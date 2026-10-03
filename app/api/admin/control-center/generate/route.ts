import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { isSameOriginRequest, verifyAdminSession } from '@/lib/adminAuth';
import type { SocialChannel } from '@/lib/database';

const CHANNELS: SocialChannel[] = ['instagram', 'facebook', 'linkedin', 'tiktok', 'youtube', 'pinterest', 'x', 'threads'];

export async function POST(request: Request) {
  if (!verifyAdminSession(request)) return NextResponse.json({ error: 'Sign in to generate social content.' }, { status: 401 });
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'GEMINI_API_KEY is not configured.' }, { status: 503 });

  try {
    const body = await request.json();
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    const channels = Array.isArray(body.channels) ? body.channels as unknown[] : [];
    if (prompt.length < 20 || prompt.length > 4000) {
      return NextResponse.json({ error: 'Describe the post in 20 to 4,000 characters.' }, { status: 400 });
    }
    if (!channels.length || channels.length > CHANNELS.length || channels.some((channel) => !CHANNELS.includes(channel as SocialChannel))) {
      return NextResponse.json({ error: 'Choose one or more supported social channels.' }, { status: 400 });
    }

    const selectedChannels = [...new Set(channels as SocialChannel[])];
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Create original social media copy and a production-ready image-generation prompt for Christopher J. Callaghan, a Manchester-based developer and technology builder. Use clear British English. Return valid JSON only with string field title, object field copyByChannel containing exactly these requested channel keys and string values, and string field imagePrompt. Adapt the length, tone and format to each channel. Avoid invented statistics, results, endorsements, or claims. The content is a draft and must not imply it has been published. Requested channels: ${selectedChannels.join(', ')}. Brief: ${prompt}`,
      config: { responseMimeType: 'application/json' }
    });
    if (!response.text) return NextResponse.json({ error: 'The AI returned an empty draft.' }, { status: 502 });

    const generated = JSON.parse(response.text) as Record<string, unknown>;
    const title = typeof generated.title === 'string' ? generated.title.trim().slice(0, 160) : '';
    const rawCopies = generated.copyByChannel && typeof generated.copyByChannel === 'object'
      ? generated.copyByChannel as Record<string, unknown>
      : {};
    const copyByChannel: Partial<Record<SocialChannel, string>> = {};
    for (const channel of selectedChannels) {
      const copy = rawCopies[channel];
      if (typeof copy !== 'string' || !copy.trim()) {
        return NextResponse.json({ error: 'The AI draft did not include usable copy for every selected channel.' }, { status: 502 });
      }
      copyByChannel[channel] = copy.trim().slice(0, 5000);
    }
    const imagePrompt = typeof generated.imagePrompt === 'string' ? generated.imagePrompt.trim().slice(0, 2000) : '';
    if (!title || !imagePrompt) return NextResponse.json({ error: 'The AI draft did not include a title and image prompt.' }, { status: 502 });

    return NextResponse.json({ draft: { title, copyByChannel, imagePrompt } }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('AI social draft generation failed:', error);
    return NextResponse.json({ error: 'Could not generate social content. Try a more specific brief.' }, { status: 502 });
  }
}