import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { ArrowRight, Check, CircleDot } from 'lucide-react';

type ServiceConfig = {
  accent: string;
  tint: string;
  label: string;
  title: string;
  intro: string;
  outcomes: { value: string; label: string }[];
  stages: { name: string; kicker: string; title: string; body: string; output: string; code: string[] }[];
  capabilities: { title: string; body: string; tag: string }[];
  safeguards: { title: string; body: string }[];
};

const configs: Record<string, ServiceConfig> = {
  'local-seo': {
    accent: '#FFB347', tint: 'rgba(255,179,71,.12)', label: 'LOCAL DISCOVERY SYSTEM',
    title: 'Turn local searches into real customer actions.',
    intro: 'A connected local presence: accurate business information, useful location pages and clear routes from discovery to contact.',
    outcomes: [{ value: '01', label: 'Profile clarity' }, { value: '02', label: 'Local relevance' }, { value: '03', label: 'Customer actions' }],
    stages: [
      { name: 'Profile', kicker: '01 / BUSINESS SIGNALS', title: 'Make the business easy to understand.', body: 'Bring categories, services, opening hours, contact details, photos and destination links into line with the real business.', output: 'A complete, accurate business profile', code: ['profile.category = "Primary service"', 'profile.hours = verifiedOpeningHours', 'profile.links = [website, booking, contact]', 'validate(profile, businessSource)'] },
      { name: 'Coverage', kicker: '02 / SERVICE AREAS', title: 'Build pages around genuine coverage.', body: 'Explain what is offered, who it helps and where the business actually works. Each page needs useful local detail, not duplicated town-name copy.', output: 'Distinct service-area landing pages', code: ['for (const area of verifiedCoverage) {', '  page = buildUsefulLocalPage(area)', '  page.include(service, proof, FAQs)', '  page.addClearNextStep()', '}'] },
      { name: 'Trust', kicker: '03 / CONSISTENCY', title: 'Keep the details consistent.', body: 'Check core business information across the website and priority listings, and make review responses and customer actions part of a repeatable process.', output: 'Consistent information and trust signals', code: ['sources = [website, keyDirectories]', 'differences = compareBusinessDetails(sources)', 'review(differences)', 'resolveVerifiedChanges()'] },
      { name: 'Measure', kicker: '04 / LOCAL PERFORMANCE', title: 'Measure actions, not vanity metrics.', body: 'Review calls, direction requests, website visits and qualified enquiries. Use the evidence to decide which profile or page needs attention next.', output: 'A practical local performance review', code: ['events = [calls, directions, visits, leads]', 'baseline = capture(events, dateRange)', 'compareLikeForLike(baseline)', 'prioritise(nextBestImprovement)'] }
    ],
    capabilities: [
      { title: 'Google Business Profile', body: 'Categories, services, hours, photos, links and profile completeness.', tag: 'PROFILE' },
      { title: 'Location landing pages', body: 'Useful local pages based on actual services, coverage and customer questions.', tag: 'CONTENT' },
      { title: 'Business detail alignment', body: 'Consistent names, phone numbers, addresses or service-area information.', tag: 'TRUST' },
      { title: 'Review and action journeys', body: 'Clear routes to call, request directions, visit the site or leave feedback.', tag: 'CONVERSION' },
      { title: 'Local measurement', body: 'Profile interactions, visits and enquiries reviewed against a baseline.', tag: 'REPORTING' },
      { title: 'Technical foundations', body: 'Indexability, structured data, mobile usability and page performance.', tag: 'TECHNICAL' }
    ],
    safeguards: [{ title: 'No fake locations', body: 'Only represent real premises and genuine service coverage.' }, { title: 'No copy-and-paste town pages', body: 'Every location page needs a useful reason to exist.' }, { title: 'No ranking guarantees', body: 'Visibility is measured over time; positions and leads are not promised.' }]
  },
  'social-media-marketing': {
    accent: '#DF80FF', tint: 'rgba(139,92,246,.13)', label: 'CONTENT & DISTRIBUTION SYSTEM',
    title: 'Make every post part of a bigger plan.',
    intro: 'A repeatable content system that connects your message, creative, publishing rhythm and audience response to actual business priorities.',
    outcomes: [{ value: '01', label: 'Clear positioning' }, { value: '02', label: 'Consistent output' }, { value: '03', label: 'Useful feedback' }],
    stages: [
      { name: 'Strategy', kicker: '01 / POSITIONING', title: 'Know what you want to be known for.', body: 'Define the audience, offer, brand voice and the few messages worth repeating. Give each content theme a clear job.', output: 'A focused content strategy', code: ['audience = definePriorityAudience()', 'offer = clarifyCustomerValue()', 'pillars = mapToBusinessGoals(offer)', 'voice = documentBrandVoice()'] },
      { name: 'Create', kicker: '02 / CREATIVE SYSTEM', title: 'Build ideas into platform-native content.', body: 'Turn useful ideas into formats that fit each platform: short video, carousels, explainers, proof, behind-the-scenes and direct offers.', output: 'A reusable creative and content bank', code: ['idea = selectFrom(contentPillars)', 'assets = createPlatformVariants(idea)', 'check(brandVoice, clarity, rights)', 'queue(approvedAssets)'] },
      { name: 'Publish', kicker: '03 / DISTRIBUTION', title: 'Publish with rhythm and purpose.', body: 'Use a realistic calendar, adapt the message to the channel and make sure every post has a reason to exist and a sensible next step.', output: 'A manageable publishing calendar', code: ['calendar = plan(approvedContent)', 'for (const post of calendar) {', '  adaptFor(post, platform)', '  publishAt(approvedTime)', '}'] },
      { name: 'Learn', kicker: '04 / PERFORMANCE', title: 'Use response to improve the next cycle.', body: 'Look beyond likes. Review meaningful reach, saves, shares, profile actions, site visits and enquiries in the context of the objective.', output: 'A better-informed next content cycle', code: ['signals = collect(reach, saves, shares)', 'actions = collect(clicks, enquiries)', 'insights = compareByFormatAndTheme()', 'update(nextContentPlan, insights)'] }
    ],
    capabilities: [
      { title: 'Content strategy', body: 'Audience, positioning, content pillars, tone and campaign priorities.', tag: 'STRATEGY' },
      { title: 'Creative direction', body: 'Visual concepts and messaging adapted to each platform and format.', tag: 'CREATIVE' },
      { title: 'Short-form video', body: 'Hooks, scripts, edits and repeatable formats for video-first channels.', tag: 'VIDEO' },
      { title: 'Publishing calendar', body: 'A realistic schedule with clear ownership and approval steps.', tag: 'OPERATIONS' },
      { title: 'Community and response', body: 'Practical response guidelines and escalation for sensitive messages.', tag: 'ENGAGEMENT' },
      { title: 'Performance review', body: 'Content and audience signals connected to clicks and business actions.', tag: 'LEARNING' }
    ],
    safeguards: [{ title: 'No empty posting targets', body: 'Consistency matters, but volume is not the strategy.' }, { title: 'No fabricated proof', body: 'Testimonials, claims and results need to be genuine and approved.' }, { title: 'No vanity-only reporting', body: 'Reach and engagement are read alongside useful actions.' }]
  },
  'agency-development-partner': {
    accent: '#00DFC9', tint: 'rgba(0,223,201,.11)', label: 'WHITE-LABEL DELIVERY SYSTEM',
    title: 'Add engineering capacity without adding delivery chaos.',
    intro: 'A dependable development partner for agencies that need senior hands-on build support, clear communication and clean handovers.',
    outcomes: [{ value: '01', label: 'Extra capacity' }, { value: '02', label: 'Clear delivery' }, { value: '03', label: 'Clean handover' }],
    stages: [
      { name: 'Scope', kicker: '01 / PROJECT INTAKE', title: 'Get the brief and constraints straight.', body: 'Review the client brief, existing stack, access, dependencies, deadlines and definition of done before work starts.', output: 'An agreed technical scope and delivery plan', code: ['brief = reviewClientRequirements()', 'stack = inspectExistingArchitecture()', 'risks = identifyDependenciesAndUnknowns()', 'plan = agreeScopeAndAcceptance(brief)'] },
      { name: 'Build', kicker: '02 / ENGINEERING', title: 'Deliver in the agency workflow.', body: 'Work within agreed repositories, conventions and communication channels. Keep changes focused, reviewable and aligned with the wider product.', output: 'Maintainable, reviewable implementation', code: ['branch = createScopedFeatureBranch()', 'implement(agreedRequirements)', 'run(typecheck, tests, build)', 'openPullRequest(withContext)'] },
      { name: 'Review', kicker: '03 / QUALITY', title: 'Make progress visible and testable.', body: 'Share useful updates, flag blockers early and check the real user journey rather than relying on a successful compile alone.', output: 'Evidence-backed review and QA notes', code: ['review = inspectChangedPaths()', 'verify(criticalUserJourneys)', 'record(knownRisks, followUps)', 'requestReview(agencyTeam)'] },
      { name: 'Handover', kicker: '04 / CONTINUITY', title: 'Leave the team in control.', body: 'Document what changed, how it works, any configuration required and what remains. The agency retains the agreed ownership and client relationship.', output: 'A clear technical handover', code: ['notes = documentImplementation()', 'list(configAndEnvironmentNeeds)', 'handover(openRisks, nextSteps)', 'confirmOwnershipAndAccess()'] }
    ],
    capabilities: [
      { title: 'Frontend engineering', body: 'React, Next.js, TypeScript and responsive interface implementation.', tag: 'FRONTEND' },
      { title: 'Backend and APIs', body: 'Application logic, integrations, data flows and service endpoints.', tag: 'BACKEND' },
      { title: 'CMS and commerce', body: 'WordPress, WooCommerce, custom content and checkout integrations.', tag: 'PLATFORMS' },
      { title: 'Technical problem-solving', body: 'Debugging, refactoring, performance and inherited codebases.', tag: 'REPAIR' },
      { title: 'AI and automation', body: 'Practical AI features, workflow integrations and internal tools.', tag: 'EMERGING TECH' },
      { title: 'Delivery support', body: 'Code review, QA, documentation and developer-to-developer handover.', tag: 'DELIVERY' }
    ],
    safeguards: [{ title: 'Clear scope and access', body: 'Agree repository, environments, responsibilities and acceptance criteria.' }, { title: 'No client confusion', body: 'Communication and white-label boundaries are agreed before delivery.' }, { title: 'No hidden handover debt', body: 'Document configuration, known issues and outstanding work.' }]
  },
  'app-development': {
    accent: '#18A8FF', tint: 'rgba(24,168,255,.12)', label: 'MOBILE PRODUCT ENGINEERING',
    title: 'Build an app around the way people actually use it.',
    intro: 'From product scope and interaction design to APIs, accounts, data and release preparation: the app and the systems behind it are planned together.',
    outcomes: [{ value: '01', label: 'Useful journeys' }, { value: '02', label: 'Connected systems' }, { value: '03', label: 'Release confidence' }],
    stages: [
      { name: 'Discover', kicker: '01 / PRODUCT SCOPE', title: 'Start with the user and the job.', body: 'Identify who the app serves, what they need to do, which journeys matter first and what belongs in a later release.', output: 'Prioritised product scope and user journeys', code: ['users = definePrimaryPersonas()', 'jobs = mapCoreUserNeeds(users)', 'flows = prioritiseCriticalJourneys(jobs)', 'scope = separateNowFromLater(flows)'] },
      { name: 'Experience', kicker: '02 / INTERACTION DESIGN', title: 'Make the important paths feel obvious.', body: 'Design navigation, states, forms, feedback and empty or error conditions for real devices and real usage contexts.', output: 'Testable screen flows and interaction states', code: ['screens = mapFrom(userFlows)', 'states = define(loading, empty, error, success)', 'prototype = connectPrimaryInteractions()', 'reviewOn(realDeviceSizes)'] },
      { name: 'Engineering', kicker: '03 / APP + PLATFORM', title: 'Connect the app to dependable services.', body: 'Build the client experience alongside authentication, APIs, data, notifications and any external services the product depends on.', output: 'An integrated app and backend workflow', code: ['app = implement(sharedDesignSystem)', 'api = connect(secureApplicationEndpoints)', 'auth = integrateAccountLifecycle()', 'data = validateAndPersist(realRecords)'] },
      { name: 'Release', kicker: '04 / QUALITY & RELEASE', title: 'Test the journeys before calling it ready.', body: 'Check device sizes, permissions, connectivity, account states and failure paths, then prepare the store and operational handover.', output: 'Release checklist and support plan', code: ['test = run(deviceAndJourneyMatrix)', 'check(permissions, offline, recovery)', 'prepare(storeMetadata, assets)', 'handover(releaseNotes, supportPlan)'] }
    ],
    capabilities: [
      { title: 'iOS and Android', body: 'Native or cross-platform approaches selected around product needs.', tag: 'PLATFORMS' },
      { title: 'React Native and Expo', body: 'Shared mobile foundations with deliberate platform-specific behaviour.', tag: 'ENGINEERING' },
      { title: 'Accounts and authentication', body: 'Sign-up, login, profile, permissions and account lifecycle journeys.', tag: 'IDENTITY' },
      { title: 'APIs and backend', body: 'Connect mobile screens to real application data and business rules.', tag: 'INTEGRATION' },
      { title: 'Payments and notifications', body: 'Plan service integrations, user consent and clear transaction states.', tag: 'SERVICES' },
      { title: 'Testing and release', body: 'Device checks, store preparation, analytics and handover planning.', tag: 'LAUNCH' }
    ],
    safeguards: [{ title: 'No demo presented as live', body: 'Mock data, payment simulations and unfinished integrations are clearly labelled.' }, { title: 'Security from the start', body: 'Protect accounts, API access, personal data and payment flows.' }, { title: 'Release is a process', body: 'Store approval, credentials and third-party accounts are dependencies, not assumptions.' }]
  }
};

