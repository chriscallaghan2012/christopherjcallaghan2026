import React from 'react';
import { TIMELINE_DATA } from '../data/portfolioData';
import { Clock, Calendar, CheckCircle, Sparkles } from 'lucide-react';

export const ExperienceTimeline: React.FC = () => {
  return (
    <section id="timeline" className="relative w-full py-20 md:py-28 overflow-hidden bg-black/60 border-y border-white/5">
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/10 bg-white/5 text-white/70 text-[10px] font-mono font-bold uppercase tracking-[0.3em]">
            Chronological Track Record
          </div>

          <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white">
            <span className="text-moving-gradient">Engineering Evolution</span>
          </h2>

          <p className="text-white/60 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            From first HTML scripts to enterprise AI architectures and high-throughput SaaS platforms.
          </p>
        </div>

        {/* Timeline Line & Milestones */}
        <div className="relative">
          {/* Center spine */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#FF003C]/40 to-transparent" />

          <div className="space-y-12 relative">
            {TIMELINE_DATA.map((milestone, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={milestone.year}
                  className={`flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  } gap-8`}
                >
                  {/* Content card */}
                  <div className="w-full md:w-1/2">
                    <div className="group rounded-3xl border border-white/10 bg-black/70 backdrop-blur-2xl p-6 sm:p-8 transition-all duration-300 hover:border-[#FF003C]/50 hover:shadow-[0_0_30px_rgba(255,0,60,0.15)] hover:-translate-y-1">
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <span className="px-3 py-1 rounded-full bg-[#FF003C]/10 border border-[#FF003C]/30 text-[#FF003C] font-mono text-xs font-bold">
                          {milestone.year}
                        </span>
                        <span className="text-2xl">{milestone.icon}</span>
                      </div>

                      <h3 className="text-xl md:text-2xl font-black text-white tracking-tight mb-2 group-hover:text-[#FF003C] transition-colors">
                        {milestone.title}
                      </h3>

                      <p className="text-sm text-white/60 leading-relaxed mb-4">
                        {milestone.desc}
                      </p>

                      {milestone.technologies && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                          {milestone.technologies.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-white/50"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Center Node Badge */}
                  <div className="hidden md:flex shrink-0 w-10 h-10 rounded-full border border-white/20 bg-[#060608] items-center justify-center relative z-10 shadow-[0_0_20px_rgba(255,0,60,0.3)]">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#FF003C] animate-pulse" />
                  </div>

                  {/* Empty placeholder for symmetry */}
                  <div className="hidden md:block w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
