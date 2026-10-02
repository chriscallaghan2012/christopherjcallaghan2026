'use client';

import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Packet {
  offset: number;
  speed: number;
  tail: number;
  strength: number;
}

interface Fiber {
  points: Point[];
  distances: number[];
  length: number;
  depth: number;
  startNode: number;
  endNode: number;
  packets: Packet[];
}

function buildNetwork(width: number, height: number) {
  let seed = 74021;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const nodes: Point[] = Array.from({ length: 132 }, () => {
    const angle = random() * Math.PI * 2;
    const radius = 0.3 + Math.pow(random(), 0.72) * 0.76;
    return {
      x: width * (0.5 + Math.cos(angle) * radius * 0.76),
      y: height * (0.5 + Math.sin(angle) * radius * 0.82)
    };
  });

  const connections = new Set<string>();
  nodes.forEach((node, nodeIndex) => {
    const nearestNodes = nodes
      .map((other, otherIndex) => ({
        index: otherIndex,
        distance: Math.hypot(node.x - other.x, node.y - other.y)
      }))
      .filter((candidate) => candidate.index !== nodeIndex)
      .sort((left, right) => left.distance - right.distance)
      .slice(0, random() > 0.58 ? 3 : 2);

    nearestNodes.forEach(({ index }) => {
      connections.add(`${Math.min(nodeIndex, index)}:${Math.max(nodeIndex, index)}`);
    });
  });

  const fibers: Fiber[] = [];
  connections.forEach((connection) => {
    const [startNode, endNode] = connection.split(':').map(Number);
    const start = nodes[startNode];
    const end = nodes[endNode];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const span = Math.hypot(dx, dy);
    const curve = (random() - 0.5) * Math.min(110, span * 0.66);
    const normalX = -dy / span;
    const normalY = dx / span;
    const controlOne = { x: start.x + dx * 0.3 + normalX * curve, y: start.y + dy * 0.3 + normalY * curve };
    const controlTwo = { x: start.x + dx * 0.7 + normalX * curve * 0.65, y: start.y + dy * 0.7 + normalY * curve * 0.65 };
    const points: Point[] = [];

    for (let step = 0; step <= 20; step += 1) {
      const t = step / 20;
      const inverse = 1 - t;
      points.push({
        x: inverse ** 3 * start.x + 3 * inverse ** 2 * t * controlOne.x + 3 * inverse * t ** 2 * controlTwo.x + t ** 3 * end.x,
        y: inverse ** 3 * start.y + 3 * inverse ** 2 * t * controlOne.y + 3 * inverse * t ** 2 * controlTwo.y + t ** 3 * end.y
      });
    }

    const distances = [0];
    for (let index = 1; index < points.length; index += 1) {
      distances.push(distances[index - 1] + Math.hypot(points[index].x - points[index - 1].x, points[index].y - points[index - 1].y));
    }

    const length = distances[distances.length - 1];
    const packetCount = random() > 0.3 ? (random() > 0.84 ? 2 : 1) : 0;
    const packets = Array.from({ length: packetCount }, () => ({
      offset: random() * length,
      speed: random() > 0.84 ? 58 + random() * 38 : 10 + random() * 34,
      tail: 12 + random() * 34,
      strength: 0.55 + random() * 0.4
    }));

    fibers.push({ points, distances, length, depth: random(), startNode, endNode, packets });
  });

  return { nodes, fibers };
}

function pointOnFiber(fiber: Fiber, distance: number): Point {
  const target = Math.max(0, Math.min(fiber.length, distance));
  let low = 0;
  let high = fiber.distances.length - 1;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (fiber.distances[middle] < target) low = middle + 1;
    else high = middle;
  }

  const endIndex = Math.max(1, low);
  const startIndex = endIndex - 1;
  const segmentLength = fiber.distances[endIndex] - fiber.distances[startIndex] || 1;
  const progress = (target - fiber.distances[startIndex]) / segmentLength;
  const start = fiber.points[startIndex];
  const end = fiber.points[endIndex];
  return { x: start.x + (end.x - start.x) * progress, y: start.y + (end.y - start.y) * progress };
}

