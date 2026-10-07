import { Project, ServiceItem, RoleExpertise, TimelineMilestone, SkillItem, Testimonial, VenturePackageModule, VentureStageConfig } from '../types';

const FALLBACK_PROJECT_IMAGES: Record<string, string> = {
  'secure-api.png': '/assets/projects/secure-api.svg',
  'multi-tenant-college.png': '/assets/projects/schools-platform.svg',
  'schoo-management.png': '/assets/projects/schools-platform.svg',
  'genafize-logo.png': '/assets/projects/ai-products.svg',
  'matchdayparking.png': '/assets/matchdayparking.png',
  'tutors-directory.png': '/assets/projects/tutors-directory.svg'
};

const toScreenshotGallery = (project: string, screenshots: Array<{ file: string; caption: string }>) =>
  screenshots.map(({ file, caption }) => ({
    src: `/images/${file}`,
    alt: `${project}: ${caption}`,
    caption,
    href: `/images/${file}`
  }));

const scannerGallery = toScreenshotGallery('Matchday Parking scanner', [
  { file: 'scaner1.jpg', caption: 'Staff access screen' },
  { file: 'scnner2.jpg', caption: 'Live ticket scanning' },
  { file: 'scanner4.jpg', caption: 'Manual order-code lookup' },
  { file: 'scanner5.jpg', caption: 'Order download, cached orders and scan sync' }
]);

const mwFitnessGallery = toScreenshotGallery('MWFitness mobile app', [
  { file: 'app1.mwfitness.app.jpg', caption: 'Member home and current workout' },
  { file: 'app2.mwfitness.app.jpg', caption: 'Progress, weigh-in and nutrition dashboard' },
  { file: 'app3.mwfitness.app.jpg', caption: 'Training programme and weekly sessions' },
  { file: 'scanner3.app.jpg', caption: 'Training schedule and upcoming sessions' },
  { file: 'Screenshot_20260928_192332_uk.co.mwfitness.app.jpg', caption: 'MWFitness app screen 05' },
  { file: 'Screenshot_20260928_192336_uk.co.mwfitness.app.jpg', caption: 'MWFitness app screen 06' },
  { file: 'Screenshot_20260928_192339_uk.co.mwfitness.app.jpg', caption: 'MWFitness app screen 07' },
  { file: 'Screenshot_20260928_192341_uk.co.mwfitness.app.jpg', caption: 'MWFitness app screen 08' },
  { file: 'Screenshot_20260928_192344_uk.co.mwfitness.app.jpg', caption: 'MWFitness app screen 09' },
  { file: 'Screenshot_20260928_192347_uk.co.mwfitness.app.jpg', caption: 'MWFitness app screen 10' },
  { file: 'Screenshot_20260928_192349_uk.co.mwfitness.app.jpg', caption: 'MWFitness app screen 11' },
  { file: 'Screenshot_20260928_192351_uk.co.mwfitness.app.jpg', caption: 'MWFitness app screen 12' },
  { file: 'Screenshot_20260928_192354_uk.co.mwfitness.app.jpg', caption: 'MWFitness app screen 13' },
  { file: 'Screenshot_20260928_192356_uk.co.mwfitness.app.jpg', caption: 'MWFitness app screen 14' },
  { file: 'Screenshot_20260928_192359_uk.co.mwfitness.app.jpg', caption: 'MWFitness app screen 15' },
  { file: 'Screenshot_20260928_192405_uk.co.mwfitness.app.jpg', caption: 'MWFitness app screen 16' }
]);

export function getProjectImageUrl(imagePath: string): string {
  if (!imagePath) return '/assets/projects/project-preview.svg';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return '/assets/projects/project-preview.svg';
  }
  const fileName = imagePath.split('/').pop() ?? '';
  return FALLBACK_PROJECT_IMAGES[fileName] ?? imagePath;
}

export const VENTURE_STAGES: VentureStageConfig[] = [
  {
    stage: 'SME & Early Startup',
    targetRaise: 'Up to £25k (Grants & Angel)',
    timeToMarket: '2 - 3 Weeks',
    focus: 'Rapid Lean MVP + Grant Technical Specs (Innovate UK / Regional) + Micro-Angel Pitch Pack',
    badge: 'SME & Startup'
  },
  {
    stage: 'Pre-Seed / Angel',
    targetRaise: '£150k - £500k',
    timeToMarket: '3 - 5 Weeks',
    focus: 'Functional MVP + High-converting Waitlist + Interactive Investor Demo'
  },
  {
    stage: 'Seed / Acceleration',
    targetRaise: '£500k - £2.5M',
    timeToMarket: '6 - 8 Weeks',
    focus: 'Multi-Tenant Platform + Programmatic Ads Engine + Live MRR Telemetry'
  },
  {
    stage: 'Series A / Scale',
    targetRaise: '£2.5M - £10M+',
    timeToMarket: '8 - 12 Weeks',
    focus: 'Enterprise Security Hardening + Autonomous Marketing Machine + VC Due Diligence'
  },
  {
    stage: 'Self-Funded / Bootstrapped',
    targetRaise: 'Cashflow Positive Day 1',
    timeToMarket: '3 - 6 Weeks',
    focus: 'High-margin Stripe checkout + Organic Programmatic SEO + Viral Loops'
  }
];