export const ServiceExperience: React.FC<{ page: string }> = ({ page }) => {
  const config = configs[page];
  const [active, setActive] = useState(0);
  const stage = config?.stages[active];
  const progress = useMemo(() => ((active + 1) / (config?.stages.length ?? 1)) * 100, [active, config]);

  if (!config) return null;

  return (
    <MotionConfig reducedMotion="user">
      <div className="mt-16 space-y-20 md:mt-24 md:space-y-28" style={{ '--service-accent': config.accent, '--service-tint': config.tint } as React.CSSProperties}>
        <section aria-labelledby="service-outcomes-title" className="relative overflow-hidden border border-white/10 bg-[#0b0b10] p-6 sm:p-9 lg:p-12">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 90% 0%, ${config.tint}, transparent 48%)` }} />
          <div className="relative grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
            <div><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em]" style={{ color: config.accent }}>{config.label}</p><h2 id="service-outcomes-title" className="mt-4 max-w-xl text-3xl font-black leading-tight text-white sm:text-4xl">{config.title}</h2><p className="mt-5 max-w-xl text-sm leading-7 text-white/65">{config.intro}</p></div>
            <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3">{config.outcomes.map((item) => <div key={item.label} className="bg-[#101016] p-5 sm:p-6"><p className="font-mono text-2xl font-black" style={{ color: config.accent }}>{item.value}</p><p className="mt-3 text-xs font-bold uppercase tracking-[.12em] text-white/65">{item.label}</p></div>)}</div>
          </div>
        </section>

        <section aria-labelledby="service-lab-title">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em]" style={{ color: config.accent }}>INTERACTIVE SERVICE WALKTHROUGH</p><h2 id="service-lab-title" className="mt-3 text-3xl font-black text-white sm:text-4xl">See how the work comes together.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">Explore each stage to see the decisions, practical work and outputs involved. The code is illustrative, not a live client system.</p></div><div className="w-full md:max-w-52"><div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-white/45"><span>Journey progress</span><span>{String(active + 1).padStart(2, '0')} / 04</span></div><div className="mt-2 h-1 bg-white/10"><motion.div className="h-full" style={{ backgroundColor: config.accent }} animate={{ width: `${progress}%` }} /></div></div></div>
          <div className="grid overflow-hidden border border-white/10 bg-[#09090d] lg:grid-cols-[260px_1fr]">
            <nav aria-label="Service stages" className="border-b border-white/10 p-3 lg:border-b-0 lg:border-r"><div className="grid grid-cols-2 gap-2 lg:grid-cols-1">{config.stages.map((item, index) => <button key={item.name} type="button" onClick={() => setActive(index)} aria-current={active === index ? 'step' : undefined} className="flex min-h-16 items-center gap-3 border p-3 text-left transition-colors" style={{ borderColor: active === index ? config.accent : 'rgba(255,255,255,.08)', backgroundColor: active === index ? config.tint : 'transparent' }}><span className="font-mono text-xs" style={{ color: config.accent }}>0{index + 1}</span><span className="min-w-0 flex-1"><span className="block text-xs font-bold text-white">{item.name}</span><span className="mt-1 block text-[9px] text-white/40">{item.kicker.split('/')[1]?.trim()}</span></span>{active === index && <CircleDot className="h-4 w-4 shrink-0" style={{ color: config.accent }} />}</button>)}</div></nav>
            <div className="grid min-w-0 xl:grid-cols-[.9fr_1.1fr]">
              <div className="p-6 sm:p-8"><AnimatePresence mode="wait"><motion.div key={stage.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .22 }}><p className="font-mono text-[10px] font-bold tracking-[.18em]" style={{ color: config.accent }}>{stage.kicker}</p><h3 className="mt-5 text-2xl font-black leading-tight text-white sm:text-3xl">{stage.title}</h3><p className="mt-5 text-sm leading-7 text-white/60">{stage.body}</p><div className="mt-8 border-l-2 p-4" style={{ borderColor: config.accent, backgroundColor: config.tint }}><p className="font-mono text-[9px] font-bold uppercase tracking-wider text-white/45">STAGE OUTPUT</p><p className="mt-2 text-sm font-bold text-white">{stage.output}</p></div></motion.div></AnimatePresence><div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5"><button type="button" onClick={() => setActive((active + config.stages.length - 1) % config.stages.length)} className="text-xs font-bold text-white/55 hover:text-white">PREVIOUS</button><button type="button" onClick={() => setActive((active + 1) % config.stages.length)} className="inline-flex items-center gap-2 px-4 py-3 text-xs font-black text-black" style={{ backgroundColor: config.accent }}>{active === 3 ? 'RESTART WALKTHROUGH' : 'NEXT STAGE'} <ArrowRight className="h-4 w-4" /></button></div></div>
              <div className="border-t border-white/10 bg-[#050508] p-4 sm:p-6 xl:border-l xl:border-t-0"><div className="flex items-center justify-between border-b border-white/10 pb-4"><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#39D98A]" /><span className="font-mono text-[10px] text-white/55">PROCESS / EXAMPLE</span></div><span className="font-mono text-[9px] text-white/35">STAGE_{String(active + 1).padStart(2, '0')}.TS</span></div><AnimatePresence mode="wait"><motion.pre key={stage.name} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: .2 }} className="min-h-[260px] overflow-x-auto py-6 font-mono text-xs leading-8 text-white/75 sm:text-sm"><code>{stage.code.map((line, index) => <span key={line} className="block"><span className="mr-5 inline-block w-4 select-none text-right text-white/20">{index + 1}</span><span style={{ color: index === 0 ? config.accent : undefined }}>{line}</span></span>)}</code></motion.pre></AnimatePresence><div className="flex items-center gap-2 border-t border-white/10 pt-4 text-[10px] text-white/40"><Check className="h-3.5 w-3.5" style={{ color: config.accent }} /> Illustrative workflow — implementation varies by project</div></div>
            </div>
          </div>
        </section>

        <section aria-labelledby="service-capabilities-title">
          <div className="mb-8 max-w-3xl"><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em]" style={{ color: config.accent }}>CAPABILITY MAP</p><h2 id="service-capabilities-title" className="mt-3 text-3xl font-black text-white sm:text-4xl">The parts that make the whole thing work.</h2><p className="mt-4 text-sm leading-7 text-white/55">A joined-up view of the practical work, not a disconnected list of buzzwords.</p></div>
          <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-3">{config.capabilities.map((item, index) => <article key={item.title} className="group bg-[#0b0b10] p-6 transition-colors hover:bg-[#111118]"><div className="flex items-center justify-between"><span className="font-mono text-[10px]" style={{ color: config.accent }}>{item.tag}</span><span className="font-mono text-[10px] text-white/25">0{index + 1}</span></div><h3 className="mt-6 text-lg font-black text-white">{item.title}</h3><p className="mt-3 text-sm leading-6 text-white/55">{item.body}</p><div className="mt-6 h-px w-8 transition-all group-hover:w-full" style={{ backgroundColor: config.accent }} /></article>)}</div>
        </section>

        <section aria-labelledby="service-guardrails-title" className="grid gap-8 border-y border-white/10 py-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em]" style={{ color: config.accent }}>BUILT WITH REAL-WORLD CONSTRAINTS</p><h2 id="service-guardrails-title" className="mt-3 text-3xl font-black text-white">Good delivery includes knowing what not to promise.</h2><p className="mt-4 text-sm leading-7 text-white/55">Clear assumptions, honest reporting and sensible checks make the work more useful after the initial launch.</p></div><div className="divide-y divide-white/10 border-y border-white/10">{config.safeguards.map((item, index) => <article key={item.title} className="grid gap-3 py-5 sm:grid-cols-[42px_1fr]"><span className="font-mono text-xs" style={{ color: config.accent }}>0{index + 1}</span><div><h3 className="font-bold text-white">{item.title}</h3><p className="mt-2 text-sm leading-6 text-white/55">{item.body}</p></div></article>)}</div></section>

        <section className="grid gap-6 border border-white/10 bg-[#0b0b10] p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em]" style={{ color: config.accent }}>MAKE IT SPECIFIC</p><h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">Start with the problem. Build the right solution.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">Tell me what is not working, what you want to change or what you are trying to launch. We can shape a sensible first scope together.</p></div><a href={`/build?service=${page}`} className="inline-flex min-h-12 items-center justify-center gap-3 px-6 text-xs font-black tracking-[.12em] text-black" style={{ backgroundColor: config.accent }}>SCOPE THIS PROJECT <ArrowRight className="h-4 w-4" /></a></section>
      </div>
    </MotionConfig>
  );
};
