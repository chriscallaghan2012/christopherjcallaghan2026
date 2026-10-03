import React from 'react';
import type { Metadata, Viewport } from 'next';
import { AnalyticsConsent } from '@/src/components/AnalyticsConsent';
import '@/src/index.css';

export const viewport: Viewport = {
  themeColor: '#060608',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://christopherjcallaghan.com'),
  title: 'Christopher J. Callaghan | I Build Things',
  description: 'Full-stack developer, AI builder and business creator. I turn ideas, problems and opportunities into working technology.',
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
    'Full-Stack Developer',
    'AI Builder',
    'Manchester Web Developer',
    'AI Engineer',
    'Software Developer',
    'SEO Services',
    'Google Maps Marketing',
    'PPC Advertising',
    'Social Media Marketing'
  ],
  authors: [{ name: 'Christopher J. Callaghan', url: 'https://christopherjcallaghan.com' }],
  creator: 'Christopher J. Callaghan',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://christopherjcallaghan.com',
    title: 'Christopher J. Callaghan | I Build Things',
    description: 'I turn ideas, problems and opportunities into working technology.',
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
    title: 'Christopher J. Callaghan | I Build Things',
    description: 'Full-stack developer, AI builder and business creator.',
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
    jobTitle: 'Full-Stack Developer, AI Builder and Business Creator',
    url: 'https://christopherjcallaghan.com',
    sameAs: [
      'https://www.linkedin.com/in/webdevelopermanchester/',
      'https://github.com'
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Manchester',
      addressCountry: 'UK'
    },
    knowsAbout: [
      'Next.js 15',
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
        <AnalyticsConsent measurementId="G-0R6PCNG3NK" tagManagerId={process.env.NEXT_PUBLIC_GTM_ID ?? ''} />
      </body>
    </html>
  );
}
