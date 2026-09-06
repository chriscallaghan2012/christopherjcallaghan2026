'use client';

import React, { useState } from 'react';
import { SKILLS_DATA } from '../data/portfolioData';
import { Cpu, Layers, Sparkles } from 'lucide-react';

export const SkillsMarquee: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Frontend', 'Backend', 'AI & Data', 'Cloud & DevOps', 'E-Commerce'];

  const displayedSkills = activeCategory === 'All' 
    ? SKILLS_DATA 
    : SKILLS_DATA.filter(s => s.category === activeCategory);

  // Duplicate for smooth seamless loop
  const marqueeItems = [...displayedSkills, ...displayedSkills, ...displayedSkills];

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden bg-black/40">
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/10 bg-white/5 text-white/70 text-[10px] font-mono font-bold uppercase tracking-[0.3em] mb-4">
          Tech Radar & Arsenal
        </div>

        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-6">
          <span className="text-moving-gradient">Technologies & Frameworks</span>
        </h2>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'bg-white/15 text-white border border-[#FF003C]/50'
                  : 'bg-white/[0.02] text-white/50 border border-white/5 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Infinite Marquee Track 1 (Left) */}
      <div className="relative w-full overflow-hidden py-3">
        {/* Left & Right gradient fades for luxury infinity effect */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#060608] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#060608] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee gap-4">
          {marqueeItems.map((skill, idx) => (
            <div
              key={`${skill.slug}-${idx}`}
              className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/70 border border-white/10 backdrop-blur-xl transition-all duration-300 hover:border-[#FF003C]/60 hover:shadow-[0_0_25px_rgba(255,0,60,0.2)] hover:scale-105 shrink-0"
            >
              <img
                src={`https://cdn.simpleicons.org/${skill.slug}/ffffff`}
                alt={skill.name}
                className="w-5 h-5 object-contain group-hover:scale-110 transition-transform opacity-80 group-hover:opacity-100"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-xs font-mono font-bold text-white/80 group-hover:text-white tracking-wider">
                {skill.name}
              </span>
              <span className="text-[9px] font-mono uppercase text-white/30 px-1.5 py-0.5 rounded bg-white/5">
                {skill.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reverse Marquee Track 2 (Right) */}
      <div className="relative w-full overflow-hidden py-3 mt-2">
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#060608] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#060608] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-reverse gap-4">
          {marqueeItems.slice().reverse().map((skill, idx) => (
            <div
              key={`rev-${skill.slug}-${idx}`}
              className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/70 border border-white/10 backdrop-blur-xl transition-all duration-300 hover:border-[#FF003C]/60 hover:shadow-[0_0_25px_rgba(255,0,60,0.2)] hover:scale-105 shrink-0"
            >
              <img
                src={`https://cdn.simpleicons.org/${skill.slug}/ffffff`}
                alt={skill.name}
                className="w-5 h-5 object-contain group-hover:scale-110 transition-transform opacity-80 group-hover:opacity-100"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-xs font-mono font-bold text-white/80 group-hover:text-white tracking-wider">
                {skill.name}
              </span>
              <span className="text-[9px] font-mono uppercase text-white/30 px-1.5 py-0.5 rounded bg-white/5">
                {skill.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
