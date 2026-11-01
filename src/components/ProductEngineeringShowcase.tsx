'use client';

import React, { useState } from 'react';
import { motion, MotionConfig } from 'motion/react';
import { ArrowRight, Check, Cloud, Code2, Database, GitBranch, Layers3, LockKeyhole, Sparkles, Terminal } from 'lucide-react';

const stack = [
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'PHP', 'Python', 'Laravel', 'Node.js',
  'React Native', 'Expo', 'WordPress', 'WooCommerce', 'HTML5', 'CSS3', 'C#', '.NET',
  'Java', 'SQL', 'PostgreSQL', 'MySQL', 'Neon', 'Firebase', 'Redis', 'Docker',
  'Vercel', 'AWS', 'Google Cloud', 'Cloudflare', 'GitHub', 'Git', 'Stripe',
  'OpenAI', 'Anthropic', 'Google Gemini', 'Google AI', 'MCP', 'REST APIs', 'GraphQL',
  'Linux', 'Apache', 'Nginx', 'jQuery', 'Bootstrap'
];

const logoSlugs: Record<string, string> = {
  React: 'react', 'Next.js': 'nextdotjs', TypeScript: 'typescript', JavaScript: 'javascript',
  PHP: 'php', Python: 'python', Laravel: 'laravel', 'Node.js': 'nodedotjs',
  'React Native': 'react', Expo: 'expo', WordPress: 'wordpress', WooCommerce: 'woocommerce',
  HTML5: 'html5', CSS3: 'css3', 'C#': 'csharp', '.NET': 'dotnet', Java: 'java',
  SQL: 'databricks', PostgreSQL: 'postgresql', MySQL: 'mysql', Neon: 'neon',
  Firebase: 'firebase', Redis: 'redis', Docker: 'docker', Vercel: 'vercel',
  AWS: 'amazonaws', 'Google Cloud': 'googlecloud', Cloudflare: 'cloudflare',
  GitHub: 'github', Git: 'git', Stripe: 'stripe', OpenAI: 'openai',
  Anthropic: 'anthropic', 'Google Gemini': 'googlegemini', 'Google AI': 'google',
  Linux: 'linux', Apache: 'apache', Nginx: 'nginx', jQuery: 'jquery', Bootstrap: 'bootstrap'
};

const stages = [
  {
    label: '01 / DISCOVER', title: 'Understand the problem before choosing the tools.',
    description: 'Turn the brief into clear outcomes, user journeys and constraints. Define what a useful first release actually needs to do.',
    command: 'scope --from brief.md --prioritise outcomes',
    status: 'SCOPE DEFINED',
    code: [
      ['const brief = await intake.read("brief.md");', 'purple'],
      ['const goals = extractOutcomes(brief);', 'blue'],
      ['const constraints = mapConstraints(brief);', 'blue'],
      ['const scope = prioritise({ goals, constraints });', 'green'],
      ['await plan.save(scope);', 'muted']
    ],
    nodes: ['Problem', 'Users', 'Scope', 'Success']
  },
  {
    label: '02 / ARCHITECT', title: 'Design the system around the job it needs to do.',
    description: 'Choose an architecture that fits the product: interface, APIs, data, permissions, integrations and the infrastructure to run it.',
    command: 'architecture --map services --check dependencies',
    status: 'ARCHITECTURE READY',
    code: [
      ['const app = defineProduct({ users, journeys });', 'purple'],
      ['app.frontend = chooseUI("React / Next.js");', 'blue'],
      ['app.data = modelEntities(requirements);', 'blue'],
      ['app.services = mapIntegrations(services);', 'green'],
      ['validateArchitecture(app);', 'muted']
    ],
    nodes: ['Interface', 'API layer', 'Database', 'Services']
  },
  {
    label: '03 / BUILD', title: 'Make the experience real, then make it work.',
    description: 'Build the responsive interface and the application logic together. The terminal shows the work; the preview shows what people actually use.',
    command: 'build --target product --quality production',
    status: 'BUILD IN PROGRESS',
    code: [
      ['export default async function ProductPage() {', 'purple'],
      ['  const data = await api.products.list();', 'blue'],
      ['  return <ProductExperience data={data} />;', 'green'],
      ['}', 'purple'],
      ['// responsive, accessible and tested', 'muted']
    ],
    nodes: ['UI', 'Components', 'API', 'Data']
  },
  {
    label: '04 / INTEGRATE', title: 'Connect the product to the systems around it.',
    description: 'Bring together databases, payments, identity, third-party APIs and AI models with validation, permissions and sensible failure handling.',
    command: 'connect --services database, payments, ai',
    status: 'INTEGRATIONS CONNECTED',
    code: [
      ['await db.connect(process.env.DATABASE_URL);', 'blue'],
      ['await payments.configure(stripe);', 'blue'],
      ['await identity.enable(authProvider);', 'purple'],
      ['await ai.register({ openai, anthropic });', 'green'],
      ['await integrations.healthCheck();', 'muted']
    ],
    nodes: ['Product', 'Identity', 'Payments', 'AI / APIs']
  },
  {
    label: '05 / LAUNCH', title: 'Release with checks, visibility and a route forward.',
    description: 'Test the critical journeys, prepare production infrastructure, deploy safely and monitor how the product performs once it is in use.',
    command: 'release --environment production --verify',
    status: 'READY FOR RELEASE',
    code: [
      ['await tests.run({ unit: true, e2e: true });', 'blue'],
      ['await security.audit();', 'purple'],
      ['await deploy.to("production");', 'green'],
      ['await monitoring.enable();', 'green'],
      ['✓ release checks complete', 'muted']
    ],
    nodes: ['Test', 'Deploy', 'Monitor', 'Improve']
  }
] as const;

