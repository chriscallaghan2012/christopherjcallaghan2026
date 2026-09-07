'use client';

import React, { useState } from 'react';
import { 
  VENTURE_PACKAGE_MODULES, 
  VENTURE_STAGES 
} from '../data/portfolioData';
import { VenturePackageModule, VentureStageConfig } from '../types';
import { 
  Layers, 
  Megaphone, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  Rocket, 
  DollarSign, 
  Users, 
  Cpu, 
  Award,
  Check,
  RefreshCw
} from 'lucide-react';

interface TheWholePackageProps {
  onOpenConsultation: () => void;
  onNavigateToProjects?: () => void;
}

export const TheWholePackage: React.FC<TheWholePackageProps> = ({ 
  onOpenConsultation,
  onNavigateToProjects 
}) => {
  const [selectedStage, setSelectedStage] = useState<VentureStageConfig>(VENTURE_STAGES[0]);
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>(
    VENTURE_PACKAGE_MODULES.filter(m => m.defaultChecked).map(m => m.id)
  );
  const [activePillarTab, setActivePillarTab] = useState<'all' | 'setup' | 'advertising' | 'funding'>('all');

  const toggleModule = (id: string) => {
    setSelectedModuleIds(prev => 
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedModuleIds(VENTURE_PACKAGE_MODULES.map(m => m.id));
  };

  const selectedModules = VENTURE_PACKAGE_MODULES.filter(m => selectedModuleIds.includes(m.id));
  const setupCount = selectedModules.filter(m => m.category === 'setup').length;
  const adsCount = selectedModules.filter(m => m.category === 'advertising').length;
  const fundingCount = selectedModules.filter(m => m.category === 'funding').length;

  const filteredModules = activePillarTab === 'all' 
    ? VENTURE_PACKAGE_MODULES 
    : VENTURE_PACKAGE_MODULES.filter(m => m.category === activePillarTab);

  // Compute calculated readiness
  const totalAvailable = VENTURE_PACKAGE_MODULES.length;
  const completenessPct = Math.round((selectedModuleIds.length / totalAvailable) * 100);

  return (
    <section id="the-whole-package" className="relative w-full py-20 md:py-32 overflow-hidden bg-[#07070a]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#FF003C]/10 via-purple-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 md:mb-24 space-y-5">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#FF003C]/30 bg-[#FF003C]/10 text-[#FF003C] text-[11px] font-mono font-black uppercase tracking-[0.25em]">
            <Rocket className="w-3.5 h-3.5" />
            End-to-End Venture Architecture
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.95]">
            THE WHOLE <span className="text-moving-gradient">PACKAGE.</span>
          </h2>

          <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-white/80 tracking-tight">
            The Setup. The Advertising. Funding &amp; Finance Support.
          </p>

          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed pt-2">
            Most founders lose 12 months managing disconnected freelancers, broken ad agencies, and slide-deck designers. I build and deliver your entire venture ecosystem under one roof.
          </p>

          {/* Quick Pillar Counter Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 max-w-3xl mx-auto">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left">
              <div className="flex items-center gap-2 text-[#FF003C] text-xs font-mono font-bold uppercase mb-1">
                <Layers className="w-4 h-4" />
                01. The Setup
              </div>
              <p className="text-sm font-bold text-white">Turnkey Product & Cloud</p>
              <p className="text-xs text-white/50">Next.js 15, AI Engine & Stripe</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase mb-1">
                <Megaphone className="w-4 h-4" />
                02. The Advertising
              </div>
              <p className="text-sm font-bold text-white">High-Yield Growth Engine</p>
              <p className="text-xs text-white/50">Programmatic SEO, Funnels & CAPI</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase mb-1">
                <TrendingUp className="w-4 h-4" />
                03. Funding &amp; Finance
              </div>
              <p className="text-sm font-bold text-white">Route &amp; Application Support</p>
              <p className="text-xs text-white/50">Start Up Loans, Grants, Angels &amp; More</p>
            </div>
          </div>
        </div>

        {/* The 3 Pillars In-Depth Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* Pillar 1: The Setup */}
          <div className="group rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl p-8 hover:border-[#FF003C]/50 hover:shadow-[0_0_40px_rgba(255,0,60,0.15)] transition-all flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF003C]/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-[#FF003C]/10 border border-[#FF003C]/30 text-[#FF003C]">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF003C] font-black px-3 py-1 rounded-full bg-[#FF003C]/10 border border-[#FF003C]/20">
                  PILLAR 01
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white tracking-tight mb-2">
                  The Technical Setup
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  A production-grade, battle-tested software foundation engineered for infinite scale without expensive rewrites.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  'Turnkey Full-Stack Architecture (Next.js 15 + Node.js)',
                  'Custom AI Engine & RAG Pipelines (Gemini 2.0 / OpenAI)',
                  'Global Monetization with Stripe Billing & Webhooks',
                  'Multi-Tenant Schema Isolation & Sub-second Database',
                  'Role-Based ACL, Biometric 2FA & HIPAA/GDPR Compliance'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-[#FF003C] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 mt-6">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/40">Launch Velocity</span>
                <span className="text-white font-bold">2 to 4 Weeks</span>
              </div>
            </div>
          </div>

          {/* Pillar 2: The Advertising */}
          <div className="group rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl p-8 hover:border-amber-500/50 hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] transition-all flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Megaphone className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-black px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                  PILLAR 02
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white tracking-tight mb-2">
                  The Advertising Engine
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Software that solves distribution. Automated buyer acquisition, programmatic SEO, and server-side conversion funnels.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  'Programmatic SEO Engine (10k+ High-Intent Pages)',
                  'Paid Ad Funnels with Server-Side CAPI (Meta / Google)',
                  'Genafize Automated Ad Copy & Creative Generators',
                  'Incentivized Viral Loops & Referral K-Factor Hooks',
                  'Automated Lifecycle Email Drip & Churn Minimizers'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 mt-6">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/40">Organic Traffic Multiplier</span>
                <span className="text-amber-400 font-bold">+350% SERP Reach</span>
              </div>
            </div>
          </div>

          {/* Pillar 3: Getting Funded */}
          <div className="group rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl p-8 hover:border-emerald-500/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] transition-all flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-black px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  PILLAR 03
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white tracking-tight mb-2">
                  Funding &amp; Finance Support
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Helping you identify the right funding route for your business. Whether you&rsquo;re starting from an idea or already trading, I help you understand what funding may be available and prepare the business for an application.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  'Start Up Loans',
                  'Business loans',
                  'Government grants',
                  'Local authority funding',
                  'Innovation & technology funding',
                  'SEIS/EIS investor preparation',
                  'Angel investment',
                  'Equity crowdfunding',
                  'Asset & equipment finance',
                  'Vehicle and premises finance',
                  'Funding applications & supporting documentation',
                  'Business plans & financial forecasts (tech-funding preparation)'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 mt-6">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/40">Scope</span>
                <span className="text-emerald-400 font-bold">Advisory &amp; Application Prep</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Whole Package Configurator & Calculator */}
        <div className="rounded-3xl border border-white/15 bg-black/80 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-20">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF003C]/10 border border-[#FF003C]/30 text-[#FF003C] text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                Interactive Venture Builder
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Configure Your Whole Package
              </h3>
              <p className="text-white/60 text-xs sm:text-sm mt-1 max-w-xl">
                Select your target stage (from £25k SME micro-grants to venture scale) and customized setup, advertising, and funding components to see your calculated launch readiness.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={selectAll}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white text-xs font-mono transition-colors active:scale-95"
              >
                Select Full Suite ({totalAvailable}/{totalAvailable})
              </button>
              <button
                onClick={onOpenConsultation}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#FF003C] text-white text-xs font-mono font-black uppercase tracking-wider shadow-[0_0_25px_rgba(255,0,60,0.4)] hover:shadow-[0_0_35px_rgba(255,0,60,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>Deploy Package</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Stage Selector */}
          <div className="py-6 border-b border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-white/40 block">
                1. Choose Target Capital / Launch Stage:
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full self-start sm:self-auto">
                Includes SME Grants & Startups Up to £25k
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
              {VENTURE_STAGES.map((stg) => (
                <button
                  key={stg.stage}
                  onClick={() => setSelectedStage(stg)}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    selectedStage.stage === stg.stage
                      ? 'border-[#FF003C] bg-[#FF003C]/10 text-white shadow-[0_0_25px_rgba(255,0,60,0.25)] ring-1 ring-[#FF003C]/50'
                      : 'border-white/10 bg-black/40 text-white/60 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {stg.stage === 'SME & Early Startup' && (
                    <span className="absolute top-2.5 right-2.5 text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      SME Pack
                    </span>
                  )}
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#FF003C] font-bold mb-1">
                    {stg.targetRaise}
                  </div>
                  <div className="text-xs font-black mb-1.5 text-white">{stg.stage}</div>
                  <div className="text-[11px] text-white/50 leading-snug line-clamp-2">
                    {stg.focus}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="pt-6 pb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-white/40 mr-1">Filter Pillar:</span>
              {(['all', 'setup', 'advertising', 'funding'] as const).map((pillar) => (
                <button
                  key={pillar}
                  onClick={() => setActivePillarTab(pillar)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                    activePillarTab === pillar
                      ? 'bg-white/20 text-white font-bold border border-white/30'
                      : 'text-white/50 hover:text-white bg-white/5 border border-white/5'
                  }`}
                >
                  {pillar}
                </button>
              ))}
            </div>

            <div className="text-xs font-mono text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{selectedModuleIds.length} of {totalAvailable} Modules Activated</span>
            </div>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
            {filteredModules.map((module) => {
              const isChecked = selectedModuleIds.includes(module.id);
              const badgeColor = module.category === 'setup' 
                ? 'text-[#FF003C] border-[#FF003C]/30 bg-[#FF003C]/10' 
                : module.category === 'advertising' 
                ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' 
                : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';

              return (
                <div
                  key={module.id}
                  onClick={() => toggleModule(module.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    isChecked
                      ? 'border-white/30 bg-white/[0.04] shadow-lg'
                      : 'border-white/5 bg-white/[0.01] opacity-60 hover:opacity-100 hover:border-white/15'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[9px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border font-bold ${badgeColor}`}>
                        {module.category}
                      </span>
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                        isChecked ? 'bg-[#FF003C] border-[#FF003C] text-white' : 'border-white/20 bg-transparent'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1.5">
                      {module.name}
                    </h4>

                    <p className="text-xs text-white/60 leading-relaxed mb-4">
                      {module.description}
                    </p>

                    <div className="space-y-1.5 border-t border-white/5 pt-3">
                      {module.deliverables.map((deliv, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-white/50">
                          <span className="w-1 h-1 rounded-full bg-white/40" />
                          <span>{deliv}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-white/40">Impact:</span>
                    <span className="text-[#FF003C] font-bold">{module.impactMetric}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Telemetry Summary Card */}
          <div className="mt-8 p-6 rounded-2xl bg-[#111118] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 md:gap-6 w-full md:w-auto text-left">
              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase block">Selected Stage</span>
                <span className="text-sm font-black text-white block truncate">{selectedStage.stage}</span>
                <span className="text-[11px] font-mono text-[#FF003C] font-bold">{selectedStage.targetRaise}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase block">Total Modules</span>
                <span className="text-xl font-black text-white">{selectedModules.length} Active</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase block">Target Timeline</span>
                <span className="text-xl font-black text-amber-400">{selectedStage.timeToMarket}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase block">Readiness Score</span>
                <span className="text-xl font-black text-emerald-400">{completenessPct}%</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase block">Pillars Covered</span>
                <span className="text-xs font-mono font-bold text-white block mt-1">
                  {setupCount > 0 && 'Setup '}
                  {adsCount > 0 && '• Ads '}
                  {fundingCount > 0 && '• Funding'}
                </span>
              </div>
            </div>

            <button
              onClick={onOpenConsultation}
              className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-[#FF003C] text-white font-mono font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(255,0,60,0.4)] hover:shadow-[0_0_40px_rgba(255,0,60,0.6)] hover:scale-105 active:scale-95 transition-all shrink-0 flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>Schedule Whole Package Briefing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Why The Whole Package Wins: Agency vs Freelancer vs Christopher */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="text-center mb-6 sm:mb-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF003C] font-bold block mb-2">
              Comparative Analysis
            </span>
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Why Founders Choose The Whole Package
            </h3>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-white/40 px-1 mb-2 md:hidden">
            <span>Comparison Matrix</span>
            <span className="text-white/60">← Scroll sideways →</span>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-left border-collapse border border-white/10 rounded-2xl overflow-hidden bg-black/40 min-w-[620px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-[11px] font-mono uppercase tracking-wider text-white/60">
                  <th className="p-4 sm:p-5">Strategic Dimension</th>
                  <th className="p-4 sm:p-5 text-white/40">Traditional Agencies</th>
                  <th className="p-4 sm:p-5 text-white/40">Isolated Freelancers</th>
                  <th className="p-4 sm:p-5 text-[#FF003C] font-bold bg-[#FF003C]/5">Christopher J. Callaghan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs sm:text-sm text-white/70">
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Full Venture Scope</td>
                  <td className="p-4 sm:p-5 text-white/50">Only tech OR only ads (never both)</td>
                  <td className="p-4 sm:p-5 text-white/50">Single skill silo</td>
                  <td className="p-4 sm:p-5 text-white font-bold bg-[#FF003C]/5 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Setup + Ads + Funding in One
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Investor Demo Fidelity</td>
                  <td className="p-4 sm:p-5 text-white/50">Static Figma click-through slides</td>
                  <td className="p-4 sm:p-5 text-white/50">Buggy partial prototype</td>
                  <td className="p-4 sm:p-5 text-white font-bold bg-[#FF003C]/5 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Live, Production-Ready Working Demo
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Advertising & Distribution</td>
                  <td className="p-4 sm:p-5 text-white/50">Outsourced to third party for £5k/mo</td>
                  <td className="p-4 sm:p-5 text-white/50">Not included</td>
                  <td className="p-4 sm:p-5 text-white font-bold bg-[#FF003C]/5 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Programmatic SEO & CAPI Ads Built-In
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Communication Friction</td>
                  <td className="p-4 sm:p-5 text-white/50">Account managers & game of telephone</td>
                  <td className="p-4 sm:p-5 text-white/50">Ghosting risk & slow replies</td>
                  <td className="p-4 sm:p-5 text-white font-bold bg-[#FF003C]/5 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Direct Technical Partner Access
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Time to First Revenue / Raise</td>
                  <td className="p-4 sm:p-5 text-white/50">6 - 9 Months</td>
                  <td className="p-4 sm:p-5 text-white/50">Unpredictable</td>
                  <td className="p-4 sm:p-5 text-emerald-400 font-bold bg-[#FF003C]/5 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    3 to 6 Weeks Turnkey
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Banner */}
        <div className="rounded-3xl p-8 sm:p-12 border border-[#FF003C]/40 bg-gradient-to-r from-[#FF003C]/20 via-black to-purple-950/20 backdrop-blur-2xl text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 shadow-[0_0_60px_rgba(255,0,60,0.25)]">
          <div className="space-y-3 max-w-xl">
            <span className="text-[10px] font-mono text-[#FF003C] uppercase tracking-[0.25em] font-bold">
              Immediate Capacity Available
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Ready to execute The Whole Package?
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Book a 1-on-1 architecture session with Christopher. We will map your setup requirements, ad channels, and funding deliverables in 30 minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={onOpenConsultation}
              className="w-full sm:w-auto px-8 py-4 bg-[#FF003C] text-white font-mono font-black text-xs uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(255,0,60,0.5)] hover:shadow-[0_0_45px_rgba(255,0,60,0.7)] hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <span>Initiate Whole Package</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onNavigateToProjects && (
              <button
                onClick={onNavigateToProjects}
                className="w-full sm:w-auto px-6 py-4 bg-white/5 border border-white/15 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-2xl hover:bg-white/10 transition-colors"
              >
                View Track Record
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
