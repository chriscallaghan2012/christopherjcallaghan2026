import React from 'react';
import { ArrowDown, ArrowRight, Code, MapPin, MousePointerClick, Search } from 'lucide-react';
import { MotionConfig, motion } from 'motion/react';
import { ScrollWritingTitle } from './ScrollWritingTitle';
import { ProcessFlow } from './ProcessFlow';
import { SystemMap } from './SystemMap';
import type { SystemMapContent } from '../types';
import { ACADEMY_URL } from '../../lib/academy';

interface HomeSectionsProps {
  onOpenConsultation: () => void;
  onNavigate: (tab: 'build' | 'start') => void;
}

const waysToWork = [
  {
    id: 'start',
    label: '01 / START',
    title: 'Build a business.',
    description: 'Turn an idea into a business with the plan, brand and digital foundations to get moving.',
    details: 'Planning · Research · Setup · Finance · Brand · E-commerce · Marketing · SEO · Automation · Funding support',
    action: 'START A BUSINESS'
  },
  {
    id: 'build',
    label: '02 / BUILD',
    title: 'Build the thing you need.',
    description: 'A website, app, platform or system, shaped around the problem it needs to solve.',
    details: 'Websites · Apps · SaaS · E-commerce · Software · AI · Automation',
    action: 'BUILD SOMETHING'
  },
  {
    id: 'grow',
    label: '03 / GROW',
    title: 'Grow an existing business.',
    description: 'Make it easier for the right people to find you, buy from you and keep coming back.',
    details: 'Marketing · SEO · Google · Social media · AI search · Ads · Conversion · Automation · Digital systems',
    action: 'GROW YOUR BUSINESS'
  }
];

const technologies = [
  'PHP', 'Laravel', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
  'React Native', 'Expo', 'WordPress', 'WooCommerce',
  'Firebase', 'AWS', 'Vercel', 'Neon', 'PostgreSQL', 'MySQL', 'Stripe', 'APIs', 'AI',
  'LLMs', 'Automation'
];

const growthServices = [
  { label: 'SEO', href: '/seo-services', description: 'Build long-term visibility in search.', icon: Search, accent: 'text-[#FFB347]', hoverText: 'group-hover:text-[#FFB347]', border: 'hover:border-[#FFB347]/55', wash: 'group-hover:bg-[#FFB347]/[0.035]' },
  { label: 'Local SEO', href: '/local-seo', description: 'Help nearby customers find you.', icon: MapPin, accent: 'text-[#00DFC9]', hoverText: 'group-hover:text-[#00DFC9]', border: 'hover:border-[#00DFC9]/55', wash: 'group-hover:bg-[#00DFC9]/[0.035]' },
  { label: 'Google Ads', href: '/google-ads-management', description: 'Reach people ready to take action.', icon: MousePointerClick, accent: 'text-[#FF6F91]', hoverText: 'group-hover:text-[#FF6F91]', border: 'hover:border-[#FF6F91]/55', wash: 'group-hover:bg-[#FF6F91]/[0.035]' },
  { label: 'Web Design & Development', href: '/web-design-development', description: 'Websites built, fixed and kept working.', icon: Code, accent: 'text-[#FF003C]', hoverText: 'group-hover:text-[#FF003C]', border: 'hover:border-[#FF003C]/55', wash: 'group-hover:bg-[#FF003C]/[0.035]' }
];

