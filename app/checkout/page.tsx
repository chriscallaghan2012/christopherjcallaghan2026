import type { Metadata } from 'next';
import { ClassCheckoutPage } from '@/src/components/ClassCheckoutPage';

export const metadata: Metadata = {
  title: 'Secure Checkout | Christopher J. Callaghan',
  description: 'Create your account and securely book a one-to-one website class or six-session MVP bootcamp.',
  robots: { index: false, follow: false }
};

export default function CheckoutPage() {
  return <ClassCheckoutPage />;
}