export const VENTURE_PACKAGE_MODULES: VenturePackageModule[] = [
  // THE SETUP
  {
    id: 'setup-core-mvp',
    name: 'Turnkey Full-Stack Product Build',
    category: 'setup',
    description: 'Production-ready Next.js 15, React 19, and Node.js architecture designed to scale with zero rewrite penalty.',
    deliverables: ['Responsive Web App & PWA', 'Scalable Node / Express APIs', 'Database Modeling (Postgres/Redis)', 'CI/CD Automated Deployments'],
    impactMetric: 'Zero technical debt at launch',
    defaultChecked: true
  },
  {
    id: 'setup-ai-engine',
    name: 'Custom AI & Autonomous Agent Layer',
    category: 'setup',
    description: 'Bespoke LLM pipelines (Gemini 2.0, OpenAI, Claude), vector database search, and automated task execution agents.',
    deliverables: ['Vector Embeddings & RAG Ingestion', 'Streaming UI Feedback', 'Tool-calling Autonomous Agents', 'Prompt Governance & Guardrails'],
    impactMetric: '10x operational efficiency',
    defaultChecked: true
  },
  {
    id: 'setup-payments-cloud',
    name: 'Stripe Payments & Multi-Tenant Cloud',
    category: 'setup',
    description: 'Instant monetization rails with Stripe Billing, multi-tier subscriptions, tenant-isolated data, and global CDN.',
    deliverables: ['Stripe Checkout & Customer Portal', 'Webhook Event Reconciliation', 'Tenant-partitioned Database', 'AWS / Cloudflare Edge Setup'],
    impactMetric: 'Instant global monetization',
    defaultChecked: true
  },
  {
    id: 'setup-security-compliance',
    name: 'Security, Auth & Compliance Blueprint',
    category: 'setup',
    description: 'Enterprise-grade authentication, role-based access control, HIPAA/GDPR alignment, and immutable audit logging.',
    deliverables: ['OAuth2 / Biometric 2FA MFA', 'Granular Role-based ACL', 'Encrypted Data-at-Rest (pgcrypto)', 'Penetration Test Readiness'],
    impactMetric: 'Enterprise sales clearance',
    defaultChecked: false
  },

  // THE ADVERTISING
  {
    id: 'ads-programmatic-seo',
    name: 'Programmatic SEO & Content Matrix',
    category: 'advertising',
    description: 'Automated generation of thousands of high-intent search landing pages capturing qualified organic buyer traffic.',
    deliverables: ['Database-driven Dynamic Landing Pages', 'Semantic Keyword Clustering', 'Automated JSON-LD Schema Markup', 'Sub-second Core Web Vitals'],
    impactMetric: '+350% organic search capture',
    defaultChecked: true
  },
  {
    id: 'ads-paid-funnels',
    name: 'High-Converting Paid Ad Funnel Engine',
    category: 'advertising',
    description: 'Turnkey ad funnel architectures with server-side conversion API tracking for Meta, Google Ads, TikTok, and LinkedIn.',
    deliverables: ['Server-Side Conversions API (CAPI)', 'High-converting Lander Frameworks', 'Automated UTM Attribution Tracking', 'Multi-variant A/B Split Testing'],
    impactMetric: 'Sub-£15 qualified CPA acquisition',
    defaultChecked: true
  },
  {
    id: 'ads-retention-viral',
    name: 'Viral Loop & Automated Retention Machine',
    category: 'advertising',
    description: 'Built-in referral mechanics, automated onboarding email drip campaigns, and churn reduction triggers.',
    deliverables: ['K-factor Referral Invite Loops', 'Automated Onboarding Drip Flows', 'In-app Behavioral Trigger Emails', 'Exit-intent Conversion Hooks'],
    impactMetric: 'Up to 2.4x lifetime value (LTV)',
    defaultChecked: false
  },

  // FUNDING & FINANCE SUPPORT
  {
    id: 'funding-route-advisory',
    name: 'Funding Route Advisory & Applications',
    category: 'funding',
    description: 'Help identifying the right funding route for your business — from idea stage to already trading — with application-ready preparation and supporting documentation.',
    deliverables: [
      'Start Up Loans',
      'Business & government grants',
      'Local authority & innovation funding',
      'SEIS/EIS investor preparation & Angels',
      'Equity crowdfunding, asset & premises finance',
      'Funding applications & supporting documentation',
      'Business plans & financial forecasts (tech-funding prep)'
    ],
    impactMetric: 'Application-ready funding preparation',
    defaultChecked: true
  },
  {
    id: 'funding-sme-grant-starter',
    name: 'SME & Startup Micro-Funding (Up to £25k)',
    category: 'funding',
    description: 'Tailored for UK & global SMEs and early startups securing £5k to £25k via Innovate UK grants, regional innovation vouchers, or angel micro-rounds.',
    deliverables: ['Innovate UK & Regional Grant Tech Specs', 'Lean Working Proof-of-Concept Prototype', '12-Month Micro-Budget & Cashflow Model', 'Angel Micro-Round 1-Pager & Executive Deck'],
    impactMetric: 'High-success grant & micro-capital rate',
    defaultChecked: true
  },
  {
    id: 'funding-investor-demo',
    name: 'Interactive Working Investor Demo',
    category: 'funding',
    description: 'A live, clickable prototype pre-loaded with simulated enterprise datasets that blows static slide decks away.',
    deliverables: ['Live Sandbox Demo URL', 'Pre-seeded Realistic Demo Data', 'Zero-latency Demo Mode Toggle', 'Interactive Executive Walkthrough'],
    impactMetric: '10x higher investor conviction',
    defaultChecked: true
  },
  {
    id: 'funding-pitch-technical',
    name: 'Pitch Deck Technical Strategy & Financials',
    category: 'funding',
    description: 'Clear translation of deep technical moats, unit economics, and architectural defensibility for angel and VC meetings.',
    deliverables: ['Tech Moat & IP Slide Deck Architecture', 'COGS & Cloud Unit Economics Model', 'Product Roadmap (18-Month Vision)', 'Competitive Moat Matrix'],
    impactMetric: 'VC technical diligence approved',
    defaultChecked: true
  },
  {
    id: 'funding-traction-dashboard',
    name: 'Live Traction & Telemetry Data Room',
    category: 'funding',
    description: 'An executive telemetry dashboard showcasing real-time user activity, activation funnels, MRR, and engagement metrics.',
    deliverables: ['Live MRR & User Cohort Analytics', 'Virtual Investor Data Room Assets', 'Architecture Security Whitepaper', 'Automated Cap Table Modeling'],
    impactMetric: 'Accelerates closing rounds by 40%',
    defaultChecked: false
  }
];

