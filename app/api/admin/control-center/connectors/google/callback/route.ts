import { timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getAdminGoogleConnection, isDatabaseConfigured, saveAdminGoogleConnection } from '@/lib/database';
import { encryptGoogleRefreshToken, getGoogleOAuthConfig } from '@/lib/googleConnectorAuth';

const STATE_COOKIE = 'cjc_google_oauth_state';
const COOKIE_PATH = '/api/admin/control-center/connectors/google';

function adminRedirect(request: NextRequest, result: string) {
  const response = NextResponse.redirect(new URL(`/admin?google=${encodeURIComponent(result)}`, request.url));
  response.cookies.set(STATE_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: COOKIE_PATH, maxAge: 0 });
  return response;
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  if (query.get('error')) return adminRedirect(request, 'denied');
  if (!isDatabaseConfigured) return adminRedirect(request, 'database-missing');

  const stateCookie = request.cookies.get(STATE_COOKIE)?.value ?? '';
  const stateQuery = query.get('state') ?? '';
  const stateBytes = Buffer.from(stateCookie);
  const queryBytes = Buffer.from(stateQuery);
  if (!stateCookie || stateBytes.length !== queryBytes.length || !timingSafeEqual(stateBytes, queryBytes)) {
    return adminRedirect(request, 'state-error');
  }

  const code = query.get('code');
  const config = getGoogleOAuthConfig(request.url);
  if (!code || !config) return adminRedirect(request, 'oauth-config');

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri,
        grant_type: 'authorization_code'
      })
    });
    const tokens = await tokenResponse.json() as { access_token?: string; refresh_token?: string; scope?: string };
    if (!tokenResponse.ok || !tokens.access_token) return adminRedirect(request, 'token-exchange-failed');

    const userResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });
    const user = await userResponse.json() as { email?: string };
    if (!userResponse.ok || !user.email) return adminRedirect(request, 'profile-failed');

    const previous = tokens.refresh_token ? null : await getAdminGoogleConnection();
    const refreshToken = tokens.refresh_token
      ? encryptGoogleRefreshToken(tokens.refresh_token, config.encryptionKey)
      : previous?.encryptedRefreshToken;
    if (!refreshToken) return adminRedirect(request, 'refresh-token-missing');

    await saveAdminGoogleConnection({
      accountEmail: user.email,
      encryptedRefreshToken: refreshToken,
      grantedScopes: (tokens.scope ?? '').split(' ').filter(Boolean)
    });
    return adminRedirect(request, 'connected');
  } catch (error) {
    console.error('Google OAuth callback failed:', error);
    return adminRedirect(request, 'connection-failed');
  }
}
