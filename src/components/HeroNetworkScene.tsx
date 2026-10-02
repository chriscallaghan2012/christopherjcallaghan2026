'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot, extend, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';

interface Route {
  start: THREE.Vector3;
  controlOne: THREE.Vector3;
  controlTwo: THREE.Vector3;
  end: THREE.Vector3;
  depth: number;
  seed: number;
  region: number;
}

interface NetworkGeometry {
  fibers: THREE.BufferGeometry;
  packets: THREE.BufferGeometry;
}

interface ManagedSceneRoot {
  root: ReturnType<typeof createRoot>;
  teardownFrame: number | null;
  configureQueue: Promise<void>;
}

const sceneRoots = new WeakMap<HTMLCanvasElement, ManagedSceneRoot>();
extend(THREE as unknown as Parameters<typeof extend>[0]);

const FIBER_VERTEX_SHADER = `
attribute float aProgress;
attribute float aDepth;
attribute float aSeed;
attribute float aRegion;
uniform float uTime;
uniform float uBurst;
uniform float uBurstRegion;
varying float vDepth;
varying float vEdge;
varying float vPulse;
varying float vBurstAffinity;
void main() {
  float phase = fract(aSeed + uTime * (0.035 + aDepth * 0.045));
  float distanceToPulse = abs(aProgress - phase);
  distanceToPulse = min(distanceToPulse, 1.0 - distanceToPulse);
  vPulse = exp(-distanceToPulse * 70.0);
  vDepth = aDepth;
  vEdge = smoothstep(0.8, 5.7, length(position.xy));
  vBurstAffinity = exp(-abs(aRegion - uBurstRegion) * 1.7);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FIBER_FRAGMENT_SHADER = `
