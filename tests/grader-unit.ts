/**
 * Website Grader unit tests — deterministic, no external network access.
 * Run with: npm test   (tsx tests/grader-unit.ts && tsx tests/smoke.ts)
 *
 * Covers: URL validation/normalisation, prohibited-destination blocking,
 * HTML parsing, structured-data parsing, missing metadata/heading checks,
 * scoring rules (including not-measured treatment), and recommendation
 * generation with contextual CTAs.
 */

import assert from 'node:assert/strict';
import { validateTargetUrl, normalizeTargetUrl, isValidEmail, MAX_URL_LENGTH } from '../lib/grader/validate';
import { isBlockedHostname, isIpBlocked } from '../lib/grader/safeNetwork';
import { parsePage } from '../lib/grader/html';
import { scoreCategory, scoreCategories, overallScore, gradeFor, CATEGORY_WEIGHTS } from '../lib/grader/scoring';
import { buildRecommendations } from '../lib/grader/recommendations';
import { runSeoChecks } from '../lib/grader/checks/seo';
import { findBlockedAiCrawlers, runAiChecks } from '../lib/grader/checks/ai';
import { runScan } from '../lib/grader/engine';
import { buildReportPdf } from '../lib/grader/pdfReport';
import type { ScanContext } from '../lib/grader/context';
import type { Check, CheckStatus, ScanReport } from '../lib/grader/types';

interface TestCase {
  name: string;
  fn: () => void | Promise<void>;
}

const cases: TestCase[] = [];
function test(name: string, fn: () => void | Promise<void>) {
  cases.push({ name, fn });
}

// ---------------------------------------------------------------------------
// Fixtures (served locally in tests/smoke.ts too; never hit the public web)
// ---------------------------------------------------------------------------

