import { z } from 'zod';
import { buildReportPdf, type ReportPdfInput } from '@/lib/grader/pdfReport';
import type { CategoryCounts } from '@/lib/grader/types';

export const dynamic = 'force-dynamic';
export const maxDuration = 20;

const countSchema: z.ZodType<CategoryCounts> = z.object({
  pass: z.number().int().nonnegative(),
  warning: z.number().int().nonnegative(),
  fail: z.number().int().nonnegative(),
  info: z.number().int().nonnegative(),
  notMeasured: z.number().int().nonnegative()
});

const reportSchema = z.object({
  targetUrl: z.string().max(2048),
  finalUrl: z.string().max(2048),
  createdAt: z.string().max(100),
  scanId: z.string().max(100),
  overall: z.object({
    score: z.union([z.number(), z.null()]),
    grade: z.string().max(20),
    label: z.string().max(100)
  }),
  summary: countSchema,
  executiveSummary: z.string().max(20_000),
  limitations: z.array(z.string().max(2000)).max(100),
  version: z.string().max(100),
  categories: z.array(z.object({
    id: z.enum(['seo', 'ai', 'performance', 'accessibility', 'security']),
    label: z.string().max(100),
    score: z.union([z.number(), z.null()]),
    counts: countSchema,
    checks: z.array(z.object({
      status: z.enum(['pass', 'warning', 'fail', 'info', 'not_measured']),
      name: z.string().max(500),
      explanation: z.string().max(10_000),
      evidence: z.array(z.string().max(4000)).max(100),
      fix: z.string().max(10_000).optional(),
      docs: z.array(z.object({ label: z.string().max(200), url: z.string().max(2048) })).optional()
    })).max(500)
  })).max(20),
  recommendations: z.array(z.object({
    priority: z.enum(['critical', 'high', 'medium', 'low']),
    title: z.string().max(500),
    category: z.enum(['seo', 'ai', 'performance', 'accessibility', 'security']),
    whatDetected: z.string().max(10_000),
    whyItMatters: z.string().max(10_000),
    fix: z.string().max(10_000),
    estimatedImpact: z.string().max(1000),
    difficulty: z.enum(['straightforward', 'intermediate', 'advanced'])
  })).max(500),
  scanMeta: z.object({
    httpStatus: z.number().int(),
    pageBytes: z.number().nonnegative(),
    durationMs: z.number().nonnegative(),
    checksRun: z.number().int().nonnegative(),
    checksNotMeasured: z.number().int().nonnegative()
  })
}).transform((value): ReportPdfInput => ({
    ...value,
    overall: { ...value.overall, score: value.overall.score ?? null },
    categories: value.categories.map((category) => ({ ...category, score: category.score ?? null }))
  }));

const MAX_BODY_BYTES = 2 * 1024 * 1024;

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
  let bodyText: string | null;
  try {
    bodyText = await readBody(request);
  } catch {
    return Response.json({ error: 'Could not read the report.' }, { status: 400 });
  }
  if (bodyText === null) {
    return Response.json({ error: 'The report is too large to export.' }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(bodyText || '{}');
  } catch {
    return Response.json({ error: 'The report data is invalid.' }, { status: 400 });
  }

  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'The report data is incomplete or invalid.' }, { status: 400 });
  }

  try {
    const pdf = await buildReportPdf(parsed.data);
    const id = parsed.data.scanId.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 64) || 'report';
    return new Response(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="website-audit-${id}.pdf"`,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  } catch (error) {
    console.error('Website grader PDF generation failed:', error);
    return Response.json({ error: 'The report PDF could not be created.' }, { status: 500 });
  }
}
