import { NextRequest } from 'next/server';
import { z } from 'zod';
import { runScan } from '@/lib/grader/engine';
import { normalizeTargetUrl, isValidEmail } from '@/lib/grader/validate';
import { sendReportEmail } from '@/lib/grader/emailReport';
import { isGraderStorageConfigured } from '@/lib/grader/storage';
import { GRADER_VERSION } from '@/lib/grader/types';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const ScanRequestSchema = z.object({
  url: z.string().min(1, 'Enter a website URL to audit.').max(2048, 'That URL is too long.'),
  email: z.string().trim().optional().nullable(),
  wantHelp: z.boolean().optional()
});

const MAX_BODY_BYTES = 16 * 1024;

/** Reads the request body with a hard size cap. */
async function readBody(request: Request): Promise<string | null> {
  try {
    const reader = request.body?.getReader();
    if (!reader) {
      const text = await request.text();
      return text.length <= MAX_BODY_BYTES ? text : null;
    }
    const chunks: Uint8Array[] = [];
    let total = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) return null;
      chunks.push(value);
    }
    return Buffer.concat(chunks).toString('utf8');
  } catch {
    return null;
  }
}

/** Lightweight in-memory rate limit (per instance). */
const rateBuckets = new Map<string, number[]>();
const RATE_LIMIT = 6; // scans per window
const RATE_WINDOW_MS = 60 * 1000;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = (rateBuckets.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (bucket.length >= RATE_LIMIT) {
    rateBuckets.set(ip, bucket);
    return true;
  }
  bucket.push(now);
  rateBuckets.set(ip, bucket);
  return false;
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  if (rateLimited(ip)) {
    return Response.json(
      { success: false, error: 'Too many audits in a short time. Please wait a minute and try again.' },
      { status: 429 }
    );
  }

  const bodyText = await readBody(request);
  if (bodyText === null) {
    return Response.json({ success: false, error: 'Request body too large.' }, { status: 413 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(bodyText || '{}');
  } catch {
    return Response.json({ success: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const result = ScanRequestSchema.safeParse(parsed);
  if (!result.success) {
    const firstError = result.error.issues[0]?.message ?? 'Invalid request.';
    return Response.json({ success: false, error: firstError }, { status: 400 });
  }

  const { url, email, wantHelp } = result.data;
  const normalized = normalizeTargetUrl(url);
  if (!normalized) {
    return Response.json({ success: false, error: 'Enter a valid http(s) website URL.' }, { status: 400 });
  }
  const emailValue = email && email.trim() ? email.trim() : null;
  if (emailValue && !isValidEmail(emailValue)) {
    return Response.json({ success: false, error: 'Enter a valid email address to receive the report.' }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (event: object) => {
        try {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        } catch {
          // Stream may already be closing; ignore.
        }
      };

      try {
        emit({ type: 'meta', targetUrl: normalized.url, storageConfigured: isGraderStorageConfigured, version: GRADER_VERSION, wantHelp: Boolean(wantHelp) });

        const report = await runScan({
          targetUrl: url,
          onEvent: (evt) => emit(evt)
        });

        if (emailValue) {
          const emailResult = await sendReportEmail(report, emailValue);
          emit({
            type: 'email',
            status: emailResult.status,
            message: emailResult.status === 'sent'
              ? `Your report has been emailed to ${emailValue}.`
              : (emailResult.error ?? 'Email delivery is not configured yet.')
          });
        }

        emit({ type: 'result', report });
      } catch (err) {
        console.error('Website grader scan failed:', err);
        emit({
          type: 'error',
          code: 'SCAN_FAILED',
          message: 'The audit could not be completed. Please try again in a moment.'
        });
      } finally {
        try { controller.close(); } catch { /* already closed */ }
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}