const GOOD_PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>Acme Widgets | Best Widgets in Manchester</title>
<meta name="description" content="Acme Widgets makes high-quality widgets for businesses across Manchester. Book a free demo today.">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="canonical" href="https://acme.test/">
<meta property="og:title" content="Acme Widgets"><meta property="og:description" content="Best widgets in Manchester."><meta property="og:image" content="https://acme.test/og.jpg">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Acme Widgets","url":"https://acme.test"}</script>
</head><body>
<header><nav><a href="/">Home</a><a href="/services">Services</a></nav></header>
<main><h1>Acme Widgets</h1><h2>What we do</h2>
<p>We build high quality widgets for businesses across Manchester and the UK. Our widgets help teams save time and reduce cost. Contact us at hello@acme.test to get started.</p>
<img src="/hero.jpg" alt="Acme widget" width="800" height="400" loading="lazy">
</main><footer><p>&copy; Acme Widgets Ltd.</p></footer></body></html>`;

const BROKEN_PAGE = `<!doctype html><html><head><meta charset="utf-8">
<title></title>
<script type="application/ld+json">{ this is not valid json }</script>
</head><body>
<img src="/photo.jpg">
<div><input type="text" name="email"></div>
<p>Almost no content here.</p>
</body></html>`;

/** Builds a scan context around pre-parsed HTML — no network involved. */
function buildContext(html: string, origin = 'https://acme.test'): ScanContext {
  const pageFacts = parsePage(html, origin);
  return {
    targetUrl: `${origin}/`,
    finalUrl: `${origin}/`,
    origin,
    hostname: new URL(origin).hostname,
    page: {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'x-content-type-options': 'nosniff',
        'referrer-policy': 'strict-origin-when-cross-origin',
        'content-encoding': 'gzip'
      },
      body: Buffer.from(html),
      finalUrl: `${origin}/`,
      redirectChain: []
    },
    pageFacts,
    robotsTxt: 'User-agent: *\nAllow: /\n',
    robotsTxtStatus: 200,
    sitemapXml: '<?xml version="1.0"?><urlset></urlset>',
    sitemapStatus: 200,
    llmsTxt: '# Acme Widgets\n',
    llmsTxtStatus: 200,
    httpProbe: { status: 200, redirected: false },
    tls: null,
    linkChecks: [],
    xRobotsTag: null,
    userAgent: 'CJCSiteGrader-Test/1.0'
  };
}

function findCheck(checks: Check[], id: string): Check {
  const found = checks.find((c) => c.id === id);
  assert.ok(found, `expected check "${id}" to exist`);
  return found;
}

// ---------------------------------------------------------------------------
test('AI crawler rules respect user-agent groups', () => { assert.deepEqual(findBlockedAiCrawlers('User-agent: OtherBot\nDisallow: /\n\nUser-agent: *\nAllow: /', '/'), []); });

test('AI crawler rules detect a specific disallow', () => { assert.deepEqual(findBlockedAiCrawlers('User-agent: GPTBot\nDisallow: /\n\nUser-agent: *\nAllow: /', '/'), ['GPTBot']); });

test('AI crawler path rules respect a more specific allow', () => { const robots = 'User-agent: GPTBot\nDisallow: /\nAllow: /public/\n\nUser-agent: *\nAllow: /'; assert.deepEqual(findBlockedAiCrawlers(robots, '/public/page'), []); assert.ok(findBlockedAiCrawlers(robots, '/private/page').includes('GPTBot')); });

test('missing robots file is not reported as confirmed crawler access', () => { assert.deepEqual(findBlockedAiCrawlers(null, '/'), []); const ctx = buildContext(GOOD_PAGE); ctx.robotsTxt = null; const result = runAiChecks(ctx).find((item) => item.id === 'ai-crawler-permissive'); assert.ok(result); assert.equal(result.status, 'not_measured'); assert.equal(result.points, 0); });

test('AI vocabulary and word count are context only, not quality scores', () => { const checks = runAiChecks(buildContext(GOOD_PAGE)); for (const id of ['ai-topical-focus', 'ai-service-clarity', 'ai-title-meta', 'ai-internal-relations']) { const result = checks.find((item) => item.id === id); assert.ok(result); assert.equal(result.status, 'info'); assert.equal(result.points, 0); } });

// 1. URL validation and normalisation
// ---------------------------------------------------------------------------

test('accepts a plain https URL', () => {
  assert.equal(validateTargetUrl('https://example.com/page'), null);
});

test('accepts a bare domain and defaults to https', () => {
  assert.equal(validateTargetUrl('example.com'), null);
  const normalized = normalizeTargetUrl('example.com');
  assert.ok(normalized);
  assert.equal(normalized.url, 'https://example.com/');
  assert.equal(normalized.hostname, 'example.com');
});

test('rejects URLs with embedded login details rather than silently stripping them', () => {
  assert.notEqual(validateTargetUrl('https://user:secret@example.com/'), null);
  assert.equal(normalizeTargetUrl('https://user:secret@example.com/'), null);
});

test('strips hash fragments', () => {
  const normalized = normalizeTargetUrl('https://example.com/page#section');
  assert.ok(normalized);
  assert.ok(!normalized.url.includes('#'));
});

test('rejects non-http(s) protocols', () => {
  assert.notEqual(validateTargetUrl('ftp://example.com/'), null);
  assert.notEqual(validateTargetUrl('javascript:alert(1)'), null);
  assert.notEqual(validateTargetUrl('file:///etc/passwd'), null);
});

test('rejects empty, oversized and malformed URLs', () => {
  assert.notEqual(validateTargetUrl(''), null);
  assert.notEqual(validateTargetUrl('   '), null);
  assert.notEqual(validateTargetUrl('x'.repeat(MAX_URL_LENGTH + 1)), null);
  assert.notEqual(validateTargetUrl('http://'), null);
});

test('email validation accepts plausible addresses and rejects bad ones', () => {
  assert.equal(isValidEmail('person@example.com'), true);
  assert.equal(isValidEmail('person@example.co.uk'), true);
  assert.equal(isValidEmail('not-an-email'), false);
  assert.equal(isValidEmail('missing@domain'), false);
  assert.equal(isValidEmail('two@@at.com'), false);
  assert.equal(isValidEmail(`${'a'.repeat(65)}@example.com`), false);
});

// ---------------------------------------------------------------------------
// 2. Prohibited destination blocking (SSRF protections)
// ---------------------------------------------------------------------------

test('blocks localhost and internal hostnames', () => {
  assert.equal(isBlockedHostname('localhost'), true);
  assert.equal(isBlockedHostname('localhost.localdomain'), true);
  assert.equal(isBlockedHostname('example.internal'), true);
  assert.equal(isBlockedHostname('example.com'), false);
});

test('blocks private, loopback, link-local and metadata IPs', () => {
  assert.equal(isIpBlocked('127.0.0.1'), true);
  assert.equal(isIpBlocked('10.1.2.3'), true);
  assert.equal(isIpBlocked('192.168.1.10'), true);
  assert.equal(isIpBlocked('172.16.5.5'), true);
  assert.equal(isIpBlocked('169.254.169.254'), true);
  assert.equal(isIpBlocked('0.0.0.0'), true);
  assert.equal(isIpBlocked('::1'), true);
  assert.equal(isIpBlocked('93.184.216.34'), false);
});

test('engine rejects invalid targets with a user-safe failed report', async () => {
  const report = await runScan({ targetUrl: 'ftp://example.com/', persist: false });
  assert.equal(report.status, 'failed');
  assert.equal(report.errorCode, 'ERR_INVALID');
  assert.ok(report.error && report.error.length > 0);
  // User-safe message: no stack traces or internal paths.
  assert.ok(!report.error.includes(' at '));
  assert.ok(!report.error.includes('/Users/'));
});

// ---------------------------------------------------------------------------
// 3. HTML parsing + structured-data parsing
// ---------------------------------------------------------------------------

test('parsePage extracts metadata from a well-optimised page', () => {
  const facts = parsePage(GOOD_PAGE, 'https://acme.test');
  assert.equal(facts.title, 'Acme Widgets | Best Widgets in Manchester');
  assert.ok(facts.metaDescription.length > 0);
  assert.equal(facts.h1Count, 1);
  assert.equal(facts.canonical, 'https://acme.test/');
  assert.equal(facts.lang, 'en');
  assert.ok(facts.viewport);
  assert.equal(facts.structuredData.length, 1);
  assert.equal(facts.structuredData[0].validJson, true);
  assert.ok(facts.jsonLdTypes.includes('Organization'));
  assert.equal(facts.hasMain, true);
  assert.equal(facts.hasNav, true);
  assert.equal(facts.hasHeader, true);
  assert.equal(facts.hasFooter, true);
});

test('parsePage identifies missing metadata on a broken page', () => {
  const facts = parsePage(BROKEN_PAGE, 'https://acme.test');
  assert.equal(facts.title, '');
  assert.equal(facts.metaDescription, '');
  assert.equal(facts.h1Count, 0);
  assert.equal(facts.canonical, null);
  assert.equal(facts.lang, null);
  assert.equal(facts.og.title, null);
});

test('parsePage distinguishes missing alt attributes from empty alt text', () => {
  const missingAlt = parsePage('<html><body><img src="/a.jpg"></body></html>', 'https://acme.test');
  assert.equal(missingAlt.images[0].hasAlt, false);

  const emptyAlt = parsePage('<html><body><img src="/a.jpg" alt=""></body></html>', 'https://acme.test');
  assert.equal(emptyAlt.images[0].hasAlt, true);
  assert.equal(emptyAlt.images[0].alt, '');
});

test('parsePage reports invalid JSON-LD without throwing', () => {
  const facts = parsePage(BROKEN_PAGE, 'https://acme.test');
  assert.equal(facts.structuredData.length, 1);
  assert.equal(facts.structuredData[0].validJson, false);
  assert.ok(facts.structuredData[0].error);
  assert.equal(facts.jsonLdTypes.length, 0);
});

test('parsePage extracts nested JSON-LD types from @graph and arrays', () => {
  const html = `<html><head><script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Organization","name":"Acme"},{"@type":["WebSite","CreativeWork"],"name":"Acme site"},{"@type":"Service","name":"SEO"}]}</script></head><body><h1>Acme</h1></body></html>`;
  const facts = parsePage(html, 'https://acme.test');
  assert.deepEqual(facts.jsonLdTypes.sort(), ['CreativeWork', 'Organization', 'Service', 'WebSite']);
  assert.equal(facts.structuredData[0].validJson, true);
});

