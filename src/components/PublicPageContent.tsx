import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PUBLIC_PAGES } from '../data/sitePages';
import type { PublicPage } from '../data/sitePages';
import { PublicPageTab } from '../types';
import { ScrollWritingTitle } from './ScrollWritingTitle';
import { ProcessFlow } from './ProcessFlow';
import { SystemMap } from './SystemMap';

type PublicContentTab = Exclude<PublicPageTab, 'contact'>;

const headlineAccents: Record<PublicContentTab, Array<{ word: string; color: 'orange' | 'purple' }>> = {
  about: [{ word: 'CHRISTOPHER', color: 'orange' }, { word: 'CALLAGHAN', color: 'purple' }],
  'seo-services': [{ word: 'EASIER', color: 'orange' }, { word: 'FIND.', color: 'purple' }],
  'local-seo': [{ word: 'SHOW', color: 'orange' }, { word: 'LOOK.', color: 'purple' }],
  'google-ads-management': [{ word: 'RIGHT', color: 'purple' }, { word: 'PEOPLE.', color: 'orange' }],
  'social-media-marketing': [{ word: 'REASON', color: 'orange' }, { word: 'ATTENTION.', color: 'purple' }],
  'web-design-development': [{ word: 'WEBSITE', color: 'orange' }, { word: 'WORK.', color: 'purple' }],
  'agency-development-partner': [{ word: 'TEAM,', color: 'orange' }, { word: 'EXTENDED.', color: 'purple' }],
  'app-development': [{ word: 'MOBILE', color: 'orange' }, { word: 'USE.', color: 'purple' }],
  'ai-automation': [{ word: 'WORK', color: 'purple' }, { word: 'DOWN.', color: 'orange' }]
};

const serviceCtaHeadlines: Partial<Record<PublicContentTab, string>> = {
  'seo-services': "LET'S MAKE THE RIGHT PAGES EASIER TO FIND.",
  'local-seo': "LET'S MAKE YOUR LOCAL PRESENCE CLEARER.",
  'google-ads-management': "LET'S BUILD A CAMPAIGN AROUND A CLEAR GOAL.",
  'social-media-marketing': "LET'S GIVE YOUR NEXT CONTENT CYCLE A PLAN.",
  'web-design-development': "LET'S MAKE YOUR WEBSITE WORK FOR YOU.",
  'agency-development-partner': "LET'S ADD CAPACITY TO YOUR DELIVERY TEAM.",
  'app-development': "LET'S BUILD AN APP PEOPLE CAN USE.",
  'ai-automation': "LET'S MAKE THE REPETITIVE WORK LIGHTER."
};

const serviceCtaAccents: Partial<Record<PublicContentTab, Array<{ word: string; color: 'orange' | 'purple' }>>> = {
  'seo-services': [{ word: 'PAGES', color: 'orange' }, { word: 'FIND.', color: 'purple' }],
  'local-seo': [{ word: 'LOCAL', color: 'orange' }, { word: 'CLEARER.', color: 'purple' }],
  'google-ads-management': [{ word: 'CAMPAIGN', color: 'purple' }, { word: 'GOAL.', color: 'orange' }],
  'social-media-marketing': [{ word: 'CONTENT', color: 'orange' }, { word: 'PLAN.', color: 'purple' }],
  'web-design-development': [{ word: 'WEBSITE', color: 'orange' }, { word: 'YOU.', color: 'purple' }],
  'agency-development-partner': [{ word: 'DELIVERY', color: 'purple' }, { word: 'TEAM.', color: 'orange' }],
  'app-development': [{ word: 'AN', color: 'orange' }, { word: 'APP.', color: 'purple' }],
  'ai-automation': [{ word: 'WORK', color: 'purple' }, { word: 'LIGHTER.', color: 'orange' }]
};

