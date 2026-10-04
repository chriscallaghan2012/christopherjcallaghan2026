import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PUBLIC_PAGES } from '../data/sitePages';
import { PublicPageTab } from '../types';
import { ScrollWritingTitle } from './ScrollWritingTitle';
import { ProcessFlow } from './ProcessFlow';
import { SystemMap } from './SystemMap';

type PublicContentTab = Exclude<PublicPageTab, 'contact'>;

const headlineAccents: Record<PublicContentTab, Array<{ word: string; color: 'orange' | 'purple' }>> = {
  about: [{ word: 'CHRISTOPHER', color: 'orange' }, { word: 'CALLAGHAN', color: 'purple' }],
  seo: [{ word: 'EASIER', color: 'orange' }, { word: 'FIND.', color: 'purple' }],
  'google-maps': [{ word: 'SHOW', color: 'orange' }, { word: 'LOOK.', color: 'purple' }],
  ppc: [{ word: 'RIGHT', color: 'purple' }, { word: 'PEOPLE.', color: 'orange' }],
  'social-media': [{ word: 'REASON', color: 'orange' }, { word: 'ATTENTION.', color: 'purple' }]
};

const serviceCtaHeadlines: Partial<Record<PublicContentTab, string>> = {
  seo: "LET'S MAKE THE RIGHT PAGES EASIER TO FIND.",
  'google-maps': "LET'S MAKE YOUR LOCAL PRESENCE CLEARER.",
  ppc: "LET'S BUILD A CAMPAIGN AROUND A CLEAR GOAL.",
  'social-media': "LET'S GIVE YOUR NEXT CONTENT CYCLE A PLAN."
};

const serviceCtaAccents: Partial<Record<PublicContentTab, Array<{ word: string; color: 'orange' | 'purple' }>>> = {
  seo: [{ word: 'PAGES', color: 'orange' }, { word: 'FIND.', color: 'purple' }],
  'google-maps': [{ word: 'LOCAL', color: 'orange' }, { word: 'CLEARER.', color: 'purple' }],
  ppc: [{ word: 'CAMPAIGN', color: 'purple' }, { word: 'GOAL.', color: 'orange' }],
  'social-media': [{ word: 'CONTENT', color: 'orange' }, { word: 'PLAN.', color: 'purple' }]
};

interface PublicPageContentProps {
  page: PublicContentTab;
  onNavigateToProjects: () => void;
}

export const PublicPageContent: React.FC<PublicPageContentProps> = ({ page, onNavigateToProjects }) => {
  const content = PUBLIC_PAGES[page];
  const isAbout = page === 'about';
  const buildHref = page === 'seo' || page === 'google-maps' || page === 'ppc'
    ? `/build?service=${page}`
    : '/build';

  return (
    <main className="relative min-h-[75svh] overflow-hidden py-24 md:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_16%,rgba(255,0,60,0.09),transparent_38%)]" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <header className="max-w-5xl">
          <p className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#FF003C]">{content.eyebrow}</p>
          <ScrollWritingTitle as="h1" text={content.headline} accentWords={headlineAccents[page]} className="text-5xl font-black leading-[0.92] text-white sm:text-7xl md:text-8xl" />
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-white/70 md:text-xl">{content.intro}</p>
        </header>

        {isAbout ? (
          <section className="mt-20 grid gap-8 border-y border-white/10 py-10 md:grid-cols-[180px_1fr]">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/60">THE WAY I WORK</p>
            <div className="max-w-3xl space-y-5 text-base leading-relaxed text-white/70">
              <p>I work across product, software and business problems, from the first idea through to a live digital experience.</p>
              <p>The aim is straightforward: understand what you are trying to achieve, then build the technology that helps get you there.</p>
            </div>
          </section>
        ) : null}

        {content.flow && <div className="mt-12"><ProcessFlow {...content.flow} /></div>}
        {content.systemMap && <div className="mt-5"><SystemMap {...content.systemMap} /></div>}

        {content.points && <section className="mt-12 max-w-5xl" aria-labelledby="service-includes-title">
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
            <h2 id="service-includes-title" className="font-mono text-xs uppercase tracking-[0.18em] text-white/60">WHAT THIS CAN INCLUDE</h2>
            <span className="shrink-0 font-mono text-[10px] text-white/55">{String(content.points.length).padStart(2, '0')} AREAS</span>
          </div>
          <ol className="divide-y divide-white/10 border-y border-white/10">
            {content.points.map((point, index) => (
              <li key={point.title} className="grid gap-3 py-6 sm:grid-cols-[80px_1fr] sm:gap-5">
                <span className="font-mono text-4xl font-black leading-none text-[#FF003C] sm:text-5xl">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-base font-bold text-white">{point.title}</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/65 md:text-base">{point.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>}

        {serviceCtaHeadlines[page] && <section className="mt-16 max-w-5xl border-t border-white/10 pt-10">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF003C]">NEXT STEP</p>
          <ScrollWritingTitle as="h2" text={serviceCtaHeadlines[page] ?? ''} accentWords={serviceCtaAccents[page]} className="mt-4 max-w-4xl text-4xl font-black leading-[0.95] text-white sm:text-5xl md:text-6xl" />
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">Tell me what you want to improve. We can shape the scope and the next step around your business.</p>
        </section>}

        <div className={`${serviceCtaHeadlines[page] ? 'mt-8' : 'mt-12'} flex flex-col gap-4 sm:flex-row`}>
          <a href={buildHref} className="inline-flex min-h-12 items-center justify-center gap-3 bg-[#FF003C] px-6 text-xs font-black tracking-[0.16em] text-white shadow-[0_0_28px_rgba(255,0,60,0.24)] transition-all hover:shadow-[0_0_40px_rgba(255,0,60,0.42)]">
            LET&apos;S BUILD <ArrowRight className="h-4 w-4" />
          </a>
          {isAbout ? (
            <button onClick={onNavigateToProjects} className="inline-flex min-h-12 items-center justify-center border border-white/20 px-6 text-xs font-bold tracking-[0.16em] text-white/75 transition-colors hover:border-white/50 hover:text-white">VIEW MY WORK</button>
          ) : <a href="/contact" className="inline-flex min-h-12 items-center justify-center border border-white/20 px-6 text-xs font-bold tracking-[0.16em] text-white/75 transition-colors hover:border-white/50 hover:text-white">SEND AN ENQUIRY</a>}
        </div>

        {!isAbout && <nav className="mt-20 border-t border-white/10 pt-8" aria-label="More growth services">
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">MORE WAYS TO GROW</p>
          <div className="flex flex-wrap gap-x-7 gap-y-4">
            {[['SEO', '/seo'], ['Google Maps', '/google-maps'], ['PPC', '/ppc'], ['Social media', '/social-media']].filter(([, href]) => href !== `/${content.slug}`).map(([label, href]) => (
              <a key={href} href={href} className="font-mono text-xs font-bold text-white/70 transition-colors hover:text-[#FF003C]">{label}</a>
            ))}
          </div>
        </nav>}
      </div>
    </main>
  );
};