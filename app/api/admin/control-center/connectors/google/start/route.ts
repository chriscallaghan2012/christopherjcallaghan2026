import { randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { isSameOriginRequest, verifyAdminSession } from '@/lib/adminAuth';
import { getGoogleOAuthConfig, GOOGLE_CONNECTOR_SCOPES } from '@/lib/googleConnectorAuth';

const STATE_COOKIE = 'cjc_google_oauth_state';
const COOKIE_PATH = '/api/admin/control-center/connectors/google';

export async function GET(request: NextRequest) {
  if (!verifyAdminSession(request)) return NextResponse.json({ error: 'Sign in before connecting Google.' }, { status: 401 });
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  const config = getGoogleOAuthConfig(request.url);
  if (!config) {
    return NextResponse.json({
      error: 'Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and a base64-encoded 32-byte GOOGLE_TOKEN_ENCRYPTION_KEY in the server environment.'
    }, { status: 503 });
  }

  const state = randomBytes(32).toString('base64url');
  const authorizationUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authorizationUrl.searchParams.set('client_id', config.clientId);
  authorizationUrl.searchParams.set('redirect_uri', config.redirectUri);
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('scope', GOOGLE_CONNECTOR_SCOPES.join(' '));
  authorizationUrl.searchParams.set('access_type', 'offline');
  authorizationUrl.searchParams.set('include_granted_scopes', 'true');
  authorizationUrl.searchParams.set('prompt', 'consent');
  authorizationUrl.searchParams.set('state', state);
  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: COOKIE_PATH,
    maxAge: 600
  });
  return response;
}
