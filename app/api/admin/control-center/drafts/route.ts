import { NextResponse } from 'next/server';
import {
  deleteAdminSocialDraft,
  isDatabaseConfigured,
  listAdminSocialDrafts,
  saveAdminSocialDraft,
  type AdminSocialDraftInput,
  type SocialChannel
} from '@/lib/database';
import { isSameOriginRequest, verifyAdminSession } from '@/lib/adminAuth';

const CHANNELS: SocialChannel[] = ['instagram', 'facebook', 'linkedin', 'tiktok', 'youtube', 'pinterest', 'x', 'threads'];
const ZONE_PATTERN = /^[A-Za-z_]+(?:\/[A-Za-z0-9_+-]+)*$/;

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function parseDraft(body: unknown): { draft?: AdminSocialDraftInput; error?: string } {
  if (!body || typeof body !== 'object') return { error: 'A draft is required.' };
  const value = body as Record<string, unknown>;
  const title = typeof value.title === 'string' ? value.title.trim() : '';
  const prompt = typeof value.prompt === 'string' ? value.prompt.trim() : '';
  const channels = Array.isArray(value.channels) ? value.channels : [];
  const rawCopy = value.copyByChannel && typeof value.copyByChannel === 'object'
    ? value.copyByChannel as Record<string, unknown>
    : {};
  const imagePrompt = typeof value.imagePrompt === 'string' ? value.imagePrompt.trim() : '';
  const timeZone = typeof value.timeZone === 'string' ? value.timeZone : 'Europe/London';
  const status = value.status === 'approved' ? 'approved' : value.status === 'draft' || value.status === undefined ? 'draft' : null;
  const scheduledAt = value.scheduledAt === null || value.scheduledAt === '' || value.scheduledAt === undefined
    ? null
    : typeof value.scheduledAt === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value.scheduledAt) && Number.isFinite(Date.parse(value.scheduledAt))
      ? value.scheduledAt
      : undefined;

  if (title.length < 2 || title.length > 160) return { error: 'Title must be between 2 and 160 characters.' };
  if (prompt.length < 10 || prompt.length > 4000) return { error: 'Prompt must be between 10 and 4,000 characters.' };
  if (!channels.length || channels.some((channel) => !CHANNELS.includes(channel))) return { error: 'Choose at least one supported social channel.' };
  if (!status) return { error: 'Draft status is invalid.' };
  if (scheduledAt === undefined) return { error: 'Choose a valid schedule date and time.' };
  if (!ZONE_PATTERN.test(timeZone)) return { error: 'Choose a valid time zone.' };
  try {
    new Intl.DateTimeFormat('en', { timeZone }).format();
  } catch {
    return { error: 'Choose a valid time zone.' };
  }

  const copyByChannel: Partial<Record<SocialChannel, string>> = {};
  for (const channel of channels as SocialChannel[]) {
    const copy = rawCopy[channel];
    if (typeof copy !== 'string' || copy.length > 5000) return { error: `Copy for ${channel} must be under 5,000 characters.` };
    copyByChannel[channel] = copy;
  }
  if (imagePrompt.length > 2000) return { error: 'Image prompt must be under 2,000 characters.' };

  return {
    draft: {
      ...(typeof value.id === 'string' && /^\d+$/.test(value.id) ? { id: value.id } : {}),
      title,
      prompt,
      channels: channels as SocialChannel[],
      copyByChannel,
      imagePrompt,
      scheduledAt,
      timeZone,
      status
    }
  };
}

export async function GET(request: Request) {
  if (!verifyAdminSession(request)) return errorResponse('Sign in to manage social drafts.', 401);
  if (!isDatabaseConfigured) return errorResponse('DATABASE_URL is not configured.', 503);
  try {
    return NextResponse.json({ drafts: await listAdminSocialDrafts() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to load admin social drafts:', error);
    return errorResponse('Could not load social drafts. Apply the admin control-center migration first.', 503);
  }
}

export async function POST(request: Request) {
  if (!verifyAdminSession(request)) return errorResponse('Sign in to manage social drafts.', 401);
  if (!isSameOriginRequest(request)) return errorResponse('Request origin is not allowed.', 403);
  if (!isDatabaseConfigured) return errorResponse('DATABASE_URL is not configured.', 503);
  try {
    const { draft, error } = parseDraft(await request.json());
    if (!draft) return errorResponse(error || 'Draft is invalid.', 400);
    return NextResponse.json({ draft: await saveAdminSocialDraft(draft) });
  } catch (error) {
    console.error('Failed to save admin social draft:', error);
    return errorResponse('Could not save the social draft.', 500);
  }
}

export async function DELETE(request: Request) {
  if (!verifyAdminSession(request)) return errorResponse('Sign in to manage social drafts.', 401);
  if (!isSameOriginRequest(request)) return errorResponse('Request origin is not allowed.', 403);
  if (!isDatabaseConfigured) return errorResponse('DATABASE_URL is not configured.', 503);
  const id = new URL(request.url).searchParams.get('id');
  if (!id || !/^\d+$/.test(id)) return errorResponse('A valid draft id is required.', 400);
  try {
    return await deleteAdminSocialDraft(id)
      ? NextResponse.json({ success: true })
      : errorResponse('Draft not found.', 404);
  } catch (error) {
    console.error('Failed to delete admin social draft:', error);
    return errorResponse('Could not delete the social draft.', 500);
  }
}