test('AI identity check does not infer a named business from generic words', () => {
  const html = '<html><head><title>Business Services</title></head><body><h1>Business services</h1><p>We help your business grow.</p></body></html>';
  const result = findCheck(runAiChecks(buildContext(html)), 'ai-business-identity');
  assert.equal(result.status, 'info');
  assert.equal(result.points, 0);
});

test('parsePage handles malformed HTML without throwing', () => {
  const facts = parsePage('<html><body><p>unclosed<div>nest<section><span>deep', 'https://acme.test');
  assert.ok(facts.bodyText.includes('unclosed'));
});

// ---------------------------------------------------------------------------
// 4. Missing metadata / heading checks (real check modules)
// ---------------------------------------------------------------------------

test('SEO checks pass on a well-optimised page', () => {
  const checks = runSeoChecks(buildContext(GOOD_PAGE));
  assert.equal(findCheck(checks, 'seo-title').status, 'pass');
  assert.equal(findCheck(checks, 'seo-meta-description').status, 'pass');
  assert.equal(findCheck(checks, 'seo-h1').status, 'pass');
  assert.equal(findCheck(checks, 'seo-canonical').status, 'pass');
  assert.equal(findCheck(checks, 'seo-lang').status, 'pass');
  assert.equal(findCheck(checks, 'seo-viewport').status, 'pass');
  assert.equal(findCheck(checks, 'seo-structured-data').status, 'pass');
});

