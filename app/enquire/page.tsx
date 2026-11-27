import type { Metadata } from 'next';
import { EnquiryLanding } from '@/src/components/EnquiryLanding';

export const metadata: Metadata = {
  title: 'Project Enquiries | Web Development, SEO & AI | Christopher J. Callaghan',
  description: 'Discuss your next website, web application, SEO campaign, Google Maps visibility or AI automation project. Based in Manchester, working with businesses across the UK.',
  keywords: [
    'web development enquiries Manchester',
    'website developer Manchester',
    'SEO services Manchester',
    'Google Maps optimisation',
    'Google Business Profile support',
    'AI automation developer UK',
    'custom software development UK'
  ],
  alternates: { canonical: '/enquire' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: 'https://christopherjcallaghan.com/enquire',
    title: 'Start a Project | Christopher J. Callaghan',
    description: 'Web development, SEO, Google Maps, software and practical AI automation. Tell me what you want to improve or build.',
    siteName: 'Christopher J. Callaghan',
    images: [{ url: '/assets/cjc-social-preview.svg', width: 1200, height: 630, alt: 'Christopher J. Callaghan — Project enquiries' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Start a Project | Christopher J. Callaghan',
    description: 'Web development, SEO, Google Maps, software and AI automation. Tell me what you have in mind.',
    images: ['/assets/cjc-social-preview.svg']
  }
};

export default function EnquirePage() {
  return <EnquiryLanding />;
}
