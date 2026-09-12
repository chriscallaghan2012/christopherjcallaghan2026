import React from 'react';
import { TESTIMONIALS_DATA } from '../data/portfolioData';
import { Star, ShieldCheck, Quote, CheckCircle2 } from 'lucide-react';

export const SignalReception: React.FC = () => {
  return (
    <section id="reviews" className="relative w-full py-20 md:py-28 overflow-hidden bg-black/60 border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/10 bg-white/5 text-white/70 text-[10px] font-mono font-bold uppercase tracking-[0.3em]">
            Signal Reception
          </div>

          <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white">
            <span className="text-moving-gradient">Client Endorsements</span>
          </h2>

          <p className="text-white/60 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Feedback from founders, product leaders, and enterprise partners who rely on my code.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS_DATA.map((t, idx) => (
            <div
              key={idx}
              className="group relative rounded-3xl border border-white/10 bg-black/70 backdrop-blur-2xl p-7 flex flex-col justify-between transition-all duration-300 hover:border-[#FF003C]/50 hover:shadow-[0_0_30px_rgba(255,0,60,0.15)] hover:-translate-y-1"
            >
              <div>
                {/* Stars and Quote mark */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-white/15 group-hover:text-[#FF003C]/40 transition-colors" />
                </div>

                {/* Text */}
                <p className="text-sm text-white/70 leading-relaxed mb-6 font-sans">
                  "{t.text}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <img
                  src={t.avatarUrl}
                  alt={t.name}
                  loading="lazy"
                  decoding="async"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-white font-mono">
                      {t.name}
                    </h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="text-[10px] text-white/40 font-mono">
                    {t.role} • {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
