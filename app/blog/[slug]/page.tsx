import type { Metadata } from 'next';
import Image from 'next/image';
import { connection } from 'next/server';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPublishedBlogPost } from '@/lib/database';
import { BlogFooter, BlogHeader } from '@/src/components/BlogChrome';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

type RelatedTool = { title: string; href: string; description: string };

function getRelatedTools(category: string, title: string, excerpt: string): RelatedTool[] {
  const topic = `${category} ${title} ${excerpt}`.toLowerCase();
  const tools: RelatedTool[] = [];
  if (/e-?commerce|product page|online shop|shopify|product schema/.test(topic)) {
    tools.push(
      { title: 'AI eCommerce Readiness', href: '/tools/ai-ecommerce-report', description: 'Review observable product-page information and commerce signals.' },
      { title: 'Structured Data Validator', href: '/tools/structured-data-validator', description: 'Inspect JSON-LD and product structured data.' }
    );
  } else if (/seo|search|website|crawl|schema|structured data|robots|metadata|technical/.test(topic)) {
    tools.push(
      { title: 'Website Grader', href: '/tools/website-grader', description: 'Review technical SEO, accessibility and AI-search signals.' },
      { title: 'Structured Data Validator', href: '/tools/structured-data-validator', description: 'Check JSON-LD syntax and common structured-data issues.' }
    );
  }
  if (/ai|llm|chatgpt|assistant|automation/.test(topic)) {
    tools.push({ title: 'llms.txt Builder', href: '/tools/llms-txt', description: 'Prepare a draft guide to your website for AI crawlers and assistants.' });
  }
  if (/business|startup|start-up|launch/.test(topic)) {
    tools.push({ title: 'Business Launch Checklist', href: '/tools/business-launch-checklist', description: 'Turn a business idea into a practical next-step checklist.' });
  }
  return tools.filter((tool, index, list) => list.findIndex((item) => item.href === tool.href) === index).slice(0, 3);
}

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
      modifiedTime: post.updatedAt,
      images: post.coverImage ? [{ url: post.coverImage, alt: post.coverImageAlt || post.title }] : undefined
    },
    twitter: { card: 'summary_large_image', title, description, images: post.coverImage ? [post.coverImage] : undefined }
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  await connection();
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug);
  if (!post) notFound();

  const relatedTools = getRelatedTools(post.category, post.title, post.excerpt);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    articleSection: post.category,
    image: post.coverImage ? [`https://christopherjcallaghan.com${post.coverImage}`] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Person', name: 'Christopher J. Callaghan', url: 'https://christopherjcallaghan.com' },
    publisher: { '@type': 'Person', name: 'Christopher J. Callaghan' },
    mainEntityOfPage: `https://christopherjcallaghan.com/blog/${post.slug}`
  };

  return (
    <div className="min-h-screen bg-[#060608] text-[#ededed]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c') }} />
      <BlogHeader />

      <main className="mx-auto max-w-4xl px-5 py-14 md:px-8 md:py-20">
        <nav aria-label="Breadcrumb" className="mb-9 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45"><a href="/blog" className="hover:text-[#FFB347]">Blog</a><span className="mx-3 text-[#FF003C]">/</span><span>Article</span></nav>
        <article>
          <header className="border-b border-white/10 pb-9">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-[#DF80FF]">{post.category} / Field notes</p>
            <h1 className="text-4xl font-black leading-[1.02] text-white sm:text-6xl">{post.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/65">{post.excerpt}</p>
            <time className="mt-6 block font-mono text-[11px] uppercase tracking-[0.12em] text-white/70" dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
          </header>
          {post.coverImage && <div className="relative mt-8 aspect-[16/9] overflow-hidden border border-white/10 bg-white/[0.03]">
            <Image src={post.coverImage} alt={post.coverImageAlt || post.title} fill priority sizes="(max-width: 896px) 100vw, 896px" className="object-cover" />
          </div>}
          <div className="prose-blog mx-auto max-w-3xl py-10 text-[16px] leading-[1.85] text-white/75">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => <h2 className="mt-11 border-t border-white/10 pt-7 text-2xl font-bold leading-tight text-white">{children}</h2>,
                h3: ({ children }) => <h3 className="mt-8 text-xl font-bold text-white">{children}</h3>,
                p: ({ children }) => <p className="my-5">{children}</p>,
                ul: ({ children }) => <ul className="my-5 list-disc space-y-2 pl-6 marker:text-[#FFB347]">{children}</ul>,
                ol: ({ children }) => <ol className="my-5 list-decimal space-y-2 pl-6 marker:text-[#FFB347]">{children}</ol>,
                table: ({ children }) => <div role="region" aria-label="Article comparison table" tabIndex={0} className="my-7 max-w-full overflow-x-auto border border-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFB347]"><table className="w-full min-w-[720px] border-collapse text-left text-sm">{children}</table></div>,
                th: ({ children }) => <th scope="col" className="border-b border-white/15 bg-white/[0.04] px-4 py-3 align-top font-mono text-[10px] uppercase tracking-wider text-white/85">{children}</th>,
                td: ({ children }) => <td className="border-b border-white/10 px-4 py-3 align-top leading-relaxed text-white/75">{children}</td>,
                blockquote: ({ children }) => <blockquote className="my-7 border-l-2 border-[#DF80FF] pl-5 text-white/65">{children}</blockquote>,
                a: ({ href, children }) => <a href={href} className="text-[#FFB347] underline decoration-white/25 underline-offset-4 hover:decoration-[#FFB347]">{children}</a>,
                code: ({ children }) => <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.9em] text-[#FFB347]">{children}</code>
              }}
            >{post.contentMarkdown}</ReactMarkdown>
          </div>
        </article>
        {relatedTools.length > 0 && (
          <aside className="mb-10 border-t border-white/10 pt-8" aria-labelledby="article-related-tools">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF003C]">RELATED FREE TOOLS</p>
            <h2 id="article-related-tools" className="mt-2 text-2xl font-black text-white">Put the ideas into practice.</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {relatedTools.map((tool) => (
                <a key={tool.href} href={tool.href} className="group border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-[#FF003C]/50">
                  <span className="flex items-center justify-between gap-3 font-bold text-white">
                    {tool.title}
                    <span aria-hidden="true" className="text-[#FF003C] transition-transform group-hover:translate-x-1">→</span>
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-white/55">{tool.description}</span>
                </a>
              ))}
            </div>
          </aside>
        )}
        <div className="border-t border-white/10 pt-8">
          <p className="text-sm text-white/60">Working on something similar?</p>
          <a href="/build" className="mt-3 inline-flex min-h-11 items-center bg-[#FF003C] px-5 font-mono text-xs font-bold tracking-[0.1em] text-white hover:bg-[#ffb347] hover:text-black">START A PROJECT</a>
        </div>
      </main>
      <BlogFooter />
    </div>
  );
}