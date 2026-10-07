import type { Metadata } from 'next';
import App from '@/src/App';

const title = '1:1 Online Website Classes | Build Your Site Together';
const description = 'Learn to plan, design and build your own website in live one-to-one online classes. No coding experience required; your project stays yours.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/classes' },
  openGraph: { type: 'website', title, description, url: '/classes' }
};

export default function ClassesPage() {
  return <App initialTab="classes" />;
}