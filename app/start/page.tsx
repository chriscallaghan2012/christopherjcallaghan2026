import type { Metadata } from 'next';
import App from '@/src/App';

const title = 'Start a Business | Christopher J. Callaghan';
const description = 'Turn a business idea into a clear plan, launch and digital foundations. Get practical support with business setup, branding, websites, marketing and growth.';

export const metadata: Metadata = {
  title,
  description,
  keywords: ['start a business', 'business planning', 'business setup', 'startup website', 'Manchester business support'],
  alternates: { canonical: '/start' },
  openGraph: { type: 'website', title, description, url: '/start' },
  twitter: { card: 'summary_large_image', title, description }
};

export default function StartPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: title,
        description,
        url: 'https://christopherjcallaghan.com/start',
        mainEntity: { '@id': 'https://christopherjcallaghan.com/start#service' }
      },
      {
        '@type': 'Service',
        '@id': 'https://christopherjcallaghan.com/start#service',
        name: 'Business startup planning and digital setup',
        serviceType: ['Business planning', 'Business setup', 'Brand and website development', 'Marketing and launch planning'],
        provider: { '@type': 'Person', name: 'Christopher J. Callaghan', url: 'https://christopherjcallaghan.com' },
        areaServed: [{ '@type': 'Country', name: 'United Kingdom' }, { '@type': 'City', name: 'Manchester' }],
        url: 'https://christopherjcallaghan.com/start'
      }
    ]
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><App initialTab="start" /></>;
}