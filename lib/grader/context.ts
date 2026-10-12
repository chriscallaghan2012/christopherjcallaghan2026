/**
 * The shared context built by the engine and passed to every check module.
 * Check modules are pure functions: (context) => Check[].
 */

import type { PageFacts } from './html';
import type { SafeResponse } from './safeNetwork';
import type { Check, CategoryId } from './types';

export interface LinkCheckResult {
  url: string;
  status: number | null;
  ok: boolean;
  error?: string;
}

export interface TlsProbe {
  valid: boolean;
  error?: string;
  issuedTo?: string;
  issuer?: string;
  validFrom?: string;
  validTo?: string;
  daysToExpiry?: number;
}

export interface ScanContext {
  /** Normalised URL the user submitted. */
  targetUrl: string;
  /** URL after redirects were followed. */
  finalUrl: string;
  origin: string;
  hostname: string;
  /** Result of fetching the main page (may be null on failure). */
  page: SafeResponse | null;
  pageFacts: PageFacts | null;
  robotsTxt: string | null;
  robotsTxtStatus: number | null;
  sitemapXml: string | null;
  sitemapStatus: number | null;
  llmsTxt: string | null;
  llmsTxtStatus: number | null;
  /** Probe of http:// -> https redirect behaviour. */
  httpProbe: { status: number | null; redirected: boolean; error?: string } | null;
  tls: TlsProbe | null;
  linkChecks: LinkCheckResult[];
  /** X-Robots-Tag header value on the final page response. */
  xRobotsTag: string | null;
  userAgent: string;
}

export type CheckModule = (ctx: ScanContext) => Check[];

export function makeCategory(id: CategoryId, checks: Check[]): Check[] {
  return checks.map((check) => ({ ...check, category: id }));
}
