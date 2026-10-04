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
  seo: {
    slug: 'seo',
    tab: 'seo',
    title: 'SEO Services',
    description: 'Technical SEO, useful content and search-focused websites to help the right people find your business.',
    eyebrow: 'SEARCH / SEO',
    headline: 'BE EASIER TO FIND.',
    intro: 'Make your website clearer to search engines and more useful to the people looking for what you do.',
    points: [
      { title: 'Technical foundations', description: 'Review crawling, indexing, site structure, page speed, mobile usability, redirects and structured data. Fix the barriers that stop important pages from being understood and surfaced.' },
      { title: 'Search and content strategy', description: 'Map the services you offer to the terms and questions real customers use. Build or improve useful pages around that intent instead of publishing filler for search engines.' },
      { title: 'On-page improvements', description: 'Improve page titles, headings, internal links, snippets and calls to action so each page is clear to both search engines and people deciding who to contact.' },
      { title: 'Local and wider visibility', description: 'Connect your service pages, locations and business details so local search and broader organic search reinforce each other.' },
      { title: 'Measurement and iteration', description: 'Use search impressions, relevant visits and completed enquiries to see what is improving, find gaps and decide what to work on next.' }
    ],
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
        { id: 'queries', title: 'Search demand', summary: 'Queries and customer questions', detail: 'Search terms and questions reveal the language people use and the intent behind a visit.', group: 'source' },
        { id: 'site-state', title: 'Current website', summary: 'Structure, speed and indexability', detail: 'The existing website is reviewed for crawl access, indexability, mobile usability, page speed and structural issues.', group: 'source' },
        { id: 'intent-map', title: 'Intent map', summary: 'Queries matched to useful pages', detail: 'Group related searches by intent, then map them to the most useful existing or planned page.', group: 'work' },
        { id: 'technical-fixes', title: 'Technical fixes', summary: 'Crawl, structure and performance', detail: 'Resolve technical barriers that prevent important pages from loading well or being understood and indexed.', group: 'work' },
        { id: 'page-content', title: 'On-page content', summary: 'Titles, headings and answers', detail: 'Shape page titles, headings, copy and calls to action around the visitor’s question and next step.', group: 'work' },
        { id: 'internal-links', title: 'Internal links', summary: 'Clear paths between relevant pages', detail: 'Connect related service, location and supporting pages so visitors and crawlers can follow the site structure.', group: 'work' },
        { id: 'search-pages', title: 'Search-ready pages', summary: 'Useful, connected landing pages', detail: 'The result is a set of technically accessible pages that answer search intent and give visitors a clear next action.', group: 'outcome' }
      ],
      connections: [['queries', 'intent-map'], ['site-state', 'technical-fixes'], ['intent-map', 'page-content'], ['technical-fixes', 'page-content'], ['page-content', 'internal-links'], ['internal-links', 'search-pages']]
    }
  },
  'google-maps': {
    slug: 'google-maps',
    tab: 'google-maps',
    title: 'Google Maps and Local Search',
    description: 'Google Business Profile and local search support to help nearby customers find accurate information about your business.',
    eyebrow: 'LOCAL SEARCH / GOOGLE MAPS',
    headline: 'SHOW UP WHERE PEOPLE LOOK.',
    intro: 'Build a clearer local presence across Google Search and Maps, backed by accurate business information and useful location pages.',
    points: [
      { title: 'Google Business Profile', description: 'Set up or improve your profile with accurate categories, services, opening hours, contact details, photos and links that match how customers search.' },
      { title: 'Local information that agrees', description: 'Keep your business name, address or service area, phone number and website consistent wherever customers encounter them.' },
      { title: 'Service-area pages', description: 'Create useful pages that explain what you do and where you work. Each page should answer local questions and give visitors a clear next step, not just repeat a town name.' },
      { title: 'Reviews and customer actions', description: 'Make it easier for customers to call, request directions, visit your site or leave feedback, with clear processes for responding to reviews.' },
      { title: 'Local performance', description: 'Track profile interactions, website visits, calls and enquiries to understand which locations and services are generating interest.' }
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
        { id: 'profile', title: 'Business Profile', summary: 'Categories, services, hours and links', detail: 'The profile is checked for correct categories, services, opening hours, contact details, photos and destination links.', group: 'source' },
        { id: 'business-data', title: 'Business information', summary: 'Name, address or service area, phone', detail: 'Core business details are compared with the website and important directories to identify inconsistencies.', group: 'source' },
        { id: 'profile-update', title: 'Profile updates', summary: 'Accurate, complete listing', detail: 'Profile fields are improved so people can understand what the business does and how to contact or visit it.', group: 'work' },
        { id: 'consistency', title: 'Local consistency', summary: 'Matching details across the web', detail: 'Business name, address or service area, phone number and web links are aligned across key sources.', group: 'work' },
        { id: 'location-pages', title: 'Location pages', summary: 'Useful local service information', detail: 'Pages answer real location and service questions instead of repeating place names without useful detail.', group: 'work' },
        { id: 'customer-actions', title: 'Customer actions', summary: 'Calls, directions and visits', detail: 'Clear calls to action make it straightforward to call, request directions or continue to the relevant service page.', group: 'work' },
        { id: 'local-discovery', title: 'Local discovery', summary: 'A coherent presence in Search and Maps', detail: 'The profile and website present consistent information and give nearby customers a clear next step.', group: 'outcome' }
      ],
      connections: [['profile', 'profile-update'], ['business-data', 'consistency'], ['profile-update', 'location-pages'], ['consistency', 'location-pages'], ['location-pages', 'customer-actions'], ['customer-actions', 'local-discovery']]
    }
  },
  ppc: {
    slug: 'ppc',
    tab: 'ppc',
    title: 'PPC and Paid Advertising',
    description: 'Paid search campaigns connected to relevant landing pages, conversion tracking and business goals.',
    eyebrow: 'PAID SEARCH / PPC',
    headline: 'REACH THE RIGHT PEOPLE.',
    intro: 'Plan paid campaigns around a clear offer, a useful landing page and measurement you can act on.',
    points: [
      { title: 'Campaign strategy', description: 'Set a clear objective, audience, location, offer and budget before choosing campaign types. Separate different services and customer intent so results are easier to understand.' },
      { title: 'Account and keyword structure', description: 'Organise Google Ads campaigns and ad groups around relevant searches. Use match types, exclusions and search-term reviews to reduce spend on the wrong clicks.' },
      { title: 'Ads and landing pages', description: 'Write useful, specific ad messages and connect each campaign to a page that matches the promise, answers likely questions and makes the next action obvious.' },
      { title: 'Conversion measurement', description: 'Configure and test measurement for meaningful actions such as qualified enquiries, calls, bookings or purchases, rather than treating every visit as a result.' },
      { title: 'Ongoing optimisation', description: 'Review spend, search terms, conversions and landing-page performance together. Use the evidence to refine targeting and budget, not just chase clicks.' }
    ],
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
        { id: 'offer', title: 'Offer and goal', summary: 'The action the campaign should support', detail: 'Define the service or offer and the meaningful action to measure, such as a qualified enquiry, call or booking.', group: 'source' },
        { id: 'audience', title: 'Audience and location', summary: 'Who the campaign should reach', detail: 'Set the relevant audience and geographic boundaries before building targeting or selecting keywords.', group: 'source' },
        { id: 'search-intent', title: 'Search intent', summary: 'Terms aligned with readiness', detail: 'Review the searches people use and separate relevant intent from terms unlikely to lead to the desired action.', group: 'source' },
        { id: 'campaign', title: 'Campaign structure', summary: 'Keywords, groups and exclusions', detail: 'Organise campaigns and ad groups around related intent, with exclusions to reduce irrelevant clicks.', group: 'work' },
        { id: 'ad-page', title: 'Ad and landing page', summary: 'One consistent message', detail: 'Match the ad promise to a useful landing page with clear information and an obvious next step.', group: 'work' },
        { id: 'tracking', title: 'Conversion tracking', summary: 'Measure meaningful actions', detail: 'Configure and test measurement for the campaign’s chosen business outcome.', group: 'work' },
        { id: 'optimisation', title: 'Testing and review', summary: 'Search terms, spend and outcomes', detail: 'Review actual search terms and conversion data before adjusting budget, bids or creative.', group: 'work' },
        { id: 'measured-actions', title: 'Measured actions', summary: 'Campaign activity tied to the goal', detail: 'A connected campaign makes it possible to compare spend with the actions it was designed to generate.', group: 'outcome' }
      ],
      connections: [['offer', 'ad-page'], ['audience', 'campaign'], ['search-intent', 'campaign'], ['campaign', 'ad-page'], ['ad-page', 'tracking'], ['tracking', 'optimisation'], ['optimisation', 'measured-actions']]
    }
  },
  'social-media': {
    slug: 'social-media',
    tab: 'social-media',
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
        { id: 'audience-needs', title: 'Audience needs', summary: 'Questions, interests and context', detail: 'Understand what the intended audience wants to learn, solve or decide before choosing a post topic.', group: 'source' },
        { id: 'business-goals', title: 'Business goals', summary: 'The offer and next action', detail: 'Connect content to a relevant offer or next step without forcing every post into a sales message.', group: 'source' },
        { id: 'capacity', title: 'Channel capacity', summary: 'Platforms and time available', detail: 'Choose a sustainable platform mix based on audience, content capabilities and the time available to publish and respond.', group: 'source' },
        { id: 'content-themes', title: 'Content themes', summary: 'A useful, repeatable topic plan', detail: 'Group audience questions and business topics into themes that can support consistent publishing.', group: 'work' },
        { id: 'formats', title: 'Platform formats', summary: 'Posts adapted to each channel', detail: 'Turn themes into suitable posts, short video, stories, carousels or longer-form content for selected platforms.', group: 'work' },
        { id: 'publishing', title: 'Publish and respond', summary: 'Consistent delivery and community care', detail: 'Publish on a realistic rhythm, adapt the message to the channel and handle comments or messages consistently.', group: 'work' },
        { id: 'measurement', title: 'Useful measurement', summary: 'Visits, enquiries and other actions', detail: 'Review engagement alongside website visits, enquiries, sign-ups or sales where tracking is available.', group: 'work' },
        { id: 'next-cycle', title: 'Next content cycle', summary: 'Plan informed by what people did', detail: 'Use audience response and meaningful actions to adjust topics, formats, channels and publishing cadence.', group: 'outcome' }
      ],
      connections: [['audience-needs', 'content-themes'], ['business-goals', 'content-themes'], ['capacity', 'formats'], ['content-themes', 'formats'], ['formats', 'publishing'], ['publishing', 'measurement'], ['measurement', 'next-cycle']]
    }
  }
};