const homepageSystemMap: SystemMapContent = {
  title: 'How an idea becomes a working product',
  intro: 'The visible website is one part of a connected system: goals and constraints shape the scope, product experience, backend and launch.',
  nodes: [
    { id: 'idea', title: 'Idea or problem', summary: 'What needs to change?', detail: 'Start with the opportunity, problem or outcome. The technology choice comes after understanding what the product needs to do.', examples: ['Problem statement', 'Desired user action', 'How success will be judged'], group: 'source' },
    { id: 'audience', title: 'People using it', summary: 'Who is it for?', detail: 'Identify the customers, teams or users the experience needs to serve and what they need to accomplish.', examples: ['User roles and permissions', 'Key tasks and pain points', 'Accessibility and device needs'], group: 'source' },
    { id: 'constraints', title: 'Requirements', summary: 'Budget, timing and existing systems', detail: 'Account for delivery constraints, existing tools, integrations, data and operational needs before fixing the scope.', examples: ['Budget and target launch date', 'Existing platforms and APIs', 'Security or data requirements'], group: 'source' },
    { id: 'scope', title: 'Product scope', summary: 'Priorities and delivery plan', detail: 'Translate the goal into a sensible first release, key user journeys and an order for delivery.', examples: ['MVP features', 'Acceptance checks', 'Milestones and dependencies'], group: 'work' },
    { id: 'experience', title: 'Website or application', summary: 'The user-facing experience', detail: 'Design and build the interface around the tasks users need to complete, on desktop and mobile.', examples: ['Responsive pages and navigation', 'Forms, accounts or checkout', 'Accessible states and feedback'], group: 'work' },
    { id: 'backend', title: 'Backend and data', summary: 'Logic, storage and APIs', detail: 'Implement the server-side functions, data model, APIs and integrations needed to make the product work.', examples: ['API routes and validation', 'Database and access rules', 'Payments, email or third-party services'], group: 'work' },
    { id: 'launch', title: 'Deployment and learning', summary: 'Release, measure and improve', detail: 'Deploy the product, test critical journeys and use real usage or feedback to choose what to improve next.', examples: ['Domain, DNS and SSL', 'Production environment and release checks', 'Analytics and feedback loop'], group: 'work' },
    { id: 'product', title: 'Working product', summary: 'A connected system ready for real use', detail: 'A live product where the interface, backend, data and integrations work together to support the original goal.', examples: ['A usable customer journey', 'Connected operations and data', 'A clear route for ongoing improvements'], group: 'outcome' }
  ],
  connections: [['idea', 'scope'], ['audience', 'experience'], ['constraints', 'backend'], ['scope', 'experience'], ['scope', 'backend'], ['experience', 'launch'], ['backend', 'launch'], ['launch', 'product']]
};

