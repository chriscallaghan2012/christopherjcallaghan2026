'use client';

import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { MotionConfig, motion } from 'motion/react';
import type { ProcessFlowContent } from '../types';

interface ProcessFlowProps extends ProcessFlowContent {
  eyebrow?: string;
}

export const ProcessFlow: React.FC<ProcessFlowProps> = ({ title, intro, steps, eyebrow = 'A practical example' }) => (
  <MotionConfig reducedMotion="user" transition={{ duration: 0.45, ease: 'easeOut' }}>
    <section className="border-y border-white/10 bg-black/30 py-12 md:py-16" aria-labelledby="process-flow-title">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <header className="mb-7 max-w-3xl">
          <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF003C]">{eyebrow}</p>
          <h2 id="process-flow-title" className="text-2xl font-black text-white md:text-3xl">{title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60 md:text-base">{intro}</p>
        </header>

        <ol className="grid items-stretch gap-2 md:grid-cols-[minmax(0,1fr)_24px_minmax(0,1fr)_24px_minmax(0,1fr)_24px_minmax(0,1fr)] md:gap-3">
          {steps.map((step, index) => (
            <React.Fragment key={step.title}>
              <motion.li
                initial={{ opacity: 1, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.09 }}
                className="min-w-0 border-t-2 border-[#FF003C]/60 bg-white/[0.025] px-4 py-4 sm:px-5 sm:py-5"
              >
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#00DFC9]">STEP {String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 text-base font-bold leading-snug text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{step.description}</p>
              </motion.li>
              {index < steps.length - 1 && <div aria-hidden="true" className="flex items-center justify-center py-1 text-[#FF003C] md:py-0">
                <ArrowDown className="h-4 w-4 md:hidden" />
                <ArrowRight className="hidden h-4 w-4 md:block" />
              </div>}
            </React.Fragment>
          ))}
        </ol>
      </div>
    </section>
  </MotionConfig>
);