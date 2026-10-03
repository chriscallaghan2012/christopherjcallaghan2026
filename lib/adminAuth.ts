import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_SESSION_COOKIE = 'cjc_admin_session';
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12;

function getSessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && getSessionSecret());
}

export function verifyAdminPassword(candidate: string): boolean {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword || !getSessionSecret()) return false;

  const expected = Buffer.from(configuredPassword);
  const received = Buffer.from(candidate);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

function signExpiry(expiry: string, secret: string): string {
  return createHmac('sha256', secret).update(expiry).digest('base64url');
}

export function createAdminSessionToken(): string {
  const secret = getSessionSecret();
  if (!secret) throw new Error('ADMIN_SESSION_SECRET must contain at least 32 characters.');
  const expiry = String(Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE);
  return `${expiry}.${signExpiry(expiry, secret)}`;
}

export function verifyAdminSession(request: Request): boolean {
  const secret = getSessionSecret();
  if (!secret) return false;

  const cookieHeader = request.headers.get('cookie') || '';
  const cookie = cookieHeader.split(';').map((item) => item.trim()).find((item) => item.startsWith(`${ADMIN_SESSION_COOKIE}=`));
  if (!cookie) return false;

  const token = decodeURIComponent(cookie.slice(ADMIN_SESSION_COOKIE.length + 1));
  const [expiry, signature] = token.split('.');
  if (!expiry || !signature || !/^\d+$/.test(expiry) || Number(expiry) <= Date.now() / 1000) return false;

  const expected = Buffer.from(signExpiry(expiry, secret));
  const received = Buffer.from(signature);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}