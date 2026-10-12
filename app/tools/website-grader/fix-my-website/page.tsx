import type { Metadata } from 'next';
import App from '@/src/App';

const title = 'Fix My Website | Request Fixes From Your Website Audit';
const description = 'Send your Website Grader scan with your contact details and the issues you want fixed. Receive a clear, no-obligation plan to repair your website.';

export const metadata: Metadata = {
  title,
  description,
  keywords: ['fix my website', 'website audit fixes', 'SEO fixes', 'website repairs', 'website optimisation help'],
  alternates: { canonical: '/tools/website-grader/fix-my-website' },
  openGraph: { type: 'website', title, description, url: '/tools/website-grader/fix-my-website' },
  twitter: { card: 'summary', title, description }
};

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://christopherjcallaghan.com/tools/website-grader/fix-my-website',
      name: title,
      description,
      url: 'https://christopherjcallaghan.com/tools/website-grader/fix-my-website'
    }
  ]
};

export default function GraderFixPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
      />
      <App initialTab="website-grader-fix" />
    </>
  );
}
