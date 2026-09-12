import React from 'react';
import { ScreenTab } from '../types';
import { ArrowRight, Sparkles, Terminal, Code2, Database, ShieldCheck, Zap, Megaphone, TrendingUp, Layers, Rocket } from 'lucide-react';

interface HeroProps {
  onNavigate: (tab: ScreenTab) => void;
  onOpenConsultation: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenConsultation }) => {
  const floatingTags = [
    { label: "Turnkey MVP Setup", x: "8%", y: "22%", delay: 0 },
    { label: "Next.js 15 & AI", x: "82%", y: "18%", delay: 0.4 },
    { label: "Programmatic SEO", x: "84%", y: "36%", delay: 0.8 },
    { label: "Paid Ad Funnels", x: "7%", y: "44%", delay: 1.2 },
    { label: "Investor Demos", x: "85%", y: "60%", delay: 1.6 },
    { label: "Stripe & Cloud", x: "9%", y: "68%", delay: 2.0 },
  ];

  return (
    <section id="hero" className="relative w-full min-h-[92svh] flex flex-col justify-center items-center py-16 md:py-24 overflow-hidden">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[500px] bg-[#FF003C]/10 rounded-full blur-[160px] opacity-70" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[140px]" />
        {/* High-tech Grid Lines */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      {/* Floating Interactive Badges (Desktop) */}
      <div className="hidden xl:block absolute inset-0 pointer-events-none z-10">
        {floatingTags.map((tag) => (
          <div
            key={tag.label}
            className="absolute transition-transform duration-700 hover:scale-110 pointer-events-auto"
            style={{
              left: tag.x,
              top: tag.y,
              animation: `float 5s ease-in-out infinite alternate ${tag.delay}s`
            }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-black/60 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] text-[11px] font-mono font-bold text-white/70 hover:border-[#FF003C]/60 hover:text-white transition-all cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF003C] animate-ping" />
              {tag.label}
            </div>
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-5xl">
        {/* Top Tagline Pill */}
        <div className="inline-flex flex-wrap justify-center items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 shadow-sm max-w-full">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-white/90">
            The Whole Package // Setup • Advertising • Funding
          </span>
          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-white/30" />
          <span className="hidden sm:inline-block text-xs font-mono text-white/50">Manchester, UK & Global</span>
        </div>

        {/* Display Main Title */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4 leading-[0.95] text-white">
          <span className="block text-moving-gradient">Christopher J.</span>
          <span className="block text-moving-gradient">Callaghan</span>
        </h1>

        {/* Subtitle */}
        <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold tracking-tight mb-8 text-white/80 max-w-3xl mx-auto leading-relaxed">
          The all-in-one partner for founders. <span className="text-[#FF003C] font-bold">The Technical Setup.</span> The <span className="text-amber-400 font-bold">Advertising Engine.</span> Getting <span className="text-emerald-400 font-bold">Funded.</span>
        </h2>

        <p className="text-sm md:text-base text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          I don't just write code — I build production-grade AI platforms, deploy automated programmatic customer acquisition, and arm you with live working demos to raise capital.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            id="hero-whole-package-btn"
            onClick={() => onNavigate('package')}
            className="w-full sm:w-auto group relative px-9 py-4 bg-[#FF003C] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl overflow-hidden shadow-[0_0_35px_rgba(255,0,60,0.45)] hover:shadow-[0_0_50px_rgba(255,0,60,0.7)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Rocket className="w-4 h-4" />
            <span>Explore The Whole Package</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            id="hero-start-project-btn"
            onClick={onOpenConsultation}
            className="w-full sm:w-auto px-8 py-4 bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-white/15 hover:border-white/40 transition-all active:scale-95"
          >
            Schedule 1-on-1 Consultation
          </button>

          <button
            id="hero-view-work-btn"
            onClick={() => onNavigate('projects')}
            className="w-full sm:w-auto px-7 py-4 bg-white/5 border border-white/10 text-white/70 hover:text-white font-bold text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all"
          >
            View Projects (11+)
          </button>
        </div>

        {/* High-Impact Core Telemetry Bar */}
        <div className="w-full max-w-4xl mx-auto rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl p-6 md:p-8 shadow-2xl text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#FF003C]/10 border border-[#FF003C]/30 text-[#FF003C]">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/40 block">Venture_Architecture_Engine</span>
                <span className="text-sm font-bold text-white tracking-wide">READY_FOR_VENTURE_DEPLOYMENT</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-white/60">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Taking 2 new ventures this quarter</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#FF003C]/40 transition-colors">
              <div className="flex items-center gap-2 mb-1.5">
                <Layers className="w-4 h-4 text-[#FF003C]" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-white font-bold">01_THE_SETUP</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">Turnkey Next.js 15, AI agents & Stripe multi-tenant infrastructure</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-400/40 transition-colors">
              <div className="flex items-center gap-2 mb-1.5">
                <Megaphone className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-white font-bold">02_THE_ADS</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">Programmatic SEO, conversion ad funnels & viral growth mechanics</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-emerald-400/40 transition-colors">
              <div className="flex items-center gap-2 mb-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-white font-bold">03_THE_FUNDING</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">Live working investor demos, traction telemetry & VC pitch moats</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-purple-400/40 transition-colors">
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-white font-bold">04_VELOCITY</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">Concept to working, customer-ready venture in 3 to 6 weeks</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
