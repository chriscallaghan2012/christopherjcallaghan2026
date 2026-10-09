import type { Metadata } from 'next';
import { CustomerAccountPage } from '@/src/components/CustomerAccountPage';

export const metadata: Metadata = {
  title: 'Your Account | Christopher J. Callaghan',
  description: 'Sign in to view your one-to-one class and MVP bootcamp purchases.',
  robots: { index: false, follow: false }
};

export default function AccountPage() {
  return <CustomerAccountPage />;
}
