import type { MetadataRoute } from 'next';
import { PUBLIC_PAGES } from '@/src/data/sitePages';

const SITE_URL = 'https://christopherjcallaghan.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/build`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/start`, changeFrequency: 'monthly', priority: 0.9 },
    ...Object.values(PUBLIC_PAGES).map((page) => ({
      url: `${SITE_URL}/${page.slug}`,
      changeFrequency: 'monthly' as const,
      priority: page.tab === 'contact' ? 0.8 : 0.7
    }))
  ];
}