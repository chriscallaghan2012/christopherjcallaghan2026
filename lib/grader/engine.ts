/**
 * Website Grader scan engine.
 * Orchestrates the staged, deterministic scan, emits real progress events and
 * assembles the final report.
 */

import { parsePage } from './html';
import { safeFetch, checkLinkStatus, probeTls, probeHttpRedirect, SafeNetworkError } from './safeNetwork';
import { normalizeTargetUrl } from './validate';
import { runSeoChecks } from './checks/seo';
import { runAiChecks } from './checks/ai';
import { runPerformanceChecks } from './checks/performance';
import { runAccessibilityChecks } from './checks/accessibility';
import { runSecurityChecks } from './checks/security';
import { scoreCategories, overallScore } from './scoring';
import { buildRecommendations } from './recommendations';
import { saveScan } from './storage';
import type { ProgressEvent, ScanReport, CategoryId, Check } from './types';
import type { ScanContext } from './context';
import { GRADER_VERSION, CATEGORY_LABELS } from './types';

const STAGES: Array<{ id: ProgressEvent['id']; label: string }> = [
  { id: 'validate', label: 'Validating website address' },
  { id: 'availability', label: 'Checking website availability' },
  { id: 'auxiliary', label: 'Reading robots.txt, sitemap and llms.txt' },
  { id: 'content', label: 'Analysing page content' },
  { id: 'seo', label: 'Checking SEO and indexing signals' },
  { id: 'links', label: 'Checking internal links' },
  { id: 'performance', label: 'Evaluating performance' },
  { id: 'accessibility', label: 'Checking accessibility' },
  { id: 'security', label: 'Checking security headers' },
  { id: 'ai', label: 'Evaluating AI search readiness' },
  { id: 'score', label: 'Calculating scores' },
  { id: 'recommendations', label: 'Preparing recommendations' },
  { id: 'persist', label: 'Finalising your report' }
];

export interface EngineOptions {
  targetUrl: string;
  onEvent?: (evt: ProgressEvent) => void;
  userAgent?: string;
  persist?: boolean;
}

const DEFAULT_USER_AGENT = 'Mozilla/5.0 (compatible; CJCSiteGrader/1.0; +https://christopherjcallaghan.com/tools/website-grader)';

function emit(onEvent: EngineOptions['onEvent'], id: ProgressEvent['id'], label: string, status: ProgressEvent['status'], detail?: string) {
  onEvent?.({ type: 'stage', id, label, status, detail });
}

/** Maps internal error codes to user-safe messages (no stack traces). */
export function userSafeError(code: string | undefined, fallback: string): string {
  const map: Record<string, string> = {
    ERR_INVALID: 'That URL is not valid.',
    ERR_BLOCKED: 'That destination is not allowed to be scanned.',
    ERR_DNS: 'The domain could not be resolved. Check the address and try again.',
    ERR_TIMEOUT: 'The website took too long to respond. It may be slow or blocking automated checks.',
    ERR_TOO_LARGE: 'The page is too large to analyse.',
    ERR_REDIRECTS: 'The website redirected too many times.',
    ERR_REDIRECT: 'The website returned an invalid redirect.',
    ERR_TLS: 'The website has a TLS/certificate problem.',
    ERR_CONNECTION: 'The website refused the connection.',
    ERR_NETWORK: 'The website could not be reached.'
  };
  if (code && code.startsWith('HTTP_')) {
    return `The website returned an error status (${code.replace('HTTP_', 'HTTP ')}).`;
  }
  return map[code ?? ''] ?? fallback;
}

