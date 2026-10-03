import type { Metadata } from 'next';
import App from '@/src/App';
import { PROJECTS_DATA } from '@/src/data/portfolioData';

const title = 'Web Development Projects and Case Studies | Christopher J. Callaghan';
const description = 'Explore full-stack platforms, e-commerce systems, AI products, APIs and digital experiences built by Christopher J. Callaghan.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/projects' },
  openGraph: { type: 'website', title, description, url: '/projects', images: ['/assets/cjc-social-preview.svg'] },
  twitter: { card: 'summary_large_image', title, description, images: ['/assets/cjc-social-preview.svg'] }
};

export default function ProjectsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: 'https://christopherjcallaghan.com/projects',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: PROJECTS_DATA.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: project.title,
          description: project.description,
          creator: { '@type': 'Person', name: 'Christopher J. Callaghan' }
        }
      }))
    }
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} /><App initialTab="projects" /></>;
}