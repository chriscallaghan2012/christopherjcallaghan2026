import type { Metadata } from 'next';
import { connection } from 'next/server';
import { listPublishedBlogPosts } from '@/lib/database';

export const metadata: Metadata = {
  title: 'Blog | Christopher J. Callaghan',
  description: 'Practical notes on building software, AI products, digital systems, and businesses.',
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    title: 'Blog | Christopher J. Callaghan',
    description: 'Practical notes on building software, AI products, digital systems, and businesses.',
    url: '/blog'
  }
};

function formatDate(value: string | null): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function BlogIndexPage() {
  await connection();
  const posts = await listPublishedBlogPosts();

  return (
    <div className="min-h-screen bg-[#060608] text-[#ededed]">
      <header className="border-b border-white/10">
        <div className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-5 px-5 md:px-8">
          <a href="/" className="flex items-center gap-3 text-sm font-bold text-white" aria-label="Christopher J. Callaghan home">
            <span className="flex h-9 w-9 items-center justify-center border border-[#FF003C]/60 bg-[#FF003C]/10 font-mono text-xs">CJC</span>
            <span>Christopher J. Callaghan</span>
          </a>
          <nav className="flex items-center gap-5 font-mono text-[10px] font-bold tracking-[0.14em] text-white/60" aria-label="Blog navigation">
            <a href="/" className="hover:text-white">HOME</a>
            <a href="/build" className="hover:text-white">BUILD</a>
            <a href="/contact" className="hover:text-white">CONTACT</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto min-h-[70svh] max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-[#FF003C]">Field notes / ideas into practice</p>
        <h1 className="max-w-4xl text-5xl font-black leading-[0.95] text-white sm:text-7xl">NOTES ON <span className="text-[#FFB347]">BUILDING</span> THINGS.</h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65">Practical thinking on software, AI, digital products and building businesses around the work.</p>

        {posts.length ? (
          <div className="mt-14 divide-y divide-white/10 border-y border-white/10">
            {posts.map((post) => (
              <article key={post.id} className="grid gap-3 py-7 md:grid-cols-[1fr_220px] md:items-start">
                <div>
                  <h2 className="text-2xl font-bold leading-tight text-white md:text-3xl"><a href={`/blog/${post.slug}`} className="transition-colors hover:text-[#FFB347]">{post.title}</a></h2>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/65">{post.excerpt}</p>
                </div>
                <time className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40 md:text-right" dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-14 border-y border-white/10 py-10">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#DF80FF]">First notes are in progress</p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60">New writing on software, AI and digital products will appear here.</p>
          </div>
        )}
      </main>

      <footer className="border-t border-white/10 px-5 py-5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/40 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:justify-between"><span>© {new Date().getFullYear()} Christopher J. Callaghan</span><span>Manchester, United Kingdom</span></div>
      </footer>
    </div>
  );
}