function execSummary(
  checksByCategory: Record<CategoryId, Check[]>,
  recommendations: ScanReport['recommendations'],
  overallLabel: string
): string {
  const all = Object.values(checksByCategory).flat();
  const passed = all.filter((c) => c.status === 'pass').length;
  const failed = all.filter((c) => c.status === 'fail').length;
  const warnings = all.filter((c) => c.status === 'warning').length;

  const strengths = (Object.entries(checksByCategory) as Array<[CategoryId, Check[]]>)
    .filter(([, checks]) => checks.some((c) => c.status === 'pass'))
    .map(([id]) => CATEGORY_LABELS[id])
    .slice(0, 3);

  const top = recommendations.slice(0, 3).map((r) => r.title);

  let summary = `Your website scored ${overallLabel.toLowerCase()} overall. ${passed} checks passed, ${warnings} warnings and ${failed} issues were found.`;
  if (strengths.length) summary += ` Strengths were seen in ${strengths.join(', ').toLowerCase()}.`;
  if (top.length) summary += ` The highest-priority fixes are: ${top.join('; ').toLowerCase()}.`;
  summary += ' This is a diagnostic assessment of observable signals, not a guarantee of rankings, conversions or AI citations.';
  return summary;
}
function buildLimitations(checksNotMeasured: number, pageFetched: boolean, emailConfigured: boolean): string[] {
  const limits: string[] = [];
  if (!pageFetched) limits.push('The page could not be fetched, so content-dependent checks were not measured.');
  if (checksNotMeasured > 0) limits.push(`${checksNotMeasured} check(s) were not measured in this scan. Not-measured checks are excluded from scoring rather than awarded arbitrary points.`);
  limits.push('Lighthouse Core Web Vitals (LCP, INP, CLS, TBT, FCP) require a real browser or real-user field data and were not measured in this serverless scan.');
  limits.push('Accessibility results are from automated HTML-level checks only and do not establish WCAG conformance.');
  limits.push('A crawlable page is not guaranteed to be indexed, and no claim about live Google rankings or AI citations is made.');
  limits.push('This is a single-page audit; site-wide crawling, indexing history and analytics are out of scope.');
  if (!emailConfigured) limits.push('Email delivery is not configured, so emailed reports are currently unavailable.');
  return limits;
}
export async function runScan(options: EngineOptions): Promise<ScanReport> {
  const startedAt = new Date().toISOString();
  const onEvent = options.onEvent;
  const userAgent = options.userAgent || DEFAULT_USER_AGENT;
  const stagesRun: string[] = [];

  const normalized = normalizeTargetUrl(options.targetUrl);
  if (!normalized) {
    const failedReport: ScanReport = {
      scanId: '',
      targetUrl: options.targetUrl,
      finalUrl: '',
      createdAt: startedAt,
      status: 'failed',
      error: userSafeError('ERR_INVALID', 'That URL is not valid.'),
      errorCode: 'ERR_INVALID',
      overall: { score: null, grade: '—', label: 'Not enough data' },
      categories: [],
      recommendations: [],
      summary: { pass: 0, warning: 0, fail: 0, info: 0, notMeasured: 0 },
      executiveSummary: '',
      limitations: [],
      scanMeta: { startedAt, completedAt: new Date().toISOString(), durationMs: 0, pageBytes: 0, httpStatus: 0, targetUrl: options.targetUrl, finalUrl: '', redirectChain: [], userAgent, checksRun: 0, checksNotMeasured: 0, stages: [] },
      version: GRADER_VERSION
    };
    return failedReport;
  }

  emit(onEvent, 'validate', STAGES[0].label, 'complete', normalized.url);
  stagesRun.push('validate');

  const ctx: ScanContext = {
    targetUrl: normalized.url,
    finalUrl: normalized.url,
    origin: normalized.origin,
    hostname: normalized.hostname,
    page: null,
    pageFacts: null,
    robotsTxt: null,
    robotsTxtStatus: null,
    sitemapXml: null,
    sitemapStatus: null,
    llmsTxt: null,
    llmsTxtStatus: null,
    httpProbe: null,
    tls: null,
    linkChecks: [],
    xRobotsTag: null,
    userAgent
  };

  let availabilityError: { code: string; message: string } | null = null;

  // ---- Availability: fetch the main page ----
  emit(onEvent, 'availability', STAGES[1].label, 'started');
  try {
    const page = await safeFetch(normalized.url, { timeoutMs: 15000, maxBytes: 4 * 1024 * 1024, userAgent });
    ctx.page = page;
    ctx.finalUrl = page.finalUrl;
    ctx.xRobotsTag = page.headers['x-robots-tag'] ?? null;
    const finalHost = new URL(page.finalUrl).hostname;
    if (finalHost !== ctx.hostname) {
      ctx.hostname = finalHost;
      try { ctx.origin = new URL(page.finalUrl).origin; } catch { /* keep original */ }
    }
    emit(onEvent, 'availability', STAGES[1].label, 'complete', `HTTP ${page.status}`);
  } catch (err) {
    const code = err instanceof SafeNetworkError ? err.code : 'ERR_NETWORK';
    availabilityError = { code, message: userSafeError(code, 'The website could not be reached.') };
    emit(onEvent, 'availability', STAGES[1].label, 'failed', availabilityError.message);
  }
  stagesRun.push('availability');

  // ---- Auxiliary: robots.txt, sitemap.xml, llms.txt + probes ----
  emit(onEvent, 'auxiliary', STAGES[2].label, 'started');
  const auxiliaryUrl = (path: string) => {
    const base = new URL(ctx.origin);
    base.pathname = path;
    base.search = '';
    base.hash = '';
    return base.toString();
  };
  const fetchText = async (path: string): Promise<{ body: string | null; status: number | null }> => {
    try {
      const res = await safeFetch(auxiliaryUrl(path), { timeoutMs: 6000, maxBytes: 512 * 1024, userAgent });
      if (res.status >= 400) return { body: null, status: res.status };
      return { body: res.body.toString('utf8').slice(0, 256 * 1024), status: res.status };
    } catch {
      return { body: null, status: null };
    }
  };
  const [robots, sitemap, llms] = await Promise.all([
    fetchText('/robots.txt'),
    fetchText('/sitemap.xml'),
    fetchText('/llms.txt')
  ]);
  ctx.robotsTxt = robots.body;
  ctx.robotsTxtStatus = robots.status;
  ctx.sitemapXml = sitemap.body;
  ctx.sitemapStatus = sitemap.status;
  ctx.llmsTxt = llms.body;
  ctx.llmsTxtStatus = llms.status;

  // Probes run in parallel but tolerate failures.
  const probes = await Promise.allSettled([
    probeTls(ctx.finalUrl),
    probeHttpRedirect(ctx.finalUrl)
  ]);
  if (probes[0].status === 'fulfilled') ctx.tls = probes[0].value;
  if (probes[1].status === 'fulfilled') ctx.httpProbe = probes[1].value;
  emit(onEvent, 'auxiliary', STAGES[2].label, 'complete');
  stagesRun.push('auxiliary');
  // ---- Content: parse the HTML ----
  emit(onEvent, 'content', STAGES[3].label, 'started');
  if (ctx.page && ctx.page.body.length > 0) {
    const html = ctx.page.body.toString('utf8');
    try {
      ctx.pageFacts = parsePage(html, ctx.origin);
      emit(onEvent, 'content', STAGES[3].label, 'complete');
    } catch {
      ctx.pageFacts = null;
      emit(onEvent, 'content', STAGES[3].label, 'failed', 'Page content could not be parsed.');
    }
  } else {
    emit(onEvent, 'content', STAGES[3].label, 'failed', 'No page content available.');
  }
  stagesRun.push('content');

  // ---- SEO + internal link checks ----
  emit(onEvent, 'seo', STAGES[4].label, 'started');
  const seoChecks = runSeoChecks(ctx);
  emit(onEvent, 'seo', STAGES[4].label, 'complete', `${seoChecks.length} checks`);
  stagesRun.push('seo');

  emit(onEvent, 'links', STAGES[5].label, 'started');
  if (ctx.pageFacts) {
    const candidates = [...new Set(ctx.pageFacts.internalLinks)].filter((u) => {
      try {
        const parsed = new URL(u);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch {
        return false;
      }
    }).slice(0, 8);
    const results = await Promise.all(candidates.map((u) => checkLinkStatus(u, { userAgent })));
    ctx.linkChecks = results;
  }
  emit(onEvent, 'links', STAGES[5].label, 'complete', `${ctx.linkChecks.length} link(s) checked`);
  stagesRun.push('links');

  // ---- Remaining categories ----
  emit(onEvent, 'performance', STAGES[6].label, 'started');
  const performanceChecks = runPerformanceChecks(ctx);
  emit(onEvent, 'performance', STAGES[6].label, 'complete');
  stagesRun.push('performance');

  emit(onEvent, 'accessibility', STAGES[7].label, 'started');
  const accessibilityChecks = runAccessibilityChecks(ctx);
  emit(onEvent, 'accessibility', STAGES[7].label, 'complete');
  stagesRun.push('accessibility');

  emit(onEvent, 'security', STAGES[8].label, 'started');
  const securityChecks = runSecurityChecks(ctx);
  emit(onEvent, 'security', STAGES[8].label, 'complete');
  stagesRun.push('security');

  emit(onEvent, 'ai', STAGES[9].label, 'started');
  const aiChecks = runAiChecks(ctx);
  emit(onEvent, 'ai', STAGES[9].label, 'complete');
  stagesRun.push('ai');
  // ---- Score ----
  emit(onEvent, 'score', STAGES[10].label, 'started');
  const checksByCategory: Record<CategoryId, Check[]> = {
    seo: seoChecks,
    ai: aiChecks,
    performance: performanceChecks,
    accessibility: accessibilityChecks,
    security: securityChecks
  };
  const categories = scoreCategories([
    { id: 'seo', checks: seoChecks },
    { id: 'ai', checks: aiChecks },
    { id: 'performance', checks: performanceChecks },
    { id: 'accessibility', checks: accessibilityChecks },
    { id: 'security', checks: securityChecks }
  ]);
  const { overall } = overallScore(categories);
  emit(onEvent, 'score', STAGES[10].label, 'complete', overall.score === null ? 'No measurable data' : `${overall.score}/100`);
  stagesRun.push('score');

  // ---- Recommendations ----
  emit(onEvent, 'recommendations', STAGES[11].label, 'started');
  const allChecks = Object.values(checksByCategory).flat();
  const recommendations = buildRecommendations(allChecks, ctx.targetUrl);
  const summaryCounts = { pass: 0, warning: 0, fail: 0, info: 0, notMeasured: 0 };
  for (const c of allChecks) {
    if (c.status === 'pass') summaryCounts.pass += 1;
    else if (c.status === 'warning') summaryCounts.warning += 1;
    else if (c.status === 'fail') summaryCounts.fail += 1;
    else if (c.status === 'info') summaryCounts.info += 1;
    else summaryCounts.notMeasured += 1;
  }
  emit(onEvent, 'recommendations', STAGES[11].label, 'complete', `${recommendations.length} recommendation(s)`);
  stagesRun.push('recommendations');

  const completedAt = new Date().toISOString();
  const pageFetched = ctx.page !== null;
  const checksNotMeasured = summaryCounts.notMeasured;
  const scanReport: ScanReport = {
    scanId: '',
    targetUrl: ctx.targetUrl,
    finalUrl: ctx.finalUrl,
    createdAt: startedAt,
    status: pageFetched ? 'completed' : 'failed',
    ...(!pageFetched && availabilityError ? { error: availabilityError.message, errorCode: availabilityError.code } : {}),
    overall,
    categories,
    recommendations,
    summary: summaryCounts,
    executiveSummary: execSummary(checksByCategory, recommendations, overall.label),
    limitations: buildLimitations(checksNotMeasured, pageFetched, true),
    scanMeta: {
      startedAt,
      completedAt,
      durationMs: new Date(completedAt).getTime() - new Date(startedAt).getTime(),
      pageBytes: ctx.page?.body.length ?? 0,
      httpStatus: ctx.page?.status ?? 0,
      targetUrl: ctx.targetUrl,
      finalUrl: ctx.finalUrl,
      redirectChain: ctx.page?.redirectChain ?? [],
      userAgent,
      checksRun: allChecks.length - checksNotMeasured,
      checksNotMeasured,
      stages: stagesRun
    },
    version: GRADER_VERSION
  };

  // ---- Persist ----
  emit(onEvent, 'persist', STAGES[12].label, 'started');
  if (options.persist !== false) {
    const { scanId } = await saveScan(scanReport);
    scanReport.scanId = scanId;
  }
  emit(onEvent, 'persist', STAGES[12].label, 'complete', scanReport.scanId ? `Saved as ${scanReport.scanId}` : 'In-memory');
  stagesRun.push('persist');

  return scanReport;
}




