import type { Metadata } from 'next';
import App from '@/src/App';

const title = 'Structured Data Validator | JSON-LD Checker | Christopher J. Callaghan';
const description = 'Check pasted JSON-LD or HTML for syntax errors, detected Schema.org entity types and common property gaps. Clear limitations and links to official validators.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/tools/structured-data-validator' },
  openGraph: { type: 'website', title, description, url: '/tools/structured-data-validator' },
  twitter: { card: 'summary', title, description }
};

export default function StructuredDataValidatorPage() {
  return <App initialTab="structured-data-validator" />;
}
