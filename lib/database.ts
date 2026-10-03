import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;
const sql = databaseUrl ? neon(databaseUrl) : null;

export const isDatabaseConfigured = Boolean(databaseUrl);

export type BlogPostStatus = 'draft' | 'published';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentMarkdown: string;
  metaTitle: string;
  metaDescription: string;
  aiPrompt: string;
  status: BlogPostStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export type BlogPostInput = Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'> & { id?: string };

const BLOG_POST_COLUMNS = `
  id::text AS id,
  title,
  slug,
  excerpt,
  content_markdown AS "contentMarkdown",
  meta_title AS "metaTitle",
  meta_description AS "metaDescription",
  ai_prompt AS "aiPrompt",
  status,
  created_at::text AS "createdAt",
  updated_at::text AS "updatedAt",
  published_at::text AS "publishedAt"
`;

function createReferenceCode(prefix: 'REF' | 'CNS'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
}

export async function saveContactSubmission(data: {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
}) {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  const refCode = createReferenceCode('REF');

  await sql`
    INSERT INTO contact_submissions (name, email, project_type, budget, timeline, message, ref_code)
    VALUES (${data.name}, ${data.email}, ${data.projectType}, ${data.budget}, ${data.timeline}, ${data.message}, ${refCode})
  `;

  return { success: true, refCode };
}

export async function saveConsultationRequest(data: {
  name: string;
  email: string;
  packageScope: string;
  fundingGoal: string;
  timeline: string;
  details: string;
}) {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  const refCode = createReferenceCode('CNS');

  await sql`
    INSERT INTO consultation_requests (name, email, package_scope, funding_goal, timeline, details, ref_code)
    VALUES (${data.name}, ${data.email}, ${data.packageScope}, ${data.fundingGoal}, ${data.timeline}, ${data.details}, ${refCode})
  `;

  return { success: true, refCode };
}

export async function saveAiBlueprint(data: {
  title: string;
  domain: string;
  userPrompt: string;
  modelUsed: string;
  blueprint: object;
}) {
  if (!sql) throw new Error('DATABASE_URL is not configured.');

  await sql`
    INSERT INTO ai_blueprints (title, domain, user_prompt, model_used, blueprint_json)
    VALUES (${data.title}, ${data.domain}, ${data.userPrompt}, ${data.modelUsed}, ${JSON.stringify(data.blueprint)}::jsonb)
  `;

  return { success: true };
}

export async function listPublishedBlogPosts(): Promise<BlogPost[]> {
  if (!sql) return [];
  try {
    const rows = await sql`
      SELECT ${sql.unsafe(BLOG_POST_COLUMNS)}
      FROM blog_posts
      WHERE status = 'published'
      ORDER BY published_at DESC
      LIMIT 200
    `;
    return rows as unknown as BlogPost[];
  } catch (error) {
    console.error('Could not read published blog posts:', error);
    return [];
  }
}

export async function getPublishedBlogPost(slug: string): Promise<BlogPost | null> {
  if (!sql) return null;
  try {
    const rows = await sql`
      SELECT ${sql.unsafe(BLOG_POST_COLUMNS)}
      FROM blog_posts
      WHERE slug = ${slug} AND status = 'published'
      LIMIT 1
    `;
    return (rows[0] as unknown as BlogPost | undefined) ?? null;
  } catch (error) {
    console.error('Could not read published blog post:', error);
    return null;
  }
}

export async function listAdminBlogPosts(): Promise<BlogPost[]> {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  const rows = await sql`
    SELECT ${sql.unsafe(BLOG_POST_COLUMNS)}
    FROM blog_posts
    ORDER BY updated_at DESC
    LIMIT 200
  `;
  return rows as unknown as BlogPost[];
}

export async function saveBlogPost(data: BlogPostInput): Promise<BlogPost> {
  if (!sql) throw new Error('DATABASE_URL is not configured.');

  const rows = data.id
    ? await sql`
        UPDATE blog_posts SET
          title = ${data.title},
          slug = ${data.slug},
          excerpt = ${data.excerpt},
          content_markdown = ${data.contentMarkdown},
          meta_title = ${data.metaTitle},
          meta_description = ${data.metaDescription},
          ai_prompt = ${data.aiPrompt},
          status = ${data.status},
          updated_at = NOW(),
          published_at = CASE WHEN ${data.status} = 'published' THEN COALESCE(published_at, NOW()) ELSE NULL END
        WHERE id = ${data.id}::bigint
        RETURNING ${sql.unsafe(BLOG_POST_COLUMNS)}
      `
    : await sql`
        INSERT INTO blog_posts (title, slug, excerpt, content_markdown, meta_title, meta_description, ai_prompt, status, published_at)
        VALUES (
          ${data.title}, ${data.slug}, ${data.excerpt}, ${data.contentMarkdown}, ${data.metaTitle}, ${data.metaDescription}, ${data.aiPrompt}, ${data.status},
          CASE WHEN ${data.status} = 'published' THEN NOW() ELSE NULL END
        )
        RETURNING ${sql.unsafe(BLOG_POST_COLUMNS)}
      `;

  const saved = rows[0] as unknown as BlogPost | undefined;
  if (!saved) throw new Error('Blog post could not be saved.');
  return saved;
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  const rows = await sql`DELETE FROM blog_posts WHERE id = ${id}::bigint RETURNING id`;
  return rows.length > 0;
}