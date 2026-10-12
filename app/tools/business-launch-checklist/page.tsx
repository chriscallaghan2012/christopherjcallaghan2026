import type { Metadata } from 'next';
import App from '@/src/App';

const title = 'Free Business Launch Checklist | Christopher J. Callaghan';
const description = 'Build a practical checklist for starting, launching or improving a small business. Get plain-language next steps tailored to your stage, offer and sales plans.';

export const metadata: Metadata = {
  title,
  description,
  keywords: ['business launch checklist', 'start a business checklist', 'small business planner', 'business relaunch plan'],
  alternates: { canonical: '/tools/business-launch-checklist' },
  openGraph: { type: 'website', title, description, url: '/tools/business-launch-checklist' },
  twitter: { card: 'summary', title, description }
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Business Launch Checklist',
  description,
  url: 'https://christopherjcallaghan.com/tools/business-launch-checklist',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  isAccessibleForFree: true
};

export default function BusinessLaunchChecklistPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <App initialTab="business-launch-checklist" />
    </>
  );
}