const KpiTrendChart: React.FC<{ chart: NonNullable<PublicPage['chart']> }> = ({ chart }) => {
  const chartLeft = 48;
  const chartRight = 608;
  const chartTop = 22;
  const chartBottom = 190;
  const ticks = [20, 10, 0, -10, -20];
  const xFor = (index: number) => chartLeft + index * ((chartRight - chartLeft) / 5);
  const yFor = (value: number) => chartBottom - ((value + 20) / 40) * (chartBottom - chartTop);

  return (
    <section className="mt-16 max-w-5xl" aria-labelledby="service-chart-title">
      <div className="border-b border-white/10 pb-5">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF003C]">{chart.eyebrow}</p>
        <h2 id="service-chart-title" className="mt-2 text-2xl font-black text-white sm:text-3xl">{chart.title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">{chart.description}</p>
      </div>
      <figure className="mt-6 border border-white/10 bg-black/35 p-4 sm:p-6">
        <div className="flex flex-col gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#FFB347]">Illustrative example only</p>
            <p className="mt-1 text-xs text-white/50">Change from each series&apos; baseline; 0% means no change.</p>
          </div>
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/40">BASELINE + 5 MONTHS</p>
        </div>
        <svg className="mt-5 block w-full" viewBox="0 0 640 252" role="img" aria-label={`${chart.title}, illustrative percentage change from baseline across five months`}>
          <text x="48" y="12" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">CHANGE</text>
          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={chartLeft} x2={chartRight} y1={yFor(tick)} y2={yFor(tick)} stroke={tick === 0 ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)'} strokeDasharray={tick === 0 ? undefined : '3 7'} />
              <text x="0" y={yFor(tick) + 4} fill="rgba(255,255,255,0.55)" fontSize="10" fontFamily="monospace">{tick > 0 ? '+' : ''}{tick}%</text>
            </g>
          ))}
          {chart.periods.map((period, index) => (
            <text key={period} x={xFor(index)} y="220" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace">{period}</text>
          ))}
          <text x={chartLeft} y="244" fill="rgba(255,255,255,0.38)" fontSize="9" fontFamily="monospace">REPORTING PERIOD</text>
          {chart.series.map((series) => (
            <g key={series.label}>
              <polyline
                fill="none"
                stroke={series.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={series.values.map((value, index) => `${xFor(index)},${yFor(value - 100)}`).join(' ')}
              />
              {series.values.map((value, index) => (
                <circle key={`${series.label}-${index}`} cx={xFor(index)} cy={yFor(value - 100)} r="3.5" fill={series.color} />
              ))}
            </g>
          ))}
        </svg>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-4">
          {chart.series.map((series) => (
            <li key={series.label} className="flex items-center gap-2 text-xs text-white/70">
              <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: series.color }} />
              {series.label}
            </li>
          ))}
        </ul>
        <figcaption className="mt-4 max-w-3xl text-xs leading-relaxed text-white/45">Each point shows percentage change from that metric&apos;s own baseline, not a percentage-point change. The lines are illustrative sample data, not client results or a forecast. A live report uses your Search Console and analytics data, agreed conversion definitions, and comparable reporting periods.</figcaption>
      </figure>
    </section>
  );
};

interface PublicPageContentProps {
  page: PublicContentTab;
  onNavigateToProjects: () => void;
}

