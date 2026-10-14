import { NextRequest } from 'next/server';
import { z } from 'zod';
import { sendLeadEmail } from '@/lib/grader/emailReport';
import { isValidEmail } from '@/lib/grader/validate';
import { getScan } from '@/lib/grader/storage';
import type { ScanReport } from '@/lib/grader/types';

export const dynamic = 'force-dynamic';

/**
 * Converts a completed Website Grader scan into an owner lead.
 * The visitor supplies name + email (+ optional phone); the full scan report
 * (loaded by scanId from storage) is emailed to the site owner so the audit
 * arrives with the enquiry. The visitor's email is never persisted.
 */
const LeadRequestSchema = z.object({
  scanId: z.string().trim().min(1).max(128),
  report: z.unknown().optional(),
  name: z.string().trim().min(1, 'Enter your name.').max(120),
  email: z.string().trim().min(1, 'Enter your email.').max(320),
  phone: z.string().trim().max(40).optional().nullable(),
  message: z.string().trim().max(2000).optional().nullable(),
  issues: z.array(z.string().trim().min(1).max(128)).max(30).optional().nullable()
});

const MAX_BODY_BYTES = 256 * 1024;

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

function isUsableClientReport(value: unknown, scanId: string): value is ScanReport {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<ScanReport>;
  if (candidate.scanId !== scanId || candidate.status !== 'completed') return false;
  if (typeof candidate.targetUrl !== 'string' || typeof candidate.finalUrl !== 'string') return false;
  if (!candidate.overall || typeof candidate.overall !== 'object') return false;
  if (!Array.isArray(candidate.categories) || !Array.isArray(candidate.recommendations)) return false;
  if (!candidate.summary || typeof candidate.summary !== 'object') return false;
  if (!candidate.scanMeta || typeof candidate.scanMeta !== 'object') return false;
  try {
    const url = new URL(candidate.targetUrl);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
  } catch {
    return false;
  }
  return true;
}

export async function POST(request: NextRequest) {
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

  const result = LeadRequestSchema.safeParse(parsed);
  if (!result.success) {
    const firstError = result.error.issues[0]?.message ?? 'Invalid request.';
    return Response.json({ success: false, error: firstError }, { status: 400 });
  }

  const { scanId, report: clientReport, name, email, phone, message, issues } = result.data;
  if (!isValidEmail(email)) {
    return Response.json({ success: false, error: 'Enter a valid email address.' }, { status: 400 });
  }

  // Load the persisted report so the owner receives the real scan, not a
  // client-supplied (spoofable) payload.
  let report: ScanReport | null = null;
  try {
    report = (await getScan(scanId)) as ScanReport | null;
  } catch (err) {
    console.error('Failed to load scan for lead:', err);
  }
  // Server-side persistence is preferred. If it is unavailable, accept the report
  // captured by the same-tab UI after checking its shape and matching scan ID.
  // This fallback is for continuity, not a cryptographic proof of report authenticity.
  if (!report && isUsableClientReport(clientReport, scanId)) {
    report = clientReport;
  }
  if (!report) {
    return Response.json(
      { success: false, error: 'We could not find that scan. Please return to the report and try again.' },
      { status: 404 }
    );
  }

  const emailResult = await sendLeadEmail(report, {
    name,
    email,
    phone: phone && phone.trim() ? phone.trim() : undefined,
    message: message && message.trim() ? message.trim() : undefined,
    issueIds: issues ?? undefined
  });

  if (emailResult.status === 'unavailable') {
    return Response.json(
      { success: false, error: 'Delivery is temporarily unavailable. Please email me directly instead.' },
      { status: 503 }
    );
  }
  if (emailResult.status === 'failed') {
    return Response.json(
      { success: false, error: 'We could not send your request just now. Please try again in a moment.' },
      { status: 502 }
    );
  }

  return Response.json({ success: true, confirmationEmailSent: emailResult.confirmationEmailSent ?? false });
}
