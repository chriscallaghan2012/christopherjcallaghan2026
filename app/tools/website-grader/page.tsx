import type { Metadata } from 'next';
import App from '@/src/App';

const title = 'Free Website Grader | SEO, AI Search & Performance Audit | Christopher J. Callaghan';
const description = 'Grade any public website in seconds: scored checks across technical SEO, AI search readiness, performance, accessibility and security — with prioritised fixes you can act on. Free, no account required.';

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
      name: 'Website Grader',
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
