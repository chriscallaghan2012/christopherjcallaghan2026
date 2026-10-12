import type { Metadata } from 'next';
import App from '@/src/App';

const title = 'Free llms.txt Builder | AI Search Website Guide | Christopher J. Callaghan';
const description = 'Create a clear llms.txt file for your website. Organise important pages, describe your business accurately, then preview and download the finished text file.';

export const metadata: Metadata = {
  title,
  description,
  keywords: ['llms.txt builder', 'AI search file generator', 'llms.txt generator', 'website AI guide'],
  alternates: { canonical: '/tools/llms-txt' },
  openGraph: { type: 'website', title, description, url: '/tools/llms-txt' },
  twitter: { card: 'summary', title, description }
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'llms.txt Builder',
  description,
  url: 'https://christopherjcallaghan.com/tools/llms-txt',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  isAccessibleForFree: true
};

export default function LlmsTxtBuilderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
      />
      <App initialTab="llms-builder" />
    </>
  );
}