test('SEO checks fail with evidence on a broken page', () => {
  const checks = runSeoChecks(buildContext(BROKEN_PAGE));
  const title = findCheck(checks, 'seo-title');
  assert.equal(title.status, 'fail');
  assert.ok(title.evidence.length > 0, 'failing check must carry evidence');
  assert.ok(title.explanation.length > 0);
  assert.equal(findCheck(checks, 'seo-meta-description').status, 'fail');
  assert.equal(findCheck(checks, 'seo-h1').status, 'fail');
  assert.equal(findCheck(checks, 'seo-structured-data').status, 'fail');
  assert.equal(findCheck(checks, 'seo-img-alt').status, 'fail');
});

test('every failing SEO check exposes a fix recommendation', () => {
  const checks = runSeoChecks(buildContext(BROKEN_PAGE));
  const failing = checks.filter((c) => c.status === 'fail');
  assert.ok(failing.length > 0);
  for (const check of failing) {
    assert.ok(check.fix && check.fix.length > 0, `${check.id} is missing a suggested fix`);
  }
});

// ---------------------------------------------------------------------------
// 5. Scoring rules (including not-measured treatment)
// ---------------------------------------------------------------------------

function makeCheck(id: string, status: CheckStatus, category: Check['category'] = 'seo', points = 10): Check {
  return {
    id,
    category,
    name: `Check ${id}`,
    status,
    evidence: [`evidence for ${id}`],
    explanation: 'What this means.',
    fix: 'How to fix it.',
    measured: status === 'not_measured' ? 'not_applicable' : 'measured',
    points
  };
}

