import { z } from 'zod';
import { parsePage } from '@/lib/grader/html';
import { safeFetch, SafeNetworkError } from '@/lib/grader/safeNetwork';
import { normalizeTargetUrl } from '@/lib/grader/validate';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const ScanRequestSchema = z.object({
  url: z.string().trim().min(1, 'Enter a page address to scan.').max(2048, 'That address is too long.'),
  region: z.enum(['gb', 'us', 'ie']).default('gb')
});

const rateBuckets = new Map<string, number[]>();
const RATE_LIMIT = 6;
const RATE_WINDOW_MS = 60 * 1000;
const MAX_BODY_BYTES = 16 * 1024;
const MAX_KEYWORDS = 8;
const STOP_WORDS = new Set([
  'about', 'after', 'also', 'and', 'are', 'for', 'from', 'get', 'how', 'into', 'its', 'more',
  'our', 'out', 'the', 'their', 'this', 'with', 'your', 'you', 'was', 'what', 'when', 'where',
  'which', 'who', 'will', 'have', 'has', 'can', 'not', 'all', 'best', 'new', 'page', 'home'
]);

interface KeywordRanking {
  keyword: string;
  evidence: string[];
  position: number | null;
  resultUrl: string | null;
  status: 'ranked' | 'not-found' | 'unavailable';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = (rateBuckets.get(ip) ?? []).filter((timestamp) => now - timestamp < RATE_WINDOW_MS);
  if (bucket.length >= RATE_LIMIT) {
    rateBuckets.set(ip, bucket);
    return true;
  }
  bucket.push(now);
  rateBuckets.set(ip, bucket);
  return false;
}

function extractPageKeywords(facts: ReturnType<typeof parsePage>): Array<{ keyword: string; evidence: string[] }> {
  const sources = [
    { label: 'Title', text: facts.title, weight: 5 },
    ...facts.h1Texts.map((text) => ({ label: 'H1 heading', text, weight: 4 })),
    { label: 'Meta description', text: facts.metaDescription, weight: 2 }
  ];
  const candidates = new Map<string, { score: number; evidence: Set<string>; display: string }>();

  for (const source of sources) {
    const words = source.text.toLocaleLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}'-]{2,}/gu) ?? [];
    const filtered = words.filter((word) => !STOP_WORDS.has(word));
    for (let size = 1; size <= 3; size += 1) {
      for (let index = 0; index <= filtered.length - size; index += 1) {
        const parts = filtered.slice(index, index + size);
        const phrase = parts.join(' ');
        if (phrase.length < 4) continue;
        const current = candidates.get(phrase) ?? { score: 0, evidence: new Set<string>(), display: parts.join(' ') };
        current.score += source.weight * (size === 1 ? 0.7 : 1);
        current.evidence.add(source.label);
        candidates.set(phrase, current);
      }
    }
  }

  const ranked = [...candidates.entries()]
    .sort((a, b) => b[1].score - a[1].score || b[0].length - a[0].length)
    .slice(0, MAX_KEYWORDS);

  return ranked.map(([keyword, data]) => ({
    keyword: data.display,
    evidence: [...data.evidence],
  }));
}

async function lookupGooglePosition(
  keyword: string,
  hostname: string,
  region: string,
  apiKey: string
): Promise<KeywordRanking> {
  const url = new URL('https://serpapi.com/search.json');
  url.searchParams.set('engine', 'google');
  url.searchParams.set('q', keyword);
  url.searchParams.set('gl', region);
  url.searchParams.set('hl', 'en');
  url.searchParams.set('num', '100');
  url.searchParams.set('api_key', apiKey);

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(15000), cache: 'no-store' });
    if (!response.ok) {
      console.error('SERP provider returned an error status:', response.status);
      return { keyword, evidence: [], position: null, resultUrl: null, status: 'unavailable' };
    }
    const data = await response.json() as {
      error?: string;
      organic_results?: Array<{ position?: number; link?: string }>;
    };
    if (data.error) {
      console.error('SERP provider returned an error response.');
      return { keyword, evidence: [], position: null, resultUrl: null, status: 'unavailable' };
    }
    const match = data.organic_results?.find((result) => {
      if (!result.link) return false;
      try {
        return new URL(result.link).hostname.toLowerCase().replace(/^www\./, '') === hostname.replace(/^www\./, '');
      } catch {
        return false;
      }
    });
    return {
      keyword,
      evidence: [],
      position: match?.position ?? null,
      resultUrl: match?.link ?? null,
      status: match ? 'ranked' : 'not-found'
    };
  } catch (error) {
    console.error('SERP provider request failed:', error);
    return { keyword, evidence: [], position: null, resultUrl: null, status: 'unavailable' };
  }
}

