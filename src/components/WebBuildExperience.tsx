import React, { useState } from 'react';
import { ArrowRight, Braces, Code2, Eye, Layers3, MonitorSmartphone, Terminal, Zap } from 'lucide-react';
import { MotionConfig, motion, AnimatePresence } from 'motion/react';

const stages = [
  {
    id: 'structure',
    label: '01 / STRUCTURE',
    title: 'Start with the foundations',
    description: 'Build the semantic structure first: clear sections, meaningful content, accessible controls and a layout that works before the visual polish.',
    language: 'HTML',
    code: `<main class="page">
  <header class="hero">
    <p class="eyebrow">YOUR BUSINESS</p>
    <h1>Make your next move.</h1>
    <p>Clear message. Useful experience.</p>
    <a href="/contact">Start a project</a>
  </header>
  <section class="services">
    <article>Web design</article>
    <article>Development</article>
    <article>Integrations</article>
  </section>
</main>`
  },
  {
    id: 'design',
    label: '02 / DESIGN',
    title: 'Give the experience its character',
    description: 'Turn the structure into a responsive interface with a deliberate visual system, readable type, considered spacing and a consistent brand.',
    language: 'CSS',
    code: `.hero {
  display: grid;
  gap: clamp(1.5rem, 5vw, 4rem);
  min-height: 34rem;
  align-content: center;
  padding: clamp(2rem, 7vw, 6rem);
  background: #101018;
  color: #fff;
}

.hero h1 {
  max-width: 11ch;
  font-size: clamp(3rem, 8vw, 7rem);
  line-height: .92;
  letter-spacing: -.06em;
}

.hero a {
  width: fit-content;
  padding: 1rem 1.4rem;
  background: #ff3158;
  color: #09090c;
}`
  },
  {
    id: 'function',
    label: '03 / FUNCTION',
    title: 'Make every interaction do a job',
    description: 'Connect the interface to real application behaviour: validated forms, APIs, accounts, payments, content systems and useful feedback.',
    language: 'TypeScript',
    code: `async function submitEnquiry(form: FormData) {
  const response = await fetch('/api/enquiries', {
    method: 'POST',
    body: form,
  });

  if (!response.ok) {
    throw new Error('Could not send enquiry');
  }

  return response.json();
}

// Validate → send → confirm
// Handle errors. Protect user data.`
  },
  {
    id: 'launch',
    label: '04 / DELIVERY',
    title: 'Test it, ship it, keep improving',
    description: 'Check real devices, accessibility, performance, security and search foundations. Monitor the live product and improve it using evidence.',
    language: 'WORKFLOW',
    code: `✓ Responsive layout checks
✓ Keyboard and screen-reader review
✓ Performance and Core Web Vitals
✓ Forms, APIs and error states
✓ Metadata, sitemap and indexing
✓ Analytics and conversion events
→ Release when the checks pass`
  }
];