uniform float uBurst;
varying float vDepth;
varying float vEdge;
varying float vPulse;
varying float vBurstAffinity;
void main() {
  float activity = 0.2 + vDepth * 0.25 + vPulse * 0.55;
  activity += uBurst * vBurstAffinity * 0.35;
  float alpha = activity * (0.12 + vEdge * 0.88);
  vec3 red = mix(vec3(0.3, 0.001, 0.016), vec3(1.0, 0.018, 0.065), clamp(vPulse + uBurst * vBurstAffinity, 0.0, 1.0));
  gl_FragColor = vec4(red, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

const PACKET_VERTEX_SHADER = `
attribute vec3 aStart;
attribute vec3 aControlOne;
attribute vec3 aControlTwo;
attribute vec3 aEnd;
attribute float aOffset;
attribute float aSpeed;
attribute float aStrength;
attribute float aRegion;
uniform float uTime;
uniform float uBurst;
uniform float uBurstRegion;
varying float vStrength;
varying float vBurstAffinity;
varying float vEdge;
vec3 bezierPoint(float t) {
  float inverse = 1.0 - t;
  return inverse * inverse * inverse * aStart
    + 3.0 * inverse * inverse * t * aControlOne
    + 3.0 * inverse * t * t * aControlTwo
    + t * t * t * aEnd;
}
void main() {
  float progress = fract(aOffset + uTime * aSpeed * (1.0 + uBurst * 0.9));
  vec3 routePosition = bezierPoint(progress);
  vec4 viewPosition = modelViewMatrix * vec4(routePosition, 1.0);
  gl_Position = projectionMatrix * viewPosition;
  gl_PointSize = clamp((4.5 + aStrength * 4.5) * (16.0 / max(1.0, -viewPosition.z)), 2.0, 12.0);
  vStrength = aStrength;
  vBurstAffinity = exp(-abs(aRegion - uBurstRegion) * 1.7);
  vEdge = smoothstep(1.4, 6.0, length(routePosition.xy));
}
`;

const PACKET_FRAGMENT_SHADER = `
uniform float uBurst;
varying float vStrength;
varying float vBurstAffinity;
varying float vEdge;
void main() {
  float radius = length(gl_PointCoord - vec2(0.5));
  if (radius > 0.5) discard;
  float halo = exp(-radius * 15.0);
  float core = 1.0 - smoothstep(0.03, 0.2, radius);
  float activity = 0.68 + uBurst * vBurstAffinity * 2.0;
  vec3 color = mix(vec3(0.9, 0.008, 0.035), vec3(1.0, 0.68, 0.62), core);
  float alpha = (halo * 0.42 + core * 0.9) * vStrength * activity * (0.16 + vEdge * 0.84);
  gl_FragColor = vec4(color, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

function createRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function evaluateRoute(route: Route, progress: number, target: THREE.Vector3) {
  const inverse = 1 - progress;
  target.set(
    inverse ** 3 * route.start.x + 3 * inverse ** 2 * progress * route.controlOne.x + 3 * inverse * progress ** 2 * route.controlTwo.x + progress ** 3 * route.end.x,
    inverse ** 3 * route.start.y + 3 * inverse ** 2 * progress * route.controlOne.y + 3 * inverse * progress ** 2 * route.controlTwo.y + progress ** 3 * route.end.y,
    inverse ** 3 * route.start.z + 3 * inverse ** 2 * progress * route.controlOne.z + 3 * inverse * progress ** 2 * route.controlTwo.z + progress ** 3 * route.end.z
  );
  return target;
}

function createNetwork(routeCount: number, width: number, height: number, seed: number): NetworkGeometry {
  const random = createRandom(seed);
  const halfHeight = 12 * Math.tan(THREE.MathUtils.degToRad(23));
  const halfWidth = halfHeight * Math.max(0.72, width / Math.max(1, height));
  const hubs = Array.from({ length: 14 }, (_, index) => {
    const side = index < 7 ? -1 : 1;
    return {
      point: new THREE.Vector3(side * (halfWidth * 0.28 + random() * halfWidth * 0.08), (random() - 0.5) * halfHeight * 1.35, (random() - 0.5) * 7),
      region: index % 7
    };
  });
  const routes: Route[] = [];

  for (let index = 0; index < routeCount; index += 1) {
    const side = random() > 0.5 ? 1 : -1;
    const region = Math.floor(random() * 7);
    const hub = hubs[(side > 0 ? 7 : 0) + region].point;
    const start = new THREE.Vector3(side * halfWidth * (1.04 + random() * 0.28), (random() - 0.5) * halfHeight * 2.3, (random() - 0.5) * 12);
    const end = new THREE.Vector3(-side * halfWidth * (1.04 + random() * 0.28), (random() - 0.5) * halfHeight * 2.3, (random() - 0.5) * 12);
    const bendOne = (random() - 0.5) * halfHeight * 0.8;
    const bendTwo = (random() - 0.5) * halfHeight * 0.8;
    const depth = random();
    const seedValue = random();

    routes.push({
      start,
      controlOne: new THREE.Vector3(side * halfWidth * 0.76, start.y * 0.66 + hub.y * 0.34 + bendOne, start.z * 0.72 + hub.z * 0.28),
      controlTwo: new THREE.Vector3(hub.x + side * halfWidth * 0.1, hub.y + bendTwo * 0.2, hub.z),
      end: hub,
      depth,
      seed: seedValue,
      region
    });
    routes.push({
      start: hub,
      controlOne: new THREE.Vector3(hub.x - side * halfWidth * 0.1, hub.y - bendTwo * 0.18, hub.z),
      controlTwo: new THREE.Vector3(-side * halfWidth * 0.76, end.y * 0.66 + hub.y * 0.34 + bendTwo, end.z * 0.72 + hub.z * 0.28),
      end,
      depth,
      seed: (seedValue + 0.37) % 1,
      region
    });
  }

  const segments = 36;
  const vertexCount = routes.length * segments * 2;
  const positions = new Float32Array(vertexCount * 3);
  const progressValues = new Float32Array(vertexCount);
  const depthValues = new Float32Array(vertexCount);
  const seedValues = new Float32Array(vertexCount);
  const regionValues = new Float32Array(vertexCount);
  const packetStarts: number[] = [];
  const packetControlOnes: number[] = [];
  const packetControlTwos: number[] = [];
  const packetEnds: number[] = [];
  const packetOffsets: number[] = [];
  const packetSpeeds: number[] = [];
  const packetStrengths: number[] = [];
  const packetRegions: number[] = [];
  const packetPositions: number[] = [];
  const pointA = new THREE.Vector3();
  const pointB = new THREE.Vector3();
  let vertex = 0;

  routes.forEach((route) => {
    for (let segment = 0; segment < segments; segment += 1) {
      const from = segment / segments;
      const to = (segment + 1) / segments;
      evaluateRoute(route, from, pointA);
      evaluateRoute(route, to, pointB);

      [pointA, pointB].forEach((point, endIndex) => {
        const offset = vertex * 3;
        positions[offset] = point.x;
        positions[offset + 1] = point.y;
        positions[offset + 2] = point.z;
        progressValues[vertex] = endIndex === 0 ? from : to;
        depthValues[vertex] = route.depth;
        seedValues[vertex] = route.seed;
        regionValues[vertex] = route.region;
        vertex += 1;
      });
    }

    const packetCount = random() < 0.78 ? 3 + Math.floor(random() * 6) : 0;
    for (let packet = 0; packet < packetCount; packet += 1) {
      const offset = random();
      const point = evaluateRoute(route, offset, pointA);
      packetPositions.push(point.x, point.y, point.z);
      packetStarts.push(route.start.x, route.start.y, route.start.z);
      packetControlOnes.push(route.controlOne.x, route.controlOne.y, route.controlOne.z);
      packetControlTwos.push(route.controlTwo.x, route.controlTwo.y, route.controlTwo.z);
      packetEnds.push(route.end.x, route.end.y, route.end.z);
      packetOffsets.push(offset);
      packetSpeeds.push(0.055 + random() * 0.34);
      packetStrengths.push(0.48 + random() * 0.52);
      packetRegions.push(route.region);
    }
  });

  const fiberGeometry = new THREE.BufferGeometry();
  fiberGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  fiberGeometry.setAttribute('aProgress', new THREE.BufferAttribute(progressValues, 1));
  fiberGeometry.setAttribute('aDepth', new THREE.BufferAttribute(depthValues, 1));
  fiberGeometry.setAttribute('aSeed', new THREE.BufferAttribute(seedValues, 1));
  fiberGeometry.setAttribute('aRegion', new THREE.BufferAttribute(regionValues, 1));

  const packetGeometry = new THREE.BufferGeometry();
  packetGeometry.setAttribute('position', new THREE.Float32BufferAttribute(packetPositions, 3));
  packetGeometry.setAttribute('aStart', new THREE.Float32BufferAttribute(packetStarts, 3));
  packetGeometry.setAttribute('aControlOne', new THREE.Float32BufferAttribute(packetControlOnes, 3));
  packetGeometry.setAttribute('aControlTwo', new THREE.Float32BufferAttribute(packetControlTwos, 3));
  packetGeometry.setAttribute('aEnd', new THREE.Float32BufferAttribute(packetEnds, 3));
  packetGeometry.setAttribute('aOffset', new THREE.Float32BufferAttribute(packetOffsets, 1));
  packetGeometry.setAttribute('aSpeed', new THREE.Float32BufferAttribute(packetSpeeds, 1));
  packetGeometry.setAttribute('aStrength', new THREE.Float32BufferAttribute(packetStrengths, 1));
  packetGeometry.setAttribute('aRegion', new THREE.Float32BufferAttribute(packetRegions, 1));

  return { fibers: fiberGeometry, packets: packetGeometry };
}

function NetworkLayer({ routeCount, reducedMotion }: { routeCount: number; reducedMotion: boolean }) {
  const { size, camera } = useThree();
  const cursor = useRef({ x: 0, y: 0 });
  const burst = useRef({ next: 5, started: -10, duration: 2.2, region: 0 });
  const fiberUniforms = useMemo(() => ({ uTime: { value: 0 }, uBurst: { value: 0 }, uBurstRegion: { value: 0 } }), []);
  const packetUniforms = useMemo(() => ({ uTime: { value: 0 }, uBurst: { value: 0 }, uBurstRegion: { value: 0 } }), []);
  const geometry = useMemo(() => createNetwork(routeCount, size.width, size.height, 99173), [routeCount, size.height, size.width]);
  const fiberMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: fiberUniforms,
    vertexShader: FIBER_VERTEX_SHADER,
    fragmentShader: FIBER_FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false
  }), [fiberUniforms]);
  const packetMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: packetUniforms,
    vertexShader: PACKET_VERTEX_SHADER,
    fragmentShader: PACKET_FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false
  }), [packetUniforms]);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      cursor.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      cursor.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  useEffect(() => () => {
    geometry.fibers.dispose();
    geometry.packets.dispose();
    fiberMaterial.dispose();
    packetMaterial.dispose();
  }, [fiberMaterial, geometry, packetMaterial]);

  useFrame((state) => {
    const time = reducedMotion ? 0 : state.clock.elapsedTime;
    const event = burst.current;
    if (!reducedMotion && time >= event.next) {
      event.started = time;
      event.duration = 1.4 + Math.random() * 2.3;
      event.next = time + 8 + Math.random() * 11;
      event.region = Math.floor(Math.random() * 7);
    }

    const progress = (time - event.started) / event.duration;
    const activity = !reducedMotion && progress >= 0 && progress <= 1 ? Math.sin(progress * Math.PI) : 0;
    fiberUniforms.uTime.value = time;
    fiberUniforms.uBurst.value = activity;
    fiberUniforms.uBurstRegion.value = event.region;
    packetUniforms.uTime.value = time;
    packetUniforms.uBurst.value = activity;
    packetUniforms.uBurstRegion.value = event.region;

    const drift = reducedMotion ? 0 : time;
    camera.position.x = Math.sin(drift * 0.045) * 0.1 + (reducedMotion ? 0 : cursor.current.x * 0.11);
    camera.position.y = Math.cos(drift * 0.04) * 0.06 - (reducedMotion ? 0 : cursor.current.y * 0.07);
    camera.position.z = 12 + Math.sin(drift * 0.03) * 0.16;
    camera.lookAt(reducedMotion ? 0 : cursor.current.x * 0.08, reducedMotion ? 0 : -cursor.current.y * 0.06, 0);
  });

  return <>
    <lineSegments geometry={geometry.fibers}>
      <primitive object={fiberMaterial} attach="material" />
    </lineSegments>
    <points geometry={geometry.packets}>
      <primitive object={packetMaterial} attach="material" />
    </points>
  </>;
}

export default function HeroNetworkScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const narrow = window.matchMedia('(max-width: 700px)');
    const updateMotion = () => setReducedMotion(motion.matches);
    const updateWidth = () => setIsNarrow(narrow.matches);
    updateMotion();
    updateWidth();
    motion.addEventListener('change', updateMotion);
    narrow.addEventListener('change', updateWidth);
    return () => {
      motion.removeEventListener('change', updateMotion);
      narrow.removeEventListener('change', updateWidth);
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    let managed = sceneRoots.get(canvas);
    if (managed?.teardownFrame !== null && managed?.teardownFrame !== undefined) {
      window.cancelAnimationFrame(managed.teardownFrame);
      managed.teardownFrame = null;
    }
    if (!managed) {
      managed = { root: createRoot(canvas), teardownFrame: null, configureQueue: Promise.resolve() };
      sceneRoots.set(canvas, managed);
    }

    const sceneRoot = managed;
    const configure = () => {
      const bounds = host.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      sceneRoot.configureQueue = sceneRoot.configureQueue.then(async () => {
        if (sceneRoot.teardownFrame !== null) return;
        await sceneRoot.root.configure({
          size: { width: bounds.width, height: bounds.height, top: bounds.top, left: bounds.left },
          dpr: isNarrow ? 1 : [1, 1.5],
          frameloop: reducedMotion ? 'demand' : 'always',
          camera: { position: [0, 0, 12], fov: 46, near: 0.1, far: 48 },
          gl: { alpha: true, antialias: false, powerPreference: 'high-performance' }
        });
        if (sceneRoot.teardownFrame === null) {
          sceneRoot.root.render(<>
            <NetworkLayer routeCount={isNarrow ? 120 : 260} reducedMotion={reducedMotion} />
            <EffectComposer multisampling={0}>
              <Bloom intensity={1.05} luminanceThreshold={0.12} luminanceSmoothing={0.16} mipmapBlur />
            </EffectComposer>
          </>);
        }
      }).catch((error: unknown) => console.error('Hero network renderer failed:', error));
    };

    const resizeObserver = new ResizeObserver(configure);
    resizeObserver.observe(host);
    configure();

    return () => {
      resizeObserver.disconnect();
      const teardownFrame = window.requestAnimationFrame(() => {
        if (sceneRoot.teardownFrame !== teardownFrame) return;
        sceneRoot.root.unmount();
        sceneRoots.delete(canvas);
      });
      sceneRoot.teardownFrame = teardownFrame;
    };
  }, [isNarrow, reducedMotion]);

  return <div ref={hostRef} aria-hidden="true" className="hero-network-canvas absolute inset-0">
    <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
  </div>;
}