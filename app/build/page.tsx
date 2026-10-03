import type { Metadata } from 'next';
import App from '@/src/App';

const title = 'Build a Website, App or Software | Christopher J. Callaghan';
const description = 'Plan and build a website, app, software product or AI system with Christopher J. Callaghan. Start with the outcome you want, then shape the right solution.';

export const metadata: Metadata = {
  title,
  description,
  keywords: ['website development', 'app development', 'custom software', 'AI development', 'Manchester developer'],
  alternates: { canonical: '/build' },
  openGraph: { type: 'website', title, description, url: '/build' },
  twitter: { card: 'summary_large_image', title, description }
};

type BuildPageProps = {
  searchParams: Promise<{ service?: string | string[] }>;
};

export default async function BuildPage({ searchParams }: BuildPageProps) {
  const { service } = await searchParams;
  const initialService = service === 'seo' || service === 'google-maps' || service === 'ppc' ? service : undefined;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: title,
        description,
        url: 'https://christopherjcallaghan.com/build',
        mainEntity: { '@id': 'https://christopherjcallaghan.com/build#service' }
      },
      {
        '@type': 'Service',
        '@id': 'https://christopherjcallaghan.com/build#service',
        name: 'Digital product development',
        serviceType: ['Website development', 'App development', 'Custom software', 'AI and automation'],
        provider: { '@type': 'Person', name: 'Christopher J. Callaghan', url: 'https://christopherjcallaghan.com' },
        areaServed: [{ '@type': 'Country', name: 'United Kingdom' }, { '@type': 'City', name: 'Manchester' }],
        url: 'https://christopherjcallaghan.com/build'
      }
    ]
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><App initialTab="build" initialService={initialService} /></>;
}