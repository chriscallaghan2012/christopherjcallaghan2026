import { PublicPageTab } from '../types';
import type { ProcessFlowContent, SystemMapContent } from '../types';

export interface PublicPage {
  slug: string;
  tab: PublicPageTab;
  title: string;
  description: string;
  eyebrow: string;
  headline: string;
  intro: string;
  points?: { title: string; description: string }[];
  deliverables?: { title: string; description: string }[];
  metrics?: { label: string; value: string; detail: string }[];
  measurement?: {
    intro: string;
    steps: { label: string; description: string }[];
  };
  chart?: {
    eyebrow: string;
    title: string;
    description: string;
    periods: string[];
    series: { label: string; color: string; values: number[] }[];
  };
  flow?: ProcessFlowContent;
  systemMap?: SystemMapContent;
}

export const PUBLIC_PAGES: Record<string, PublicPage> = {
  about: {
    slug: 'about',
    tab: 'about',
    title: 'About Christopher J. Callaghan',
    description: 'Meet Christopher J. Callaghan, a full-stack developer, AI builder and business creator with 15+ years building digital products and businesses.',
    eyebrow: 'ABOUT THE BUILDER',
    headline: 'CHRISTOPHER J. CALLAGHAN',
    intro: 'Full-stack developer / AI / business / builder. For 15+ years, I have built websites, applications, software, integrations, AI systems and digital businesses.'
  },
  contact: {
    slug: 'contact',
    tab: 'contact',
    title: 'Contact Christopher J. Callaghan',
    description: 'Tell Christopher what you are trying to build, improve or grow. Start with the idea; the technical plan can come later.',
    eyebrow: 'CONTACT',
    headline: 'WHAT ARE YOU BUILDING?',
    intro: 'Share the idea, problem or opportunity. I’ll get back to you by email.'
  },
  'seo-services': {
    slug: 'seo-services',
    tab: 'seo-services',
    title: 'SEO Services',
    description: 'Technical SEO, useful content and search-focused websites to help the right people find your business.',
    eyebrow: 'SEO SERVICES',
    headline: 'BE EASIER TO FIND.',
    intro: 'Make your website clearer to search engines and more useful to the people looking for what you do.',
    points: [
      { title: 'Technical foundations', description: 'Review crawling, indexing, site structure, page speed, mobile usability, redirects and structured data. Fix the barriers that stop important pages from being understood and surfaced.' },
      { title: 'Search and content strategy', description: 'Map the services you offer to the terms and questions real customers use. Build or improve useful pages around that intent instead of publishing filler for search engines.' },
      { title: 'On-page improvements', description: 'Improve page titles, headings, internal links, snippets and calls to action so each page is clear to both search engines and people deciding who to contact.' },
      { title: 'Local and wider visibility', description: 'Connect your service pages, locations and business details so local search and broader organic search reinforce each other.' },
      { title: 'Measurement and iteration', description: 'Use search impressions, relevant visits and completed enquiries to see what is improving, find gaps and decide what to work on next.' }
    ],
    deliverables: [
      { title: 'Technical findings', description: 'A prioritised view of crawlability, indexing, performance and structural issues.' },
      { title: 'Search-to-page map', description: 'Priority services and customer questions matched to the most useful pages.' },
      { title: 'On-page improvements', description: 'Clearer titles, headings, internal links and calls to action on agreed pages.' },
      { title: 'Baseline reporting', description: 'A consistent comparison of impressions, clicks, visits and qualified enquiries.' }
    ],
    metrics: [
      { label: 'Organic clicks', value: '+14%', detail: 'Change against the agreed Search Console baseline.' },
      { label: 'Qualified enquiries', value: '+8%', detail: 'Change in relevant enquiries attributed to organic search.' },
      { label: 'Priority pages indexed', value: '94%', detail: 'Share of agreed landing pages available in search.' },
      { label: 'Search conversion rate', value: '+6%', detail: 'Change in the share of organic visits that take action.' }
    ],
    measurement: {
      intro: 'Record where the site is now, then compare like-for-like periods and connect organic visits to meaningful enquiries. Percentages describe observed change, never a guaranteed uplift.',
      steps: [
        { label: '01 / Establish', description: 'Choose a representative starting period and record clicks, impressions, priority pages and enquiries.' },
        { label: '02 / Compare', description: 'Use consistent date ranges and account for seasonality, site changes and tracking differences.' },
        { label: '03 / Improve', description: 'Use the evidence to choose the next page, technical fix or content improvement to test.' }
      ]
    },
    chart: {
      eyebrow: 'EXAMPLE REPORT / ORGANIC SEARCH',
      title: 'Organic search, made measurable',
      description: 'See how search discovery and qualified actions move across comparable reporting periods.',
      periods: ['Base', 'M1', 'M2', 'M3', 'M4', 'M5'],
      series: [
        { label: 'Clicks', color: '#FF003C', values: [100, 102, 98, 106, 111, 114] },
        { label: 'Impressions', color: '#00DFC9', values: [100, 108, 105, 113, 116, 119] },
        { label: 'Qualified enquiries', color: '#FFB347', values: [100, 96, 103, 105, 111, 108] }
      ]
    },
    flow: {
      title: 'From search opportunity to useful growth',
      intro: 'A practical SEO cycle: establish what is blocking discovery, improve the pages that matter, then measure and refine.',
      steps: [
        { title: 'Find the opportunity', description: 'Understand the services, audience, search intent and current visibility.' },
        { title: 'Fix technical barriers', description: 'Review indexing, site structure, performance, mobile usability and metadata.' },
        { title: 'Build useful pages', description: 'Improve service content, internal links and clear next steps for visitors.' },
        { title: 'Measure and refine', description: 'Use search visibility, relevant visits and enquiries to choose the next improvement.' }
      ]
    },
    systemMap: {
      title: 'How search work connects',
      intro: 'Search demand and the current site inform the technical fixes, content and links that make a page easier to discover.',
      nodes: [
        { id: 'queries', title: 'Search demand', summary: 'Queries and customer questions', detail: 'Search terms and questions reveal the language people use and the intent behind a visit.', examples: ['Google Search Console query exports', 'Service and location terms', 'Questions gathered from enquiries'], group: 'source' },
        { id: 'site-state', title: 'Current website', summary: 'Structure, speed and indexability', detail: 'The existing website is reviewed for crawl access, indexability, mobile usability, page speed and structural issues.', examples: ['robots.txt and sitemap.xml', 'Canonical URLs and redirects', 'Mobile rendering and page performance'], group: 'source' },
        { id: 'intent-map', title: 'Intent map', summary: 'Queries matched to useful pages', detail: 'Group related searches by intent, then map them to the most useful existing or planned page.', examples: ['Topic-to-URL map', 'Service versus informational intent', 'Overlapping pages to consolidate'], group: 'work' },
        { id: 'technical-fixes', title: 'Technical fixes', summary: 'Crawl, structure and performance', detail: 'Resolve technical barriers that prevent important pages from loading well or being understood and indexed.', examples: ['Crawl and index checks', 'Core Web Vitals opportunities', 'CMS SEO plugin settings, where applicable'], group: 'work' },
        { id: 'page-content', title: 'On-page content', summary: 'Titles, headings and answers', detail: 'Shape page titles, headings, copy and calls to action around the visitor’s question and next step.', examples: ['Title tag and H1 alignment', 'Useful question-and-answer coverage', 'Clear enquiry or booking CTA'], group: 'work' },
        { id: 'internal-links', title: 'Internal links', summary: 'Clear paths between relevant pages', detail: 'Connect related service, location and supporting pages so visitors and crawlers can follow the site structure.', examples: ['Service-to-location links', 'Related article links', 'Descriptive anchor text'], group: 'work' },
        { id: 'search-pages', title: 'Search-ready pages', summary: 'Useful, connected landing pages', detail: 'The result is a set of technically accessible pages that answer search intent and give visitors a clear next action.', examples: ['Crawlable page structure', 'Relevant internal pathways', 'Enquiry or booking actions'], group: 'outcome' }
      ],
      connections: [['queries', 'intent-map'], ['site-state', 'technical-fixes'], ['intent-map', 'page-content'], ['technical-fixes', 'page-content'], ['page-content', 'internal-links'], ['internal-links', 'search-pages']]
    }
  },
  'local-seo': {
    slug: 'local-seo',
    tab: 'local-seo',
    title: 'Local SEO and Google Maps Marketing',
    description: 'Google Business Profile and local search support to help nearby customers find accurate information about your business.',
    eyebrow: 'LOCAL SEO / GOOGLE MAPS',
    headline: 'SHOW UP WHERE PEOPLE LOOK.',
    intro: 'Build a clearer local presence across Google Search and Maps, backed by accurate business information and useful location pages.',
    points: [
      { title: 'Google Business Profile', description: 'Set up or improve your profile with accurate categories, services, opening hours, contact details, photos and links that match how customers search.' },
      { title: 'Local information that agrees', description: 'Keep your business name, address or service area, phone number and website consistent wherever customers encounter them.' },
      { title: 'Service-area pages', description: 'Create useful pages that explain what you do and where you work. Each page should answer local questions and give visitors a clear next step, not just repeat a town name.' },
      { title: 'Reviews and customer actions', description: 'Make it easier for customers to call, request directions, visit your site or leave feedback, with clear processes for responding to reviews.' },
      { title: 'Local performance', description: 'Track profile interactions, website visits, calls and enquiries to understand which locations and services are generating interest.' }
    ],
    deliverables: [
      { title: 'Profile review', description: 'A practical check of categories, services, hours, contact details, photos and links.' },
      { title: 'Business detail alignment', description: 'A checklist of priority places where your business information should agree.' },
      { title: 'Useful local pages', description: 'Location content shaped around actual services, coverage and customer questions.' },
      { title: 'Action tracking', description: 'A view of profile interactions, calls, directions, visits and enquiries.' }
    ],
    flow: {
      title: 'Turn local intent into customer action',
      intro: 'Connect an accurate business profile with consistent local information and useful service-area pages.',
      steps: [
        { title: 'Make the profile accurate', description: 'Check categories, services, hours, contact details, photos and links.' },
        { title: 'Align local information', description: 'Keep business details consistent across key directories and your website.' },
        { title: 'Answer local questions', description: 'Create useful location and service pages with clear visitor next steps.' },
        { title: 'Review customer actions', description: 'Monitor calls, directions, site visits and enquiries, then improve what is unclear.' }
      ]
    },
    systemMap: {
      title: 'How local search connects',
      intro: 'Accurate business information, a well-maintained profile and useful local pages work together to support discovery and customer actions.',
      nodes: [
        { id: 'profile', title: 'Business Profile', summary: 'Categories, services, hours and links', detail: 'The profile is checked for correct categories, services, opening hours, contact details, photos and destination links.', examples: ['Primary and additional categories', 'Services, opening hours and photos', 'Website, call and booking links'], group: 'source' },
        { id: 'business-data', title: 'Business information', summary: 'Name, address or service area, phone', detail: 'Core business details are compared with the website and important directories to identify inconsistencies.', examples: ['Business name and phone', 'Address or service area', 'Matching contact details on key listings'], group: 'source' },
        { id: 'profile-update', title: 'Profile updates', summary: 'Accurate, complete listing', detail: 'Profile fields are improved so people can understand what the business does and how to contact or visit it.', examples: ['Accurate service descriptions', 'Current photos and hours', 'Direct links to relevant pages'], group: 'work' },
        { id: 'consistency', title: 'Local consistency', summary: 'Matching details across the web', detail: 'Business name, address or service area, phone number and web links are aligned across key sources.', examples: ['Website contact page', 'Business directories', 'Location and service-area references'], group: 'work' },
        { id: 'location-pages', title: 'Location pages', summary: 'Useful local service information', detail: 'Pages answer real location and service questions instead of repeating place names without useful detail.', examples: ['Local service details', 'Travel or coverage information', 'Unique FAQs and next actions'], group: 'work' },
        { id: 'customer-actions', title: 'Customer actions', summary: 'Calls, directions and visits', detail: 'Clear calls to action make it straightforward to call, request directions or continue to the relevant service page.', examples: ['Call clicks', 'Direction requests', 'Website and booking visits'], group: 'work' },
        { id: 'local-discovery', title: 'Local discovery', summary: 'A coherent presence in Search and Maps', detail: 'The profile and website present consistent information and give nearby customers a clear next step.', examples: ['Consistent business details', 'Useful local landing pages', 'Trackable call, direction or site actions'], group: 'outcome' }
      ],
      connections: [['profile', 'profile-update'], ['business-data', 'consistency'], ['profile-update', 'location-pages'], ['consistency', 'location-pages'], ['location-pages', 'customer-actions'], ['customer-actions', 'local-discovery']]
    }
  },
  'google-ads-management': {
    slug: 'google-ads-management',
    tab: 'google-ads-management',
    title: 'Google Ads Management and PPC',
    description: 'Google Ads and paid search campaigns connected to relevant landing pages, conversion tracking and business goals.',
    eyebrow: 'GOOGLE ADS / PPC',
    headline: 'REACH THE RIGHT PEOPLE.',
    intro: 'Plan paid campaigns around a clear offer, a useful landing page and measurement you can act on.',
    points: [
      { title: 'Campaign strategy', description: 'Set a clear objective, audience, location, offer and budget before choosing campaign types. Separate different services and customer intent so results are easier to understand.' },
      { title: 'Account and keyword structure', description: 'Organise Google Ads campaigns and ad groups around relevant searches. Use match types, exclusions and search-term reviews to reduce spend on the wrong clicks.' },
      { title: 'Ads and landing pages', description: 'Write useful, specific ad messages and connect each campaign to a page that matches the promise, answers likely questions and makes the next action obvious.' },
      { title: 'Conversion measurement', description: 'Configure and test measurement for meaningful actions such as qualified enquiries, calls, bookings or purchases, rather than treating every visit as a result.' },
      { title: 'Ongoing optimisation', description: 'Review spend, search terms, conversions and landing-page performance together. Use the evidence to refine targeting and budget, not just chase clicks.' }
    ],
    deliverables: [
      { title: 'Campaign structure', description: 'Campaigns, ad groups, keywords and exclusions organised around search intent.' },
      { title: 'Ad-to-page alignment', description: 'Relevant ad messages connected to landing pages with a clear next action.' },
      { title: 'Conversion tracking', description: 'Agreed calls, forms, bookings or purchases configured and tested.' },
      { title: 'Optimisation report', description: 'Spend, search terms and conversion trends reviewed against the campaign baseline.' }
    ],
    metrics: [
      { label: 'Cost per qualified lead', value: '£42 / lead', detail: 'Cost measured against the agreed qualified lead definition.' },
      { label: 'Landing-page conversion', value: '+12%', detail: 'Change in conversion rate against the starting period.' },
      { label: 'Tracked conversions', value: '96%', detail: 'Share of agreed campaign actions with verified tracking.' },
      { label: 'Irrelevant search spend', value: '-18%', detail: 'Change identified through search-term and exclusion reviews.' }
    ],
    measurement: {
      intro: 'Agree what counts as a qualified action, capture current spend and conversion performance, then compare equivalent campaign periods. Changes are measured outcomes, not promised results.',
      steps: [
        { label: '01 / Define', description: 'Agree which calls, enquiries, bookings or sales count as qualified conversions.' },
        { label: '02 / Baseline', description: 'Record spend, conversions, cost per qualified action and landing-page conversion rate.' },
        { label: '03 / Optimise', description: 'Review search terms and outcomes together before changing targeting, creative or budget.' }
      ]
    },
    chart: {
      eyebrow: 'EXAMPLE REPORT / GOOGLE ADS',
      title: 'Paid campaign performance',
      description: 'Read conversion volume and cost efficiency together, not clicks in isolation. A lower cost-per-lead index can indicate improved efficiency.',
      periods: ['Base', 'M1', 'M2', 'M3', 'M4', 'M5'],
      series: [
        { label: 'Qualified conversions', color: '#FF003C', values: [100, 106, 103, 111, 108, 116] },
        { label: 'Conversion rate', color: '#00DFC9', values: [100, 103, 99, 108, 105, 112] },
        { label: 'Cost per qualified lead', color: '#FFB347', values: [100, 97, 102, 92, 95, 88] }
      ]
    },
    flow: {
      title: 'Connect ad spend to a measurable outcome',
      intro: 'Build a paid-search loop around the action that matters, with each campaign and landing page telling the same story.',
      steps: [
        { title: 'Define the conversion', description: 'Choose the meaningful action, target area and budget constraints.' },
        { title: 'Structure the campaign', description: 'Group searches by intent and exclude irrelevant traffic.' },
        { title: 'Match ad to landing page', description: 'Keep the promise, page content and call to action consistent.' },
        { title: 'Measure and adjust', description: 'Check conversion data and search terms before changing bids or budget.' }
      ]
    },
    systemMap: {
      title: 'How a paid campaign connects',
      intro: 'Offer, audience and search intent shape the campaign and landing page; measurement then informs budget and targeting decisions.',
      nodes: [
        { id: 'offer', title: 'Offer and goal', summary: 'The action the campaign should support', detail: 'Define the service or offer and the meaningful action to measure, such as a qualified enquiry, call or booking.', examples: ['Enquiry form completion', 'Tracked phone call', 'Purchase or booking confirmation'], group: 'source' },
        { id: 'audience', title: 'Audience and location', summary: 'Who the campaign should reach', detail: 'Set the relevant audience and geographic boundaries before building targeting or selecting keywords.', examples: ['Service area or radius', 'Customer intent', 'Budget and schedule limits'], group: 'source' },
        { id: 'search-intent', title: 'Search intent', summary: 'Terms aligned with readiness', detail: 'Review the searches people use and separate relevant intent from terms unlikely to lead to the desired action.', examples: ['Keyword themes', 'Search-term review', 'Negative keyword list'], group: 'source' },
        { id: 'campaign', title: 'Campaign structure', summary: 'Keywords, groups and exclusions', detail: 'Organise campaigns and ad groups around related intent, with exclusions to reduce irrelevant clicks.', examples: ['Google Ads campaign and ad groups', 'Keyword match strategy', 'Location and negative-keyword settings'], group: 'work' },
        { id: 'ad-page', title: 'Ad and landing page', summary: 'One consistent message', detail: 'Match the ad promise to a useful landing page with clear information and an obvious next step.', examples: ['Search ad headline and description', 'Dedicated service landing page', 'UTM campaign parameters'], group: 'work' },
        { id: 'tracking', title: 'Conversion tracking', summary: 'Measure meaningful actions', detail: 'Configure and test measurement for the campaign’s chosen business outcome.', examples: ['GA4 event for a form or booking', 'Google Ads conversion action', 'GTM tag and trigger, when used'], group: 'work' },
        { id: 'optimisation', title: 'Testing and review', summary: 'Search terms, spend and outcomes', detail: 'Review actual search terms and conversion data before adjusting budget, bids or creative.', examples: ['Search-term report', 'Cost per qualified action', 'Landing-page drop-off'], group: 'work' },
        { id: 'measured-actions', title: 'Measured actions', summary: 'Campaign activity tied to the goal', detail: 'A connected campaign makes it possible to compare spend with the actions it was designed to generate.', examples: ['Campaign-tagged visits', 'Calls, enquiries or bookings', 'Budget decisions tied to conversion data'], group: 'outcome' }
      ],
      connections: [['offer', 'ad-page'], ['audience', 'campaign'], ['search-intent', 'campaign'], ['campaign', 'ad-page'], ['ad-page', 'tracking'], ['tracking', 'optimisation'], ['optimisation', 'measured-actions']]
    }
  },
  'social-media-marketing': {
    slug: 'social-media-marketing',
    tab: 'social-media-marketing',
    title: 'Social Media Marketing',
    description: 'Social media planning, content and paid campaigns connected to your website, audience and business goals.',
    eyebrow: 'CONTENT / SOCIAL MEDIA',
    headline: 'GIVE PEOPLE A REASON TO PAY ATTENTION.',
    intro: 'Build a consistent social presence with useful content and a clear path from discovery to your website or offer.',
    points: [
      { title: 'Choose the right networks', description: 'Plan for Instagram, Facebook, LinkedIn, TikTok, YouTube, Pinterest, X (Twitter) and Threads. The right mix depends on your audience, offer, content format and the time you can sustain.' },
      { title: 'Content and channel planning', description: 'Define what each network is for, what to publish, how often and how content can be adapted across channels without simply reposting the same thing everywhere.' },
      { title: 'Creative and publishing', description: 'Develop practical post, short-video, story, carousel and longer-form ideas that fit your brand and the way people use each platform.' },
      { title: 'Community and response', description: 'Set expectations for comments, messages, moderation and escalation so customer conversations are handled consistently.' },
      { title: 'Paid social when it fits', description: 'Plan and test paid campaigns on relevant platforms, with clear audiences, creative variations, budget limits and a defined conversion goal.' },
      { title: 'Measure useful outcomes', description: 'Connect reach and engagement to visits, enquiries, sign-ups or sales. Use the results to adjust topics, formats, channels and campaign spend.' }
    ],
    deliverables: [
      { title: 'Channel plan', description: 'A platform mix, audience focus and publishing rhythm sized to your capacity.' },
      { title: 'Content themes', description: 'Repeatable topics tied to customer questions, expertise and offers.' },
      { title: 'Publishing calendar', description: 'A practical schedule with formats and channel-specific prompts.' },
      { title: 'Outcome review', description: 'Engagement considered alongside visits, enquiries, sign-ups or sales.' }
    ],
    flow: {
      title: 'From audience insight to a repeatable content loop',
      intro: 'Plan content for the people and platforms that fit the business, then learn from useful actions rather than reach alone.',
      steps: [
        { title: 'Choose audience and channels', description: 'Match audience needs and available capacity to suitable platforms.' },
        { title: 'Plan useful content', description: 'Choose themes, formats and a realistic publishing rhythm.' },
        { title: 'Publish and respond', description: 'Adapt each post to its platform and handle audience replies consistently.' },
        { title: 'Learn and refine', description: 'Review engagement, visits and enquiries to guide the next content cycle.' }
      ]
    },
    systemMap: {
      title: 'How a content loop connects',
      intro: 'Audience needs and business goals guide channel choices, content formats and publishing, with useful actions shaping the next cycle.',
      nodes: [
        { id: 'audience-needs', title: 'Audience needs', summary: 'Questions, interests and context', detail: 'Understand what the intended audience wants to learn, solve or decide before choosing a post topic.', examples: ['Common customer questions', 'Audience comments and messages', 'Searches and objections'], group: 'source' },
        { id: 'business-goals', title: 'Business goals', summary: 'The offer and next action', detail: 'Connect content to a relevant offer or next step without forcing every post into a sales message.', examples: ['Service or product focus', 'Brand priorities', 'Enquiry, booking or signup action'], group: 'source' },
        { id: 'capacity', title: 'Channel capacity', summary: 'Platforms and time available', detail: 'Choose a sustainable platform mix based on audience, content capabilities and the time available to publish and respond.', examples: ['Instagram or TikTok video', 'LinkedIn expertise posts', 'Available production and reply time'], group: 'source' },
        { id: 'content-themes', title: 'Content themes', summary: 'A useful, repeatable topic plan', detail: 'Group audience questions and business topics into themes that can support consistent publishing.', examples: ['Education and answers', 'Proof of process', 'Offer and product explainers'], group: 'work' },
        { id: 'formats', title: 'Platform formats', summary: 'Posts adapted to each channel', detail: 'Turn themes into suitable posts, short video, stories, carousels or longer-form content for selected platforms.', examples: ['Short-form video', 'Carousel or image post', 'Long-form professional update'], group: 'work' },
        { id: 'publishing', title: 'Publish and respond', summary: 'Consistent delivery and community care', detail: 'Publish on a realistic rhythm, adapt the message to the channel and handle comments or messages consistently.', examples: ['Editorial calendar', 'Platform-native copy', 'Comment and message response plan'], group: 'work' },
        { id: 'measurement', title: 'Useful measurement', summary: 'Visits, enquiries and other actions', detail: 'Review engagement alongside website visits, enquiries, sign-ups or sales where tracking is available.', examples: ['Link clicks and landing visits', 'Enquiry or signup actions', 'Content format comparisons'], group: 'work' },
        { id: 'next-cycle', title: 'Next content cycle', summary: 'Plan informed by what people did', detail: 'Use audience response and meaningful actions to adjust topics, formats, channels and publishing cadence.', examples: ['Repeat useful themes', 'Retire weak formats', 'Update the publishing rhythm'], group: 'outcome' }
      ],
      connections: [['audience-needs', 'content-themes'], ['business-goals', 'content-themes'], ['capacity', 'formats'], ['content-themes', 'formats'], ['formats', 'publishing'], ['publishing', 'measurement'], ['measurement', 'next-cycle']]
    }
  },
  'web-design-development': {
    slug: 'web-design-development',
    tab: 'web-design-development',
    title: 'Web Design & Development',
    description: 'Websites designed, built, fixed and maintained. New builds, redesigns, repairs, updates and software fixes without the need for a full project brief or business setup.',
    eyebrow: 'WEB DESIGN / DEVELOPMENT',
    headline: 'MAKE YOUR WEBSITE WORK.',
    intro: 'A better website, built or fixed. Design, development and repair for websites and software that need to look right, work properly and turn visitors into enquiries.',
    points: [
      { title: 'Web design', description: 'Clear, on-brand design that guides visitors towards the next step, with responsive layouts that work on mobile, tablet and desktop.' },
      { title: 'Website development', description: 'Fast, reliable websites built on modern foundations such as Next.js, React and WordPress, with clean code that is easy to update and maintain.' },
      { title: 'Fixes and repairs', description: 'Broken layouts, broken forms, slow pages, console errors and display issues diagnosed and fixed so the site works the way it should.' },
      { title: 'Software and system fixes', description: 'Bugs, crashes and performance problems in existing applications and software, repaired without rewriting what already works.' },
      { title: 'Redesigns and improvements', description: 'Refresh an existing site with a modern design, clearer structure, faster pages and content that performs like a website built today.' },
      { title: 'Updates and maintenance', description: 'Keep the site secure and current with regular updates, backups, monitoring and small improvements that compound over time.' }
    ],
    deliverables: [
      { title: 'Page and content structure', description: 'A clear sitemap, page priorities and content hierarchy shaped around customer tasks.' },
      { title: 'Responsive implementation', description: 'A considered mobile, tablet and desktop experience, tested across key breakpoints.' },
      { title: 'Working integrations', description: 'Forms, analytics, booking, payments or other agreed tools connected and checked.' },
      { title: 'Launch and handover', description: 'A tested release with practical editing notes, backups and maintenance options.' }
    ],
    flow: {
      title: 'From a website that works to one that works harder',
      intro: 'A practical cycle for websites and software: understand the problem, design or fix it, launch it, then keep improving.',
      steps: [
        { title: 'Find the problem', description: 'Understand what the site or software needs to achieve and what is currently holding it back.' },
        { title: 'Design or fix', description: 'Create the design, rebuild the page or repair the broken piece with a clear goal in mind.' },
        { title: 'Test and launch', description: 'Check on real devices, confirm the essentials work, then launch or hand over.' },
        { title: 'Maintain and improve', description: 'Keep it secure and current, measure how it performs and improve what matters.' }
      ]
    },
    systemMap: {
      title: 'How a working website stays connected',
      intro: 'Business goals, the current website and budget shape the design and build work, while testing, launch and maintenance keep it working over time.',
      nodes: [
        { id: 'business-goal', title: 'Business goal', summary: 'The outcome the site should support', detail: 'Clarify what the business needs the website or software to achieve, such as enquiries, bookings, sales or simply a clearer professional presence.', examples: ['More enquiries or bookings', 'Faster, clearer information', 'A more professional impression'], group: 'source' },
        { id: 'current-site', title: 'Current website or software', summary: 'What exists today and where it falls short', detail: 'Review the existing site or system to find broken elements, performance issues, outdated design or missing functionality.', examples: ['Broken forms or links', 'Slow page load times', 'Layout or mobile issues'], group: 'source' },
        { id: 'budget', title: 'Budget and priorities', summary: 'What matters most right now', detail: 'Agree on the scope that fits the budget, prioritising the fixes and improvements that will make the biggest difference.', examples: ['Fix first, redesign later', 'Priority pages or features', 'A realistic timeline'], group: 'source' },
        { id: 'design-build', title: 'Design and build', summary: 'The work that makes the goal real', detail: 'Design, build or repair the site or software against the agreed priorities, keeping it simple and maintainable.', examples: ['Responsive design', 'Modern development stack', 'Clean, updatable code'], group: 'work' },
        { id: 'testing', title: 'Testing', summary: 'Checked before it reaches customers', detail: 'Test everything on real devices and browsers, confirm forms and key actions work, and review against the original goal.', examples: ['Mobile and desktop checks', 'Form and checkout testing', 'Speed and accessibility review'], group: 'work' },
        { id: 'launch', title: 'Launch and handover', summary: 'Live and easy to manage', detail: 'Launch the change and hand over with clear, simple instructions so the business can manage its own content and not depend on a developer for every edit.', examples: ['Launch or deploy', 'Editing guidance', 'Backup and handover notes'], group: 'outcome' },
        { id: 'maintenance', title: 'Maintenance', summary: 'Secure, current and improving', detail: 'Regular updates, backups and monitoring keep the site secure, while small measured improvements build on what is working.', examples: ['Updates and backups', 'Uptime and performance checks', 'Small improvement rounds'], group: 'outcome' }
      ],
      connections: [['business-goal', 'design-build'], ['current-site', 'design-build'], ['budget', 'design-build'], ['design-build', 'testing'], ['testing', 'launch'], ['launch', 'maintenance']]
    }
  },
  'agency-development-partner': {
    slug: 'agency-development-partner',
    tab: 'agency-development-partner',
    title: 'White-Label Agency Development Partner',
    description: 'Dependable white-label web development and delivery support for agencies that need extra capacity, specialist implementation or a trusted overflow partner.',
    eyebrow: 'AGENCY PARTNER / WHITE-LABEL DEVELOPMENT',
    headline: 'YOUR DEVELOPMENT TEAM, EXTENDED.',
    intro: 'Add senior hands-on development capacity without adding permanent headcount. Work can sit behind your brand, plug into your process and scale around the projects already on your desk.',
    points: [
      { title: 'White-label delivery', description: 'Build under your agency brand, follow your client-facing conventions and keep communication clear about who owns each decision and deliverable.' },
      { title: 'Overflow project capacity', description: 'Take on a defined backlog, campaign build or delivery phase when your team is at capacity, with scope and handoff agreed before work begins.' },
      { title: 'Front-end and full-stack builds', description: 'Implement responsive websites, landing pages, CMS work and application features using the stack that fits the project and your existing team.' },
      { title: 'Rescue and specialist work', description: 'Investigate inherited code, unblock a stalled build, resolve complex bugs or add a capability your in-house team does not need to maintain full time.' },
      { title: 'A reliable working rhythm', description: 'Use your project tools, staging environment, review process and release cadence, with concise progress updates and early escalation of risks.' },
      { title: 'Clean handover', description: 'Document implementation choices, provide reviewable work and leave the project understandable for your team after delivery.' }
    ],
    deliverables: [
      { title: 'Scoped capacity', description: 'A defined set of tickets, sprint capacity or project milestones with clear acceptance criteria.' },
      { title: 'Reviewable implementation', description: 'Small, understandable changes delivered through your preferred repository and review workflow.' },
      { title: 'Status and risk updates', description: 'Visible progress, dependencies and decisions surfaced before they become surprises.' },
      { title: 'Agency-ready handoff', description: 'Release notes and technical context your team can confidently pass on or maintain.' }
    ],
    flow: {
      title: 'Extra capacity, integrated into your delivery',
      intro: 'A practical partner model: agree on the work, join the existing workflow, deliver in reviewable increments and hand the result back cleanly.',
      steps: [
        { title: 'Scope the gap', description: 'Review the project, backlog, stack, deadlines and client-facing boundaries.' },
        { title: 'Join your workflow', description: 'Agree tools, access, coding conventions, review points and communication cadence.' },
        { title: 'Deliver in increments', description: 'Build and test defined work in small pieces that your team can review.' },
        { title: 'Handover with context', description: 'Document what changed, remaining risks and the next useful step.' }
      ]
    },
    systemMap: {
      title: 'How a white-label partnership fits',
      intro: 'Your agency retains the client relationship and delivery direction; scoped implementation capacity joins the workflow and returns work your team can own.',
      nodes: [
        { id: 'client-goal', title: 'Client goal', summary: 'The outcome and delivery commitment', detail: 'Understand the client need, agreed outcome, deadlines and constraints before choosing an implementation approach.', examples: ['Project brief and acceptance criteria', 'Delivery milestone', 'Client-facing commitments'], group: 'source' },
        { id: 'agency-workflow', title: 'Agency workflow', summary: 'Tools, reviews and release process', detail: 'Fit into the agency’s established project, repository, communication and QA practices.', examples: ['Issue tracker and repository', 'Code review conventions', 'Staging and release process'], group: 'source' },
        { id: 'scope', title: 'Defined scope', summary: 'Work with clear boundaries', detail: 'Break the need into work that can be estimated, reviewed and accepted without blurring ownership.', examples: ['In-scope tickets', 'Dependencies and access', 'Definition of done'], group: 'work' },
        { id: 'implementation', title: 'Implementation', summary: 'Build, fix or extend', detail: 'Deliver the agreed web or software work in reviewable changes, raising blockers and risks early.', examples: ['Website and landing pages', 'Feature development', 'Bug fixes and integrations'], group: 'work' },
        { id: 'quality', title: 'Quality and review', summary: 'Evidence before handoff', detail: 'Check the work against acceptance criteria and the project’s existing quality process.', examples: ['Responsive checks', 'Regression review', 'Pull request notes'], group: 'work' },
        { id: 'agency-handoff', title: 'Agency-owned delivery', summary: 'Context returned to your team', detail: 'Return the implementation with enough technical and release context for the agency to own the next client conversation.', examples: ['Release notes', 'Known limitations', 'Next-step recommendations'], group: 'outcome' }
      ],
      connections: [['client-goal', 'scope'], ['agency-workflow', 'scope'], ['scope', 'implementation'], ['implementation', 'quality'], ['quality', 'agency-handoff']]
    }
  },
  'app-development': {
    slug: 'app-development',
    tab: 'app-development',
    title: 'iPhone and Android App Development',
    description: 'iPhone and Android app development for useful mobile products, from product discovery and MVPs to integrations, testing and release planning.',
    eyebrow: 'IPHONE / ANDROID APP DEVELOPMENT',
    headline: 'MOBILE APPS, BUILT FOR REAL USE.',
    intro: 'Turn a mobile product idea into a clear, testable app. Start with the user problem and the smallest useful release, then build the experience, backend and integrations around how people will actually use it.',
    points: [
      { title: 'Product discovery and MVP scope', description: 'Clarify the audience, core task and first-release boundary so the app solves a real problem before extra features inflate cost and complexity.' },
      { title: 'iPhone and Android experiences', description: 'Plan for both platforms, choosing a shared or platform-specific implementation based on product needs, device capabilities and long-term ownership.' },
      { title: 'UX and interface design', description: 'Map key journeys, navigation, empty states, errors and accessibility needs, then shape a focused interface around the actions users come to complete.' },
      { title: 'Backend, accounts and data', description: 'Connect the app to the right APIs, authentication, database and admin workflows, with clear handling for permissions and sensitive information.' },
      { title: 'Payments, notifications and integrations', description: 'Add agreed capabilities such as subscriptions, bookings, push notifications, maps, analytics or links to existing business systems.' },
      { title: 'Device testing and release support', description: 'Test important flows on representative devices, prepare release assets and guide the handoff for App Store and Google Play submission.' }
    ],
    deliverables: [
      { title: 'Product and MVP outline', description: 'A prioritised feature set, user journeys and release boundary for the first useful version.' },
      { title: 'Mobile interface', description: 'A cohesive set of screens and states shaped around the needs of iPhone and Android users.' },
      { title: 'Connected app foundations', description: 'Agreed APIs, authentication, data flows and integrations documented with the build.' },
      { title: 'Test and release checklist', description: 'Device coverage, key-flow checks and a practical store-submission handoff.' }
    ],
    flow: {
      title: 'From useful idea to release-ready app',
      intro: 'Keep the first release focused: validate the user journey, build the core experience, test it on devices and plan a responsible launch.',
      steps: [
        { title: 'Define the first release', description: 'Identify users, the core problem, platform needs and what can wait.' },
        { title: 'Design the key journeys', description: 'Map screens, data, permissions and edge cases before implementation.' },
        { title: 'Build and test', description: 'Implement the app and supporting services, then verify important flows on devices.' },
        { title: 'Prepare the release', description: 'Review store requirements, analytics, support needs and the next iteration.' }
      ]
    },
    systemMap: {
      title: 'How a mobile product comes together',
      intro: 'The user problem shapes journeys and platform choices; app, backend and integrations are tested together before release.',
      nodes: [
        { id: 'user-need', title: 'User need', summary: 'A task worth making easier', detail: 'Identify who will use the product, the context they are in and the task the app should help them complete.', examples: ['User interviews or existing feedback', 'Core job to be done', 'Accessibility and device context'], group: 'source' },
        { id: 'product-scope', title: 'MVP scope', summary: 'The smallest useful release', detail: 'Prioritise essential flows and defer optional features until the first release can be tested with real users.', examples: ['Must-have user journeys', 'iOS and Android requirements', 'Release assumptions'], group: 'work' },
        { id: 'mobile-app', title: 'Mobile experience', summary: 'Screens, navigation and states', detail: 'Design and implement the interface, including loading, error, empty and permission states.', examples: ['Onboarding and account flows', 'Core task screens', 'Responsive device layouts'], group: 'work' },
        { id: 'services', title: 'Backend and APIs', summary: 'Data, identity and integrations', detail: 'Connect the application to secure data services, authentication and the external systems it needs.', examples: ['API and database', 'User identity and permissions', 'Payments or notifications'], group: 'work' },
        { id: 'device-quality', title: 'Device quality', summary: 'Key flows checked in context', detail: 'Test performance, usability and important app journeys on representative devices and operating system versions.', examples: ['iPhone and Android device checks', 'Network and error handling', 'Analytics event validation'], group: 'work' },
        { id: 'release', title: 'Release and learning', summary: 'A launch that can improve', detail: 'Prepare store submission and support basics, then use feedback and product events to prioritise the next release.', examples: ['Store listing and review checklist', 'Crash and usage monitoring', 'Post-release improvement backlog'], group: 'outcome' }
      ],
      connections: [['user-need', 'product-scope'], ['product-scope', 'mobile-app'], ['product-scope', 'services'], ['mobile-app', 'device-quality'], ['services', 'device-quality'], ['device-quality', 'release']]
    }
  },
  'ai-automation': {
    slug: 'ai-automation',
    tab: 'ai-automation',
    title: 'AI Integration and Business Automation',
    description: 'Practical AI integrations and business process automation that connect your existing tools, reduce repetitive work and keep people in control.',
    eyebrow: 'AI INTEGRATION / BUSINESS AUTOMATION',
    headline: 'AUTOMATE THE WORK THAT SLOWS YOU DOWN.',
    intro: 'Use AI where it makes a real process better. Connect the tools you already use, remove repetitive handoffs and add human review where accuracy, privacy or judgement matters.',
    points: [
      { title: 'Process discovery', description: 'Map how work moves today, who handles each step, where information gets re-entered and which exceptions still need a person.' },
      { title: 'AI inside existing workflows', description: 'Add summarisation, classification, drafting, extraction or natural-language search to a process where the input and expected output can be checked.' },
      { title: 'Business system integrations', description: 'Connect CRM, email, forms, databases, calendars and APIs so information moves between systems without brittle copy-and-paste routines.' },
      { title: 'Human review and safeguards', description: 'Set confidence checks, approval points, fallbacks and audit trails so important decisions remain visible and reversible.' },
      { title: 'Internal tools and assistants', description: 'Build focused dashboards, knowledge assistants or task interfaces that give teams useful access to approved data and actions.' },
      { title: 'Monitoring and iteration', description: 'Track completion, exceptions, time saved and output quality. Refine the workflow using real operating evidence, not an AI demo alone.' }
    ],
    deliverables: [
      { title: 'Process map', description: 'A before-and-after view of systems, manual steps, exceptions and human approvals.' },
      { title: 'Working integration', description: 'A tested connection between agreed tools, with clear handling for failures and retries.' },
      { title: 'AI task with guardrails', description: 'A bounded AI capability with defined inputs, output checks and escalation paths.' },
      { title: 'Operational handover', description: 'Monitoring, ownership and improvement measures your team can use after launch.' }
    ],
    flow: {
      title: 'Automate a real process, not just a demo',
      intro: 'Start with the repetitive task, connect the right systems, keep decisions reviewable and measure whether the new process is genuinely better.',
      steps: [
        { title: 'Map the current work', description: 'Document triggers, tools, handoffs, exceptions and the time involved.' },
        { title: 'Choose the right intervention', description: 'Decide whether rules, integration, AI or a combination fits the task.' },
        { title: 'Build with controls', description: 'Add permissions, validation, human approval and failure handling.' },
        { title: 'Measure in operation', description: 'Review time, completion, exceptions and output quality after launch.' }
      ]
    },
    systemMap: {
      title: 'How practical automation works',
      intro: 'An existing business process becomes a connected workflow with explicit checks, human decisions and operating measures.',
      nodes: [
        { id: 'manual-process', title: 'Current process', summary: 'Tasks, handoffs and repeated work', detail: 'Understand the workflow as it actually operates, including exceptions and the information people re-enter.', examples: ['Email and spreadsheet handoffs', 'Repeated data entry', 'Approval and exception paths'], group: 'source' },
        { id: 'business-systems', title: 'Existing systems', summary: 'Tools and data already in use', detail: 'Identify the systems that own the data and the supported ways they can be connected.', examples: ['CRM and email', 'Forms and databases', 'Document stores and APIs'], group: 'source' },
        { id: 'workflow-design', title: 'Workflow design', summary: 'Triggers, rules and ownership', detail: 'Define what starts the process, which steps are deterministic, where AI helps and who owns exceptions.', examples: ['Event triggers', 'Business rules', 'Escalation and retry paths'], group: 'work' },
        { id: 'ai-capability', title: 'AI capability', summary: 'A bounded task with checks', detail: 'Use a model for a specific task and validate its output before it can affect important business records or decisions.', examples: ['Document extraction', 'Message classification', 'Drafting with human approval'], group: 'work' },
        { id: 'human-control', title: 'Human control', summary: 'Review and approval points', detail: 'Keep people involved where judgement, confidence, compliance or customer impact requires a decision.', examples: ['Confidence thresholds', 'Approval queues', 'Audit and correction history'], group: 'work' },
        { id: 'measured-workflow', title: 'Measured workflow', summary: 'Visible quality and operating impact', detail: 'Monitor successful completions, exceptions, processing time and quality to guide safe iteration.', examples: ['Completion and exception rate', 'Time per task', 'Output review and correction rate'], group: 'outcome' }
      ],
      connections: [['manual-process', 'workflow-design'], ['business-systems', 'workflow-design'], ['workflow-design', 'ai-capability'], ['ai-capability', 'human-control'], ['human-control', 'measured-workflow']]
    }
  }
};