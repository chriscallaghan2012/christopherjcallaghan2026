import type { Metadata } from 'next';
import App from '@/src/App';

const title = 'Free SERP Preview & On-Page SEO Checker';
const description = 'Scan a public page to read its title and meta description, preview a Google-style search result, and get a prioritised on-page SEO checklist.';

export const metadata: Metadata = {
  title,
  description,
  keywords: ['SERP preview tool', 'Google snippet preview', 'meta title checker', 'meta description preview'],
  alternates: { canonical: '/tools/serp-preview' },
  openGraph: { type: 'website', title, description, url: '/tools/serp-preview' },
  twitter: { card: 'summary', title, description }
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SERP Preview Tool',
  description,
  url: 'https://christopherjcallaghan.com/tools/serp-preview',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  isAccessibleForFree: true
};

export default function SerpPreviewPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
      />
      <App initialTab="serp-preview" />
    </>
  );
}