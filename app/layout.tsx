import React from 'react';
import type { Metadata, Viewport } from 'next';
import '@/src/index.css';

export const viewport: Viewport = {
  themeColor: '#060608',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://christopherjcallaghan.com'),
  title: 'Christopher J. Callaghan | Digital Architect & Senior Full-Stack Engineer',
  description: 'Senior Full-Stack Architect & AI Systems Engineer based in Manchester, UK. Specializing in Next.js 15, React 19, Supabase, Resend, Programmatic SEO, and AI Agentic Pipelines.',
  applicationName: 'Christopher J. Callaghan — Digital Architect',
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
    'Digital Architect',
    'Senior Full-Stack Engineer',
    'Manchester Web Developer',
    'AI Engineer',
    'Next.js Architect',
    'Supabase Developer',
    'Resend Email Specialist',
    'Programmatic SEO',
    'React 19 Architect'
  ],
  authors: [{ name: 'Christopher J. Callaghan', url: 'https://christopherjcallaghan.com' }],
  creator: 'Christopher J. Callaghan',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://christopherjcallaghan.com',
    title: 'Christopher J. Callaghan | Digital Architect & Senior Full-Stack Engineer',
    description: 'Senior Software Architect & AI Engineering Specialist. Architecting next-generation digital experiences, venture packages, and programmatic SaaS platforms.',
    siteName: 'Christopher J. Callaghan Portfolio',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Christopher J. Callaghan — Digital Architect & Senior Full-Stack Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Christopher J. Callaghan | Digital Architect',
    description: 'Senior Full-Stack & AI Systems Architect based in Manchester, UK.',
    creator: '@christopherjcallaghan',
    images: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
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
    jobTitle: 'Digital Architect & Senior Full-Stack Engineer',
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
      'AI Agent Architectures',
      'Supabase',
      'Resend Email API',
      'Programmatic SEO',
      'Stripe Integration'
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
      </body>
    </html>
  );
}
