'use client';

import React, { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowRight, Bot, Check, ChevronRight, Globe2, MapPin, MessageCircle, Search, ShieldCheck, Sparkles, Star, Workflow } from 'lucide-react';
import type { PublicPage } from '../data/sitePages';

interface SeoSearchExperienceProps {
  content: PublicPage;
}

const conversations = [
  {
    question: 'How can my business show up in AI search?',
    answer: 'Start by making your business easy to verify. Align your website, Google Business Profile, reviews, directory listings and social profiles. Then build clear service pages that answer real customer questions and support those claims with useful, consistent information.',
    source: 'Website content · Business listings · Customer reviews'
  },
  {
    question: 'Does ranking on Google guarantee ChatGPT will recommend me?',
    answer: 'No. A Google ranking does not guarantee an AI recommendation. Strong technical SEO helps your pages get discovered, while clear service information, consistent business details and credible third-party references give systems more context to assess your business.',
    source: 'Technical SEO · Clear service pages · Trusted references'
  },
  {
    question: 'What should I improve first?',
    answer: 'Begin with the basics: check whether important pages can be crawled and indexed, make each service page answer a specific customer need, align your business details across key platforms, and measure relevant enquiries alongside search visibility.',
    source: 'Crawl and index checks · Service-page audit · Measurement'
  }
];

const signalCards = [
  { icon: Search, number: '01', title: 'Website & content', body: 'Clear service pages, useful answers, crawlable structure, internal links and technical foundations.' },
  { icon: MapPin, number: '02', title: 'Google & Maps', body: 'Accurate business details, relevant categories, service areas and links that match your website.' },
  { icon: Star, number: '03', title: 'Reviews & reputation', body: 'Authentic customer feedback and a consistent process for responding and learning from it.' },
  { icon: Globe2, number: '04', title: 'Directories & mentions', body: 'Reliable business information and relevant third-party references beyond your own website.' },
  { icon: MessageCircle, number: '05', title: 'Social & wider presence', body: 'Profiles and public information that reinforce who you are, what you do and where you operate.' },
  { icon: ShieldCheck, number: '06', title: 'Evidence & consistency', body: 'Keep important facts aligned. Conflicting details make it harder for people and systems to verify you.' }
];

const deliverySteps = [
  { number: '01', title: 'Find the gaps', body: 'Review search visibility, technical access, service pages, business profiles and the signals customers see.' },
  { number: '02', title: 'Fix the foundations', body: 'Prioritise crawlability, indexing, site structure, page experience and inconsistent business information.' },
  { number: '03', title: 'Build stronger evidence', body: 'Improve service content, customer answers, internal links, reviews workflows and relevant external references.' },
  { number: '04', title: 'Measure and refine', body: 'Compare search and AI visibility indicators with relevant visits, calls and qualified enquiries.' }
];

