import type { Metadata } from 'next';
import App from '@/src/App';

const title = 'Business Startup and Growth Support | Christopher J. Callaghan';
const description = 'Bring your business idea together with practical planning, setup, funding, branding, websites, marketing and growth support.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/package' },
  openGraph: { type: 'website', title, description, url: '/package', images: ['/assets/cjc-social-preview.svg'] },
  twitter: { card: 'summary_large_image', title, description, images: ['/assets/cjc-social-preview.svg'] }
};

export default function PackagePage() {
  return <App initialTab="package" />;
}
