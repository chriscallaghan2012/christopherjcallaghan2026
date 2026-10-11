import { BLOG_CATEGORIES, type BlogCategory, type BlogPostInput } from './database';

function cleanText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length <= maxLength ? trimmed : null;
}

export function slugifyBlogTitle(title: string): string {
  return title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100)
    .replace(/-$/, '');
}

export function validateBlogPostInput(value: unknown): { post?: BlogPostInput; error?: string } {
  if (!value || typeof value !== 'object') return { error: 'A post is required.' };
  const body = value as Record<string, unknown>;
  const title = cleanText(body.title, 140);
  const excerpt = cleanText(body.excerpt, 420);
  const category = BLOG_CATEGORIES.includes(body.category as BlogCategory) ? body.category as BlogCategory : null;
  const coverImage = cleanText(body.coverImage ?? '', 240);
  const coverImageAlt = cleanText(body.coverImageAlt ?? '', 300);
  const contentMarkdown = cleanText(body.contentMarkdown, 60000);
  const metaTitle = cleanText(body.metaTitle, 180);
  const metaDescription = cleanText(body.metaDescription, 320);
  const aiPrompt = cleanText(body.aiPrompt ?? '', 8000);
  const requestedSlug = cleanText(body.slug, 120);
  const slug = slugifyBlogTitle(requestedSlug || title || '');
  const status = body.status === 'published' ? 'published' : body.status === 'draft' || body.status === undefined ? 'draft' : null;

  if (!title || title.length < 4) return { error: 'Title must be at least 4 characters.' };
  if (!excerpt || excerpt.length < 10) return { error: 'Excerpt must be at least 10 characters.' };
  if (!category) return { error: 'Choose a valid post category.' };
  if (coverImage === null || coverImageAlt === null) return { error: 'Cover image details are too long.' };
  if (coverImage && !/^\/(?:assets|images)\/[A-Za-z0-9/_-]+\.(?:jpe?g|png|webp|avif)$/i.test(coverImage)) {
    return { error: 'Cover images must use a local image in /assets or /images.' };
  }
  if (coverImage && !coverImageAlt) return { error: 'Add alt text for the cover image.' };
  if (!contentMarkdown || contentMarkdown.length < 40) return { error: 'Post content must be at least 40 characters.' };
  if (!metaTitle || metaTitle.length < 4) return { error: 'SEO title must be at least 4 characters.' };
  if (!metaDescription || metaDescription.length < 20) return { error: 'SEO description must be at least 20 characters.' };
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return { error: 'Use a valid URL slug.' };
  if (!status) return { error: 'Status must be draft or published.' };
  if (aiPrompt === null) return { error: 'AI prompt must be under 8,000 characters.' };
  if (body.id !== undefined && (typeof body.id !== 'string' || !/^\d+$/.test(body.id))) return { error: 'Post id is invalid.' };

  return {
    post: {
      ...(typeof body.id === 'string' ? { id: body.id } : {}),
      title,
      slug,
      excerpt,
      category,
      coverImage,
      coverImageAlt,
      contentMarkdown,
      metaTitle,
      metaDescription,
      aiPrompt,
      status
    }
  };
}