export const PublicPageContent: React.FC<PublicPageContentProps> = ({ page, onNavigateToProjects }) => {
  const content = PUBLIC_PAGES[page];
  const isAbout = page === 'about';
  const buildHref = page === 'about' ? '/build' : `/build?service=${page}`;

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
          <div className="mt-16 max-w-5xl">
            <section className="grid gap-8 border-y border-white/10 py-10 md:grid-cols-[180px_1fr]" aria-labelledby="about-profile-title">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/60">01 / ABOUT ME</p>
              <div className="max-w-3xl space-y-5 text-base leading-relaxed text-white/70">
                <h2 id="about-profile-title" className="text-2xl font-black leading-tight text-white sm:text-3xl">An independent developer who thinks about the whole product.</h2>
                <p>I&apos;m Christopher J. Callaghan, a Manchester-based full-stack developer, AI builder and business creator. I work with founders, growing businesses and agencies to turn ideas, bottlenecks and opportunities into useful digital products.</p>
                <p>My work moves between product thinking and hands-on engineering. I can help shape an early idea, build a customer-facing website or app, connect the services behind it, and keep improving the product after launch. The point is not to add technology for its own sake; it is to make something clearer, more useful or easier to run.</p>
                <p>I work directly with clients and can also join an agency team as a white-label development partner. In either case, I aim to make decisions understandable, progress visible and the finished work straightforward for the people who will own it next.</p>
              </div>
            </section>

            <section className="grid gap-8 border-b border-white/10 py-10 md:grid-cols-[180px_1fr]" aria-labelledby="about-work-title">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/60">02 / THE WORK</p>
              <div>
                <h2 id="about-work-title" className="text-2xl font-black text-white sm:text-3xl">From the first screen to the systems behind it.</h2>
                <dl className="mt-7 grid gap-x-10 sm:grid-cols-2">
                  <div className="border-t border-white/10 py-4">
                    <dt className="text-base font-bold text-white">Websites and commerce</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-white/60">New builds, redesigns, e-commerce journeys, content platforms and improvements to sites that already have customers and operational needs.</dd>
                  </div>
                  <div className="border-t border-white/10 py-4">
                    <dt className="text-base font-bold text-white">Apps and digital products</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-white/60">Product discovery, MVP scope, user journeys, account and data flows, integrations, testing and a practical path to release.</dd>
                  </div>
                  <div className="border-t border-white/10 py-4">
                    <dt className="text-base font-bold text-white">Software and integrations</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-white/60">Custom tools, APIs, dashboards, payments and connections between platforms, designed around the way a team actually works.</dd>
                  </div>
                  <div className="border-t border-white/10 py-4">
                    <dt className="text-base font-bold text-white">AI and automation</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-white/60">Focused AI features and repeatable workflows, with validation and human oversight where decisions or business data matter.</dd>
                  </div>
                </dl>
              </div>
            </section>

            <section className="grid gap-8 border-b border-white/10 py-10 md:grid-cols-[180px_1fr]" aria-labelledby="about-approach-title">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/60">03 / MY APPROACH</p>
              <div>
                <h2 id="about-approach-title" className="text-2xl font-black text-white sm:text-3xl">Make the next decision easier.</h2>
                <ol className="mt-6 divide-y divide-white/10 border-y border-white/10">
                  <li className="grid gap-2 py-4 sm:grid-cols-[52px_1fr]"><span className="font-mono text-xs text-[#FF003C]">01</span><div><h3 className="text-sm font-bold text-white">Start with the outcome</h3><p className="mt-1 text-sm leading-relaxed text-white/60">Understand who the work is for, what needs to change and how you will know it is helping.</p></div></li>
                  <li className="grid gap-2 py-4 sm:grid-cols-[52px_1fr]"><span className="font-mono text-xs text-[#FF003C]">02</span><div><h3 className="text-sm font-bold text-white">Find a useful scope</h3><p className="mt-1 text-sm leading-relaxed text-white/60">Separate what matters now from what can wait, and make important assumptions and dependencies visible.</p></div></li>
                  <li className="grid gap-2 py-4 sm:grid-cols-[52px_1fr]"><span className="font-mono text-xs text-[#FF003C]">03</span><div><h3 className="text-sm font-bold text-white">Build and check the real journey</h3><p className="mt-1 text-sm leading-relaxed text-white/60">Connect the interface to its data and services, then test the important paths people and teams will use.</p></div></li>
                  <li className="grid gap-2 py-4 sm:grid-cols-[52px_1fr]"><span className="font-mono text-xs text-[#FF003C]">04</span><div><h3 className="text-sm font-bold text-white">Hand over with context</h3><p className="mt-1 text-sm leading-relaxed text-white/60">Leave clear notes about what changed, how to operate it and what would make sense to improve next.</p></div></li>
                </ol>
              </div>
            </section>

            <section className="grid gap-8 border-b border-white/10 py-10 md:grid-cols-[180px_1fr]" aria-labelledby="about-experience-title">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/60">04 / IN PRACTICE</p>
              <div className="max-w-3xl space-y-5 text-base leading-relaxed text-white/70">
                <h2 id="about-experience-title" className="text-2xl font-black leading-tight text-white sm:text-3xl">I like work where the details have to connect.</h2>
                <p>That might mean taking an event-booking product beyond its public website: connecting venue discovery to live availability, checkout and payment services, then giving staff an offline-capable way to validate bookings. It might mean building a tutor directory where profiles, filters, booking and management tools work as one experience.</p>
                <p>Those projects reflect the kind of problems I enjoy: the visible product matters, but so do the data, integrations and operational steps that make it dependable. I bring that same end-to-end attention to smaller websites, focused fixes and agency delivery work.</p>
              </div>
            </section>
          </div>
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

        {content.deliverables && <section className="mt-16 max-w-5xl border-y border-white/10 py-8" aria-labelledby="service-deliverables-title">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF003C]">THE WORK, MADE TANGIBLE</p>
              <h2 id="service-deliverables-title" className="mt-2 text-2xl font-black text-white sm:text-3xl">What you can expect to receive</h2>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">SCOPED TO THE PROJECT</span>
          </div>
          <ol className="grid gap-x-10 sm:grid-cols-2">
            {content.deliverables.map((item, index) => (
              <li key={item.title} className="grid grid-cols-[36px_1fr] gap-3 border-t border-white/10 py-4">
                <span className="font-mono text-xs font-bold text-[#FF003C]">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/60">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>}

        {content.metrics && <section className="mt-16 max-w-5xl" aria-labelledby="service-metrics-title">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF003C]">MEASURE WHAT CHANGES</p>
              <h2 id="service-metrics-title" className="mt-2 text-2xl font-black text-white sm:text-3xl">Set a baseline. Measure meaningful change.</h2>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-white/40">Illustrative values only / not client results</p>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-white/55">{content.measurement?.intro ?? 'Agree what success means, record a starting point and compare results over consistent periods. Percentages describe observed change, never a guaranteed uplift.'}</p>
          </div>
          <dl className="grid border-b border-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {content.metrics.map((metric) => (
              <div key={metric.label} className="border-b border-white/10 py-5 sm:border-r sm:px-5 sm:first:pl-0 lg:border-b-0 lg:first:pl-0">
                <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/55">{metric.label}</dt>
                <dd className="mt-3 text-3xl font-black leading-none text-white">{metric.value}</dd>
                <p className="mt-3 text-xs leading-relaxed text-white/50">{metric.detail}</p>
              </div>
            ))}
          </dl>
          {content.measurement?.steps && <ol className="grid gap-4 border-b border-white/10 py-5 sm:grid-cols-3">
            {content.measurement.steps.map((step, index) => <li key={step.label}>
              <p className={`font-mono text-[9px] font-bold uppercase tracking-[0.14em] ${index === 0 ? 'text-[#FF003C]' : index === 1 ? 'text-[#00DFC9]' : 'text-[#FFB347]'}`}>{step.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-white/55">{step.description}</p>
            </li>)}
          </ol>}
        </section>}

        {content.chart && <KpiTrendChart chart={content.chart} />}

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
            {[['SEO', '/seo-services'], ['Local SEO', '/local-seo'], ['Google Ads', '/google-ads-management'], ['Social media', '/social-media-marketing'], ['Web design & development', '/web-design-development'], ['Agency development partner', '/agency-development-partner'], ['iPhone & Android apps', '/app-development'], ['AI & automation', '/ai-automation']].filter(([, href]) => href !== `/${content.slug}`).map(([label, href]) => (
              <a key={href} href={href} className="font-mono text-xs font-bold text-white/70 transition-colors hover:text-[#FF003C]">{label}</a>
            ))}
          </div>
        </nav>}
      </div>
    </main>
  );
};