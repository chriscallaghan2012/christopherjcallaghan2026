import type { Metadata } from 'next';
import App from '@/src/App';

const title = 'Free SERP Preview Tool | Google Search Snippet Preview';
const description = 'Preview your page title and meta description in Google-style desktop and mobile search results. Check estimated pixel widths and copy your meta tags.';

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