test('category weights are centralised and sum to 1', () => {
  const total = Object.values(CATEGORY_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
  assert.ok(Math.abs(total - 1) < 1e-9, `weights sum to ${total}`);
  assert.equal(CATEGORY_WEIGHTS.seo, 0.3);
  assert.equal(CATEGORY_WEIGHTS.ai, 0.25);
  assert.equal(CATEGORY_WEIGHTS.performance, 0.2);
  assert.equal(CATEGORY_WEIGHTS.accessibility, 0.15);
  assert.equal(CATEGORY_WEIGHTS.security, 0.1);
});

test('scoring: pass earns full, warning earns half, fail earns none', () => {
  const { score } = scoreCategory([
    makeCheck('a', 'pass'),
    makeCheck('b', 'warning'),
    makeCheck('c', 'fail')
  ]);
  // earned 10 + 5 = 15 of 30 possible → 50
  assert.equal(score, 50);
});

test('info and not-measured checks are excluded from both sides of scoring', () => {
  const { score, counts } = scoreCategory([
    makeCheck('a', 'pass'),
    makeCheck('info', 'info'),
    makeCheck('nm', 'not_measured')
  ]);
  // Only the passing check counts: 10/10 → 100 (no points awarded or docked for unavailable data)
  assert.equal(score, 100);
  assert.equal(counts.info, 1);
  assert.equal(counts.notMeasured, 1);
});

test('a category with nothing measurable reports null, never a fake score', () => {
  const { score } = scoreCategory([makeCheck('i', 'info'), makeCheck('n', 'not_measured')]);
  assert.equal(score, null);
});

test('overall score renormalises weights over measurable categories only', () => {
  const categories = scoreCategories([
    { id: 'seo', checks: [makeCheck('a', 'pass', 'seo')] },
    { id: 'security', checks: [makeCheck('b', 'fail', 'security')] },
    { id: 'ai', checks: [makeCheck('c', 'not_measured', 'ai')] }
  ]);
  const { overall, weightsUsed } = overallScore(categories);
  // measurable: seo 100 (w .3), security 0 (w .1) → 0.75*100 + 0.25*0 = 75
  assert.equal(overall.score, 75);
  assert.ok(Math.abs((weightsUsed.seo ?? 0) - 0.75) < 1e-9);
  assert.ok(Math.abs((weightsUsed.security ?? 0) - 0.25) < 1e-9);
  assert.equal(weightsUsed.ai, undefined);
});

test('grades map scores to honest labels', () => {
  assert.equal(gradeFor(100).grade, 'A+');
  assert.equal(gradeFor(75).grade, 'B');
  assert.equal(gradeFor(0).grade, 'F');
  assert.equal(gradeFor(null).label, 'Not enough data');
});

test('report PDF includes a valid document for all scan results', async () => {
  const report: ScanReport = {
    scanId: 'wg_test123',
    targetUrl: 'https://example.com/',
    finalUrl: 'https://example.com/',
    createdAt: '2026-10-12T12:00:00.000Z',
    status: 'completed',
    overall: { score: 66, grade: 'C+', label: 'Fair' },
    categories: [{
      id: 'seo',
      label: 'Technical & On-page SEO',
      weight: 0.3,
      score: 66,
      checks: [{
        id: 'seo-title',
        category: 'seo',
        name: 'Page title',
        status: 'fail',
        evidence: ['No title was found'],
        explanation: 'Search engines use the title to understand the page.',
        fix: 'Add a descriptive title.',
        measured: 'measured',
        points: 10
      }],
      counts: { pass: 0, warning: 0, fail: 1, info: 0, notMeasured: 0 }
    }],
    recommendations: [],
    summary: { pass: 0, warning: 0, fail: 1, info: 0, notMeasured: 0 },
    executiveSummary: 'One issue needs attention.',
    limitations: ['Browser lab metrics were not measured.'],
    scanMeta: {
      startedAt: '2026-10-12T11:59:59.000Z',
      completedAt: '2026-10-12T12:00:00.000Z',
      durationMs: 1000,
      pageBytes: 1024,
      httpStatus: 200,
      targetUrl: 'https://example.com/',
      finalUrl: 'https://example.com/',
      redirectChain: [],
      userAgent: 'test',
      checksRun: 1,
      checksNotMeasured: 0,
      stages: []
    },
    version: '1.0.0'
  };
  const pdf = await buildReportPdf(report);
  assert.equal(pdf.subarray(0, 5).toString('ascii'), '%PDF-');
  assert.ok(pdf.length > 1000);
});

// ---------------------------------------------------------------------------
// 6. Recommendation generation + contextual CTAs
// ---------------------------------------------------------------------------

test('recommendations cover fail/warning checks only, never passes', () => {
  const recs = buildRecommendations(
    [makeCheck('seo-meta-description', 'fail'), makeCheck('custom-check', 'warning'), makeCheck('ok', 'pass')],
    'https://example.com/'
  );
  assert.equal(recs.length, 2);
  assert.ok(!recs.some((r) => r.checkId === 'ok'));
});

test('recommendations include detection, rationale, fix and a contextual CTA', () => {
  const recs = buildRecommendations([makeCheck('seo-meta-description', 'fail')], 'https://example.com/');
  assert.equal(recs.length, 1);
  const rec = recs[0];
  assert.equal(rec.cta.label, 'Get Better Search Snippets');
  assert.ok(rec.cta.href.startsWith('/'), 'CTA must link to a real site route');
  assert.ok(rec.whatDetected.length > 0);
  assert.ok(rec.whyItMatters.length > 0);
  assert.ok(rec.fix.length > 0);
  assert.ok(rec.estimatedImpact.length > 0);
  assert.ok(['critical', 'high', 'medium', 'low'].includes(rec.priority));
  assert.ok(['straightforward', 'intermediate', 'advanced'].includes(rec.difficulty));
});

test('checks without a custom template still get a sensible default recommendation', () => {
  const recs = buildRecommendations([makeCheck('totally-custom', 'fail')], 'https://example.com/');
  assert.equal(recs.length, 1);
  assert.equal(recs[0].cta.label, 'Get This Fixed');
  assert.ok(recs[0].cta.href.startsWith('/'));
});

test('recommendations are ordered by priority severity', () => {
  const recs = buildRecommendations(
    [
      { ...makeCheck('low-one', 'warning'), severity: 'low' },
      { ...makeCheck('critical-one', 'fail'), severity: 'critical' },
      { ...makeCheck('high-one', 'fail'), severity: 'high' }
    ],
    'https://example.com/'
  );
  assert.deepEqual(recs.map((r) => r.priority), ['critical', 'high', 'low']);
});

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

let passedCount = 0;
const failedNames: string[] = [];

for (const testCase of cases) {
  try {
    await testCase.fn();
    passedCount += 1;
    console.log(`  ok   ${testCase.name}`);
  } catch (err) {
    failedNames.push(testCase.name);
    console.error(`  FAIL ${testCase.name}`);
    console.error(`       ${err instanceof Error ? err.message : String(err)}`);
  }
}

console.log(`\n${passedCount}/${cases.length} unit checks passed`);
if (failedNames.length > 0) {
  console.error(`Failed: ${failedNames.join(' | ')}`);
  process.exit(1);
}
