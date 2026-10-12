import React from 'react';
import { ArrowRight, Rocket } from 'lucide-react';
import { TOOLS, FUTURE_TOOLS, type ToolCardData } from '../data/tools';

/** Reusable card for a single tool in the directory (home, /tools, future listings). */
export const ToolCard: React.FC<{ tool: ToolCardData }> = ({ tool }) => {
  const Icon = tool.icon;
  const isLive = tool.status === 'live';
  return (
    <article className="group relative flex h-full flex-col border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-[#FF003C]/55">
      <div className="flex items-start justify-between gap-3">
        <span className={`flex h-11 w-11 items-center justify-center border ${tool.accent}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className={`border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] ${
          isLive ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300' : 'border-white/15 bg-white/[0.04] text-white/50'
        }`}>
          {isLive ? 'Live' : 'Coming soon'}
        </span>
      </div>
      <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5575]">{tool.eyebrow}</p>
      <h3 className="mt-2 text-xl font-black text-white">{tool.name}</h3>
      <p className="mt-1.5 text-sm font-bold text-white/80">{tool.tagline}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">{tool.description}</p>
      {tool.capabilities && tool.capabilities.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${tool.name} capabilities`}>
          {tool.capabilities.map((capability) => (
            <li key={capability} className="border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-white/55">
              {capability}
            </li>
          ))}
        </ul>
      )}
      {isLive ? (
        <a href={tool.href} className="mt-6 inline-flex min-h-11 items-center gap-2 self-start bg-[#FF003C] px-5 text-xs font-black tracking-[0.1em] text-[#171717] transition-colors hover:bg-[#FF2A55]">
          Open tool <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </a>
      ) : (
        <span className="mt-6 inline-flex min-h-11 items-center gap-2 self-start border border-white/15 px-5 font-mono text-xs uppercase tracking-[0.1em] text-white/40">
          In development
        </span>
      )}
    </article>
  );
};

/** Tools directory page content: lists every tool card consistently. */
export const ToolsDirectory: React.FC = () => (
  <div className="px-5 py-14 md:px-8 md:py-20">
    <div className="mx-auto max-w-5xl">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-[#FF5575]">Free tools</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[0.95] text-white sm:text-6xl">
        Free tools for your website.
      </h1>
      <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
        Practical, no-account tools that analyse your site and tell you what to improve next — built with the same
        engineering I use for client projects.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
        {FUTURE_TOOLS.map((future) => (
          <article key={future.name} className="flex flex-col border border-white/10 bg-white/[0.02] p-6">
            <span className="flex h-11 w-11 items-center justify-center border border-white/10 text-white/40">
              <future.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-lg font-black text-white">{future.name}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">{future.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-white/10 pt-8">
        <Rocket className="h-5 w-5 text-[#FF5575]" aria-hidden="true" />
        <p className="text-sm text-white/65">
          Need something specific?{' '}
          <a href="/contact" className="font-bold text-white transition-colors hover:text-[#FF5575]">Tell me what you&apos;re trying to solve</a>{' '}
          or <a href="/services" className="font-bold text-white transition-colors hover:text-[#FF5575]">browse my services</a>.
        </p>
      </div>
    </div>
  </div>
);