const tokenClass: Record<string, string> = {
  purple: 'text-[#D7A4FF]', blue: 'text-[#75C9FF]', green: 'text-[#70E2C2]', muted: 'text-white/35'
};

export const TechStackTicker: React.FC = () => (
  <section aria-label="Technology stack and platforms" className="relative overflow-hidden border-y border-white/10 bg-[#09090d]/90 py-5 md:py-6">
    <div className="mx-auto mb-4 flex max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
      <p className="shrink-0 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 md:text-[10px]">Technologies / platforms / infrastructure</p>
      <span className="hidden font-mono text-[9px] uppercase tracking-[0.16em] text-[#00DFC9]/70 sm:block">One stack. Many possibilities.</span>
    </div>
    <MotionConfig reducedMotion="user">
      <div className="group relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#09090d] to-transparent md:w-28" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#09090d] to-transparent md:w-28" />
        <motion.div className="flex w-max items-center gap-3 pr-3 group-hover:[animation-play-state:paused]" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 58, ease: 'linear', repeat: Infinity }}>
          {[...stack, ...stack].map((name, index) => (
            <span key={`${name}-${index}`} className="inline-flex h-10 shrink-0 items-center gap-2.5 border border-white/[0.09] bg-white/[0.025] px-4 font-mono text-[11px] font-semibold tracking-wide text-white/70 transition-colors hover:border-[#00DFC9]/40 hover:text-white">
              <img
                src={`https://cdn.simpleicons.org/${logoSlugs[name] ?? ''}/ffffff`}
                alt=""
                aria-hidden="true"
                loading="lazy"
                width="18"
                height="18"
                className="h-[18px] w-[18px] object-contain opacity-80"
                onError={(event) => { event.currentTarget.style.display = 'none'; }}
              />
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </MotionConfig>
  </section>
);

export const ProductEngineeringShowcase: React.FC = () => {
  const [active, setActive] = useState(0);
  const stage = stages[active];
  const icons = [GitBranch, Layers3, Code2, Database, Cloud];
  const ActiveIcon = icons[active];

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="product-engineering-title" className="relative overflow-hidden border-y border-white/10 bg-[#08080c]/95 py-20 md:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute -left-48 top-1/4 h-[30rem] w-[30rem] rounded-full bg-[#FF003C]/[0.07] blur-[130px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#6847FF]/[0.08] blur-[130px]" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-10 max-w-3xl md:mb-12">
            <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#00DFC9]">Inside the build / from concept to production</p>
            <h2 id="product-engineering-title" className="text-3xl font-black leading-[1.04] tracking-tight text-white sm:text-4xl md:text-6xl">How an idea becomes a <span className="text-[#FF5575]">working product.</span></h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55 md:text-base">The visible website is one part of a connected system. Explore how the decisions, code and infrastructure come together behind it.</p>
          </div>

          <div role="tablist" aria-label="Product development stages" className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {stages.map((item, index) => (
              <button key={item.label} id={`build-stage-tab-${index}`} type="button" role="tab" aria-selected={active === index} aria-controls="build-stage-panel" onClick={() => setActive(index)} className={`min-h-12 border px-3 text-left font-mono text-[10px] font-bold tracking-[0.1em] transition-colors sm:text-[11px] ${active === index ? 'border-[#FF5575]/70 bg-[#FF003C]/10 text-white' : 'border-white/10 bg-white/[0.02] text-white/45 hover:border-white/25 hover:text-white/80'}`}>
                <span className="mr-2 text-[#00DFC9]">{String(index + 1).padStart(2, '0')}</span>{item.label.split(' / ')[1]}
              </button>
            ))}
          </div>

          <div id="build-stage-panel" role="tabpanel" aria-labelledby={`build-stage-tab-${active}`} className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="flex min-w-0 flex-col border border-white/10 bg-[#0d0e14]">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2"><Terminal className="h-4 w-4 text-[#00DFC9]" /><span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-white/65">Build terminal</span></div>
                <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#FF5575]" /><span className="h-2 w-2 rounded-full bg-[#FFB347]" /><span className="h-2 w-2 rounded-full bg-[#00DFC9]" /></div>
              </div>
              <div className="border-b border-white/[0.07] px-4 py-3">
                <p className="font-mono text-[10px] text-white/35">cjc / product-engineering / {stage.label.toLowerCase().replace(' / ', '-')}</p>
                <p className="mt-2 break-all font-mono text-xs text-[#70E2C2]"><span className="text-[#FF5575]">$</span> {stage.command}</p>
              </div>
              <div className="min-h-[228px] space-y-3 px-4 py-5 sm:px-5">
                {stage.code.map(([line, tone], index) => (
                  <motion.p key={`${active}-${line}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.11, duration: 0.24 }} className={`break-words font-mono text-[11px] leading-relaxed sm:text-xs ${tokenClass[tone]}`}>
                    <span className="mr-3 select-none text-white/20">{String(index + 1).padStart(2, '0')}</span>{line}
                  </motion.p>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.07] px-4 py-3">
                <span className="inline-flex items-center gap-2 font-mono text-[9px] font-bold tracking-[0.12em] text-[#70E2C2]"><span className="h-1.5 w-1.5 rounded-full bg-[#70E2C2]" />{stage.status}</span>
                <span className="font-mono text-[9px] text-white/30">process exited 0</span>
              </div>
            </div>

            <div className="flex min-w-0 flex-col border border-white/10 bg-[#0b0c12]">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2"><ActiveIcon className="h-4 w-4 text-[#FF5575]" /><span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-white/65">System architecture</span></div>
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/30">Live concept / {String(active + 1).padStart(2, '0')}</span>
              </div>
              <div className="flex flex-1 flex-col justify-center p-5 sm:p-7">
                <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mx-auto w-full max-w-xl">
                  <div className="mb-7 text-center">
                    <span className="inline-flex items-center gap-2 border border-[#FF5575]/30 bg-[#FF003C]/[0.07] px-4 py-2.5 text-xs font-bold text-white"><Sparkles className="h-3.5 w-3.5 text-[#FF5575]" />{stage.title}</span>
                    <p className="mx-auto mt-3 max-w-lg text-xs leading-relaxed text-white/45">{stage.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {stage.nodes.map((node, index) => (
                      <React.Fragment key={node}>
                        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.08 }} className="relative flex min-h-[76px] flex-col items-center justify-center gap-2 border border-white/10 bg-white/[0.025] px-2 py-3 text-center">
                          <span className="font-mono text-[9px] text-[#00DFC9]">NODE 0{index + 1}</span>
                          <span className="text-xs font-bold text-white/80">{node}</span>
                          {index < stage.nodes.length - 1 && <span aria-hidden="true" className="absolute -right-2 top-1/2 z-10 hidden h-px w-2 bg-[#FF5575] sm:block" />}
                        </motion.div>
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-center gap-2 text-[9px] font-mono uppercase tracking-[0.13em] text-white/35"><LockKeyhole className="h-3 w-3" /> Connected, validated and monitored</div>
                </motion.div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] px-4 py-3">
                <span className="font-mono text-[9px] text-white/35">SYSTEM / {stage.nodes.length} CORE COMPONENTS</span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[9px] text-[#70E2C2]"><Check className="h-3 w-3" /> FLOW VERIFIED</span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="max-w-xl text-[11px] leading-relaxed text-white/35">Illustrative engineering workflow. The code and architecture shown are examples, not a claim that every project uses the same stack.</p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setActive((active + stages.length - 1) % stages.length)} className="border border-white/15 px-3 py-2 font-mono text-[9px] font-bold tracking-[0.1em] text-white/60 transition-colors hover:border-white/40 hover:text-white">PREVIOUS</button>
              <button type="button" onClick={() => setActive((active + 1) % stages.length)} className="inline-flex items-center gap-2 border border-[#FF5575]/50 bg-[#FF003C]/10 px-3 py-2 font-mono text-[9px] font-bold tracking-[0.1em] text-white transition-colors hover:bg-[#FF003C]/20">NEXT STAGE <ArrowRight className="h-3 w-3" /></button>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
};
