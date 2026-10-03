import { NextResponse } from 'next/server';
import {
  deleteAdminRankObservation,
  isDatabaseConfigured,
  listAdminRankObservations,
  listAdminResearchTracks,
  saveAdminRankObservation,
  type RankingSource
} from '@/lib/database';
import { isSameOriginRequest, verifyAdminSession } from '@/lib/adminAuth';

const SOURCES: RankingSource[] = ['google', 'local', 'ai_search'];

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: Request) {
  if (!verifyAdminSession(request)) return errorResponse('Sign in to view ranking history.', 401);
  if (!isDatabaseConfigured) return errorResponse('DATABASE_URL is not configured.', 503);
  try {
    const [tracks, observations] = await Promise.all([listAdminResearchTracks(), listAdminRankObservations()]);
    return NextResponse.json({ tracks, observations }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to load ranking history:', error);
    return errorResponse('Could not load ranking history. Apply the admin inbox/rankings migration first.', 503);
  }
}

export async function POST(request: Request) {
  if (!verifyAdminSession(request)) return errorResponse('Sign in to record a ranking check.', 401);
  if (!isSameOriginRequest(request)) return errorResponse('Request origin is not allowed.', 403);
  if (!isDatabaseConfigured) return errorResponse('DATABASE_URL is not configured.', 503);
  try {
    const body = await request.json();
    const trackId = typeof body.trackId === 'string' && /^\d+$/.test(body.trackId) ? body.trackId : null;
    const source = SOURCES.includes(body.source as RankingSource) ? body.source as RankingSource : null;
    const position = body.position === null || body.position === '' || body.position === undefined
      ? null
      : Number.isInteger(body.position) && body.position >= 1 && body.position <= 100
        ? body.position as number
        : undefined;
    const isPresent = typeof body.isPresent === 'boolean' ? body.isPresent : null;
    const resultUrl = typeof body.resultUrl === 'string' ? body.resultUrl.trim() : '';
    const evidence = typeof body.evidence === 'string' ? body.evidence.trim() : '';
    if (!trackId || !source || isPresent === null || position === undefined) {
      return errorResponse('Choose a research monitor, source, and valid result status or position.', 400);
    }
    if (!isPresent && position !== null) return errorResponse('A missing result cannot have a position.', 400);
    if (resultUrl.length > 2000 || evidence.length > 4000) return errorResponse('Result URL or evidence is too long.', 400);

    const observation = await saveAdminRankObservation({ trackId, source, position, isPresent, resultUrl, evidence });
    return observation
      ? NextResponse.json({ observation })
      : errorResponse('Research monitor not found.', 404);
  } catch (error) {
    console.error('Failed to save ranking observation:', error);
    return errorResponse('Could not save the ranking observation.', 500);
  }
}

export async function DELETE(request: Request) {
  if (!verifyAdminSession(request)) return errorResponse('Sign in to delete ranking observations.', 401);
  if (!isSameOriginRequest(request)) return errorResponse('Request origin is not allowed.', 403);
  if (!isDatabaseConfigured) return errorResponse('DATABASE_URL is not configured.', 503);
  const id = new URL(request.url).searchParams.get('id');
  if (!id || !/^\d+$/.test(id)) return errorResponse('A valid ranking observation id is required.', 400);
  try {
    return await deleteAdminRankObservation(id)
      ? NextResponse.json({ success: true })
      : errorResponse('Ranking observation not found.', 404);
  } catch (error) {
    console.error('Failed to delete ranking observation:', error);
    return errorResponse('Could not delete the ranking observation.', 500);
  }
}