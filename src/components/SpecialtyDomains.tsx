'use client';

import React, { useState } from 'react';
import { SPECIALTY_PILLARS } from '../data/portfolioData';
import { ScreenTab } from '../types';
import { Sparkles, BarChart3, Server, Network, ArrowRight, Check, ShieldCheck, Zap } from 'lucide-react';

interface SpecialtyDomainsProps {
  onNavigateTab?: (tab: ScreenTab) => void;
  onOpenConsultation: () => void;
}

const pillarIcons: Record<string, React.ReactNode> = {
  "ai-solutions": <Sparkles className="w-5 h-5 text-purple-400" />,
  "marketing-tools": <BarChart3 className="w-5 h-5 text-amber-400" />,
  "platform-development": <Server className="w-5 h-5 text-cyan-400" />,
  "integrations-and-apis": <Network className="w-5 h-5 text-[#FF003C]" />
};

export const SpecialtyDomains: React.FC<SpecialtyDomainsProps> = ({ onNavigateTab, onOpenConsultation }) => {
  const [activePillarId, setActivePillarId] = useState<string>("ai-solutions");

  const activePillar = SPECIALTY_PILLARS.find(p => p.id === activePillarId) || SPECIALTY_PILLARS[0];

  return (
    <section id="expertise" className="relative w-full py-20 md:py-28 overflow-hidden bg-black/60 border-y border-white/5">
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-[10px] font-mono font-bold uppercase tracking-[0.3em]">
            Core Architecture Pillars
          </div>

          <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white">
            <span className="text-moving-gradient">Specialized Capabilities</span>
          </h2>

          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            High-leverage engineering across four deep technical disciplines. Built for real enterprise loads.
          </p>

          {/* Interactive Pillar Switcher Tabs */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {SPECIALTY_PILLARS.map((pillar) => {
              const isActive = pillar.id === activePillarId;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setActivePillarId(pillar.id)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? 'bg-white/10 text-white border border-[#FF003C]/60 shadow-[0_0_25px_rgba(255,0,60,0.25)]'
                      : 'bg-white/[0.03] text-white/50 border border-white/5 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {pillarIcons[pillar.id]}
                  <span>{pillar.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Pillar Showcase Stage */}
        <div className="rounded-3xl border border-white/10 bg-black/80 backdrop-blur-2xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Ambient Corner Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF003C]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF003C]" />
                {activePillar.badge}
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                {activePillar.headline}
              </h3>

              <p className="text-white/60 text-sm md:text-base leading-relaxed">
                {activePillar.description}
              </p>

              {/* Feature Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {activePillar.features.map((feat) => (
                  <div
                    key={feat.name}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#FF003C]/40 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Check className="w-4 h-4 text-[#FF003C]" />
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">
                        {feat.name}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 leading-normal pl-6">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Action row */}
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onOpenConsultation}
                  className="px-7 py-3.5 rounded-xl bg-[#FF003C] text-white font-bold text-xs uppercase tracking-[0.2em] shadow-[0_0_25px_rgba(255,0,60,0.4)] hover:shadow-[0_0_35px_rgba(255,0,60,0.6)] transition-all flex items-center justify-center gap-2"
                >
                  <span>Inquire for {activePillar.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('ai-tool')}
                    className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 text-xs font-bold uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Launch Interactive Studio
                  </button>
                )}
              </div>
            </div>

            {/* Right Interactive Architecture Visualizer */}
            <div className="lg:col-span-5">
              <div className="relative aspect-square max-w-[420px] mx-auto rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl p-8 flex flex-col justify-between overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-[#FF003C]/10 opacity-70 pointer-events-none" />

                {/* Top Telemetry Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
                  <div className="flex items-center gap-2 font-mono text-[10px] text-white/40 uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE_ARCHITECTURE_TELEMETRY
                  </div>
                  <span className="text-[10px] font-mono text-[#FF003C] font-bold">ACTIVE</span>
                </div>

                {/* Middle Schematic Graph */}
                <div className="relative z-10 my-auto py-6 space-y-4">
                  <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-white/60">Input Ingestion</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">High Throughput</span>
                  </div>

                  <div className="flex justify-center">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-white/20 to-[#FF003C]" />
                  </div>

                  <div className="p-4 rounded-xl bg-[#FF003C]/10 border border-[#FF003C]/40 flex items-center justify-between shadow-[0_0_25px_rgba(255,0,60,0.2)]">
                    <span className="text-xs font-mono text-white font-bold">{activePillar.title} Engine</span>
                    <span className="text-[10px] font-mono text-[#FF003C] bg-[#FF003C]/20 px-2 py-0.5 rounded font-bold">0.4ms Latency</span>
                  </div>

                  <div className="flex justify-center">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-[#FF003C] to-white/20" />
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-white/60">Production Result</span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">Deterministic</span>
                  </div>
                </div>

                {/* Bottom Quote */}
                <div className="relative z-10 border-t border-white/10 pt-4 text-left">
                  <p className="text-xs font-mono text-white/50 italic">
                    "{activePillar.highlightQuote}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
