import type { MetadataRoute } from 'next';
import { PUBLIC_PAGES } from '@/src/data/sitePages';
import { listPublishedBlogPosts } from '@/lib/database';

const SITE_URL = 'https://christopherjcallaghan.com';
export const dynamic = 'force-dynamic';

function parseSitemapDate(value: string): Date | undefined {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listPublishedBlogPosts();
  return [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/build`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/start`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/package`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/classes`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/projects`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/services`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/security-malware-removal`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE_URL}/expertise`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/tools`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/tools/website-grader`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/tools/llms-txt`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/tools/business-launch-checklist`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/tools/structured-data-validator`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/tools/ai-ecommerce-report`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    ...Object.values(PUBLIC_PAGES).map((page) => ({
      url: `${SITE_URL}/${page.slug}`,
      changeFrequency: 'monthly' as const,
      priority: page.tab === 'contact' ? 0.8 : 0.7
    })),
    ...posts.map((post) => {
      const lastModified = parseSitemapDate(post.updatedAt);
      return {
        url: `${SITE_URL}/blog/${post.slug}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: 'monthly' as const,
        priority: 0.6
      };
    })
  ];
}