export const SeoSearchExperience: React.FC<SeoSearchExperienceProps> = ({ content }) => {
  const [activeConversation, setActiveConversation] = useState(0);
  const [displayedAnswer, setDisplayedAnswer] = useState('');
  const active = conversations[activeConversation];

  useEffect(() => {
    setDisplayedAnswer('');
    let cursor = 0;
    const typing = window.setInterval(() => {
      cursor = Math.min(cursor + 3, active.answer.length);
      setDisplayedAnswer(active.answer.slice(0, cursor));
      if (cursor >= active.answer.length) window.clearInterval(typing);
    }, 16);
    return () => window.clearInterval(typing);
  }, [active.answer]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.seo-reveal'));
    if (!('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('is-in-view'));
      return;
    }
    document.documentElement.classList.add('seo-motion-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-in-view', entry.isIntersecting));
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove('seo-motion-ready');
    };
  }, []);

  return (
    <div className="seo-experience mt-14 space-y-16 md:mt-20 md:space-y-24">
      <section className="seo-reveal seo-position-one relative isolate overflow-hidden border-y border-white/10 bg-[#0b0b10] py-14 sm:py-20 lg:py-24" aria-labelledby="seo-position-one-title">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_10%,rgba(255,179,71,.14),transparent_42%),radial-gradient(ellipse_at_0%_100%,rgba(255,0,60,.09),transparent_36%)]" />
        <div className="mx-auto grid max-w-[1500px] gap-10 px-5 md:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-16 xl:px-12">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[.22em] text-[#FFB347]">THE NEW POSITION 1 / SEARCH HAS CHANGED</p>
            <h2 id="seo-position-one-title" className="mt-5 max-w-3xl text-4xl font-black leading-[.98] tracking-tight text-white sm:text-5xl lg:text-6xl">It is no longer only about being on Google.</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">AI pulls signals from your Google presence, maps, reviews, directories, social profiles, website, content, ads, and third-party mentions to surface your company. You need to show up everywhere so AI can recognize you as the recommendation in your market.</p>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55">That answer is engineered, not luck. SEO and ads alone cannot buy it. Build a clear, consistent presence that people can verify and search systems can understand—then measure what actually brings the right enquiries.</p>
            <a href="#seo-signal-system" className="mt-8 inline-flex min-h-12 items-center gap-3 bg-[#FFB347] px-5 text-xs font-black uppercase tracking-[.14em] text-[#111114] transition-transform hover:translate-x-1">Explore the signals <ArrowRight className="h-4 w-4" /></a>
          </div>

          <div className="seo-chat-shell relative mx-auto w-full max-w-2xl border border-white/15 bg-[#08080c] shadow-[0_30px_100px_rgba(0,0,0,.4)]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center border border-[#FFB347]/35 bg-[#FFB347]/10 text-[#FFB347]"><Bot className="h-5 w-5" /></div>
                <div><p className="text-sm font-bold text-white">AI search conversation</p><p className="mt-1 font-mono text-[9px] uppercase tracking-[.13em] text-white/45">Illustrative interactive example</p></div>
              </div>
              <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" /> Demo</span>
            </div>

            <div className="seo-chat-thread space-y-6 px-4 py-5 sm:px-6 sm:py-7" aria-live="polite">
              <div className="flex justify-end gap-2">
                <div key={active.question} className="seo-chat-user max-w-[92%] bg-[#303039] px-4 py-3 text-sm leading-6 text-white sm:max-w-[85%]">{active.question}</div>
                <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center bg-[#FFB347] text-[10px] font-black text-[#111114]">YOU</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-[#111114]"><Sparkles className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <div key={active.question} className="seo-chat-answer">
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-white/85"><span>AI search assistant</span><span className="text-white/30">·</span><span className="text-[10px] font-normal text-white/40">Example response</span></div>
                    <p className="whitespace-pre-wrap text-sm leading-7 text-white/80">{displayedAnswer}<span className={displayedAnswer.length < active.answer.length ? "seo-typing-caret" : "hidden"} aria-hidden="true" /></p>
                    <div className="mt-5 border-t border-white/10 pt-4">
                      <p className="font-mono text-[9px] uppercase tracking-[.13em] text-white/40">Signals that may support an answer</p>
                      <div className="mt-2 flex flex-wrap gap-2">{active.source.split(' · ').map((source) => <span key={source} className="inline-flex items-center gap-1.5 border border-white/10 bg-white/[.035] px-2 py-1 text-[10px] text-white/60"><Check className="h-3 w-3 text-[#FFB347]" />{source}</span>)}</div>
                    </div>
                    <div className="mt-5 border-t border-white/10 pt-4">
                      <p className="font-mono text-[9px] uppercase tracking-[.13em] text-white/40">AI discovery surfaces</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="seo-ai-brand seo-ai-brand--chatgpt"><span className="seo-ai-brand-mark">✳</span>ChatGPT</span>
                        <span className="seo-ai-brand seo-ai-brand--gemini"><span className="seo-ai-brand-mark">✦</span>Gemini</span>
                        <span className="seo-ai-brand seo-ai-brand--claude"><span className="seo-ai-brand-mark">✳</span>Claude</span>
                        <span className="seo-ai-brand seo-ai-brand--perplexity"><span className="seo-ai-brand-mark">◈</span>Perplexity</span>
                        <span className="seo-ai-brand seo-ai-brand--copilot"><span className="seo-ai-brand-mark">◉</span>Copilot</span>
                        <span className="seo-ai-brand seo-ai-brand--google"><span className="seo-ai-brand-mark">G</span>Google AI</span>
                        <span className="seo-ai-brand seo-ai-brand--grok"><span className="seo-ai-brand-mark">𝕏</span>Grok</span>
                        <span className="seo-ai-brand seo-ai-brand--meta"><span className="seo-ai-brand-mark">∞</span>Meta AI</span>
                        <span className="seo-ai-brand seo-ai-brand--deepseek"><span className="seo-ai-brand-mark">◌</span>DeepSeek</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-[10px] leading-5 text-white/35">Illustrative only. These are examples of AI discovery products, not live integrations, citations or a promise that any platform will recommend a business.</p>
                </div>
              </div>
            </div>
            </div>

            <div className="border-t border-white/10 bg-white/[.02] p-4 sm:px-6">
              <p className="mb-3 font-mono text-[9px] font-bold uppercase tracking-[.14em] text-white/40">Try another question</p>
              <div className="flex flex-wrap gap-2">
                {conversations.map((conversation, index) => (
                  <button key={conversation.question} type="button" onClick={() => setActiveConversation(index)} aria-pressed={activeConversation === index} className={`min-h-9 border px-3 py-2 text-left text-[11px] transition-colors ${activeConversation === index ? 'border-[#FFB347]/60 bg-[#FFB347]/10 text-[#FFCF83]' : 'border-white/10 bg-transparent text-white/60 hover:border-white/30 hover:text-white'}`}>
                    {index === 0 ? 'AI visibility' : index === 1 ? 'Google vs AI' : 'What to fix first'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="seo-signal-system" className="seo-reveal mx-auto w-full max-w-[1500px] px-5 md:px-8 xl:px-12" aria-labelledby="seo-signals-title">
        <div className="grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
          <div><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#FFB347]">THE SIGNAL SYSTEM / 01—06</p><h2 id="seo-signals-title" className="mt-4 max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">Make every part of your presence tell the same story.</h2></div>
          <p className="max-w-2xl text-sm leading-7 text-white/60 lg:justify-self-end lg:text-base">Search and AI discovery are not one switch. Build a joined-up picture: a technically sound website, useful information, accurate profiles and credible signals that reinforce one another.</p>
        </div>
        <div className="mt-8 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-3">
          {signalCards.map(({ icon: Icon, number, title, body }) => <article key={number} className="group min-h-52 bg-[#09090d] p-6 transition-colors hover:bg-[#101015] sm:p-8">
            <div className="flex items-center justify-between"><span className="font-mono text-[10px] font-bold tracking-[.16em] text-[#FFB347]">{number} / SIGNAL</span><Icon className="h-5 w-5 text-white/40 transition-colors group-hover:text-[#FFB347]" /></div>
            <h3 className="mt-7 text-xl font-black text-white">{title}</h3><p className="mt-3 max-w-md text-sm leading-7 text-white/60">{body}</p>
          </article>)}
        </div>
      </section>

      <section className="seo-reveal seo-full-width-band border-y border-white/10 bg-[#0a0a0e] py-14 sm:py-20" aria-labelledby="seo-work-title">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8 xl:px-12">
          <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#FFB347]">WHAT THE WORK LOOKS LIKE</p><h2 id="seo-work-title" className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">A practical SEO plan, built around your business.</h2></div>
            <p className="max-w-3xl text-sm leading-7 text-white/60 lg:justify-self-end lg:text-base">No vague checklist and no ranking guarantees. Work is prioritised around what is blocking discovery, which pages matter commercially and what evidence will tell us whether the changes are helping.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {(content.points ?? []).map((point, index) => <article key={point.title} className="flex min-h-full flex-col border border-white/10 bg-[#08080c] p-5 sm:p-6">
              <span className="font-mono text-xs font-bold text-[#FFB347]">0{index + 1}</span><h3 className="mt-5 text-lg font-black text-white">{point.title}</h3><p className="mt-3 flex-1 text-sm leading-7 text-white/60">{point.description}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className="seo-reveal mx-auto w-full max-w-[1500px] px-5 md:px-8 xl:px-12" aria-labelledby="seo-deliverables-title">
        <div className="grid gap-6 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
          <div><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#FFB347]">THE OUTPUT / NOT JUST ADVICE</p><h2 id="seo-deliverables-title" className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">Know what was checked, changed and measured.</h2></div>
          <p className="max-w-3xl text-sm leading-7 text-white/60 lg:justify-self-end lg:text-base">The exact scope depends on your site and priorities. The work should leave you with clear decisions, tangible improvements and a baseline for the next round.</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {(content.deliverables ?? []).map((item, index) => <article key={item.title} className="border-t-2 border-[#FFB347]/70 bg-white/[.025] p-5 sm:p-6">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[#FFB347]">DELIVERABLE / 0{index + 1}</span><h3 className="mt-4 text-lg font-black text-white">{item.title}</h3><p className="mt-3 text-sm leading-7 text-white/60">{item.description}</p>
          </article>)}
        </div>
      </section>

      <section className="seo-reveal seo-full-width-band border-y border-white/10 bg-[#0b0b10] py-14 sm:py-20" aria-labelledby="seo-process-title">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8 xl:px-12">
          <div className="max-w-4xl"><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#FFB347]">FROM AUDIT TO IMPROVEMENT</p><h2 id="seo-process-title" className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">{content.flow?.title ?? 'From audit to useful improvement'}</h2><p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">{content.flow?.intro}</p></div>
          <ol className="mt-10 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
            {(content.flow?.steps ?? deliverySteps).map((step, index) => <li key={step.title} className="bg-[#09090d] p-6 sm:p-8">
              <div className="flex items-center justify-between"><span className="font-mono text-xs font-bold text-[#FFB347]">{String(index + 1).padStart(2, '0')} / STEP</span><ArrowDownRight className="h-5 w-5 text-white/30" /></div><h3 className="mt-8 text-xl font-black text-white">{step.title}</h3><p className="mt-3 text-sm leading-7 text-white/60">{step.description}</p>
            </li>)}
          </ol>
        </div>
      </section>

      <section className="seo-reveal mx-auto w-full max-w-[1500px] px-5 md:px-8 xl:px-12" aria-labelledby="seo-measure-title">
        <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
          <div><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#FFB347]">MEASURE WHAT CHANGES</p><h2 id="seo-measure-title" className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">Visibility matters. Useful actions matter more.</h2><p className="mt-5 text-sm leading-7 text-white/60">{content.measurement?.intro}</p><div className="mt-6 flex items-start gap-3 border-l-2 border-[#FFB347] bg-white/[.025] p-4"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#FFB347]" /><p className="text-xs leading-6 text-white/55">The figures below are illustrative placeholders, not client results or forecasts. Actual reporting uses agreed baselines and available analytics/search data.</p></div></div>
          <div className="border border-white/10 bg-[#09090d] p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5"><div><p className="font-mono text-[10px] uppercase tracking-[.15em] text-[#FFB347]">REPORTING SNAPSHOT</p><h3 className="mt-2 text-lg font-black text-white">Signals worth tracking</h3></div><span className="border border-white/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-white/45">Sample only</span></div>
            <dl className="grid sm:grid-cols-2">
              {(content.metrics ?? []).map((metric) => <div key={metric.label} className="border-b border-white/10 py-5 sm:px-4 sm:first:pl-0 sm:nth-[2n+1]:border-r sm:nth-[2n+1]:pl-0">
                <dt className="text-xs text-white/55">{metric.label}</dt><dd className="mt-2 text-3xl font-black text-white">{metric.value}</dd><p className="mt-2 text-xs leading-6 text-white/45">{metric.detail}</p>
              </div>)}
            </dl>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {(content.measurement?.steps ?? []).map((step) => <div key={step.label} className="border-t border-white/10 pt-3"><p className="font-mono text-[9px] font-bold uppercase tracking-[.12em] text-[#FFB347]">{step.label}</p><p className="mt-2 text-xs leading-6 text-white/55">{step.description}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="seo-reveal seo-full-width-band border-y border-white/10 bg-[#0a0a0e] py-14 sm:py-20" aria-labelledby="seo-system-title">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8 xl:px-12">
          <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr] lg:items-end"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#FFB347]">HOW THE PIECES CONNECT</p><h2 id="seo-system-title" className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">A joined-up system, not isolated SEO tasks.</h2></div><p className="max-w-3xl text-sm leading-7 text-white/60 lg:justify-self-end lg:text-base">{content.systemMap?.intro}</p></div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {(content.systemMap?.nodes ?? []).map((node, index) => <article key={node.id} className="relative border border-white/10 bg-[#09090d] p-5 sm:p-6">
              <span className="font-mono text-[10px] font-bold text-[#FFB347]">SIGNAL {String(index + 1).padStart(2, '0')}</span><h3 className="mt-4 text-lg font-black text-white">{node.title}</h3><p className="mt-2 text-sm text-white/65">{node.summary}</p><p className="mt-3 text-xs leading-6 text-white/50">{node.detail}</p><div className="mt-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-white/35"><Workflow className="h-3.5 w-3.5" />{node.group === 'source' ? 'Input signal' : node.group === 'outcome' ? 'Outcome' : 'Improvement'}</div>
            </article>)}
          </div>
          <p className="mt-4 flex items-start gap-2 text-xs leading-6 text-white/40"><ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0" />No single signal guarantees an AI mention or search position. The goal is to improve clarity, accessibility, consistency and evidence across the places customers look.</p>
        </div>
      </section>
    </div>
  );
};
