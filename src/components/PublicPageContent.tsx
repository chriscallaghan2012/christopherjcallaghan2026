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

  const relatedToolsByPage: Record<string, { title: string; href: string; description: string }[]> = {
    'seo-services': [
      { title: 'Website Grader', href: '/tools/website-grader', description: 'Review observable technical SEO, accessibility, performance and AI-search signals.' },
      { title: 'llms.txt Builder', href: '/tools/llms-txt', description: 'Prepare a draft guide to your website for AI crawlers and assistants.' },
      { title: 'Structured Data Validator', href: '/tools/structured-data-validator', description: 'Inspect JSON-LD and common structured-data issues.' }
    ],
    'local-seo': [
      { title: 'Website Grader', href: '/tools/website-grader', description: 'Check technical signals that can affect how your local website is understood.' },
      { title: 'Structured Data Validator', href: '/tools/structured-data-validator', description: 'Review business and website structured data before publishing.' }
    ],
    'web-design-development': [
      { title: 'Website Grader', href: '/tools/website-grader', description: 'Find technical, accessibility and content signals worth reviewing.' },
      { title: 'Structured Data Validator', href: '/tools/structured-data-validator', description: 'Validate JSON-LD markup used by your website.' },
      { title: 'AI eCommerce Readiness', href: '/tools/ai-ecommerce-report', description: 'Review product-page information and observable commerce signals.' }
    ],
    'google-ads-management': [
      { title: 'Website Grader', href: '/tools/website-grader', description: 'Review technical and usability signals on your landing pages.' }
    ],
    'app-development': [
      { title: 'Structured Data Validator', href: '/tools/structured-data-validator', description: 'Inspect structured data on the public website that supports your product.' }
    ],
    'ai-automation': [
      { title: 'llms.txt Builder', href: '/tools/llms-txt', description: 'Create a draft website guide for AI discovery.' },
      { title: 'Structured Data Validator', href: '/tools/structured-data-validator', description: 'Inspect structured data used to describe your organisation and content.' }
    ]
  };
  const relatedTools = relatedToolsByPage[content.slug] ?? [];
  const serviceTheme: Record<string, { trace: string; accent: string; soft: string; panelTitle: string; bullets: string[] }> = {
    'seo-services': { trace: 'electric-border--orange', accent: '#FFB347', soft: 'rgba(255,179,71,.10)', panelTitle: 'Make search work harder', bullets: ['Technical SEO and indexing foundations', 'Useful content mapped to search intent', 'Clearer service pages and conversion paths', 'Measurement tied to meaningful enquiries'] },
    'local-seo': { trace: 'electric-border--orange', accent: '#FFB347', soft: 'rgba(255,179,71,.10)', panelTitle: 'Strengthen local visibility', bullets: ['Google Business Profile improvements', 'Consistent business details across listings', 'Useful service-area landing pages', 'Calls, directions and enquiries measured'] },
    'google-ads-management': { trace: 'electric-border--purple', accent: '#DF80FF', soft: 'rgba(139,92,246,.12)', panelTitle: 'Build campaigns around outcomes', bullets: ['Clear campaign goals and audience intent', 'Keyword, creative and landing-page alignment', 'Budget and search-term monitoring', 'Reporting focused on valuable actions'] },
    'social-media-marketing': { trace: 'electric-border--purple', accent: '#DF80FF', soft: 'rgba(139,92,246,.12)', panelTitle: 'Give content a clear direction', bullets: ['Content pillars and publishing plans', 'Platform-specific creative and messaging', 'Consistent brand voice and presentation', 'Engagement reviewed against business goals'] },
    'web-design-development': { trace: 'electric-border--red', accent: '#FF5577', soft: 'rgba(255,0,60,.10)', panelTitle: 'Design and build for real use', bullets: ['Clear user journeys and responsive layouts', 'Accessible, fast and maintainable interfaces', 'Integrations and content workflows', 'Testing, launch support and iteration'] },
    'agency-development-partner': { trace: 'electric-border--teal', accent: '#00DFC9', soft: 'rgba(0,223,201,.10)', panelTitle: 'Add reliable delivery capacity', bullets: ['White-label development support', 'Frontend, backend and integration work', 'Clear handovers and technical communication', 'Flexible support aligned to project scope'] },
    'app-development': { trace: 'electric-border--blue', accent: '#18A8FF', soft: 'rgba(24,168,255,.10)', panelTitle: 'Build an app people can use', bullets: ['Product scope and user-flow planning', 'iOS, Android or cross-platform options', 'API, account and data integrations', 'Testing and release-readiness support'] },
    'ai-automation': { trace: 'electric-border--purple', accent: '#DF80FF', soft: 'rgba(139,92,246,.12)', panelTitle: 'Make repetitive work lighter', bullets: ['Map workflows and remove manual friction', 'Connect the tools your team already uses', 'Add AI where it improves a real task', 'Validation, safeguards and human oversight'] }
  };
  const heroTheme = serviceTheme[content.slug] ?? { trace: 'electric-border--red', accent: '#FF5577', soft: 'rgba(255,0,60,.10)', panelTitle: 'A practical way forward', bullets: (content.points ?? []).slice(0, 4).map((point) => point.title) };

  return (
    <main className="relative min-h-[75svh] overflow-hidden py-24 md:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_16%,rgba(255,0,60,0.09),transparent_38%)]" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <section className={isAbout ? "" : "grid items-center gap-10 lg:grid-cols-[1.15fr_.85fr]"} aria-label={content.title}>
          <header className="max-w-5xl">
            <p className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.22em]" style={{ color: heroTheme.accent }}>{content.eyebrow}</p>
            <ScrollWritingTitle as="h1" text={content.headline} accentWords={headlineAccents[page]} className="text-5xl font-black leading-[0.92] text-white sm:text-7xl md:text-8xl" />
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70 md:text-xl">{content.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={buildHref} className="inline-flex min-h-12 items-center justify-center gap-3 px-6 text-xs font-black tracking-[0.16em] text-black transition-colors hover:brightness-110" style={{ backgroundColor: heroTheme.accent }}>LET&apos;S BUILD <ArrowRight className="h-4 w-4" /></a>
              <a href="/contact" className="inline-flex min-h-12 items-center justify-center border border-white/20 px-6 text-xs font-bold tracking-[0.16em] text-white/75 transition-colors hover:border-white/50 hover:text-white">SEND AN ENQUIRY</a>
            </div>
          </header>
          {!isAbout && <aside className={`site-card ${heroTheme.trace} border border-white/10 bg-[#09090c]/90 p-5 md:p-7`} style={{ '--card-glow': heroTheme.accent, '--card-glow-secondary': heroTheme.accent, backgroundColor: heroTheme.soft } as React.CSSProperties}>
            {String(page) === 'ai-automation' ? (
              <>
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#DF80FF]">AUTONOMOUS WORKFLOW / 01—04</p>
                    <h2 className="mt-2 text-xl font-black text-white">From trigger to verified outcome.</h2>
                  </div>
                  <span aria-hidden="true" className="mt-1 h-3 w-3 shrink-0 bg-[#DF80FF] shadow-[0_0_16px_rgba(223,128,255,.8)]" />
                </div>
                <ol className="mt-5 space-y-0">
                  {(content.flow?.steps ?? []).map((step, index) => (
                    <li key={step.title} className="grid grid-cols-[34px_1fr] gap-3 border-l border-[#DF80FF]/35 pb-5 pl-4 last:pb-0">
                      <span className="font-mono text-[10px] font-bold text-[#DF80FF]">{String(index + 1).padStart(2, '0')}</span>
                      <div>
                        <h3 className="text-sm font-bold text-white">{step.title}</h3>
                        <p className="mt-1 text-xs leading-5 text-white/55">{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: heroTheme.accent }}>SERVICE SNAPSHOT</p>
                <h2 className="mt-2 border-b border-white/10 pb-5 text-xl font-bold text-white">{heroTheme.panelTitle}</h2>
                <ul className="mt-5 space-y-4 text-sm leading-6 text-white/70">
                  {heroTheme.bullets.map((item) => <li key={item} className="flex gap-3"><span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0" style={{ backgroundColor: heroTheme.accent }} />{item}</li>)}
                </ul>
              </>
            )}
          </aside>}
        </section>

        {page === 'ai-automation' && <div className="mt-12 md:mt-16">
          <section aria-labelledby="automation-pipeline-title" className="relative overflow-hidden border border-[#DF80FF]/25 bg-[#09070F]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(223,128,255,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(223,128,255,.055) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative border-b border-white/10 p-5 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#DF80FF]">WORKFLOW CANVAS / EXAMPLE ARCHITECTURE</p>
                  <h2 id="automation-pipeline-title" className="mt-3 text-3xl font-black text-white sm:text-4xl">See how the pieces connect.</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">A node-based view of an automation, inspired by visual workflow builders. Follow the main path, then see where exceptions go. This is a design example, not a live connected workflow.</p>
                </div>
                <span className="inline-flex w-fit items-center gap-2 border border-[#DF80FF]/30 bg-[#160E20] px-3 py-2 font-mono text-[9px] uppercase tracking-[.15em] text-[#DF80FF]"><span className="h-2 w-2 animate-pulse bg-[#DF80FF]" /> WORKFLOW PREVIEW</span>
              </div>
            </div>
            <div className="relative p-4 sm:p-8 lg:p-10">
              <div className="grid items-center gap-y-3 lg:grid-cols-[minmax(0,1fr)_34px_minmax(0,1fr)_34px_minmax(0,1fr)_34px_minmax(0,1fr)]">
                {[
                  { n: '01', title: 'New enquiry', kind: 'TRIGGER', detail: 'Form / inbox / webhook', icon: '↗', color: '#DF80FF' },
                  { n: '02', title: 'Prepare data', kind: 'TRANSFORM', detail: 'Extract · clean · validate', icon: '⌘', color: '#A78BFA' },
                  { n: '03', title: 'Route decision', kind: 'LOGIC + AI', detail: 'Rules · classify · confidence', icon: '✳', color: '#C4B5FD' },
                  { n: '04', title: 'Update CRM', kind: 'ACTION', detail: 'Create record · assign owner', icon: '✓', color: '#6EE7B7' }
                ].map((node, index) => (
                  <React.Fragment key={node.n}>
                    <article className="group relative min-h-[150px] border border-[#DF80FF]/30 bg-[#100B18] p-4 shadow-[0_8px_28px_rgba(0,0,0,.25)] transition-all duration-300 hover:-translate-y-1 hover:border-[#DF80FF]/80 hover:shadow-[0_0_30px_rgba(139,92,246,.16)]">
                      <div className="absolute -top-[5px] left-4 h-[9px] w-[9px] border border-[#DF80FF]/70 bg-[#100B18]" />
                      <div className="absolute -bottom-[5px] left-4 h-[9px] w-[9px] border border-[#DF80FF]/70 bg-[#100B18]" />
                      <div className="flex items-center justify-between gap-2"><span className="font-mono text-[9px] tracking-[.14em] text-white/40">NODE {node.n}</span><span className="text-lg" style={{ color: node.color }}>{node.icon}</span></div>
                      <p className="mt-4 font-mono text-[9px] font-bold tracking-[.15em]" style={{ color: node.color }}>{node.kind}</p>
                      <h3 className="mt-1 text-sm font-black text-white">{node.title}</h3>
                      <p className="mt-2 text-[10px] leading-4 text-white/50">{node.detail}</p>
                    </article>
                    {index < 3 && <div aria-hidden="true" className="flex h-7 items-center justify-center lg:h-auto"><svg viewBox="0 0 34 20" className="h-5 w-8 overflow-visible text-[#DF80FF] lg:w-[34px]" fill="none"><path d="M1 10 H29 M23 4 L29 10 L23 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" /><path d="M1 10 H29" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 8" ><animate attributeName="stroke-dashoffset" from="0" to="-22" dur="1.4s" repeatCount="indefinite" /></path></svg></div>}
                  </React.Fragment>
                ))}
              </div>
              <div className="mx-auto mt-3 hidden h-8 w-px bg-gradient-to-b from-[#DF80FF]/70 to-amber-300/60 lg:block" />
              <div className="grid gap-3 lg:grid-cols-2">
                <div className="relative border border-emerald-300/25 bg-[#071510]/95 p-4 sm:p-5">
                  <div className="flex items-start gap-3"><span className="mt-0.5 text-emerald-300">✓</span><div><p className="font-mono text-[9px] font-bold uppercase tracking-[.16em] text-emerald-200">SUCCESS PATH / LOG + CONFIRM</p><h3 className="mt-2 text-sm font-bold text-white">Verified and recorded</h3><p className="mt-1 text-xs leading-5 text-white/55">Confirm the action, write an audit event and update the workflow status.</p></div></div>
                </div>
                <div className="relative border border-amber-300/25 bg-[#191208]/90 p-4 sm:p-5">
                  <div className="flex items-start gap-3"><span className="mt-0.5 text-amber-200">↳</span><div><p className="font-mono text-[9px] font-bold uppercase tracking-[.16em] text-amber-200">EXCEPTION PATH / HUMAN REVIEW</p><h3 className="mt-2 text-sm font-bold text-white">Pause safely when needed</h3><p className="mt-1 text-xs leading-5 text-white/55">Invalid data, low confidence or failed actions go to a review queue instead of silently continuing.</p></div></div>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
                <span className="mr-1 font-mono text-[9px] uppercase tracking-[.14em] text-white/35">Built-in controls</span>
                {['Scoped permissions', 'Validation', 'Retries', 'Audit trail', 'Monitoring'].map((item) => <span key={item} className="border border-white/10 bg-black/20 px-3 py-2 font-mono text-[9px] uppercase tracking-[.1em] text-white/55">{item}</span>)}
              </div>
            </div>
          </section>
        </div>}

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

        {page === 'ai-automation' && (
          <div className="mt-16 space-y-20 md:mt-24 md:space-y-28">
            <section aria-labelledby="automation-value-title" className="relative overflow-hidden border border-[#DF80FF]/25 bg-[#100b18] p-6 sm:p-9 lg:p-12">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_0%,rgba(139,92,246,.20),transparent_48%)]" />
              <div className="relative grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[.22em] text-[#DF80FF]">THE OUTCOME / NOT THE HYPE</p>
                  <h2 id="automation-value-title" className="mt-4 max-w-xl text-3xl font-black leading-tight text-white sm:text-4xl">Less chasing. Less copying. More work that actually moves forward.</h2>
                  <p className="mt-5 max-w-xl text-sm leading-7 text-white/65">The goal is not to automate everything. It is to remove avoidable friction from the work that matters, while making the process easier to understand, measure and manage.</p>
                </div>
                <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
                  {[
                    ['01', 'Fewer manual handoffs', 'Move information between systems without repeated copy-and-paste steps.'],
                    ['02', 'More consistent processes', 'Apply the same rules, checks and routing every time.'],
                    ['03', 'Faster access to information', 'Find and summarise approved business knowledge when it is needed.'],
                    ['04', 'Clearer operational visibility', 'See completed work, exceptions, approvals and failures in one place.']
                  ].map(([number, title, description]) => (
                    <article key={number} className="bg-[#100b18]/95 p-5 sm:p-6">
                      <span className="font-mono text-xs text-[#DF80FF]">{number} / VALUE</span>
                      <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/55">{description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section aria-labelledby="automation-usecases-title">
              <div className="mb-8 max-w-3xl">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#DF80FF]">REAL-WORLD APPLICATIONS</p>
                <h2 id="automation-usecases-title" className="mt-3 text-3xl font-black text-white sm:text-4xl">Where intelligent automation can earn its place.</h2>
                <p className="mt-4 text-base leading-7 text-white/60">Start with the process, not a fashionable tool. These are examples of the kinds of workflows that can be scoped around your systems and operating rules.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[
                  { n: '01', title: 'Enquiry to qualified lead', flow: 'Form or email → classify → enrich → CRM → assigned follow-up', body: 'Capture incoming enquiries, extract key details, route by service or urgency and prepare a useful handover for the right person.' },
                  { n: '02', title: 'Documents into structured data', flow: 'Document → extract → validate → review → system record', body: 'Turn repeatable forms, invoices or requests into structured information with validation and a review route for ambiguous fields.' },
                  { n: '03', title: 'Internal knowledge assistant', flow: 'Question → approved sources → grounded answer → source links', body: 'Help staff find policies, procedures and product information from approved material, with source references and clear limits.' },
                  { n: '04', title: 'Customer support triage', flow: 'New request → categorise → prioritise → draft → human send', body: 'Group incoming requests, surface urgent cases, suggest replies and send complex or sensitive issues to a person.' },
                  { n: '05', title: 'Reporting without the admin', flow: 'Business data → scheduled checks → summary → dashboard', body: 'Collect agreed metrics, prepare regular summaries and flag unusual changes without manually assembling the same report.' },
                  { n: '06', title: 'Operations and task routing', flow: 'Event → rules → owner → status updates → exception queue', body: 'Coordinate multi-step internal work, notify the next owner and make blocked tasks or failed steps visible.' }
                ].map((item) => (
                  <article key={item.n} className="site-card electric-border electric-border--purple flex min-h-full flex-col border border-white/10 bg-[#0b0b10] p-5 sm:p-6" style={{ '--card-glow': '#DF80FF', '--card-glow-secondary': '#8B5CF6' } as React.CSSProperties}>
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <span className="font-mono text-xs text-[#DF80FF]">{item.n} / USE CASE</span>
                      <span aria-hidden="true" className="h-2 w-2 bg-[#DF80FF]" />
                    </div>
                    <h3 className="mt-5 text-xl font-black text-white">{item.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-white/60">{item.body}</p>
                    <p className="mt-5 border-l-2 border-[#DF80FF]/70 bg-white/[.025] px-3 py-3 font-mono text-[10px] leading-5 text-white/65 sm:text-xs">{item.flow}</p>
                  </article>
                ))}
              </div>
            </section>

            <section aria-labelledby="automation-principles-title" className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#DF80FF]">BUILT FOR REAL OPERATIONS</p>
                <h2 id="automation-principles-title" className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">Useful AI needs more than a clever prompt.</h2>
                <p className="mt-5 text-sm leading-7 text-white/60">The workflow around the model matters just as much as the model itself. I design for the awkward cases, the permissions and the people who have to operate the system after launch.</p>
              </div>
              <div className="divide-y divide-white/10 border-y border-white/10">
                {[
                  ['Deterministic where possible', 'Use normal code and business rules for predictable steps. Bring AI in where language, ambiguity or unstructured information makes it useful.'],
                  ['Data access with boundaries', 'Only expose the data and actions the workflow needs. Treat credentials, personal information and external inputs carefully.'],
                  ['Human approval where it matters', 'Keep review gates for consequential actions, uncertain outputs, sensitive messages and decisions that need judgement.'],
                  ['Designed for failure and recovery', 'Validate results, handle timeouts, retry safely, record what happened and provide a clear route when the workflow cannot continue.'],
                  ['Measured, not assumed', 'Agree what success means and monitor completion, correction, exceptions and processing time. Do not confuse a demo with proven business value.']
                ].map(([title, description], index) => (
                  <article key={title} className="grid gap-3 py-5 sm:grid-cols-[44px_1fr]">
                    <span className="font-mono text-xs text-[#DF80FF]">0{index + 1}</span>
                    <div><h3 className="font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-white/60">{description}</p></div>
                  </article>
                ))}
              </div>
            </section>

            <section aria-labelledby="automation-delivery-title">
              <div className="max-w-3xl">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#DF80FF]">A CLEAR PATH TO DELIVERY</p>
                <h2 id="automation-delivery-title" className="mt-3 text-3xl font-black text-white sm:text-4xl">Small enough to prove. Solid enough to build on.</h2>
                <p className="mt-4 text-sm leading-7 text-white/60">We agree the first workflow and how it will be judged, deliver a controlled version, then expand only when the evidence supports it.</p>
              </div>
              <ol className="mt-8 grid gap-px border border-white/10 bg-white/10 md:grid-cols-4">
                {[
                  ['01', 'Discover', 'Review the current process, tools, access, risks and success criteria.'],
                  ['02', 'Prototype', 'Prove the core path with realistic examples before widening the scope.'],
                  ['03', 'Harden', 'Test edge cases, permissions, failures, monitoring and human approvals.'],
                  ['04', 'Improve', 'Review real operation, fix friction and prioritise the next useful step.']
                ].map(([number, title, description]) => (
                  <li key={number} className="bg-[#0b0b10] p-5 sm:p-6">
                    <span className="font-mono text-xs text-[#DF80FF]">{number} / PHASE</span>
                    <h3 className="mt-4 text-lg font-black text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/55">{description}</p>
                  </li>
                ))}
              </ol>
            </section>

          </div>
        )}

        {page !== 'ai-automation' && content.flow && <div className="mt-16"><ProcessFlow {...content.flow} /></div>}
        {page !== 'ai-automation' && content.systemMap && <div className="mt-5"><SystemMap {...content.systemMap} /></div>}

        {page !== 'ai-automation' && content.points && <section className="mt-12 max-w-5xl" aria-labelledby="service-includes-title">
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
            <h2 id="service-includes-title" className="font-mono text-xs uppercase tracking-[0.18em] text-white/60">WHAT THIS CAN INCLUDE</h2>
            <span className="shrink-0 font-mono text-[10px] text-white/55">{String(content.points.length).padStart(2, '0')} AREAS</span>
          </div>
          {String(page) === 'ai-automation' ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {content.points.map((point, index) => (
                <article key={point.title} className="site-card electric-border electric-border--purple relative overflow-hidden border border-[#DF80FF]/20 bg-[#09070D]/90 p-6 transition-colors hover:bg-[#120B18]" style={{ '--card-glow': '#DF80FF', '--card-glow-secondary': '#8B5CF6' } as React.CSSProperties}>
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#DF80FF]">AUTOMATION / {String(index + 1).padStart(2, '0')}</span>
                    <span aria-hidden="true" className="h-2 w-2 bg-[#DF80FF] shadow-[0_0_12px_rgba(223,128,255,.8)]" />
                  </div>
                  <h3 className="mt-5 text-lg font-black text-white">{point.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/60">{point.description}</p>
                </article>
              ))}
            </div>
          ) : (
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
          )}
        </section>}

        {page !== 'ai-automation' && content.deliverables && <section className="mt-16 max-w-5xl border-y border-white/10 py-8" aria-labelledby="service-deliverables-title">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF003C]">THE WORK, MADE TANGIBLE</p>
              <h2 id="service-deliverables-title" className="mt-2 text-2xl font-black text-white sm:text-3xl">What you can expect to receive</h2>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">SCOPED TO THE PROJECT</span>
          </div>
          {String(page) === 'ai-automation' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {content.deliverables.map((item, index) => (
                <article key={item.title} className="site-card electric-border electric-border--purple relative border border-white/10 bg-[#09070D]/80 p-5" style={{ '--card-glow': '#DF80FF', '--card-glow-secondary': '#8B5CF6' } as React.CSSProperties}>
                  <p className="font-mono text-[10px] font-bold tracking-[0.16em] text-[#DF80FF]">DELIVERABLE / {String(index + 1).padStart(2, '0')}</p>
                  <h3 className="mt-3 text-base font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{item.description}</p>
                </article>
              ))}
            </div>
          ) : (
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
          )}
        </section>}

        {page !== 'ai-automation' && content.metrics && <section className="mt-16 max-w-5xl" aria-labelledby="service-metrics-title">
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

        {page !== 'ai-automation' && content.chart && <KpiTrendChart chart={content.chart} />}

        {serviceCtaHeadlines[page] && <section className="mt-16 max-w-5xl border-t border-white/10 pt-10">
          <p className={`font-mono text-[10px] font-bold uppercase tracking-[0.2em] ${String(page) === 'ai-automation' ? 'text-[#DF80FF]' : 'text-[#FF003C]'}`}>NEXT STEP</p>
          <ScrollWritingTitle as="h2" text={serviceCtaHeadlines[page] ?? ''} accentWords={serviceCtaAccents[page]} className="mt-4 max-w-4xl text-4xl font-black leading-[0.95] text-white sm:text-5xl md:text-6xl" />
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">Tell me what you want to improve. We can shape the scope and the next step around your business.</p>
        </section>}

        <div className={`${serviceCtaHeadlines[page] ? 'mt-8' : 'mt-12'} flex flex-col gap-4 sm:flex-row`}>
          <a href={buildHref} className={`inline-flex min-h-12 items-center justify-center gap-3 px-6 text-xs font-black tracking-[0.16em] text-white transition-all ${String(page) === 'ai-automation' ? 'bg-[#8B5CF6] shadow-[0_0_28px_rgba(139,92,246,0.24)] hover:bg-[#DF80FF] hover:text-black' : 'bg-[#FF003C] shadow-[0_0_28px_rgba(255,0,60,0.24)] hover:bg-[#ffb347] hover:text-black hover:shadow-[0_0_40px_rgba(255,0,60,0.42)]'}`}>
            LET&apos;S BUILD <ArrowRight className="h-4 w-4" />
          </a>
          {isAbout ? (
            <button onClick={onNavigateToProjects} className="inline-flex min-h-12 items-center justify-center border border-white/20 px-6 text-xs font-bold tracking-[0.16em] text-white/75 transition-colors hover:border-white/50 hover:text-white">VIEW MY WORK</button>
          ) : <a href="/contact" className="inline-flex min-h-12 items-center justify-center border border-white/20 px-6 text-xs font-bold tracking-[0.16em] text-white/75 transition-colors hover:border-white/50 hover:text-white">SEND AN ENQUIRY</a>}
        </div>

        {page !== 'ai-automation' && relatedTools.length > 0 && (
          <section className="mt-20 border-t border-white/10 pt-8" aria-labelledby="related-tools-title">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF003C]">FREE TOOLS</p>
            <h2 id="related-tools-title" className="mt-2 text-2xl font-black text-white sm:text-3xl">Start with a practical check.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">Use these tools to gather evidence and identify useful next steps before deciding what needs work.</p>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {relatedTools.map((tool) => (
                <a key={tool.href} href={tool.href} className="group border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-[#FF003C]/50 hover:bg-white/[0.04]">
                  <span className="flex items-center justify-between gap-4 text-base font-bold text-white">
                    {tool.title}
                    <ArrowRight className="h-4 w-4 shrink-0 text-[#FF003C] transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-white/55">{tool.description}</span>
                </a>
              ))}
            </div>
          </section>
        )}

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