export const PROJECTS_DATA: Project[] = [
  {
    id: 13,
    title: "Secure API for Health Diagnostics",
    category: "APIs & Integrations",
    description: "An API connecting athlete blood-test records, sample tracking and results to a client-facing service.",
    longDescription: "The service needed a reliable way to move athlete testing data between sample intake and the client-facing results experience.",
    techStack: ["Node.js", "Express", "PostgreSQL", "Prisma", "Docker", "REST APIs", "JWT"],
    imageUrls: ["/images/secure-api.png"],
    carouselDataAiHints: ["secure data dashboard", "healthcare API"],
    caseStudy: {
      business: 'A blood-testing service supporting athlete testing.',
      built: 'A REST API for test records, sample status and results, connecting the service with its client-facing application.',
      role: 'I built the API and data flows for handling test information and delivering results.'
    },
    featured: true
  },
  {
    id: 12,
    title: "Multi-Tenant College Platform & WP Plugin",
    category: "SaaS & Platform",
    description: "A multi-tenant SaaS platform for colleges and high schools with a custom WordPress data synchronization plugin.",
    longDescription: "Engineered a multi-tenant application designed for educational institutions, allowing each college or high school to have its own sandboxed environment. A key component of this project was a bespoke WordPress plugin that securely synchronized data (like course catalogs and events) between the SaaS platform and the institutions' public-facing WordPress websites, ensuring consistency and reducing manual effort.",
    techStack: ["Laravel", "PHP", "MySQL", "React", "WordPress", "SaaS", "REST APIs"],
    imageUrls: ["/images/multi-tenant-college.png"],
    carouselDataAiHints: ["education saas platform", "school admin console"],
    featured: false
  },
  {
    id: 11,
    title: "School Management Platform & Portal",
    category: "SaaS & Platform",
    description: "A comprehensive platform for an agency managing 70+ schools, including a portal and mass notification system.",
    longDescription: "This large-scale project involved building a centralized application to help an agency manage operations across more than 70 schools. A key component was the secure Portal, allowing educators to manage student data, track progress, and communicate with pupils.\n\nKey Features / Work Done:\n• Developed a scalable architecture to handle data for over 70 institutions.\n• Built a secure, authenticated portal for staff with role-based access control.\n• Created a notification system for sending both individual and bulk communications to pupils via email and push notifications.\n• Designed and implemented the database schema for managing student, teacher, and school data.",
    techStack: ["Laravel", "PHP", "React", "MySQL", "Node.js", "Redis", "Firebase"],
    imageUrls: ["/images/schoo-management.png"],
    carouselDataAiHints: ["education dashboard analytics", "teacher student portal"],
    caseStudy: {
      business: 'A school-support organisation working with more than 70 schools.',
      built: 'School applications and a management portal for staff, student records, role-based access and individual or bulk notifications.',
      role: 'I built the platform, data model, portal and communication workflows.',
      outcome: 'The platform supported operations across 70+ schools.'
    },
    featured: true
  },
  {
    id: 1,
    title: "Genafize – AI Aggregation / Tool Kit",
    category: "AI & Automation",
    description: "A comprehensive AI tool aggregation platform designed to streamline AI usage across multiple domains.",
    longDescription: "Genafize is a comprehensive AI tool aggregation platform designed to streamline AI usage across multiple domains. Users can access prompt engineering, AI-generated music, text, and creative workflows in a unified interface. The platform also includes advanced AI content generation tools and integrations for automation.\n\nKey Features / Work Done:\n• Built a centralized AI tool dashboard for various AI APIs.\n• Developed prompt engineering templates for AI music (Suno), LLM text, and creative outputs.\n• Integrated AI APIs (OpenAI, Gemini, Suno) to generate outputs dynamically.\n• Designed user subscription/access system with email capture.\n• Planning AI chatbots and RAG-based assistants for site users.",
    techStack: ["Next.js", "React", "Tailwind CSS", "Node.js", "Firebase", "OpenAI API", "Gemini API", "Suno", "n8n"],
    imageUrls: ["/images/genafize-logo.png"],
    carouselDataAiHints: ["AI toolkit dashboard", "prompt engineering interface"],
    featured: false
  },
  {
    id: 3,
    title: "WooCommerce Live Event API Integration",
    category: "E-Commerce",
    description: "A system for live event data integration with WooCommerce stores allowing real-time booking.",
    longDescription: "A system for live event data integration with WooCommerce stores. It pulls live event product availability and pricing into multiple WordPress sites to allow real-time booking.\n\nKey Features / Work Done:\n• Developed WooCommerce plugin for live product sync across sites.\n• Integrated third-party API data for event availability.\n• Implemented real-time product updates with caching and batching for performance.\n• Ensured secure handling of API keys and product data.",
    techStack: ["WordPress", "WooCommerce", "PHP", "REST APIs", "JavaScript", "MySQL"],
    imageUrls: ["/assets/projects/project-preview.svg"],
    carouselDataAiHints: ["e-commerce dashboard", "live event booking"]
  },
  {
    id: 4,
    title: "Matchday Parking Platform",
    category: "E-Commerce",
    description: "A pre-bookable parking service for football and rugby events at major UK venues.",
    longDescription: "Matchday Parking is a live event-commerce platform for supporters travelling to football and rugby fixtures. I owned the build beyond the public-facing website: the venue and event discovery experience, the WordPress and WooCommerce backend connections, the booking journey, and the technical work required to launch and operate the product. The platform guides customers from sport and league discovery into venue-specific event listings, availability and booking, with account, help and email touchpoints supporting the journey. The booking work also included Cashflows SDK and Worldpay payment gateway integrations. I also built a staff-scanner PWA that downloads event orders while online, validates tickets without a connection, and syncs queued scan results when service returns.",
    techStack: ["Next.js", "WordPress", "WooCommerce", "Headless", "Cashflows SDK", "Worldpay", "PWA", "Offline scanning"],
    imageUrls: ["/assets/matchdayparking.png"],
    carouselDataAiHints: ["event parking website", "stadium booking portal"],
    liveUrl: 'https://matchdayparking.com/',
    caseStudy: {
      business: 'Pre-bookable parking for football and rugby events at major UK venues.',
      built: 'A headless event-commerce platform connecting a Next.js customer experience with WordPress and WooCommerce operations. Customers can browse by sport, league and venue, review event-specific parking details and availability, then continue into booking and account journeys. The booking flow includes Cashflows SDK and Worldpay payment gateway integrations. Staff can use an installable scanner PWA to download event orders, validate tickets offline and sync queued scans after reconnecting.',
      role: 'I built and brought the full product together, not just the marketing site: frontend, backend integrations, Cashflows SDK and Worldpay payment gateway integrations, data and booking flows, an offline staff-scanning workflow, repository and branch setup, analytics, email touchpoints, deployment and launch checks.',
      outcome: '£1M+ turnover.',
      delivery: [
        'Designed the sport, league and venue information architecture for football and rugby journeys.',
        'Built venue landing pages with event schedules, parking information, availability and booking actions.',
        'Connected the Next.js frontend to the WordPress and WooCommerce product and booking backend.',
        'Integrated Cashflows SDK and Worldpay payment gateways into the booking journey.',
        'Built an installable staff-scanner PWA that caches event orders, validates tickets offline and queues scan results for sync after reconnection.',
        'Implemented customer routes across discovery, event selection, checkout and account access.',
        'Set up analytics and customer email touchpoints around the service and booking experience.',
        'Established the project repositories and branch workflow, then handled deployment, release checks and launch support.'
      ],
      gallery: [
        { src: '/assets/matchdayparking.png', alt: 'Matchday Parking homepage and sport discovery experience', caption: 'Homepage / football, rugby and event discovery', href: 'https://matchdayparking.com/' },
        { src: 'https://matchdayparking.com/_next/image?url=%2Fimages%2Ftottenham.jpg&w=1200&q=80', alt: 'Tottenham Hotspur venue image from the Matchday Parking venue page', caption: 'Tottenham Hotspur / venue and fixture listings', href: 'https://matchdayparking.com/tottenham-hotspur' },
        { src: 'https://matchdayparking.com/_next/image?url=%2Fimages%2Fbristol.jpg&w=1200&q=80', alt: 'Ashton Gate Stadium venue image from Matchday Parking', caption: 'Ashton Gate / venue discovery', href: 'https://matchdayparking.com/ashton-gate-stadium' },
        { src: 'https://matchdayparking.com/_next/image?url=%2Fimages%2Fwembley.jpg&w=1200&q=80', alt: 'Wembley Stadium image from Matchday Parking event discovery', caption: 'Wembley / stadium discovery', href: 'https://matchdayparking.com/england' }
      ]
    },
    featured: true
  },
  {
    id: 5,
    title: "Concert Parking Platform",
    category: "E-Commerce",
    description: "Pre-bookable parking for concerts and major live events across the UK.",
    longDescription: "Concert Parking is the event-focused companion platform for visitors heading to major live shows. I built the complete customer and operational experience, including the venue-led discovery pages, backend commerce connections, booking routes and the project setup needed to ship and run it. The experience helps visitors compare venue options, understand practical parking details and move from a venue page into a booking, with account, support and email journeys around it. The booking work also included Cashflows SDK and Worldpay payment gateway integrations. I also built a staff-scanner PWA that downloads event orders while online, validates tickets without a connection, and syncs queued scan results when service returns.",
    techStack: ["Next.js", "WordPress", "WooCommerce", "Headless", "Cashflows SDK", "Worldpay", "PWA", "Offline scanning"],
    imageUrls: ["/assets/concertparking.png"],
    carouselDataAiHints: ["concert parking booking"],
    liveUrl: 'https://concertparking.co.uk/',
    caseStudy: {
      business: 'Pre-bookable parking for concerts and major live events across the UK.',
      built: 'A headless event-commerce platform connecting a Next.js venue experience with WordPress and WooCommerce operations. Visitors can discover major venues, review venue-specific parking information and follow a direct route into booking and account support. The booking flow includes Cashflows SDK and Worldpay payment gateway integrations. Staff can use an installable scanner PWA to download event orders, validate tickets offline and sync queued scans after reconnecting.',
      role: 'I delivered the end-to-end platform: customer-facing website, backend integrations, Cashflows SDK and Worldpay payment gateway integrations, an offline staff-scanning workflow, booking and operational flows, repository and branch setup, analytics, email touchpoints, deployment and launch checks.',
      outcome: '£1M+ turnover.',
      delivery: [
        'Created a dedicated concert and live-event discovery experience across major UK venues.',
        'Built venue pages that bring parking information, practical details and booking actions together.',
        'Connected the Next.js frontend to the WordPress and WooCommerce backend and its event-commerce flows.',
        'Integrated Cashflows SDK and Worldpay payment gateways into the booking journey.',
        'Built an installable staff-scanner PWA that caches event orders, validates tickets offline and queues scan results for sync after reconnection.',
        'Handled the visitor journey through venue selection, booking, account access and customer support.',
        'Set up analytics and email touchpoints to support customer communications and day-to-day operations.',
        'Set up repositories and branches, managed deployment and release checks, and supported the production launch.'
      ],
      gallery: [
        { src: '/assets/concertparking.png', alt: 'Concert Parking homepage and venue discovery experience', caption: 'Homepage / concert and event discovery', href: 'https://concertparking.co.uk/' },
        { src: 'https://concertparking.co.uk/_next/image?url=https%3A%2F%2Fapp.concertparking.co.uk%2Fwp-content%2Fuploads%2F2026%2F03%2FAsset-79-1024x171.png&w=1200&q=80', alt: 'Wembley venue image from the Concert Parking page', caption: 'Wembley / venue-specific parking page', href: 'https://concertparking.co.uk/wembley' },
        { src: 'https://concertparking.co.uk/_next/image?url=https%3A%2F%2Fapp.concertparking.co.uk%2Fwp-content%2Fuploads%2F2024%2F10%2FTottenham-Hotspur-Stadium.png&w=1200&q=80', alt: 'Tottenham Hotspur Stadium venue image from Concert Parking', caption: 'Tottenham / venue discovery', href: 'https://concertparking.co.uk/tottenham' },
        { src: 'https://concertparking.co.uk/_next/image?url=https%3A%2F%2Fapp.concertparking.co.uk%2Fwp-content%2Fuploads%2F2025%2F01%2Fimages.png&w=1200&q=80', alt: 'Ashton Gate Stadium image from Concert Parking', caption: 'Ashton Gate / venue discovery', href: 'https://concertparking.co.uk/ashton-gate-stadium' }
      ]
    },
    featured: true
  },
  {
    id: 6,
    title: "Tutors Directory / Education Platform",
    category: "Full-Stack",
    description: "A platform for tutors to list their services, allowing students to search, filter, and book sessions.",
    longDescription: "A platform for tutors to list subjects, levels, pricing, and optionally exam boards. Students can search, filter, and book tutors efficiently.\n\nKey Features / Work Done:\n• Dynamic tutor profile system with subject, level, exam board, pricing.\n• Context-based filtering for price, subject, and location.\n• Implemented Autocomplete for subjects and dynamic level selection.\n• Integrated online/in-person filters and price range sliders.\n• Admin panel for CRUD operations on courses and tutor profiles.",
    techStack: ["React", "Tailwind CSS", "Node.js", "Express", "MongoDB", "WordPress"],
    imageUrls: ["/images/tutors-directory.png"],
    carouselDataAiHints: ["online learning platform", "tutor search results"],
    caseStudy: {
      business: 'An education directory connecting students with tutors.',
      built: 'Tutor profiles, subject and level filters, price and location search, online or in-person options, booking and an admin area.',
      role: 'I built the full-stack directory, search experience and management tools.'
    },
    featured: true
  },
  {
    id: 7,
    title: "Genafize.com Landing Page",
    category: "AI & Automation",
    description: "The public-facing marketing website for the Genafize AI tool suite, designed to drive user acquisition.",
    longDescription: "Built the primary marketing website for genafize.com, focusing on clear value propositions, engaging visuals, and a strong call-to-action to convert visitors into platform users. The site showcases the full range of AI capabilities offered by the Genafize toolkit.",
    techStack: ["Next.js", "React", "Tailwind CSS", "Vercel", "SEO"],
    imageUrls: ["/assets/projects/project-preview.svg"],
    carouselDataAiHints: ["modern website homepage", "AI tools pricing page"]
  },
  {
    id: 8,
    title: "WooCommerce Integration Plugins Suite",
    category: "E-Commerce",
    description: "A suite of plugins for WooCommerce including batch email sending and Stripe API synchronization.",
    longDescription: "Developed custom WooCommerce plugins for batch order email handling and Stripe data synchronisation.",
    techStack: ["WordPress", "WooCommerce", "PHP", "Stripe API"],
    imageUrls: ["/assets/projects/project-preview.svg"],
    carouselDataAiHints: ["e-commerce admin panel"],
    caseStudy: {
      business: 'E-commerce teams managing orders and payment data across WooCommerce and Stripe.',
      built: 'Admin tools for batch order emails and synchronising customer, transaction and subscription records.',
      role: 'I developed the custom WooCommerce plugins and Stripe API integration.'
    }
  },
  {
    id: 9,
    title: "Royal Mail API Integration",
    category: "APIs & Integrations",
    description: "A custom integration to connect e-commerce platforms with the Royal Mail API for shipping and tracking.",
    longDescription: "Built a seamless integration between e-commerce systems and the Royal Mail API. This tool automates the process of generating shipping labels, calculating postage costs based on weight and destination, and providing real-time tracking information to customers.",
    techStack: ["PHP", "REST APIs", "WooCommerce", "JavaScript"],
    imageUrls: ["/assets/projects/project-preview.svg"],
    carouselDataAiHints: ["shipping logistics dashboard"]
  },
  {
    id: 10,
    title: "Stripe Payments for Tutors Directory",
    category: "APIs & Integrations",
    description: "Integrated Stripe payments into the Node.js and React-based Tutors Directory platform.",
    longDescription: "Integrated Stripe checkout and payment processing into the Tutors Directory platform.",
    techStack: ["Node.js", "React", "Prisma", "Stripe API", "Vercel"],
    imageUrls: ["/assets/projects/project-preview.svg"],
    carouselDataAiHints: ["online payment checkout"],
    caseStudy: {
      business: 'A tutor directory that needed to support online payments.',
      built: 'Stripe payment intents, backend handling and webhooks connected to a React checkout.',
      role: 'I integrated Stripe across the Node.js backend and the product checkout.'
    }
  },
  {
    id: 14,
    title: 'MWFitnessUK',
    category: 'Full-Stack',
    description: 'A personal training and online coaching website for busy people in Stockport.',
    longDescription: 'MWFitnessUK presents local personal training and online coaching, with clear package information and paths for prospective clients to get in touch.',
    techStack: [],
    imageUrls: ['/assets/mwfitnessuk-hero.jpg'],
    liveUrl: 'https://mwfitnessuk.com/',
    caseStudy: {
      business: 'Personal training and online coaching based in Stockport.',
      built: 'A responsive website presenting coaching, training packages and nutrition support with clear enquiry and booking actions.',
      role: 'I built the website and shaped the content around the coach’s services.'
    },
    featured: true
  },
  {
    id: 15,
    title: 'Toastylicious',
    category: 'E-Commerce',
    description: 'An online storefront for a made-to-order toasted sandwich business.',
    longDescription: 'Toastylicious lets customers browse the menu, customize orders and build a basket for freshly made toasted sandwiches.',
    techStack: [],
    imageUrls: ['/assets/toastylicious.png'],
    liveUrl: 'https://toastylicious.com/',
    caseStudy: {
      business: 'A food brand selling made-to-order toasted sandwiches.',
      built: 'A digital storefront with menu discovery, product customization, a build-your-own flow and basket ordering.',
      role: 'I built the storefront and customer ordering experience.'
    },
    featured: true
  },
  {
    id: 16,
    title: 'Dapper Man',
    category: 'E-Commerce',
    description: 'A grooming and barbering brand combining products with mobile appointments.',
    longDescription: 'Dapper Man brings its grooming products and mobile barbering service together in one online experience.',
    techStack: [],
    imageUrls: ['/assets/dapperman.png'],
    liveUrl: 'https://dapperman.co.uk/',
    caseStudy: {
      business: 'A men’s grooming brand offering products and mobile barbering.',
      built: 'An online shop with product discovery, basket and clear paths to book a barber visit.',
      role: 'I built the e-commerce website and connected the service and product journeys.'
    },
    featured: true
  },
  {
    id: 17,
    title: 'Matchday Parking Scanner PWA',
    category: 'Full-Stack',
    description: 'A staff-facing event order and ticket-scanning app for check-in teams, with offline scanning and automatic sync when service returns.',
    longDescription: 'An installable Progressive Web App for event staff to load event orders, scan and validate tickets at check-in, and keep the entry workflow moving when connectivity is unreliable. Scan results are queued on the device and synchronized when service returns.',
    techStack: ['Progressive Web App', 'Event orders', 'Ticket scanning', 'Offline sync'],
    imageUrls: ['/images/scnner2.jpg'],
    caseStudy: {
      business: 'Matchday Parking event teams handling order check-in at busy venues.',
      built: 'A staff scanner PWA covering event-order loading, ticket validation and check-in, with offline scanning and queued result synchronization as part of the workflow.',
      role: 'I built the scanner app and its event-order, check-in and offline synchronization workflows.',
      delivery: [
        'Loads event orders onto staff devices while connected.',
        'Supports ticket scanning and validation as part of event check-in.',
        'Continues scanning when connectivity drops and queues results locally.',
        'Synchronizes queued scan results when service returns.'
      ],
      gallery: scannerGallery
    },
    featured: true
  },
  {
    id: 18,
    title: 'MWFitness React Native App',
    category: 'Full-Stack',
    description: 'A cross-platform React Native mobile app for MWFitness, built for iOS and Android.',
    longDescription: 'A React Native mobile application created for MWFitness and targeting both iOS and Android devices.',
    techStack: ['React Native', 'iOS', 'Android'],
    imageUrls: ['/images/app1.mwfitness.app.jpg'],
    caseStudy: {
      business: 'MWFitness, a personal training and online coaching business in Stockport.',
      built: 'A cross-platform mobile app using React Native for iOS and Android.',
      role: 'I built the MWFitness mobile app for both supported platforms.',
      gallery: mwFitnessGallery
    },
    featured: true
  }
];

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 1,
    icon: "Code",
    title: "Full-Stack Development",
    description: "Bespoke websites and web applications using modern stacks like Next.js, React, and Node.js with pixel-perfect responsive layouts.",
    deliverables: ["Modern React & Next.js UI", "Robust REST/GraphQL APIs", "Database Modeling & ORM", "Continuous Deployment Pipeline"],
    idealFor: "Startups & businesses needing high-performance custom applications."
  },
  {
    id: 2,
    icon: "AppWindow",
    title: "SaaS & Platform Development",
    description: "Building MVPs, subscription systems, and data dashboards with scalable multi-tenant architecture and rock-solid auth.",
    deliverables: ["Multi-tenant Data Partitioning", "Stripe Subscriptions & Invoicing", "Role-based Access Control", "Executive Dashboards & Analytics"],
    idealFor: "Founders launching software-as-a-service products."
  },
  {
    id: 3,
    icon: "BrainCircuit",
    title: "AI-Powered Solutions",
    description: "Integrating custom chatbots, assistants, and automation tools using Gemini, OpenAI, Claude, and local LLM pipelines.",
    deliverables: ["RAG Knowledge Retrieval", "Automated Content & SEO Pipelines", "Custom Autonomous Agent Workflows", "Vector Database Indexing"],
    idealFor: "Companies looking to multiply productivity with intelligent AI systems."
  },
  {
    id: 4,
    icon: "Store",
    title: "E-Commerce Development",
    description: "Custom WooCommerce & Shopify builds, high-conversion checkout flows, and payment gateway (Stripe, PayPal) integrations.",
    deliverables: ["Headless & Custom Checkout", "Live Inventory & Ticket Booking", "Custom Extension & Plugin Builds", "Automated Fulfillment Feeds"],
    idealFor: "Merchants and ticket/event platforms needing high-volume booking."
  },
  {
    id: 5,
    icon: "Smartphone",
    title: "Mobile & Cross-Platform",
    description: "Creating Progressive Web Apps (PWAs) and React Native mobile apps backed by cloud servers and offline-first storage.",
    deliverables: ["Offline Support & Service Workers", "Push Notifications", "Native Device API Access", "Responsive Touch Interactions"],
    idealFor: "Teams expanding web products into app stores or offline environments."
  },
  {
    id: 6,
    icon: "ServerCog",
    title: "System Architecture",
    description: "Expert technical consulting on scalability, database design, microservices, cloud infra, and CTO-for-hire advisory.",
    deliverables: ["Scalability Roadmaps", "Database Schema Optimization", "Security Audits & HIPAA Alignment", "Codebase Health Assessment"],
    idealFor: "Growing engineering teams facing scaling bottlenecks or technical debt."
  },
  {
    id: 7,
    icon: "Network",
    title: "Plugins & Integrations",
    description: "Developing custom WordPress plugins, API connectors (Google Ads, GA4, GSC, Royal Mail), and seamless REST integrations.",
    deliverables: ["Bespoke WordPress Plugins", "Webhook Orchestration", "Third-party CRM Sync", "Rate-limited API Gateways"],
    idealFor: "Businesses requiring disparate platforms to speak seamlessly in real-time."
  },
  {
    id: 8,
    icon: "ShieldCheck",
    title: "Support & Growth",
    description: "Providing ongoing maintenance, feature extensions, performance optimization, and proactive security hardening.",
    deliverables: ["99.9% Uptime Monitoring", "Zero-downtime Patching", "Core Web Vitals Optimization", "Priority Bug Fix SLA"],
    idealFor: "Established sites that cannot afford downtime or sluggish speeds."
  },
  {
    id: 9,
    icon: "Search",
    title: "AI-Powered SEO",
    description: "Leveraging AI to enhance search rankings, optimize content structure, and perform intelligent semantic keyword analysis.",
    deliverables: ["Automated SERP Scraping & Analysis", "Semantic Keyword Clustering", "Automated Meta & Schema Generation", "Programmatic SEO Architectures"],
    idealFor: "Brands wanting sustainable organic traffic growth through smart software."
  }
];

