/**
 * URL validation and normalisation for the Website Grader.
 * Handles untrusted user input: only http/https, credentials stripped,
 * safe normalisation, no fragments, sensible length caps.
 */

export interface NormalizedTarget {
  url: string;
  origin: string;
  hostname: string;
}

export const MAX_URL_LENGTH = 2048;
export const MAX_EMAIL_LENGTH = 320;

/** Returns a user-safe error message or null. */
export function validateTargetUrl(raw: string): string | null {
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return 'Enter a website URL to audit.';
  }
  const value = raw.trim();
  if (value.length > MAX_URL_LENGTH) {
    return 'That URL is too long.';
  }

  let candidate = value;
  // Allow the user to type "example.com" without a scheme.
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return 'That does not look like a valid URL.';
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return 'Only http:// and https:// destinations are supported.';
  }
  if (!parsed.hostname || parsed.hostname.length < 1) {
    return 'Enter a valid domain name.';
  }
  if (parsed.username || parsed.password) {
    return 'URLs with embedded login details are not supported.';
  }

  return null;
}

/**
 * Normalises a validated URL: strips credentials, removes hash fragments,
 * keeps the path (defaults to '/'), and always returns http/https.
 */
export function normalizeTargetUrl(raw: string): NormalizedTarget | null {
  const error = validateTargetUrl(raw);
  if (error) return null;

  let candidate = raw.trim();
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }
  const parsed = new URL(candidate);
  parsed.username = '';
  parsed.password = '';
  parsed.hash = '';
  if (parsed.pathname === '' || parsed.pathname === '/') {
    parsed.pathname = '/';
  }
  const url = parsed.toString();
  return {
    url,
    origin: parsed.origin,
    hostname: parsed.hostname.toLowerCase()
  };
}

/** Basic, server-side check that an email looks plausible. */
export function isValidEmail(email: string): boolean {
  if (typeof email !== 'string' || email.length > MAX_EMAIL_LENGTH) return false;
  const value = email.trim();
  if (value.length < 3 || value.length > 254) return false;
  const parts = value.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || local.length > 64) return false;
  if (!domain || domain.includes('..') || !domain.includes('.')) return false;
  return /^[^\s@]+$/.test(local) && /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain);
}
