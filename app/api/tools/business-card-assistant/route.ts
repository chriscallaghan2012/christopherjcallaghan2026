import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const runtime = 'nodejs';

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const TEMPLATES = [
  'crimson-executive',
  'swiss-minimal',
  'ember-studio',
  'monogram-luxe',
  'split-consultant',
  'signal-grid',
] as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, 900) : '';
    if (!message) {
      return NextResponse.json({ error: 'Tell the assistant what you want to improve.' }, { status: 400 });
    }
    if (!ai) {
      return NextResponse.json({
        error: 'The AI assistant needs a Gemini API key. Add GEMINI_API_KEY to your local .env.local and Vercel project environment variables, then redeploy.',
        needsApiKey: true,
      }, { status: 503 });
    }

    const current = body.current && typeof body.current === 'object' ? body.current : {};
    const systemInstruction = `You are the brand and business-card design assistant inside Christopher J. Callaghan's premium business card studio.
Give practical, specific advice on positioning, hierarchy, clarity, professional credibility, print legibility, and brand fit. Use British English. Do not invent personal contact details, qualifications, client results, or company facts.
Return ONLY valid JSON with this shape:
{
  "reply": "short helpful explanation, maximum 90 words",
  "suggested": {
    "template": "one of crimson-executive | swiss-minimal | ember-studio | monogram-luxe | split-consultant | signal-grid",
    "name": "string or empty string",
    "title": "string or empty string",
    "specialism": "string or empty string",
    "company": "string or empty string",
    "website": "string or empty string",
    "email": "string or empty string",
    "phone": "string or empty string"
  }
}
Only suggest a field when it is useful to change it. Use empty strings for fields that should remain unchanged. Never invent email addresses, phone numbers, or websites. Keep titles and specialisms concise enough for a physical business card. Prefer strong, readable wording over buzzwords.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: JSON.stringify({
        request: message,
        currentCard: {
          name: String(current.name || '').slice(0, 120),
          title: String(current.title || '').slice(0, 120),
          specialism: String(current.specialism || '').slice(0, 180),
          company: String(current.company || '').slice(0, 120),
          website: String(current.website || '').slice(0, 160),
          email: String(current.email || '').slice(0, 160),
          phone: String(current.phone || '').slice(0, 80),
          template: String(current.template || ''),
        },
        allowedTemplates: TEMPLATES,
      }),
      config: { systemInstruction, responseMimeType: 'application/json', temperature: 0.5 },
    });

    if (!response.text) {
      return NextResponse.json({ error: 'The AI assistant returned an empty response. Please try again.' }, { status: 502 });
    }

    const parsed = JSON.parse(response.text);
    const raw = parsed.suggested && typeof parsed.suggested === 'object' ? parsed.suggested : {};
    const suggested: Record<string, string> = {};
    for (const field of ['name', 'title', 'specialism', 'company', 'website', 'email', 'phone']) {
      if (typeof raw[field] === 'string' && raw[field].trim()) suggested[field] = raw[field].trim().slice(0, 180);
    }
    if (typeof raw.template === 'string' && TEMPLATES.includes(raw.template)) suggested.template = raw.template;

    return NextResponse.json({
      reply: typeof parsed.reply === 'string' ? parsed.reply.slice(0, 700) : 'I have prepared a few improvements for your card.',
      suggested,
    });
  } catch (error) {
    console.error('Business card AI assistant failed:', error);
    return NextResponse.json({ error: 'The assistant could not complete that request. Please try again.' }, { status: 500 });
  }
}
