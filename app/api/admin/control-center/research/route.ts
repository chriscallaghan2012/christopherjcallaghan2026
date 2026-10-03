import { NextResponse } from 'next/server';
import {
  deleteAdminResearchTrack,
  isDatabaseConfigured,
  listAdminResearchTracks,
  saveAdminResearchTrack,
  type AdminResearchTrackInput,
  type ResearchCadence,
  type ResearchScope
} from '@/lib/database';
import { isSameOriginRequest, verifyAdminSession } from '@/lib/adminAuth';

const SCOPES: ResearchScope[] = ['google', 'local', 'ai_search', 'competitors'];
const CADENCES: ResearchCadence[] = ['manual', 'daily', 'weekly', 'monthly'];

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function parseTrack(body: unknown): { track?: AdminResearchTrackInput; error?: string } {
  if (!body || typeof body !== 'object') return { error: 'A research monitor is required.' };
  const value = body as Record<string, unknown>;
  const name = typeof value.name === 'string' ? value.name.trim() : '';
  const query = typeof value.query === 'string' ? value.query.trim() : '';
  const scopes = Array.isArray(value.scopes) ? value.scopes : [];
  const cadence = CADENCES.includes(value.cadence as ResearchCadence) ? value.cadence as ResearchCadence : null;

  if (name.length < 2 || name.length > 120) return { error: 'Name must be between 2 and 120 characters.' };
  if (query.length < 3 || query.length > 500) return { error: 'Search query must be between 3 and 500 characters.' };
  if (!scopes.length || scopes.some((scope) => !SCOPES.includes(scope))) return { error: 'Choose at least one research scope.' };
  if (!cadence) return { error: 'Choose a valid monitoring cadence.' };

  return {
    track: {
      ...(typeof value.id === 'string' && /^\d+$/.test(value.id) ? { id: value.id } : {}),
      name,
      query,
      scopes: scopes as ResearchScope[],
      cadence,
      enabled: value.enabled !== false
    }
  };
}

export async function GET(request: Request) {
  if (!verifyAdminSession(request)) return errorResponse('Sign in to manage research monitors.', 401);
  if (!isDatabaseConfigured) return errorResponse('DATABASE_URL is not configured.', 503);
  try {
    return NextResponse.json({ tracks: await listAdminResearchTracks() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to load admin research monitors:', error);
    return errorResponse('Could not load research monitors. Apply the admin control-center migration first.', 503);
  }
}

export async function POST(request: Request) {
  if (!verifyAdminSession(request)) return errorResponse('Sign in to manage research monitors.', 401);
  if (!isSameOriginRequest(request)) return errorResponse('Request origin is not allowed.', 403);
  if (!isDatabaseConfigured) return errorResponse('DATABASE_URL is not configured.', 503);
  try {
    const { track, error } = parseTrack(await request.json());
    if (!track) return errorResponse(error || 'Research monitor is invalid.', 400);
    return NextResponse.json({ track: await saveAdminResearchTrack(track) });
  } catch (error) {
    console.error('Failed to save admin research monitor:', error);
    return errorResponse('Could not save the research monitor.', 500);
  }
}

export async function DELETE(request: Request) {
  if (!verifyAdminSession(request)) return errorResponse('Sign in to manage research monitors.', 401);
  if (!isSameOriginRequest(request)) return errorResponse('Request origin is not allowed.', 403);
  if (!isDatabaseConfigured) return errorResponse('DATABASE_URL is not configured.', 503);
  const id = new URL(request.url).searchParams.get('id');
  if (!id || !/^\d+$/.test(id)) return errorResponse('A valid research monitor id is required.', 400);
  try {
    return await deleteAdminResearchTrack(id)
      ? NextResponse.json({ success: true })
      : errorResponse('Research monitor not found.', 404);
  } catch (error) {
    console.error('Failed to delete admin research monitor:', error);
    return errorResponse('Could not delete the research monitor.', 500);
  }
}