export const WHO_I_AM_DATA: RoleExpertise[] = [
  {
    title: "Web Developer",
    subtitle: "Full-stack architecture",
    desc: "Building performant, scalable web applications with modern frameworks and best-in-class engineering practices. From Next.js to React Native, I architect systems that scale cleanly from day one.",
    highlight: "10+ years building production apps",
    metric: "10+ Yrs"
  },
  {
    title: "Software Engineer",
    subtitle: "Systems & automation",
    desc: "Designing robust software systems, APIs, and automation pipelines that power complex business logic. I turn messy requirements into reliable, maintainable, self-healing infrastructure.",
    highlight: "Designed APIs powering 100k+ daily requests",
    metric: "100k+ Req/Day"
  },
  {
    title: "AI & Innovation Lead",
    subtitle: "Strategic delivery",
    desc: "Leveraging generative AI, autonomous agents, and intelligent workflows to solve problems that once seemed impossible. I bridge the gap between business goals and technical execution.",
    highlight: "Built custom AI tools for SEO, PPC & content",
    metric: "GenAI Core"
  },
  {
    title: "Technical Partner",
    subtitle: "Product-minded engineering",
    desc: "Not just a developer — I think like a founder. I ship products that drive real revenue, reduce operational costs, and create durable competitive advantages for businesses of all sizes.",
    highlight: "Completed 50+ client projects",
    metric: "50+ Projects"
  },
  {
    title: "AI Enthusiast",
    subtitle: "Future-forward",
    desc: "Exploring the bleeding edge of machine learning, LLMs, and autonomous agent loops. I believe the best is yet to come, and I am building towards it — one intelligent system at a time.",
    highlight: "Deep-diving into agents, RAG & fine-tuning",
    metric: "Agent Ready"
  }
];

