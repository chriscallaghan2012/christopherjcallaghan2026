import React from 'react';
import { WHO_I_AM_DATA } from '../data/portfolioData';
import { Layers, Terminal, Cpu, Target, Sparkles, CheckCircle2 } from 'lucide-react';

const roleIcons: Record<string, React.ReactNode> = {
  "Web Developer": <Layers className="w-5 h-5 text-[#FF003C]" />,
  "Software Engineer": <Terminal className="w-5 h-5 text-cyan-400" />,
  "AI & Innovation Lead": <Cpu className="w-5 h-5 text-purple-400" />,
  "Technical Partner": <Target className="w-5 h-5 text-amber-400" />,
  "AI Enthusiast": <Sparkles className="w-5 h-5 text-emerald-400" />
};

export const WhoIAm: React.FC = () => {
  return (
    <section id="about" className="relative w-full py-20 md:py-28 overflow-hidden bg-black/40">
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-5xl">
        {/* Header Block */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF003C]/30 bg-[#FF003C]/10 text-[#FF003C] text-[10px] font-mono font-bold uppercase tracking-[0.3em]">
            Venture Partner & Digital Architect
          </div>

          <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-white">
            <span className="text-moving-gradient">WHO I AM.</span>
          </h2>

          <div className="flex items-center justify-center gap-4 pt-2">
            <div className="h-[1px] w-12 bg-white/10" />
            <p className="text-white/40 text-[11px] font-mono uppercase tracking-[0.3em] font-bold">
              Setup / Advertising / Capital
            </p>
            <div className="h-[1px] w-12 bg-white/10" />
          </div>

          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto pt-2 leading-relaxed">
            I don't just write code in a silo. I engineer the entire venture lifecycle: production product setup, automated customer acquisition funnels, and high-conviction working demos to secure funding.
          </p>
        </div>

        {/* 5 Cards Stack */}
        <div className="space-y-4 md:space-y-6">
          {WHO_I_AM_DATA.map((role, idx) => (
            <div
              key={role.title}
              className="group relative rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl p-6 md:p-8 transition-all duration-300 hover:border-[#FF003C]/50 hover:shadow-[0_0_40px_rgba(255,0,60,0.15)] hover:-translate-y-1"
            >
              {/* Glow accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF003C]/5 rounded-full blur-2xl group-hover:bg-[#FF003C]/15 transition-colors pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="mt-1 p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-[#FF003C]/40 group-hover:bg-[#FF003C]/10 transition-colors shrink-0">
                    {roleIcons[role.title] || <Layers className="w-5 h-5 text-[#FF003C]" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="text-xl md:text-2xl font-black text-white tracking-tight group-hover:text-[#FF003C] transition-colors">
                        {role.title}
                      </h3>
                      <span className="text-xs font-mono uppercase tracking-widest text-white/40 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5">
                        {role.subtitle}
                      </span>
                    </div>

                    <p className="text-sm md:text-base text-white/60 leading-relaxed max-w-2xl">
                      {role.desc}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 hidden md:block">
                    Verified Outcome
                  </span>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white font-mono text-xs font-bold group-hover:border-[#FF003C]/40 group-hover:text-white">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF003C]" />
                    {role.highlight}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
