import React from 'react';
import type { Metadata, Viewport } from 'next';
import { AnalyticsConsent } from '@/src/components/AnalyticsConsent';
import { WhatsAppContact } from '@/src/components/WhatsAppContact';
import '@/src/index.css';

export const viewport: Viewport = {
  themeColor: '#060608',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://christopherjcallaghan.com'),
  title: 'Freelance Web Developer Manchester | Christopher J. Callaghan',
  description: 'Freelance web developer in Manchester building and improving websites, apps, e-commerce and custom software for businesses across Greater Manchester and the UK.',
  applicationName: 'Christopher J. Callaghan',
  alternates: {
    canonical: '/',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  keywords: [
    'Christopher J. Callaghan',
    'Christopher J Callaghan',
    'Full-Stack Developer',
    'AI Builder',
    'Manchester Web Developer',
    'AI Engineer',
    'Software Developer',
    'SEO Services',
    'Local SEO',
    'Google Maps Marketing',
    'Google Ads Management',
    'PPC Advertising',
    'Social Media Marketing',
    'Web Design & Development'
  ],
  authors: [{ name: 'Christopher J. Callaghan', url: 'https://christopherjcallaghan.com' }],
  creator: 'Christopher J. Callaghan',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://christopherjcallaghan.com',
    title: 'Freelance Web Developer Manchester | Christopher J. Callaghan',
    description: 'Websites, apps, e-commerce and custom software, built and improved by a freelance web developer in Manchester.',
    siteName: 'Christopher J. Callaghan Portfolio',
    images: [
      {
        url: '/assets/cjc-social-preview.svg',
        width: 1200,
        height: 630,
        alt: 'Christopher J. Callaghan — Full-stack developer and builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Freelance Web Developer Manchester | Christopher J. Callaghan',
    description: 'Websites, apps and custom software from a freelance web developer in Manchester.',
    creator: '@christopherjcallaghan',
    images: [
      '/assets/cjc-social-preview.svg',
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Christopher J. Callaghan',
    alternateName: ['Christopher J Callaghan', 'Christopher Callaghan'],
    description: 'Manchester-based full-stack developer, AI builder and business creator building websites, applications, software, integrations and digital products.',
    jobTitle: 'Full-Stack Developer, AI Builder and Business Creator',
    url: 'https://christopherjcallaghan.com',
    sameAs: [
      'https://www.linkedin.com/in/webdevelopermanchester/'
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Manchester',
      addressCountry: 'UK'
    },
    knowsAbout: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Websites and Applications',
      'Custom Software',
      'Artificial Intelligence',
      'Digital Businesses',
      'Automation'
    ]
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#060608] text-[#ededed] selection:bg-[#FF003C] selection:text-white font-sans antialiased">
        {children}
        <WhatsAppContact />
        <AnalyticsConsent measurementId="G-0R6PCNG3NK" tagManagerId={process.env.NEXT_PUBLIC_GTM_ID ?? ''} />
      </body>
    </html>
  );
}
