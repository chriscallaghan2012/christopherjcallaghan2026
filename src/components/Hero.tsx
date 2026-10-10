'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ScreenTab } from '../types';
import { ArrowDown, ArrowRight } from 'lucide-react';

const HeroNetworkScene = dynamic(() => import('./HeroNetworkScene'), { ssr: false, loading: () => null });

interface HeroProps {
  onNavigate: (tab: ScreenTab) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [loadNetworkScene, setLoadNetworkScene] = useState(false);

  useEffect(() => {
    const browser = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    if (browser.requestIdleCallback) {
      const idleHandle = browser.requestIdleCallback(() => setLoadNetworkScene(true), { timeout: 1200 });
      return () => browser.cancelIdleCallback?.(idleHandle);
    }

    const timeoutHandle = window.setTimeout(() => setLoadNetworkScene(true), 250);
    return () => window.clearTimeout(timeoutHandle);
  }, []);

  const floatingTags = [
    { label: 'WEB / APP', x: '9%', y: '25%', delay: 0 },
    { label: 'AI / SYSTEMS', x: '82%', y: '22%', delay: 0.4 },
    { label: 'AUTOMATION', x: '84%', y: '47%', delay: 0.8 },
    { label: 'DIGITAL PRODUCTS', x: '8%', y: '57%', delay: 1.2 }
  ];

  return (
    <section id="hero" className="hero-scene relative w-full min-h-[92svh] flex flex-col justify-center items-center py-16 md:py-24 overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-transparent">
        {loadNetworkScene && <HeroNetworkScene />}
        <div className="hero-network-shade absolute inset-0" />
      </div>

      {/* Floating Interactive Badges (Desktop) */}
      <div className="hidden xl:block absolute inset-0 pointer-events-none z-10">
        {floatingTags.map((tag) => (
          <div
            key={tag.label}
            className="absolute transition-transform duration-700 hover:scale-110 pointer-events-auto"
            style={{ left: tag.x, top: tag.y }}
          >
            <div className="inline-flex items-center gap-2 border border-white/10 bg-black/60 px-3.5 py-1.5 text-[11px] font-mono font-bold text-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all hover:border-[#FF003C]/60 hover:text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF003C]" />
              {tag.label}
            </div>
          </div>
        ))}
      </div>

      <div className="container relative z-10 mx-auto max-w-6xl px-5 text-center md:px-8">
        <p className="mb-7 font-mono text-[10px] uppercase tracking-[0.28em] text-white/65 sm:text-xs">Full-stack developer / AI builder / business creator</p>
        <h1 className="hero-title text-6xl font-black leading-[0.82] tracking-tight text-white sm:text-8xl md:text-9xl lg:text-[10rem]">
          <span className="hero-title-line hero-title-line--first block">I BUILD</span>
          <span className="hero-title-line hero-title-line--second block text-[#FF003C]">THINGS</span>
        </h1>
        <p className="mt-7 text-2xl font-black uppercase tracking-[0.08em] text-[#FF003C] sm:text-3xl md:text-4xl">ON THE INTERNET.</p>
        <p className="mx-auto mt-5 max-w-2xl font-mono text-[11px] uppercase tracking-[0.12em] text-white/90 sm:text-sm">Businesses <span className="text-[#FF003C]">·</span> Apps <span className="text-[#FF003C]">·</span> Software <span className="text-[#FF003C]">·</span> AI <span className="text-[#FF003C]">·</span> Websites</p>
        <p className="mx-auto mt-7 max-w-lg text-sm leading-relaxed text-white/90 md:text-base">I turn ideas, problems and opportunities into working technology.</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button id="hero-start-project-btn" onClick={() => onNavigate('build')} className="group flex min-h-12 w-full items-center justify-center gap-3 bg-[#FF003C] px-7 text-xs font-black tracking-[0.18em] text-white shadow-[0_0_32px_rgba(255,0,60,0.35)] transition-all hover:shadow-[0_0_45px_rgba(255,0,60,0.55)] sm:w-auto">
            BUILD SOMETHING <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button id="hero-view-work-btn" onClick={() => onNavigate('projects')} className="flex min-h-12 w-full items-center justify-center gap-3 border border-white/20 bg-white/[0.03] px-7 text-xs font-bold tracking-[0.18em] text-white/75 transition-all hover:border-white/50 hover:text-white sm:w-auto">
            VIEW MY WORK <ArrowDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
