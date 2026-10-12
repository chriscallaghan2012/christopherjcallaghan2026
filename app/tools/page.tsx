import type { Metadata } from 'next';
import App from '@/src/App';

const title = 'Free Website Tools | Christopher J. Callaghan';
const description = 'Free, no-account website tools — start with the Website Grader for a scored audit of SEO, AI search readiness, performance, accessibility and security, with prioritised fixes.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/tools' },
  openGraph: { type: 'website', title, description, url: '/tools' },
  twitter: { card: 'summary', title, description }
};

export default function ToolsPage() {
  return <App initialTab="tools" />;
}
