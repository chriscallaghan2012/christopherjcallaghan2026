import { NextResponse } from 'next/server';
import { isDatabaseConfigured, deleteBlogPost, listAdminBlogPosts, saveBlogPost } from '@/lib/database';
import { isSameOriginRequest, verifyAdminSession } from '@/lib/adminAuth';
import { validateBlogPostInput } from '@/lib/blogValidation';

function unauthorized() {
  return NextResponse.json({ error: 'Sign in to manage blog posts.' }, { status: 401 });
}

export async function GET(request: Request) {
  if (!verifyAdminSession(request)) return unauthorized();
  if (!isDatabaseConfigured) return NextResponse.json({ error: 'DATABASE_URL is not configured.' }, { status: 503 });

  try {
    return NextResponse.json({ posts: await listAdminBlogPosts() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to load admin blog posts:', error);
    return NextResponse.json({ error: 'Could not load posts. Check that neon_setup.sql has been applied.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!verifyAdminSession(request)) return unauthorized();
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  if (!isDatabaseConfigured) return NextResponse.json({ error: 'DATABASE_URL is not configured.' }, { status: 503 });

  try {
    const { post, error } = validateBlogPostInput(await request.json());
    if (!post) return NextResponse.json({ error }, { status: 400 });
    const savedPost = await saveBlogPost(post);
    return NextResponse.json({ post: savedPost });
  } catch (error) {
    if ((error as { code?: string }).code === '23505') {
      return NextResponse.json({ error: 'That slug is already in use. Choose another.' }, { status: 409 });
    }
    console.error('Failed to save blog post:', error);
    return NextResponse.json({ error: 'Could not save the post.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!verifyAdminSession(request)) return unauthorized();
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  if (!isDatabaseConfigured) return NextResponse.json({ error: 'DATABASE_URL is not configured.' }, { status: 503 });

  const id = new URL(request.url).searchParams.get('id');
  if (!id || !/^\d+$/.test(id)) return NextResponse.json({ error: 'A valid post id is required.' }, { status: 400 });

  try {
    const deleted = await deleteBlogPost(id);
    return deleted ? NextResponse.json({ success: true }) : NextResponse.json({ error: 'Post not found.' }, { status: 404 });
  } catch (error) {
    console.error('Failed to delete blog post:', error);
    return NextResponse.json({ error: 'Could not delete the post.' }, { status: 500 });
  }
}