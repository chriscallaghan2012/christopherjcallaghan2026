import type { Metadata } from 'next';
import { AdminWorkspace } from '@/src/components/AdminWorkspace';

export const metadata: Metadata = {
  title: 'Admin | Christopher J. Callaghan',
  robots: { index: false, follow: false },
  alternates: { canonical: '/admin' }
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#060608] text-[#ededed]">
      <header className="border-b border-white/10">
        <div className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-5 px-5 md:px-8">
          <a href="/" className="flex items-center gap-3 text-sm font-bold text-white" aria-label="Christopher J. Callaghan home">
            <span className="flex h-9 w-9 items-center justify-center border border-[#FF003C]/60 bg-[#FF003C]/10 font-mono text-xs">CJC</span>
            <span>Christopher J. Callaghan</span>
          </a>
          <a href="/blog" className="font-mono text-[10px] font-bold tracking-[0.14em] text-white/60 hover:text-white">VIEW BLOG</a>
        </div>
      </header>
      <AdminWorkspace />
    </div>
  );
}