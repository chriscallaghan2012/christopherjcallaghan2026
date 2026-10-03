import { NextResponse } from 'next/server';
import {
  disconnectAdminGoogle,
  getAdminGoogleConnection,
  isDatabaseConfigured,
  listAdminGoogleSnapshots
} from '@/lib/database';
import { getGoogleOAuthConfig } from '@/lib/googleConnectorAuth';
import { isSameOriginRequest, verifyAdminSession } from '@/lib/adminAuth';

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: Request) {
  if (!verifyAdminSession(request)) return errorResponse('Sign in to view connector status.', 401);
  if (!isDatabaseConfigured) return errorResponse('DATABASE_URL is not configured.', 503);
  try {
    const [connection, snapshots] = await Promise.all([
      getAdminGoogleConnection(),
      listAdminGoogleSnapshots(30)
    ]);
    const config = getGoogleOAuthConfig(request.url);
    return NextResponse.json({
      google: {
        configured: Boolean(config),
        connected: Boolean(connection),
        accountEmail: connection?.accountEmail ?? null,
        grantedScopes: connection?.grantedScopes ?? [],
        connectedAt: connection?.connectedAt ?? null,
        lastSyncedAt: connection?.lastSyncedAt ?? null,
        lastSyncStatus: connection?.lastSyncStatus ?? ''
      },
      services: {
        database: isDatabaseConfigured,
        gemini: Boolean(process.env.GEMINI_API_KEY),
        email: Boolean(process.env.RESEND_API_KEY)
      },
      snapshots
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to load connector status:', error);
    return errorResponse('Could not load connector status. Apply the Google connector migration first.', 503);
  }
}

export async function DELETE(request: Request) {
  if (!verifyAdminSession(request)) return errorResponse('Sign in to disconnect Google.', 401);
  if (!isSameOriginRequest(request)) return errorResponse('Request origin is not allowed.', 403);
  if (!isDatabaseConfigured) return errorResponse('DATABASE_URL is not configured.', 503);
  try {
    await disconnectAdminGoogle();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to disconnect Google:', error);
    return errorResponse('Could not disconnect Google.', 500);
  }
}
