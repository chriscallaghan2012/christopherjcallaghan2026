import type { Metadata } from 'next';
import App from '@/src/App';

const title = 'Website Grader & AI SEO Audit | Free Website SEO Checker | Christopher J. Callaghan';
const description = 'Run a free website, SEO and AI search readiness audit. Check technical SEO, crawlability, structured data, performance signals, accessibility and security, with evidence-led scores and prioritised fixes. No account required.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'website grader',
    'free website audit',
    'SEO audit tool',
    'AI search readiness',
    'website performance check',
    'accessibility checker',
    'security header check'
  ],
  alternates: { canonical: '/tools/website-grader' },
  openGraph: { type: 'website', title, description, url: '/tools/website-grader' },
  twitter: { card: 'summary', title, description }
};

const PERSON_ID = 'https://christopherjcallaghan.com/#person';

const websiteGraderSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://christopherjcallaghan.com/tools/website-grader#application',
      name: 'Website Grader — SEO & AI Search Audit',
      description,
      url: 'https://christopherjcallaghan.com/tools/website-grader',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      browserRequirements: 'Requires JavaScript',
      isAccessibleForFree: true,
      author: { '@id': PERSON_ID },
      publisher: { '@id': PERSON_ID }
    },
    {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: 'Christopher J. Callaghan',
      url: 'https://christopherjcallaghan.com',
      jobTitle: 'Full-Stack Developer, AI Builder and Business Creator'
    }
  ]
};

export default function WebsiteGraderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteGraderSchema).replace(/</g, '\\u003c') }}
      />
      <App initialTab="website-grader" />
    </>
  );
}
