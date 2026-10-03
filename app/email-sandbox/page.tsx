import type { Metadata } from 'next';
import App from '@/src/App';

export const metadata: Metadata = {
  title: 'Email Preview Sandbox | Christopher J. Callaghan',
  robots: { index: false, follow: false }
};

export default function EmailSandboxPage() {
  return <App />;
}