export const HomeSections: React.FC<HomeSectionsProps> = ({ onOpenConsultation, onNavigate }) => (
  <>
    <section id="ways-to-work" className="relative border-y border-white/10 bg-white/[0.015] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-14 md:mb-20">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-[#FF003C]">Three ways to work together</p>
          <ScrollWritingTitle text="WHAT ARE YOU TRYING TO DO?" accentWords={[{ word: 'TRYING', color: 'orange' }, { word: 'DO?', color: 'purple' }]} className="max-w-4xl text-4xl font-black leading-[0.95] text-white sm:text-6xl md:text-7xl" />
        </div>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {waysToWork.map((way) => (
            <article id={way.id} key={way.id} className="group scroll-mt-24 grid gap-6 py-8 md:grid-cols-[160px_1fr_1fr_auto] md:items-center md:gap-8 md:py-10">
              <span className="font-mono text-xs tracking-[0.18em] text-[#FF003C]">{way.label}</span>
              <h3 className="text-3xl font-black leading-tight text-white md:text-4xl">{way.title}</h3>
              <div>
                <p className="max-w-xl text-sm leading-relaxed text-white/65 md:text-base">{way.description}</p>
                <p className="work-details-shine mt-3 max-w-xl font-mono text-[11px] leading-relaxed">{way.details}</p>
              </div>
              <button onClick={() => way.id === 'build' || way.id === 'start' ? onNavigate(way.id) : onOpenConsultation()} className="inline-flex items-center gap-2 justify-self-start whitespace-nowrap text-xs font-black tracking-[0.12em] text-white transition-colors hover:text-[#FF003C] md:justify-self-end">
                {way.action}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>

    <ProcessFlow
      eyebrow="From first conversation to live product"
      title="A clear route from idea to launch."
      intro="Start with the outcome. Shape the right scope, build the product and its connections, then launch and improve it with real feedback."
      steps={[
        { title: 'Set the objective', description: 'Clarify the problem, audience and outcome the work needs to support.' },
        { title: 'Shape the scope', description: 'Choose the right product, priorities, integrations and delivery plan.' },
        { title: 'Build and connect', description: 'Create the experience, backend and services needed to make it work.' },
        { title: 'Launch and improve', description: 'Deploy, check the important journeys and use feedback to decide what is next.' }
      ]}
    />
    <div className="mt-5"><SystemMap {...homepageSystemMap} eyebrow="A system map / idea to launch" /></div>

    <section className="relative overflow-hidden py-28 md:py-40">
      <div className="pointer-events-none absolute -right-40 top-1/4 h-[28rem] w-[28rem] rounded-full bg-[#FF003C]/10 blur-[140px]" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <p className="mb-8 font-mono text-xs uppercase tracking-[0.24em] text-[#00DFC9]">The technology is the easy part</p>
        <ScrollWritingTitle text={"YOU DON'T NEED\nTO KNOW\nWHAT TECHNOLOGY\nYOU NEED."} accentWords={[{ word: 'TECHNOLOGY', color: 'orange' }, { word: 'NEED.', color: 'purple' }]} className="max-w-6xl text-5xl font-black leading-[0.9] tracking-tight text-white sm:text-7xl md:text-8xl" />
        <p className="mt-10 max-w-3xl text-xl font-bold uppercase leading-snug text-white md:text-3xl">You just need to know what you&apos;re trying to achieve.</p>
        <p className="mt-4 text-sm text-white/55 md:text-base">Bring me the idea, problem or goal. I&apos;ll work out the technology.</p>
      </div>
    </section>

    <section className="border-y border-white/10 bg-black/35 py-20 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[0.8fr_1.2fr] md:items-start md:px-8">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-[#DF80FF]">A few things in the toolbox</p>
          <ScrollWritingTitle text={'THE\nTOOLBOX.'} accentWords={[{ word: 'TOOLBOX.', color: 'purple' }]} className="text-5xl font-black leading-none text-white md:text-7xl" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/55">The project decides the technology. Not the other way around.</p>
        </div>
        <div>
          <div className="flex flex-wrap gap-x-5 gap-y-3 border-y border-white/10 py-6">
            {technologies.map((technology) => <span key={technology} className="font-mono text-xs text-white/65 md:text-sm">{technology}</span>)}
          </div>
          <p className="mt-5 text-sm font-semibold text-white">I use whatever technology makes sense for the project.</p>
        </div>
      </div>
    </section>

    <section aria-labelledby="growth-services-title" className="border-y border-white/10 bg-white/[0.015] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#00DFC9]">Growth services</p>
            <h2 id="growth-services-title" className="text-2xl font-black text-white md:text-3xl">Make it easier to get found.</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/55">Search, local visibility, paid campaigns and the websites that connect them to your business goals.</p>
        </div>
        <MotionConfig reducedMotion="user">
          <motion.nav
            aria-label="SEO, local SEO, Google Ads and web design services"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {growthServices.map((service) => {
              const Icon = service.icon;
              return (
                <motion.a
                  key={service.href}
                  href={service.href}
                  variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.99 }}
                  className={`group relative flex min-h-40 flex-col items-center justify-between overflow-hidden border border-white/10 bg-white/[0.025] p-5 text-center transition-colors duration-300 ${service.border} ${service.wash}`}
                >
                  <span aria-hidden="true" className={`absolute left-5 right-5 top-0 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 ${service.accent.replace('text-', 'bg-')}`} />
                  <span className="flex w-full flex-col items-center text-center">
                    <span className={`mb-4 flex h-11 w-11 items-center justify-center border border-white/10 bg-black/20 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-6 group-hover:scale-110 ${service.accent}`}>
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span className={`block text-xl font-black text-white transition-colors ${service.hoverText}`}>{service.label}</span>
                    <span className="mt-2 block max-w-xs text-sm leading-relaxed text-white/60">{service.description}</span>
                  </span>
                  <span className={`mt-5 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest ${service.accent}`}>Explore {service.label}<ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></span>
                </motion.a>
              );
            })}
          </motion.nav>
        </MotionConfig>
      </div>
    </section>
  </>
);

export const HomeClosingSections: React.FC<HomeSectionsProps> = ({ onNavigate }) => (
  <>
    <section className="relative overflow-hidden border-t border-white/10 py-24 md:py-32">
      <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-[#FF003C]/10 blur-[130px]" />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-[1fr_1fr] md:items-end md:px-8">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-[#FF003C]">Start with the idea</p>
          <ScrollWritingTitle text={"GOT AN IDEA?\nLET'S BUILD\nTHE BUSINESS."} accentWords={[{ word: 'IDEA?', color: 'orange' }, { word: 'BUILD', color: 'purple' }, { word: 'BUSINESS.', color: 'orange' }]} className="text-5xl font-black leading-[0.92] text-white sm:text-6xl md:text-8xl" />
        </div>
        <div className="max-w-xl md:justify-self-end">
          <p className="text-base leading-relaxed text-white/65">From the first idea through business planning, setup, website, technology, marketing and launch, I can help build the foundations around it.</p>
          <p className="mt-3 text-sm text-white/60">Funding support can be part of the plan when it makes sense.</p>
          <button onClick={() => onNavigate('start')} className="mt-7 inline-flex items-center gap-2 bg-[#FF003C] px-6 py-4 text-xs font-black tracking-[0.16em] text-white shadow-[0_0_30px_rgba(255,0,60,0.22)] transition-all hover:gap-4 hover:shadow-[0_0_40px_rgba(255,0,60,0.4)]">START YOUR BUSINESS <ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>
    </section>

    <section id="about" className="scroll-mt-24 border-y border-white/10 bg-white/[0.02] py-16 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-[1fr_1fr] md:items-end md:px-8">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-[#FFB347]">Full-stack developer / AI / business / builder</p>
          <ScrollWritingTitle text={'CHRISTOPHER\nJ. CALLAGHAN'} accentWords={[{ word: 'CHRISTOPHER', color: 'orange' }, { word: 'CALLAGHAN', color: 'purple' }]} className="text-4xl font-black leading-none text-white sm:text-5xl md:text-6xl" />
        </div>
        <p className="max-w-xl text-base leading-relaxed text-white/60 md:justify-self-end">15+ years building websites, applications, software, integrations, AI systems and digital businesses.</p>
      </div>
    </section>

    <section id="contact" className="relative scroll-mt-24 overflow-hidden py-28 text-center md:py-36">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#FF003C]/10 to-transparent" />
      <div className="relative mx-auto max-w-5xl px-5">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.24em] text-[#FF003C]">Your move</p>
        <ScrollWritingTitle text={'WHAT ARE YOU\nBUILDING?'} accentWords={[{ word: 'WHAT', color: 'purple' }, { word: 'BUILDING?', color: 'orange' }]} className="text-5xl font-black leading-[0.9] text-white sm:text-7xl md:text-8xl" />
        <p className="mt-6 text-sm text-white/55 md:text-base">You don&apos;t need the technical plan. Start with the idea.</p>
        <button onClick={() => onNavigate('build')} className="mt-9 inline-flex items-center gap-3 bg-[#FF003C] px-8 py-4 text-xs font-black tracking-[0.16em] text-white shadow-[0_0_35px_rgba(255,0,60,0.35)] transition-all hover:gap-5 hover:shadow-[0_0_50px_rgba(255,0,60,0.55)]">LET&apos;S BUILD IT <ArrowRight className="h-4 w-4" /></button>
      </div>
    </section>
  </>
);

interface AcademySectionProps {
  onNavigateToClasses: () => void;
}

export const AcademySection: React.FC<AcademySectionProps> = ({ onNavigateToClasses }) => (
  <section aria-labelledby="academy-home-title" className="relative overflow-hidden border-y border-white/10 bg-black/35 py-20 md:py-24">
    <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(255,0,60,0.12),transparent_68%)]" />
    <div className="relative mx-auto max-w-7xl px-5 md:px-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#00DFC9]">Learn AI. Build your idea. Launch your MVP.</p>
          <h2 id="academy-home-title" className="mt-5 text-4xl font-black leading-[1.05] text-white sm:text-5xl md:text-6xl">AI Builder Academy</h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">Learn how to use AI to turn your ideas into real websites, apps and MVPs, even if you don&apos;t have a traditional coding background. Practical, live 60-minute classes teach you to build with modern AI-assisted tools, not follow a traditional coding course.</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={ACADEMY_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 bg-[#FF003C] px-5 text-xs font-black tracking-[0.1em] text-white transition-colors hover:bg-[#df0035]">EXPLORE THE ACADEMY <ArrowRight aria-hidden="true" className="h-4 w-4" /></a>
            <button onClick={onNavigateToClasses} className="inline-flex min-h-12 items-center gap-2 border border-white/25 px-5 text-xs font-bold tracking-[0.1em] text-white transition-colors hover:border-[#FF003C] hover:text-[#FF5575]">VIEW CLASSES <ArrowRight aria-hidden="true" className="h-4 w-4" /></button>
          </div>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">New practical classes added regularly.</p>
        </div>
        <div className="border-y border-white/10 py-5 lg:my-1 lg:self-center">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5575]">Tools and skills</p>
          <ul aria-label="Practical skills and tools" className="mt-4 grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-2">
            {['AI-assisted design', 'AI prototyping', 'Stitch', 'Google AI Studio', 'VS Code + AI', 'GitHub', 'Vercel', 'Neon', 'APIs', 'Deployment', 'Domains', 'Building MVPs'].map((skill) => (
              <li key={skill} className="border-t border-white/10 py-2.5 text-sm text-white/65">{skill}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-white/10 pt-7 md:mt-16 md:pt-9">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5575]">From idea to launch</p>
          <p className="text-xs text-white/40">One practical step at a time</p>
        </div>
        <ol aria-label="IDEA to LAUNCH" className="academy-flow-grid grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-y-0">
          {['IDEA', 'DESIGN', 'PROTOTYPE', 'BUILD', 'DEPLOY', 'LAUNCH'].map((step, index) => (
            <li key={step} className="relative min-w-0 border-l-2 border-[#FF003C]/60 bg-white/[0.025] px-3 py-3 sm:px-4 lg:border-l-0 lg:border-t-2 lg:px-3">
              <span className="font-mono text-[10px] font-bold text-[#00DFC9]">0{index + 1}</span>
              <span className="mt-1 block text-base font-black text-white">{step}</span>
              {index < 5 && <>
                {index % 2 === 0 ? <>
                  <span className="flow-dash-x academy-flow-dash academy-flow-dash-mobile-x absolute -right-5 top-1/2 z-0 w-5 -translate-y-1/2" />
                  <ArrowRight aria-hidden="true" className="academy-flow-arrow-x absolute top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-[#FF5575] sm:hidden" />
                </> : <>
                  <span className="flow-dash-y academy-flow-dash academy-flow-dash-mobile-y absolute -bottom-8 left-1/2 z-0 h-8 -translate-x-1/2" />
                  <ArrowDown aria-hidden="true" className="academy-flow-arrow-y absolute left-1/2 z-10 h-3.5 w-3.5 text-[#FF5575] sm:hidden" />
                </>}
                {index === 2 ? <>
                  <span className="flow-dash-y academy-flow-dash academy-flow-dash-tablet-y absolute -bottom-8 left-1/2 z-0 h-8 -translate-x-1/2" />
                  <ArrowDown aria-hidden="true" className="absolute -bottom-3 left-1/2 z-10 hidden h-3.5 w-3.5 -translate-x-1/2 text-[#FF5575] sm:block lg:hidden" />
                </> : <>
                  <span className="flow-dash-x academy-flow-dash academy-flow-dash-tablet-x absolute -right-5 top-1/2 z-0 w-5 -translate-y-1/2" />
                  <ArrowRight aria-hidden="true" className="absolute -right-3 top-1/2 z-10 hidden h-3.5 w-3.5 -translate-y-1/2 text-[#FF5575] sm:block lg:hidden" />
                </>}
                <span className="flow-dash-x academy-flow-dash academy-flow-dash-desktop-x absolute -right-5 top-1/2 z-0 w-5 -translate-y-1/2" />
                <ArrowRight aria-hidden="true" className="absolute -right-3 top-1/2 z-10 hidden h-3.5 w-3.5 -translate-y-1/2 text-[#FF5575] lg:block" />
              </>}
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
);