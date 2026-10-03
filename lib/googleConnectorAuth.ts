import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

export const GOOGLE_CONNECTOR_SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/tagmanager.readonly',
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/business.manage'
] as const;

export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  encryptionKey: Buffer;
  redirectUri: string;
}

export function getGoogleOAuthConfig(requestUrl: string): GoogleOAuthConfig | null {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const encodedEncryptionKey = process.env.GOOGLE_TOKEN_ENCRYPTION_KEY;
  if (!clientId || !clientSecret || !encodedEncryptionKey) return null;

  const encryptionKey = Buffer.from(encodedEncryptionKey, 'base64');
  if (encryptionKey.length !== 32) return null;

  const redirectUri = process.env.GOOGLE_REDIRECT_URI
    || new URL('/api/admin/control-center/connectors/google/callback', requestUrl).toString();
  return { clientId, clientSecret, encryptionKey, redirectUri };
}

export function encryptGoogleRefreshToken(token: string, key: Buffer): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), ciphertext].map((part) => part.toString('base64url')).join('.');
}

export function decryptGoogleRefreshToken(value: string, key: Buffer): string {
  const [encodedIv, encodedTag, encodedCiphertext] = value.split('.');
  if (!encodedIv || !encodedTag || !encodedCiphertext) throw new Error('Stored Google credential is invalid.');
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(encodedIv, 'base64url'));
  decipher.setAuthTag(Buffer.from(encodedTag, 'base64url'));
  return Buffer.concat([
    decipher.update(Buffer.from(encodedCiphertext, 'base64url')),
    decipher.final()
  ]).toString('utf8');
}

export async function refreshGoogleAccessToken(config: GoogleOAuthConfig, refreshToken: string): Promise<string> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    })
  });
  const result = await response.json() as { access_token?: string };
  if (!response.ok || !result.access_token) throw new Error('Google could not refresh the access token. Reconnect the account.');
  return result.access_token;
}
