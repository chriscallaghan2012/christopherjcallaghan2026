import type { Metadata } from 'next';
import { connection } from 'next/server';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPublishedBlogPost } from '@/lib/database';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(value: string | null): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug);
  if (!post) return { title: 'Article not found | Christopher J. Callaghan', robots: { index: false, follow: false } };

  const title = post.metaTitle || `${post.title} | Christopher J. Callaghan`;
  const description = post.metaDescription || post.excerpt;
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt
    },
    twitter: { card: 'summary_large_image', title, description }
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  await connection();
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug);
  if (!post) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Person', name: 'Christopher J. Callaghan', url: 'https://christopherjcallaghan.com' },
    publisher: { '@type': 'Person', name: 'Christopher J. Callaghan' },
    mainEntityOfPage: `https://christopherjcallaghan.com/blog/${post.slug}`
  };

  return (
    <div className="min-h-screen bg-[#060608] text-[#ededed]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c') }} />
      <header className="border-b border-white/10">
        <div className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-5 px-5 md:px-8">
          <a href="/" className="flex items-center gap-3 text-sm font-bold text-white" aria-label="Christopher J. Callaghan home">
            <span className="flex h-9 w-9 items-center justify-center border border-[#FF003C]/60 bg-[#FF003C]/10 font-mono text-xs">CJC</span>
            <span>Christopher J. Callaghan</span>
          </a>
          <a href="/blog" className="font-mono text-[10px] font-bold tracking-[0.14em] text-white/60 hover:text-white">ALL ARTICLES</a>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-14 md:px-8 md:py-20">
        <nav aria-label="Breadcrumb" className="mb-9 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45"><a href="/blog" className="hover:text-[#FFB347]">Blog</a><span className="mx-3 text-[#FF003C]">/</span><span>Article</span></nav>
        <article>
          <header className="border-b border-white/10 pb-9">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-[#DF80FF]">Christopher J. Callaghan / Field notes</p>
            <h1 className="text-4xl font-black leading-[1.02] text-white sm:text-6xl">{post.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/65">{post.excerpt}</p>
            <time className="mt-6 block font-mono text-[10px] uppercase tracking-[0.12em] text-white/40" dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
          </header>
          <div className="prose-blog mx-auto max-w-3xl py-10 text-[16px] leading-[1.85] text-white/75">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => <h2 className="mt-11 border-t border-white/10 pt-7 text-2xl font-bold leading-tight text-white">{children}</h2>,
                h3: ({ children }) => <h3 className="mt-8 text-xl font-bold text-white">{children}</h3>,
                p: ({ children }) => <p className="my-5">{children}</p>,
                ul: ({ children }) => <ul className="my-5 list-disc space-y-2 pl-6 marker:text-[#FFB347]">{children}</ul>,
                ol: ({ children }) => <ol className="my-5 list-decimal space-y-2 pl-6 marker:text-[#FFB347]">{children}</ol>,
                blockquote: ({ children }) => <blockquote className="my-7 border-l-2 border-[#DF80FF] pl-5 text-white/65">{children}</blockquote>,
                a: ({ href, children }) => <a href={href} className="text-[#FFB347] underline decoration-white/25 underline-offset-4 hover:decoration-[#FFB347]">{children}</a>,
                code: ({ children }) => <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.9em] text-[#FFB347]">{children}</code>
              }}
            >{post.contentMarkdown}</ReactMarkdown>
          </div>
        </article>
        <div className="border-t border-white/10 pt-8">
          <p className="text-sm text-white/60">Working on something similar?</p>
          <a href="/build" className="mt-3 inline-flex min-h-11 items-center bg-[#FF003C] px-5 font-mono text-xs font-bold tracking-[0.1em] text-white hover:bg-[#df0035]">START A PROJECT</a>
        </div>
      </main>
    </div>
  );
}