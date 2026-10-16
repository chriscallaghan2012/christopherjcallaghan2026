import type { Metadata } from 'next';
import BusinessCardCreator from '@/src/components/BusinessCardCreator';

export const metadata: Metadata = {
  title: 'Free Business Card Creator | Christopher J. Callaghan',
  description: 'Design a professional business card in the CJC dark-tech style. Edit your details, preview front and back, and download PNG or SVG artwork.',
  alternates: { canonical: 'https://christopherjcallaghan.com/tools/business-card-creator' },
};

export default function BusinessCardCreatorPage() {
  return <BusinessCardCreator />;
}
