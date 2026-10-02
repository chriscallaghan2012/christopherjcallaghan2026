import { PublicPageTab } from '../types';

export interface PublicPage {
  slug: string;
  tab: PublicPageTab;
  title: string;
  description: string;
  eyebrow: string;
  headline: string;
  intro: string;
  points?: string[];
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
      'Technical foundations: site structure, indexing, performance and structured data.',
      'Useful pages built around real customer questions and services.',
      'Search visibility across Google and emerging AI search experiences.',
      'Measurement tied to visits, enquiries and business goals.'
    ]
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
      'Google Business Profile setup and information updates.',
      'Service areas, categories, hours and contact details kept consistent.',
      'Local landing pages that explain what you offer and where you work.',
      'Clear routes from search results to calls, visits and enquiries.'
    ]
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
      'Google Ads campaign and keyword structure.',
      'Landing pages shaped around the campaign and customer intent.',
      'Conversion tracking for enquiries, purchases and other useful actions.',
      'Ongoing review of search terms, creative and campaign performance.'
    ]
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
      'Channel and content planning around your audience and capacity.',
      'Content themes, campaign ideas and a practical publishing rhythm.',
      'Paid social campaign setup and creative testing where it fits.',
      'Links and landing pages that turn interest into the next step.'
    ]
  }
};