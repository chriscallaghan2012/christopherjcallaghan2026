import { NextRequest } from 'next/server';
import { z } from 'zod';
import { safeFetch, SafeNetworkError } from '@/lib/grader/safeNetwork';
import { normalizeTargetUrl } from '@/lib/grader/validate';
import { analyzeProductPage } from '@/lib/aiEcommerceReadiness';

export const dynamic = 'force-dynamic';
export const maxDuration = 20;

const RequestSchema = z.object({ url: z.string().trim().min(1).max(2048) });
const MAX_BODY_BYTES = 8 * 1024;
const rateBuckets = new Map<string, number[]>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

async function readBody(request: Request): Promise<string | null> {
  const reader = request.body?.getReader();
  if (!reader) {
    const body = await request.text();
    return body.length <= MAX_BODY_BYTES ? body : null;
  }
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString('utf8');
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (rateBuckets.get(ip) ?? []).filter((timestamp) => now - timestamp < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    rateBuckets.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateBuckets.set(ip, recent);
  return false;
}

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export async function POST(request: NextRequest) {
  if (isRateLimited(getClientIp(request))) {
    return Response.json({ success: false, error: 'Too many scans in a short time. Please wait and try again.' }, { status: 429 });
  }

  let bodyText: string | null;
  try { bodyText = await readBody(request); } catch { bodyText = null; }
  if (bodyText === null) return Response.json({ success: false, error: 'Request body too large.' }, { status: 413 });

  let body: unknown;
  try { body = JSON.parse(bodyText || '{}'); } catch {
    return Response.json({ success: false, error: 'Invalid request body.' }, { status: 400 });
  }
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) return Response.json({ success: false, error: 'Enter a valid public website URL.' }, { status: 400 });

  const normalized = normalizeTargetUrl(parsed.data.url);
  if (!normalized) return Response.json({ success: false, error: 'Enter a valid http(s) website URL without credentials.' }, { status: 400 });

  try {
    const response = await safeFetch(normalized.url, {
      timeoutMs: 10_000,
      maxBytes: 2 * 1024 * 1024,
      maxRedirects: 4,
      userAgent: 'CJCProductReadiness/1.0'
    });
    const contentType = (response.headers['content-type'] || '').toLowerCase();
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
      return Response.json({ success: false, error: 'The destination did not return an HTML page that can be analysed.' }, { status: 415 });
    }
    if (response.status >= 400) {
      return Response.json({ success: false, error: `The destination returned HTTP ${response.status}. Try a public product page that can be accessed without signing in.` }, { status: 422 });
    }
    const html = response.body.toString('utf8');
    const report = analyzeProductPage(html, normalized.url, response.finalUrl);
    return Response.json({ success: true, report });
  } catch (error) {
    const code = error instanceof SafeNetworkError ? error.code : 'ERR_NETWORK';
    const messages: Record<string, string> = {
      ERR_BLOCKED: 'That destination is not allowed for security reasons.',
      ERR_INVALID: 'Enter a valid public http(s) website URL.',
      ERR_DNS: 'The domain could not be resolved.',
      ERR_TIMEOUT: 'The website took too long to respond.',
      ERR_REDIRECT: 'The website redirected to a destination that could not be checked safely.',
      ERR_REDIRECTS: 'The website redirected too many times.',
      ERR_TOO_LARGE: 'The website response was too large to analyse.',
      ERR_NETWORK: 'The website could not be fetched. It may block automated requests.'
    };
    return Response.json({ success: false, error: messages[code] ?? messages.ERR_NETWORK }, { status: 422 });
  }
}
