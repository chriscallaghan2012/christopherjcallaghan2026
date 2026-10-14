import type { ScanReport } from './types';

const KEY_PREFIX = 'cjc:website-grader:report:';

/** Keep the latest scan available across the report -> request form -> back navigation flow. */
export function cacheClientScanReport(report: ScanReport): void {
  if (typeof window === 'undefined' || !report?.scanId) return;
  try {
    window.sessionStorage.setItem(`${KEY_PREFIX}${report.scanId}`, JSON.stringify(report));
    window.sessionStorage.setItem('cjc:website-grader:latest-scan', report.scanId);
  } catch {
    // Storage can be disabled or full; the server-persisted report remains the primary source.
  }
}

/** Read a same-tab report when server persistence is unavailable or a scan has not been stored yet. */
export function readClientScanReport(scanId: string): ScanReport | null {
  if (typeof window === 'undefined' || !scanId) return null;
  try {
    const raw = window.sessionStorage.getItem(`${KEY_PREFIX}${scanId}`);
    if (!raw) return null;
    const value = JSON.parse(raw) as ScanReport;
    return value && value.scanId === scanId && value.overall && Array.isArray(value.categories)
      ? value
      : null;
  } catch {
    return null;
  }
}

/** Most recent same-tab scan, used only when returning from a request flow without a URL parameter. */
export function readLatestClientScanId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage.getItem('cjc:website-grader:latest-scan');
  } catch {
    return null;
  }
}
