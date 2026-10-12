/**
 * Shared types for the Website Grader scan engine and report.
 * This module must stay free of server-only imports so it can be used
 * by both the API routes (server) and the client-side report renderer.
 */

export type CategoryId = 'seo' | 'ai' | 'performance' | 'accessibility' | 'security';
export type CheckStatus = 'pass' | 'warning' | 'fail' | 'info' | 'not_measured';
export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type Measured = 'measured' | 'inferred' | 'not_applicable';
export type Difficulty = 'straightforward' | 'intermediate' | 'advanced';

export interface DocLink {
  label: string;
  url: string;
}

export interface Check {
  id: string;
  category: CategoryId;
  name: string;
  status: CheckStatus;
  severity?: Severity;
  /** Concrete evidence collected during the scan (sanitised/truncated). */
  evidence: string[];
  explanation: string;
  fix?: string;
  /** Whether the check was measured directly, inferred, or not applicable. */
  measured: Measured;
  /** Max points this check can contribute within its category. */
  points?: number;
  /** IDs of checks in other categories that share the same underlying evidence
   *  (used to avoid silent double-penalising and to disclose overlap). */
  refs?: string[];
  docs?: DocLink[];
}

export interface CategoryCounts {
  pass: number;
  warning: number;
  fail: number;
  info: number;
  notMeasured: number;
}

export interface CategoryResult {
  id: CategoryId;
  label: string;
  weight: number;
  /** 0-100, or null when no checks in this category were measurable. */
  score: number | null;
  checks: Check[];
  counts: CategoryCounts;
}

export interface Recommendation {
  checkId: string;
  category: CategoryId;
  title: string;
  whatDetected: string;
  whyItMatters: string;
  fix: string;
  priority: Severity;
  /** Clearly an estimate — never a guarantee. */
  estimatedImpact: string;
  difficulty: Difficulty;
  /** Whether a non-technical website owner can reasonably do it. */
  nonTechnical: boolean;
  cta: {
    label: string;
    /** Fallback href (service page or contact). The UI may intercept and
     *  open the pre-filled enquiry modal instead of navigating. */
    href: string;
    service?: string;
  };
}

export interface ScanMeta {
  startedAt: string;
  completedAt: string;
  durationMs: number;
  pageBytes: number;
  httpStatus: number;
  targetUrl: string;
  finalUrl: string;
  redirectChain: string[];
  userAgent: string;
  checksRun: number;
  checksNotMeasured: number;
  stages: string[];
}

export interface OverallScore {
  score: number | null;
  grade: string;
  label: string;
}

export interface ScanReport {
  scanId: string;
  targetUrl: string;
  finalUrl: string;
  createdAt: string;
  status: 'completed' | 'failed';
  /** User-safe error message, never a raw stack trace. */
  error?: string;
  errorCode?: string;
  overall: OverallScore;
  categories: CategoryResult[];
  recommendations: Recommendation[];
  summary: CategoryCounts;
  executiveSummary: string;
  limitations: string[];
  scanMeta: ScanMeta;
  version: string;
}

export type StageId =
  | 'validate'
  | 'availability'
  | 'auxiliary'
  | 'content'
  | 'seo'
  | 'links'
  | 'performance'
  | 'accessibility'
  | 'security'
  | 'ai'
  | 'score'
  | 'recommendations'
  | 'persist';

export interface ProgressEvent {
  type: 'stage';
  id: StageId;
  label: string;
  status: 'started' | 'complete' | 'failed';
  detail?: string;
}

export interface MetaEvent {
  type: 'meta';
  scanId: string;
  targetUrl: string;
}

export interface EmailEvent {
  type: 'email';
  status: 'sent' | 'unavailable' | 'failed' | 'skipped';
  message?: string;
}

export interface ResultEvent {
  type: 'result';
  report: ScanReport;
}

export interface ErrorEvent {
  type: 'error';
  code: string;
  message: string;
}

export type StreamEvent = MetaEvent | ProgressEvent | EmailEvent | ResultEvent | ErrorEvent;

/** Context passed from the grader UI into the consultation enquiry flow. */
export interface GraderEnquiryContext {
  kind: 'finding' | 'report';
  /** Human readable heading for the enquiry, e.g. the finding name. */
  heading: string;
  category?: string;
  targetUrl: string;
  /** Pre-filled, editable notes for the enquiry form. */
  notes: string;
  scope: string;
}

export const GRADER_VERSION = '1.0.0';

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  seo: 'Technical & On-page SEO',
  ai: 'AI Search Readiness',
  performance: 'Performance & UX',
  accessibility: 'Accessibility',
  security: 'Security'
};