export const TIMELINE_DATA: TimelineMilestone[] = [
  {
    year: "2018",
    title: "Started Coding",
    desc: "Built the first personal website with HTML, CSS, and JavaScript. This is the origin point of the story.",
    icon: "👨‍💻",
    technologies: ["HTML5", "CSS3", "JavaScript"]
  },
  {
    year: "2019",
    title: "Freelance Launch",
    desc: "Began delivering WordPress, WooCommerce, and bespoke web builds for local clients across Manchester and the UK.",
    icon: "💼",
    technologies: ["PHP", "WordPress", "WooCommerce", "MySQL"]
  },
  {
    year: "2020",
    title: "Modern Web",
    desc: "Shifted into React, Next.js, and modern full-stack development with performance, security, and global scale in mind.",
    icon: "⚛️",
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS"]
  },
  {
    year: "2022",
    title: "AI Integration",
    desc: "Started building AI-powered tools, automations, and intelligent experiences for SEO, PPC, and programmatic marketing workflows.",
    icon: "🤖",
    technologies: ["OpenAI API", "Vector Databases", "Python", "Automation Pipelines"]
  },
  {
    year: "2024",
    title: "Platform Delivery",
    desc: "Delivered complex SaaS-style multi-tenant platforms with live payment gateways, real-time sync, and polished UX.",
    icon: "🎵",
    technologies: ["Full-Stack SaaS", "Docker", "Stripe API", "Microservices"]
  },
  {
    year: "2025+",
    title: "Future Systems",
    desc: "Moving toward agent-driven products, intelligent workflows, and premium digital platforms that execute autonomously.",
    icon: "🚀",
    technologies: ["Gemini 2.0", "Autonomous Agents", "RAG Pipelines", "Edge Compute"]
  }
];

