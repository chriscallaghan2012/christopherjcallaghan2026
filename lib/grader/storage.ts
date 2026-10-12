/**
 * Optional persistence for Website Grader reports.
 * Uses the existing Neon `@neondatabase/serverless` connection when
 * `DATABASE_URL` is configured. Only report metadata + JSON is stored — never
 * raw page content or the user's email. Falls back to an in-memory store so
 * development and non-DB deployments still work (reports are then not
 * shareable across instances).
 */

import { neon } from '@neondatabase/serverless';
import type { ScanReport } from './types';

const databaseUrl = process.env.DATABASE_URL;
const sql = databaseUrl ? neon(databaseUrl) : null;

export const isGraderStorageConfigured = Boolean(databaseUrl);

// In-memory fallback (dev / no DB). Bounded to avoid unbounded growth.
const memoryStore = new Map<string, { report: ScanReport; createdAt: number }>();
const MEMORY_MAX = 200;

function randomId(): string {
  return `wg_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

export function assignScanId(existing?: string): string {
  return existing && /^[A-Za-z0-9_-]{6,64}$/.test(existing) ? existing : randomId();
}

export async function saveScan(report: ScanReport): Promise<{ persisted: boolean; scanId: string }> {
  const scanId = assignScanId(report.scanId);
  report.scanId = scanId;
  if (!sql) {
    memoryStore.set(scanId, { report, createdAt: Date.now() });
    if (memoryStore.size > MEMORY_MAX) {
      const oldest = [...memoryStore.entries()].sort((a, b) => a[1].createdAt - b[1].createdAt)[0]?.[0];
      if (oldest) memoryStore.delete(oldest);
    }
    return { persisted: false, scanId };
  }
  try {
    await sql`
      INSERT INTO website_grader_scans (id, target_url, final_url, status, overall_score, report_json)
      VALUES (${scanId}, ${report.targetUrl}, ${report.finalUrl}, ${report.status}, ${report.overall.score ?? null}, ${JSON.stringify(report)}::jsonb)
    `;
    return { persisted: true, scanId };
  } catch (err) {
    console.error('Failed to persist grader scan:', err);
    // Fall back to in-memory so the scan still works.
    memoryStore.set(scanId, { report, createdAt: Date.now() });
    return { persisted: false, scanId };
  }
}

export async function getScan(scanId: string): Promise<ScanReport | null> {
  const id = assignScanId(scanId);
  if (!sql) {
    return memoryStore.get(id)?.report ?? null;
  }
  try {
    const rows = await sql`
      SELECT report_json AS "reportJson"
      FROM website_grader_scans
      WHERE id = ${id}
      LIMIT 1
    `;
    const row = rows[0] as { reportJson: unknown } | undefined;
    if (!row) return null;
    return row.reportJson as ScanReport;
  } catch (err) {
    console.error('Failed to load grader scan:', err);
    return memoryStore.get(id)?.report ?? null;
  }
}
