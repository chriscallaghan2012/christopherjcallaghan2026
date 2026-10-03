import { NextResponse } from 'next/server';
import {
  getAdminGoogleConnection,
  isDatabaseConfigured,
  recordAdminGoogleSync,
  saveAdminGoogleSnapshots
} from '@/lib/database';
import { decryptGoogleRefreshToken, getGoogleOAuthConfig, refreshGoogleAccessToken } from '@/lib/googleConnectorAuth';
import { syncGoogleConnectorData } from '@/lib/googleConnectorSync';
import { isSameOriginRequest, verifyAdminSession } from '@/lib/adminAuth';

export const maxDuration = 60;

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  if (!verifyAdminSession(request)) return errorResponse('Sign in to sync Google data.', 401);
  if (!isSameOriginRequest(request)) return errorResponse('Request origin is not allowed.', 403);
  if (!isDatabaseConfigured) return errorResponse('DATABASE_URL is not configured.', 503);

  try {
    const config = getGoogleOAuthConfig(request.url);
    if (!config) return errorResponse('Google OAuth is not configured. Add the Google OAuth credentials and token encryption key first.', 503);
    const connection = await getAdminGoogleConnection();
    if (!connection) return errorResponse('Connect a Google account before syncing.', 409);

    const refreshToken = decryptGoogleRefreshToken(connection.encryptedRefreshToken, config.encryptionKey);
    const accessToken = await refreshGoogleAccessToken(config, refreshToken);
    const syncResult = await syncGoogleConnectorData(accessToken);
    if (syncResult.snapshots.length) await saveAdminGoogleSnapshots(syncResult.snapshots);

    const status = JSON.stringify({
      snapshots: syncResult.snapshots.length,
      providers: syncResult.sources
    });
    await recordAdminGoogleSync(status);

    return NextResponse.json({
      success: true,
      periodStart: syncResult.periodStart,
      periodEnd: syncResult.periodEnd,
      snapshotsSaved: syncResult.snapshots.length,
      sources: syncResult.sources
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Google connector sync failed:', error);
    const message = error instanceof Error ? error.message : 'Google sync failed.';
    try {
      await recordAdminGoogleSync(JSON.stringify({ error: message }));
    } catch {
      // Preserve the original sync failure for the client response.
    }
    return errorResponse(message, 502);
  }
}
