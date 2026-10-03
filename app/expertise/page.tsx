import type { Metadata } from 'next';
import App from '@/src/App';

const title = 'Full-Stack Development and Technical Expertise | Christopher J. Callaghan';
const description = 'Explore practical expertise across web development, software architecture, e-commerce, APIs, AI, automation and digital product delivery.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/expertise' },
  openGraph: { type: 'website', title, description, url: '/expertise', images: ['/assets/cjc-social-preview.svg'] },
  twitter: { card: 'summary_large_image', title, description, images: ['/assets/cjc-social-preview.svg'] }
};

export default function ExpertisePage() {
  return <App initialTab="expertise" />;
}