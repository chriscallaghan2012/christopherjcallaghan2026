import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import App from '@/src/App';
import { PUBLIC_PAGES } from '@/src/data/sitePages';

type PublicPageRouteProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(PUBLIC_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PublicPageRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const page = PUBLIC_PAGES[slug];
  if (!page) notFound();

  return {
    title: `${page.title} | Christopher J. Callaghan`,
    description: page.description,
    alternates: { canonical: `/${page.slug}` },
    openGraph: {
      title: `${page.title} | Christopher J. Callaghan`,
      description: page.description,
      url: `/${page.slug}`
    }
  };
}

export default async function PublicPageRoute({ params }: PublicPageRouteProps) {
  const { slug } = await params;
  const page = PUBLIC_PAGES[slug];
  if (!page) notFound();

  return <App initialTab={page.tab} />;
}