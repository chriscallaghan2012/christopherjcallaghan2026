import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { isSameOriginRequest, verifyAdminSession } from '@/lib/adminAuth';
import { slugifyBlogTitle, validateBlogPostInput } from '@/lib/blogValidation';

export async function POST(request: Request) {
  if (!verifyAdminSession(request)) return NextResponse.json({ error: 'Sign in to generate a post.' }, { status: 401 });
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'GEMINI_API_KEY is not configured.' }, { status: 503 });

  try {
    const body = await request.json();
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    if (prompt.length < 20 || prompt.length > 8000) {
      return NextResponse.json({ error: 'Describe the topic in 20 to 8,000 characters.' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Create an original, useful blog post draft for Christopher J. Callaghan, a Manchester-based full-stack developer and technology builder. Write in clear British English, use a confident first-person professional voice, and return valid JSON only with these string fields: title, slug, excerpt, metaTitle, metaDescription, contentMarkdown. The Markdown should have a short introduction, descriptive H2 sections, practical detail, and a concise conclusion. Do not invent client results, statistics, credentials, or quotations. Do not publish or claim the post is live. Topic and direction: ${prompt}`,
      config: { responseMimeType: 'application/json' }
    });

    if (!response.text) return NextResponse.json({ error: 'The AI returned an empty draft.' }, { status: 502 });
    const generated = JSON.parse(response.text) as Record<string, unknown>;
    const { post, error } = validateBlogPostInput({
      ...generated,
      slug: typeof generated.slug === 'string' ? slugifyBlogTitle(generated.slug) : slugifyBlogTitle(String(generated.title || '')),
      aiPrompt: prompt,
      status: 'draft'
    });
    if (!post) return NextResponse.json({ error: `The AI draft did not pass validation: ${error}` }, { status: 502 });

    return NextResponse.json({ post: { ...post, status: 'draft' } }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('AI blog draft generation failed:', error);
    return NextResponse.json({ error: 'Could not generate a draft. Try a more specific topic.' }, { status: 502 });
  }
}