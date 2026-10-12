import { z } from 'zod';
import { parsePage } from '@/lib/grader/html';
import { safeFetch, SafeNetworkError } from '@/lib/grader/safeNetwork';
import { normalizeTargetUrl } from '@/lib/grader/validate';

export const dynamic = 'force-dynamic';
export const maxDuration = 20;

const ScanRequestSchema = z.object({
  url: z.string().trim().min(1, 'Enter a page address to scan.').max(2048, 'That address is too long.')
});

const rateBuckets = new Map<string, number[]>();
const RATE_LIMIT = 6;
const RATE_WINDOW_MS = 60 * 1000;
const MAX_BODY_BYTES = 16 * 1024;

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

function evaluateOnPageSeo(facts: ReturnType<typeof parsePage>, xRobotsTag: string | undefined) {
  const robotsDirectives = [...facts.metaRobotsValues, ...(xRobotsTag ? [xRobotsTag] : [])];
  const checks = [
    {
      name: 'Page title',
      weight: 20,
      status: !facts.title ? 'needs-work' as const : facts.titleLength >= 30 && facts.titleLength <= 60 ? 'good' as const : 'warning' as const,
      evidence: facts.title ? `"${facts.title}" (${facts.titleLength} characters)` : 'No title tag was found.',
      guidance: facts.title ? 'Keep it distinctive and put the page’s main topic near the beginning.' : 'Add a unique, descriptive <title> tag that clearly names this page.'
    },
    {
      name: 'Meta description',
      weight: 15,
      status: !facts.metaDescription ? 'needs-work' as const : facts.metaDescriptionLength >= 70 && facts.metaDescriptionLength <= 160 ? 'good' as const : 'warning' as const,
      evidence: facts.metaDescription ? `"${facts.metaDescription}" (${facts.metaDescriptionLength} characters)` : 'No meta description was found.',
      guidance: facts.metaDescription ? 'Summarise the page accurately and make the next step clear; search engines may choose other page text.' : 'Add a useful page-specific summary. It can help explain the result, though it is not a direct ranking boost.'
    },
    {
      name: 'Main heading (H1)',
      weight: 15,
      status: facts.h1Count === 1 ? 'good' as const : facts.h1Count === 0 ? 'needs-work' as const : 'warning' as const,
      evidence: facts.h1Count === 0 ? 'No H1 heading was found.' : `${facts.h1Count} H1 heading${facts.h1Count === 1 ? '' : 's'} found${facts.h1Texts[0] ? `; first: "${facts.h1Texts[0]}"` : ''}.`,
      guidance: facts.h1Count === 1 ? 'Keep one clear main heading that matches what the page is about.' : 'Use one clear H1 as the page’s main heading, then structure subsections beneath it.'
    },
    {
      name: 'Heading structure',
      weight: 10,
      status: facts.headingLevels.includes(2) ? 'good' as const : 'warning' as const,
      evidence: facts.headingLevels.length ? `${facts.headingLevels.length} heading${facts.headingLevels.length === 1 ? '' : 's'} found; ${facts.headingLevels.filter((level) => level === 2).length} H2 subheading${facts.headingLevels.filter((level) => level === 2).length === 1 ? '' : 's'}.` : 'No heading elements were found.',
      guidance: 'Use descriptive subheadings to make the page easier to scan and its sections easier to understand.'
    },
    {
      name: 'Canonical URL',
      weight: 10,
      status: facts.canonical ? 'good' as const : 'warning' as const,
      evidence: facts.canonical ? `Canonical declared: ${facts.canonical}` : 'No canonical link was found.',
      guidance: 'Declare the preferred URL when this page may have duplicate or alternate URLs.'
    },
    {
      name: 'Mobile viewport',
      weight: 10,
      status: facts.viewport ? 'good' as const : 'needs-work' as const,
      evidence: facts.viewport ? `Viewport declared: ${facts.viewport}` : 'No viewport meta tag was found.',
      guidance: 'Add a responsive viewport meta tag so mobile browsers render the page at the device width.'
    },
    {
      name: 'Image alternative text',
      weight: 10,
      status: facts.images.length === 0 ? 'not-applicable' as const : facts.images.every((image) => image.hasAlt) ? 'good' as const : 'warning' as const,
      evidence: facts.images.length === 0 ? 'No images were found on this page.' : `${facts.images.filter((image) => image.hasAlt).length} of ${facts.images.length} images have an alt attribute.`,
      guidance: 'Add concise, accurate alt text to informative images; use empty alt text for decorative images.'
    },
    {
      name: 'Indexing instructions',
      weight: 5,
      status: robotsDirectives.some((value) => /\b(?:noindex|none)\b/i.test(value)) ? 'needs-work' as const : 'good' as const,
      evidence: robotsDirectives.length ? `Robots directives: ${robotsDirectives.join('; ')}` : 'No page-level robots restriction was found.',
      guidance: 'Check that noindex is intentional if you want this page to appear in search results.'
    },
    {
      name: 'Social sharing metadata',
      weight: 5,
      status: facts.og.title && facts.og.description && facts.og.image ? 'good' as const : 'warning' as const,
      evidence: [facts.og.title && 'og:title', facts.og.description && 'og:description', facts.og.image && 'og:image'].filter(Boolean).length
        ? `${[facts.og.title && 'og:title', facts.og.description && 'og:description', facts.og.image && 'og:image'].filter(Boolean).join(', ')} found.`
        : 'Open Graph title, description and image are incomplete.',
      guidance: 'Complete Open Graph tags to make shared links display clearly; these mainly affect social previews, not Google rankings.'
    }
  ];

  const scoredChecks = checks.filter((check) => check.status !== 'not-applicable');
  const availableWeight = scoredChecks.reduce((total, check) => total + check.weight, 0);
  const earnedWeight = scoredChecks.reduce((total, check) => total + (check.status === 'good' ? check.weight : check.status === 'warning' ? check.weight * 0.5 : 0), 0);
  const score = availableWeight ? Math.round((earnedWeight / availableWeight) * 100) : 0;
  const rankedChecks = [...checks].sort((a, b) => {
    const issueRank = (status: typeof a.status) => status === 'needs-work' ? 0 : status === 'warning' ? 1 : status === 'good' ? 2 : 3;
    return issueRank(a.status) - issueRank(b.status) || b.weight - a.weight;
  });

  return { score, checks: rankedChecks };
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
    const seo = evaluateOnPageSeo(facts, page.headers['x-robots-tag']);

    return Response.json({
      url: normalized.url,
      finalUrl: page.finalUrl,
      statusCode: page.status,
      title: facts.title,
      description: facts.metaDescription,
      score: seo.score,
      checks: seo.checks
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
