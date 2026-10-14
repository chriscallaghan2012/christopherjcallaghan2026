import type { Metadata } from 'next';
import App from '@/src/App';

const title = 'AI eCommerce Readiness Report | Product Page Checker | Christopher J. Callaghan';
const description = 'Check a public product page for observable metadata, canonical, images and Product structured data. Evidence-led findings with clear limitations; no claims about AI recommendation visibility.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/tools/ai-ecommerce-report' },
  openGraph: { type: 'website', title, description, url: '/tools/ai-ecommerce-report' },
  twitter: { card: 'summary', title, description }
};

export default function AiEcommerceReportPage() {
  return <App initialTab="ai-ecommerce-report" />;
}