export const WebBuildExperience: React.FC = () => {
  const [active, setActive] = useState(0);
  const stage = stages[active];

  return (
    <MotionConfig reducedMotion="user">
      <section className="web-build-lab relative mt-16 overflow-hidden border-y border-white/10 bg-[#08080d] py-14 sm:py-20" aria-labelledby="web-build-lab-title">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 12% 20%, rgba(255,49,88,.14), transparent 32%), radial-gradient(circle at 88% 80%, rgba(103,83,255,.12), transparent 30%)' }} />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.22em] text-[#ff5577]">INSIDE THE BUILD / FROM CODE TO CUSTOMER</p>
            <h2 id="web-build-lab-title" className="mt-4 text-3xl font-black leading-[.98] tracking-tight text-white sm:text-5xl">A website is more than a good-looking screen.</h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">Explore the stages behind a real web project. Change the build stage to see the code, then watch the browser preview reflect the work.</p>
          </div>

          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" role="tablist" aria-label="Website build stages">
            {stages.map((item, index) => (
              <button key={item.id} type="button" role="tab" aria-selected={active === index} onClick={() => setActive(index)} className={`group flex min-h-14 items-center justify-between border px-4 py-3 text-left transition-colors ${active === index ? 'border-[#ff5577]/70 bg-[#ff3158]/10 text-white' : 'border-white/10 bg-white/[.02] text-white/55 hover:border-white/30 hover:text-white'}`}>
                <span className="font-mono text-[10px] font-bold tracking-[.12em]">{item.label}</span>
                <ArrowRight className={`h-4 w-4 transition-transform ${active === index ? 'translate-x-0 text-[#ff5577]' : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
              </button>
            ))}
          </div>

          <div className="mt-5 grid items-stretch gap-4 xl:grid-cols-[.92fr_1.08fr]">
            <div className="min-w-0 border border-white/10 bg-[#0d0d14]">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2 text-white/65"><Terminal className="h-4 w-4 text-[#ff5577]" /><span className="font-mono text-[10px] uppercase tracking-[.14em]">build-terminal</span></div>
                <span className="font-mono text-[9px] text-[#00dfc9]">● EXAMPLE CODE</span>
              </div>
              <div className="flex items-center gap-2 border-b border-white/[.06] px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-[#ff5577]" /><span className="h-2 w-2 rounded-full bg-[#ffb347]" /><span className="h-2 w-2 rounded-full bg-[#00dfc9]" />
                <span className="ml-2 font-mono text-[10px] text-white/40">project / {stage.language.toLowerCase()}</span>
              </div>
              <div className="min-h-[330px] overflow-x-auto p-4 sm:p-6">
                <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#ffb347]"><Code2 className="h-3.5 w-3.5" /> {stage.language}</div>
                <AnimatePresence mode="wait">
                  <motion.pre key={stage.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: .22 }} className="whitespace-pre font-mono text-[11px] leading-[1.9] text-[#d8d8e3] sm:text-xs"><code>{stage.code}</code></motion.pre>
                </AnimatePresence>
                <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 font-mono text-[9px] text-white/40"><span className="text-[#00dfc9]">✓</span> Illustrative snippet — implementation depends on project requirements</div>
              </div>
            </div>

            <div className="min-w-0 border border-white/10 bg-[#101018]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2 text-white/65"><Eye className="h-4 w-4 text-[#00dfc9]" /><span className="font-mono text-[10px] uppercase tracking-[.14em]">browser-preview</span></div>
                <div className="flex items-center gap-2 text-white/35"><MonitorSmartphone className="h-3.5 w-3.5" /><span className="font-mono text-[9px]">RESPONSIVE</span></div>
              </div>
              <div className="p-3 sm:p-5">
                <div className="overflow-hidden border border-white/10 bg-[#f2f0ed] text-[#17171b] shadow-2xl">
                  <div className="flex items-center gap-1.5 border-b border-black/10 bg-white px-3 py-2"><span className="h-1.5 w-1.5 rounded-full bg-[#ff6b6b]" /><span className="h-1.5 w-1.5 rounded-full bg-[#ffc45c]" /><span className="h-1.5 w-1.5 rounded-full bg-[#5ccf91]" /><span className="ml-3 flex-1 truncate rounded-sm bg-[#f0eff1] px-3 py-1 font-mono text-[8px] text-black/40">yourbusiness.co.uk</span></div>
                  <AnimatePresence mode="wait">
                    <motion.div key={stage.id} initial={{ opacity: 0, scale: .985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .99 }} transition={{ duration: .28 }} className="min-h-[330px] p-5 sm:p-7">
                      <div className="flex items-center justify-between border-b border-black/10 pb-4"><span className="text-[10px] font-black tracking-[.18em]">STUDIO / BUSINESS</span><span className="text-[9px] font-semibold">MENU　 CONTACT ↗</span></div>
                      <div className="py-8 sm:py-10">
                        <p className="text-[8px] font-bold tracking-[.2em] text-[#d42e50]">{active === 0 ? 'A CLEAR START' : active === 1 ? 'DESIGNED WITH INTENT' : active === 2 ? 'BUILT TO DO MORE' : 'READY FOR THE REAL WORLD'}</p>
                        <h3 className="mt-3 max-w-[12ch] text-4xl font-black leading-[.92] tracking-[-.06em] sm:text-5xl">{active === 0 ? 'Make your next move.' : active === 1 ? 'Stand out. Stay clear.' : active === 2 ? 'Turn visits into action.' : 'Built to keep moving.'}</h3>
                        <p className="mt-4 max-w-sm text-[11px] leading-5 text-black/60">{active === 0 ? 'A clear message and a structure that helps people find what they need.' : active === 1 ? 'A distinctive visual system that feels considered on every screen.' : active === 2 ? 'Useful interactions connect the experience to the systems behind your business.' : 'Responsive, accessible and tested — with a plan for what comes next.'}</p>
                        <div className="mt-5 inline-flex items-center gap-3 bg-[#d92f51] px-4 py-3 text-[9px] font-black uppercase tracking-[.12em] text-white">Explore the project <ArrowRight className="h-3 w-3" /></div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 border-t border-black/10 pt-4">
                        {['Strategy', 'Design', 'Technology'].map((label, i) => <div key={label} className="border-l-2 border-[#d92f51] pl-2"><p className="text-[9px] font-bold">{label}</p><p className="mt-1 text-[8px] text-black/45">{['Clear direction', 'Built around people', 'Ready to scale'][i]}</p></div>)}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="mt-3 flex items-center gap-2 font-mono text-[9px] text-white/40"><Zap className="h-3 w-3 text-[#ffb347]" /> Preview updates as you move through the build</div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 border-t border-white/10 pt-6 md:grid-cols-[1fr_auto] md:items-center">
            <div><p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#ff5577]">{stage.label}</p><h3 className="mt-2 text-xl font-black text-white sm:text-2xl">{stage.title}</h3><p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">{stage.description}</p></div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setActive((current) => (current + stages.length - 1) % stages.length)} className="border border-white/20 px-4 py-3 font-mono text-[10px] font-bold text-white/70 transition-colors hover:border-white/50 hover:text-white">PREVIOUS</button>
              <button type="button" onClick={() => setActive((current) => (current + 1) % stages.length)} className="flex items-center gap-2 bg-[#ff3158] px-4 py-3 font-mono text-[10px] font-black text-black transition-colors hover:bg-[#ffb347]">NEXT STAGE <ArrowRight className="h-3.5 w-3.5" /></button>
            </div>
          </div>

          <div className="mt-10 grid gap-3 border-t border-white/10 pt-7 sm:grid-cols-3">
            <div className="flex gap-3"><Layers3 className="mt-0.5 h-4 w-4 shrink-0 text-[#ff5577]" /><div><p className="text-xs font-bold text-white">Designed as a complete system</p><p className="mt-1 text-xs leading-5 text-white/45">Not just a homepage — the journeys, content and integrations fit together.</p></div></div>
            <div className="flex gap-3"><MonitorSmartphone className="mt-0.5 h-4 w-4 shrink-0 text-[#00dfc9]" /><div><p className="text-xs font-bold text-white">Built for every screen</p><p className="mt-1 text-xs leading-5 text-white/45">Responsive behaviour is part of the build, not an afterthought.</p></div></div>
            <div className="flex gap-3"><Braces className="mt-0.5 h-4 w-4 shrink-0 text-[#ffb347]" /><div><p className="text-xs font-bold text-white">Real engineering underneath</p><p className="mt-1 text-xs leading-5 text-white/45">Clean code, data, APIs and maintainable foundations where the project needs them.</p></div></div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
};