async function readBody(request: Request): Promise<string | null> {
  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) return null;
  const reader = request.body?.getReader();
  if (!reader) return '';
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

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return Response.json({ error: 'Too many scans in a short time. Please wait a minute and try again.' }, { status: 429 });
  }

  let bodyText: string | null;
  try {
    bodyText = await readBody(request);
  } catch {
    return Response.json({ error: 'Could not read the request body.' }, { status: 400 });
  }
  if (bodyText === null) {
    return Response.json({ error: 'Request body too large.' }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(bodyText || '{}');
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = ScanRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? 'Enter a valid page address.' }, { status: 400 });
  }

  const normalized = normalizeTargetUrl(parsed.data.url);
  if (!normalized) {
    return Response.json({ error: 'Enter a valid public http(s) website address.' }, { status: 400 });
  }

  try {
    const page = await safeFetch(normalized.url, {
      timeoutMs: 10000,
      maxRedirects: 5,
      maxBytes: 2 * 1024 * 1024,
      userAgent: 'Mozilla/5.0 (compatible; CJCSERPPreview/1.0; +https://christopherjcallaghan.com/tools/serp-preview)'
    });
    const contentType = page.headers['content-type'] ?? '';
    if (!/text\/html|application\/xhtml\+xml/i.test(contentType)) {
      return Response.json({ error: 'That address did not return an HTML page to analyse.' }, { status: 422 });
    }
    if (page.status >= 400) {
      return Response.json({ error: `The page returned HTTP ${page.status}. Check the address and try again.` }, { status: 422 });
    }

    const finalUrl = new URL(page.finalUrl);
    const facts = parsePage(page.body.toString('utf8'), finalUrl.origin);
    const keywords = extractPageKeywords(facts);
    const apiKey = process.env.SERPAPI_API_KEY;
    const rankings = apiKey
      ? await Promise.all(keywords.map((item) => lookupGooglePosition(item.keyword, finalUrl.hostname, parsed.data.region, apiKey)))
      : keywords.map((item) => ({
          keyword: item.keyword,
          evidence: [],
          position: null,
          resultUrl: null,
          status: 'unavailable' as const
        }));

    return Response.json({
      finalUrl: page.finalUrl,
      statusCode: page.status,
      title: facts.title,
      description: facts.metaDescription,
      keywords: keywords.map((item, index) => ({
        ...rankings[index],
        evidence: item.evidence
      })),
      rankingsConfigured: Boolean(apiKey),
      region: parsed.data.region
    }, {
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  } catch (error) {
    if (error instanceof SafeNetworkError) {
      const message = error.code === 'ERR_BLOCKED'
        ? 'That destination is not allowed. Enter a public website address.'
        : error.code === 'ERR_TIMEOUT'
          ? 'The page took too long to respond. Try again or scan another page.'
          : error.code === 'ERR_DNS'
            ? 'We could not find that domain. Check the spelling and try again.'
            : 'We could not reach that page. Check the address and try again.';
      return Response.json({ error: message }, { status: 422 });
    }
    console.error('SERP preview scan failed:', error);
    return Response.json({ error: 'The page could not be analysed. Please try again in a moment.' }, { status: 500 });
  }
}