function traceFiber(context: CanvasRenderingContext2D, fiber: Fiber, from: number, to: number) {
  const start = pointOnFiber(fiber, from);
  const end = pointOnFiber(fiber, to);
  context.beginPath();
  context.moveTo(start.x, start.y);
  for (let index = 1; index < fiber.points.length - 1; index += 1) {
    if (fiber.distances[index] > from && fiber.distances[index] < to) {
      context.lineTo(fiber.points[index].x, fiber.points[index].y);
    }
  }
  context.lineTo(end.x, end.y);
}

export const FiberNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionPreference.matches;
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let network = buildNetwork(1, 1);

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const junctionLight = new Float32Array(network.nodes.length);
      const edgeVisibility = (point: Point) => {
        const x = (point.x / width - 0.5) * 2;
        const y = (point.y / height - 0.5) * 2;
        return 0.24 + Math.min(0.76, Math.hypot(x, y) * 0.76);
      };

      network.fibers.forEach((fiber) => {
        context.beginPath();
        context.moveTo(fiber.points[0].x, fiber.points[0].y);
        fiber.points.slice(1).forEach((point) => context.lineTo(point.x, point.y));
        context.lineWidth = 0.3 + fiber.depth * 0.55;
        context.strokeStyle = `rgba(142, 0, 34, ${(0.08 + fiber.depth * 0.15) * edgeVisibility(fiber.points[10])})`;
        context.stroke();

        fiber.packets.forEach((packet) => {
          const loop = fiber.length * 2;
          const travel = (packet.offset + time * packet.speed) % loop;
          const distance = travel <= fiber.length ? travel : loop - travel;
          const head = pointOnFiber(fiber, distance);
          const strength = edgeVisibility(head) * packet.strength;

          traceFiber(context, fiber, Math.max(0, distance - packet.tail), distance);
          context.lineWidth = 0.7 + fiber.depth * 1.25;
          context.strokeStyle = `rgba(255, 16, 52, ${0.35 + strength * 0.55})`;
          context.shadowBlur = 5 + fiber.depth * 10;
          context.shadowColor = 'rgba(255, 0, 48, 0.8)';
          context.stroke();
          context.shadowBlur = 0;

          context.beginPath();
          context.arc(head.x, head.y, 0.7 + fiber.depth * 0.65, 0, Math.PI * 2);
          context.fillStyle = `rgba(255, 222, 211, ${strength * 0.85})`;
          context.shadowBlur = 7 + fiber.depth * 9;
          context.shadowColor = 'rgba(255, 24, 52, 0.9)';
          context.fill();
          context.shadowBlur = 0;

          if (distance < 52) junctionLight[fiber.startNode] = Math.max(junctionLight[fiber.startNode], (1 - distance / 52) * packet.strength);
          if (fiber.length - distance < 52) junctionLight[fiber.endNode] = Math.max(junctionLight[fiber.endNode], (1 - (fiber.length - distance) / 52) * packet.strength);
        });
      });

      network.nodes.forEach((node, index) => {
        const light = junctionLight[index];
        if (light < 0.03) return;
        context.beginPath();
        context.arc(node.x, node.y, 0.8 + light * 1.3, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 36, 56, ${light * 0.7})`;
        context.shadowBlur = 6 + light * 12;
        context.shadowColor = 'rgba(255, 0, 48, 0.8)';
        context.fill();
        context.shadowBlur = 0;
      });
    };

    const render = (timestamp: number) => {
      draw(timestamp / 1000);
      if (!reducedMotion) animationFrame = window.requestAnimationFrame(render);
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      if (!width || !height) return;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      network = buildNetwork(width, height);
      draw(0);

      if (!reducedMotion && !animationFrame) animationFrame = window.requestAnimationFrame(render);
    };

    const updateMotionPreference = () => {
      reducedMotion = motionPreference.matches;
      if (reducedMotion) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        draw(0);
      } else if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    motionPreference.addEventListener('change', updateMotionPreference);

    return () => {
      observer.disconnect();
      motionPreference.removeEventListener('change', updateMotionPreference);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
};