export const SKILLS_DATA: SkillItem[] = [
  { name: "HTML5", slug: "html5", category: "Frontend" },
  { name: "CSS3", slug: "css-3", category: "Frontend" },
  { name: "JavaScript", slug: "javascript", category: "Frontend" },
  { name: "TypeScript", slug: "typescript", category: "Frontend" },
  { name: "PHP", slug: "php", category: "Backend" },
  { name: "Python", slug: "python", category: "Backend" },
  { name: "Go", slug: "go", category: "Backend" },
  { name: "React", slug: "react", category: "Frontend" },
  { name: "Next.js", slug: "nextdotjs", category: "Frontend" },
  { name: "Node.js", slug: "nodedotjs", category: "Backend" },
  { name: "Laravel", slug: "laravel", category: "Backend" },
  { name: "Tailwind CSS", slug: "tailwindcss", category: "Frontend" },
  { name: "MongoDB", slug: "mongodb", category: "Backend" },
  { name: "PostgreSQL", slug: "postgresql", category: "Backend" },
  { name: "MySQL", slug: "mysql", category: "Backend" },
  { name: "AWS", slug: "amazon-aws", category: "Cloud & DevOps" },
  { name: "Google Cloud", slug: "googlecloud", category: "Cloud & DevOps" },
  { name: "Docker", slug: "docker", category: "Cloud & DevOps" },
  { name: "Git", slug: "git", category: "Cloud & DevOps" },
  { name: "Linux", slug: "linux", category: "Cloud & DevOps" },
  { name: "Gemini", slug: "googlegemini", category: "AI & Data" },
  { name: "OpenAI", slug: "openai", category: "AI & Data" },
  { name: "React Native", slug: "react", category: "Frontend" },
  { name: "WordPress", slug: "wordpress", category: "E-Commerce" },
  { name: "Shopify", slug: "shopify", category: "E-Commerce" },
  { name: "WooCommerce", slug: "woocommerce", category: "E-Commerce" },
  { name: "Stripe", slug: "stripe", category: "E-Commerce" }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    name: "Sarah L.",
    role: "Product Director",
    company: "Health Diagnostics Co.",
    text: "Working with Christopher was a dream. He took our vague ideas and turned them into a stunning, functional platform that exceeded all our expectations. The communication was fantastic throughout the entire process.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "David C.",
    role: "Managing Director",
    company: "Regional Education Group",
    text: "Incredibly professional and technically skilled. He delivered our 70+ school portal on time and on budget, and the final product is a testament to his expertise. Highly recommend for any complex web development work.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "Emily R.",
    role: "Head of Growth",
    company: "Marketing & AI Studio",
    text: "The custom AI tool Christopher built for our team has revolutionized our workflow. It's intuitive, powerful, and has saved us countless hours every single week. A true game-changer for our business.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "Michael B.",
    role: "Founder",
    company: "Event Logistics UK",
    text: "A truly collaborative partner. Christopher listened to our unique matchday booking needs, provided valuable insights, and was always responsive. The live WooCommerce sync is rock solid.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "Jessica M.",
    role: "Operations Lead",
    company: "Tutors Network",
    text: "Christopher transformed our outdated directory into a modern, mobile-friendly experience that our educators and parents love. We've seen a 40% increase in bookings since the relaunch.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "Tom H.",
    role: "E-Commerce Director",
    company: "Retail Brands Group",
    text: "The attention to detail and commitment to quality is evident in every aspect of his code. Christopher is not just a developer; he is a true craftsman of the digital world. Exceptional work.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  }
];

