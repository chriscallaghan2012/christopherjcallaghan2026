'use client';

import React, { useState } from 'react';
import { SERVICES_DATA } from '../data/portfolioData';
import { ServiceItem } from '../types';
import {
  Code,
  AppWindow,
  BrainCircuit,
  Store,
  Smartphone,
  ServerCog,
  Network,
  ShieldCheck,
  Search,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface ServicesSectionProps {
  onSelectServiceForInquiry: (service: ServiceItem) => void;
}

const serviceIconMap: Record<string, React.ReactNode> = {
  Code: <Code className="h-7 w-7 text-[#FF003C]" />,
  AppWindow: <AppWindow className="h-7 w-7 text-cyan-400" />,
  BrainCircuit: <BrainCircuit className="h-7 w-7 text-purple-400" />,
  Store: <Store className="h-7 w-7 text-amber-400" />,
  Smartphone: <Smartphone className="h-7 w-7 text-emerald-400" />,
  ServerCog: <ServerCog className="h-7 w-7 text-indigo-400" />,
  Network: <Network className="h-7 w-7 text-[#FF003C]" />,
  ShieldCheck: <ShieldCheck className="h-7 w-7 text-teal-400" />,
  Search: <Search className="h-7 w-7 text-rose-400" />
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForInquiry }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  return (
    <section id="services" className="relative w-full py-20 md:py-28 overflow-hidden bg-black/40">
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/10 bg-white/5 text-white/70 text-[10px] font-mono font-bold uppercase tracking-[0.3em]">
            Precision Engineering Services
          </div>

          <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white">
            <span className="text-moving-gradient">What I Build</span>
          </h2>

          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            From modern React frontends to hardened API microservices and LLM pipelines.
          </p>
        </div>

        {/* 9 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_DATA.map((service) => (
            <div
              key={service.id}
              className="group relative rounded-3xl border border-white/10 bg-black/70 backdrop-blur-2xl p-7 flex flex-col justify-between transition-all duration-500 hover:border-[#FF003C]/50 hover:shadow-[0_0_35px_rgba(255,0,60,0.2)] hover:-translate-y-1.5 overflow-hidden"
            >
              {/* Corner tech accent line */}
              <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-white/10 group-hover:border-[#FF003C] transition-colors" />

              <div>
                {/* Icon Header */}
                <div className="mb-6 relative">
                  <div className="p-3.5 w-fit rounded-2xl bg-white/5 border border-white/10 group-hover:border-[#FF003C]/40 group-hover:bg-[#FF003C]/10 transition-colors">
                    {serviceIconMap[service.icon] || <Code className="h-7 w-7 text-[#FF003C]" />}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-black text-white tracking-tight mb-3 group-hover:text-[#FF003C] transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-white/60 text-xs md:text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Deliverables tags */}
                {service.deliverables && (
                  <div className="space-y-2 mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block">
                      Deliverables:
                    </span>
                    <ul className="space-y-1.5">
                      {service.deliverables.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-white/50">
                          <CheckCircle2 className="w-3 h-3 text-[#FF003C] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom Action */}
              <div className="pt-4 border-t border-white/5 mt-auto">
                <button
                  onClick={() => onSelectServiceForInquiry(service)}
                  className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono font-bold uppercase tracking-wider text-white/70 group-hover:bg-[#FF003C] group-hover:text-white group-hover:border-transparent transition-all"
                >
                  <span>Request Scope</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
