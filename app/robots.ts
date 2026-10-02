import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/email-sandbox']
    },
    sitemap: 'https://christopherjcallaghan.com/sitemap.xml'
  };
}