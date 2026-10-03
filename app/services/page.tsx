import type { Metadata } from 'next';
import App from '@/src/App';

const title = 'Web, Software and AI Development Services | Christopher J. Callaghan';
const description = 'Plan and build websites, apps, custom software, AI tools and automation with an independent full-stack developer in Manchester.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/services' },
  openGraph: { type: 'website', title, description, url: '/services', images: ['/assets/cjc-social-preview.svg'] },
  twitter: { card: 'summary_large_image', title, description, images: ['/assets/cjc-social-preview.svg'] }
};

export default function ServicesPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Website, software and AI development',
    serviceType: ['Website development', 'Application development', 'Custom software', 'AI and automation'],
    description,
    provider: { '@type': 'Person', name: 'Christopher J. Callaghan', url: 'https://christopherjcallaghan.com' },
    areaServed: [{ '@type': 'City', name: 'Manchester' }, { '@type': 'Country', name: 'United Kingdom' }],
    url: 'https://christopherjcallaghan.com/services'
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} /><App initialTab="services" /></>;
}