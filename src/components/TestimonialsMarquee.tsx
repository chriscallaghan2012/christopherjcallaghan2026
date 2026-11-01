'use client';

import React from 'react';
import { motion, MotionConfig } from 'motion/react';
import { MessageSquareQuote } from 'lucide-react';

const placeholders = [
  { id: '01', label: 'CLIENT FEEDBACK', text: 'A space reserved for a real client review.' },
  { id: '02', label: 'PROJECT EXPERIENCE', text: 'Your words about the work, the process and the outcome.' },
  { id: '03', label: 'WORKING TOGETHER', text: 'Verified feedback will be added here.' },
  { id: '04', label: 'RESULTS THAT MATTER', text: 'A real client story, shared with permission.' }
];

export const TestimonialsMarquee: React.FC = () => (
  <MotionConfig reducedMotion="user">
    <section aria-labelledby="client-feedback-title" className="relative overflow-hidden border-y border-white/10 bg-[#09090d]/90 py-16 md:py-20">
      <div className="mx-auto mb-8 flex max-w-7xl flex-col gap-3 px-5 md:mb-10 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#00DFC9]">The people behind the projects</p>
          <h2 id="client-feedback-title" className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">Good work. Real relationships.</h2>
        </div>
        <p className="max-w-md text-xs leading-6 text-white/45 md:text-sm">A space for genuine client feedback. These are clearly marked placeholders until real testimonials are added.</p>
      </div>

      <div className="group relative overflow-hidden py-2">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#09090d] to-transparent md:w-28" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#09090d] to-transparent md:w-28" />
        <motion.div className="flex w-max gap-3 pr-3 group-hover:[animation-play-state:paused]" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 42, ease: 'linear', repeat: Infinity }}>
          {[...placeholders, ...placeholders].map((item, index) => (
            <article key={`left-${item.id}-${index}`} className="flex w-[270px] shrink-0 flex-col justify-between border border-white/10 bg-white/[0.025] p-5 sm:w-[340px] sm:p-6">
              <MessageSquareQuote aria-hidden="true" className="mb-5 h-5 w-5 text-[#FF5575]/80" />
              <p className="text-sm leading-6 text-white/60">{item.text}</p>
              <p className="mt-6 border-t border-white/10 pt-4 font-mono text-[9px] font-bold tracking-[0.16em] text-[#00DFC9]">{item.label} / COMING SOON</p>
            </article>
          ))}
        </motion.div>
      </div>

      <div className="group relative mt-3 overflow-hidden py-2">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#09090d] to-transparent md:w-28" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#09090d] to-transparent md:w-28" />
        <motion.div className="flex w-max gap-3 pr-3 group-hover:[animation-play-state:paused]" animate={{ x: ['-50%', '0%'] }} transition={{ duration: 48, ease: 'linear', repeat: Infinity }}>
          {[...placeholders.slice().reverse(), ...placeholders.slice().reverse()].map((item, index) => (
            <article key={`right-${item.id}-${index}`} className="flex w-[270px] shrink-0 flex-col justify-between border border-white/10 bg-white/[0.025] p-5 sm:w-[340px] sm:p-6">
              <MessageSquareQuote aria-hidden="true" className="mb-5 h-5 w-5 text-[#DF80FF]/80" />
              <p className="text-sm leading-6 text-white/60">{item.text}</p>
              <p className="mt-6 border-t border-white/10 pt-4 font-mono text-[9px] font-bold tracking-[0.16em] text-[#DF80FF]">{item.label} / COMING SOON</p>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  </MotionConfig>
);
