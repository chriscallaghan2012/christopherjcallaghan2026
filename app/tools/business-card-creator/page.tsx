import type { Metadata } from 'next';
import BusinessCardCreator from '@/src/components/BusinessCardCreator';

export const metadata: Metadata = {
  title: 'Business Card Studio — Premium Templates | Christopher J. Callaghan',
  description: 'Choose from six premium business card templates, customise your details and export correctly sized 300 DPI PNG or vector SVG artwork for UK or US printing, with optional 3 mm bleed.',
  alternates: { canonical: 'https://christopherjcallaghan.com/tools/business-card-creator' },
};

export default function BusinessCardCreatorPage() {
  return <BusinessCardCreator />;
}
