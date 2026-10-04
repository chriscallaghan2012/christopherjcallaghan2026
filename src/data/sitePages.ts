import { PublicPageTab } from '../types';
import type { ProcessFlowContent } from '../types';

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
    }
  }
};