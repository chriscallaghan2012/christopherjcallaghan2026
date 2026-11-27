import type { Metadata } from 'next';
import { EnquiryLanding } from '@/src/components/EnquiryLanding';

export const metadata: Metadata = {
  title: 'Start a Project | Christopher J. Callaghan',
  description: 'Tell me what you want to build, improve or grow. Enquire about websites, apps, custom software, AI integration and digital business projects.',
  alternates: { canonical: '/enquire' },
  openGraph: {
    type: 'website',
    url: 'https://christopherjcallaghan.com/enquire',
    title: 'Have something in mind? Let’s make it work.',
    description: 'Start a conversation about your next website, app, software or AI project.',
    siteName: 'Christopher J. Callaghan',
    images: [{ url: '/assets/cjc-social-preview.svg', width: 1200, height: 630, alt: 'Christopher J. Callaghan — Project enquiries' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Start a project with Christopher J. Callaghan',
    description: 'Websites, apps, software and AI projects. Tell me what you have in mind.',
    images: ['/assets/cjc-social-preview.svg']
  }
};

export default function EnquirePage() {
  return <EnquiryLanding />;
}
