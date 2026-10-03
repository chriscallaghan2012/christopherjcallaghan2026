import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PUBLIC_PAGES } from '../data/sitePages';
import { PublicPageTab } from '../types';
import { ScrollWritingTitle } from './ScrollWritingTitle';

type PublicContentTab = Exclude<PublicPageTab, 'contact'>;

const headlineAccents: Record<PublicContentTab, Array<{ word: string; color: 'orange' | 'purple' }>> = {
  about: [{ word: 'CHRISTOPHER', color: 'orange' }, { word: 'CALLAGHAN', color: 'purple' }],
  seo: [{ word: 'EASIER', color: 'orange' }, { word: 'FIND.', color: 'purple' }],
  'google-maps': [{ word: 'SHOW', color: 'orange' }, { word: 'LOOK.', color: 'purple' }],
  ppc: [{ word: 'RIGHT', color: 'purple' }, { word: 'PEOPLE.', color: 'orange' }],
  'social-media': [{ word: 'REASON', color: 'orange' }, { word: 'ATTENTION.', color: 'purple' }]
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
        ) : content.points && (
          <section className="mt-20 max-w-5xl">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/60">WHAT THIS CAN INCLUDE</p>
              <span className="font-mono text-[10px] text-white/55">{String(content.points.length).padStart(2, '0')} AREAS</span>
            </div>
            <ol className="divide-y divide-white/10">
              {content.points.map((point, index) => (
                <li key={point.title} className="grid gap-3 py-6 sm:grid-cols-[64px_1fr] sm:gap-5">
                  <span className="font-mono text-xs text-[#FF003C]">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h2 className="text-base font-bold text-white">{point.title}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/65 md:text-base">{point.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
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