export const SPECIALTY_PILLARS = [
  {
    id: "ai-solutions",
    title: "AI Solutions",
    badge: "Intelligence Layer",
    headline: "Neural Architectures & Autonomous Pipelines",
    description: "Architecting generative AI systems that go beyond basic prompt wrappers. I build custom RAG pipelines, fine-tuned agent workflows, and vector-backed knowledge retrieval systems for enterprise applications.",
    features: [
      { name: "NEURAL_SEARCH", desc: "Vector data retrieval & hybrid semantic search using Gemini & embeddings" },
      { name: "LLM_PIPELINES", desc: "Streaming structured outputs with Gemini 2.0, OpenAI, and Claude" },
      { name: "AUTONOMOUS_AGENTS", desc: "Multi-step tool calling, self-evaluating chains, and agentic workflows" },
      { name: "KNOWLEDGE_GRAPHS", desc: "Connected enterprise context ingestion and real-time synchronization" }
    ],
    highlightQuote: "Moving beyond passive chat to proactive, autonomous decision engines."
  },
  {
    id: "marketing-tools",
    title: "Marketing Tools",
    badge: "Growth Engine",
    headline: "Programmatic SEO & PPC Automation Software",
    description: "Building automated software that scales content, analyzes search intent, and synchronizes ad networks in real-time, driving measurable top-line revenue growth.",
    features: [
      { name: "SERP_INTELLIGENCE", desc: "Real-time rank monitoring and competitive gap analysis engines" },
      { name: "CONTENT_CLUSTERING", desc: "Intelligent topic clustering and semantic content generation" },
      { name: "PPC_BID_SYNC", desc: "Google Ads & Meta automated budget balancing and conversion tracking" },
      { name: "PROGRAMMATIC_SEO", desc: "Database-driven generation of thousands of optimized landing pages" }
    ],
    highlightQuote: "Transforming manual marketing tasks into deterministic software pipelines."
  },
  {
    id: "platform-development",
    title: "Platform Development",
    badge: "Scale & Reliability",
    headline: "Multi-Tenant SaaS & High-Throughput Portals",
    description: "Engineering platforms that support tens of thousands of concurrent users with zero latency, strict tenant data isolation, and comprehensive role-based permission boundaries.",
    features: [
      { name: "MULTI_TENANCY", desc: "Schema-isolated and database-partitioned architectures" },
      { name: "ROLE_BASED_AUTH", desc: "Fine-grained ACL, SSO, session security, and OAuth2/JWT" },
      { name: "REALTIME_EVENTS", desc: "WebSocket and push event streams for collaborative experiences" },
      { name: "CLOUD_SCALABILITY", desc: "Containerized deployments on AWS and GCP with automated autoscaling" }
    ],
    highlightQuote: "Production-grade resilience built for high-stakes enterprise applications."
  },
  {
    id: "integrations-and-apis",
    title: "Integrations & APIs",
    badge: "Connectivity",
    headline: "Robust REST, GraphQL & Webhook Microservices",
    description: "Bridging disparate legacy databases, payment networks, logistics providers, and third-party SaaS tools through fault-tolerant, rate-limited APIs.",
    features: [
      { name: "PAYMENT_RAILS", desc: "Stripe Connect, custom checkout flows, and webhook event reconciliation" },
      { name: "SHIPPING_LOGISTICS", desc: "Royal Mail, FedEx, and DHL label generation and package tracking" },
      { name: "ECOMMERCE_BRIDGES", desc: "Two-way inventory and live pricing synchronization across WooCommerce" },
      { name: "DATA_AUDITING", desc: "HIPAA and GDPR aligned encrypted storage with immutable audit trails" }
    ],
    highlightQuote: "Reliable connective tissue ensuring disparate enterprise services function as one."
  }
];
