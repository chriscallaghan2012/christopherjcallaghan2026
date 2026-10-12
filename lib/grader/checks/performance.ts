/**
 * Performance & Core Web Vitals checks.
 *
 * This scanner runs in a serverless environment without a real browser, so it
 * measures the deterministic signals it can observe from the HTTP response and
 * the raw HTML. Real-field Core Web Vitals (LCP, INP, CLS) and lab metrics
 * (TBT, FCP, Speed Index) require a real browser / field data and are reported
 * as `not_measured` rather than invented.
 */

import type { Check } from '../types';
import type { ScanContext } from '../context';
import { makeCategory } from '../context';

const DOCS = {
  cwv: { label: 'Web.dev: Core Web Vitals', url: 'https://web.dev/vitals/' },
  lcp: { label: 'Web.dev: LCP', url: 'https://web.dev/articles/lcp' },
  caching: { label: 'MDN: HTTP caching', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching' }
};

function check(input: Omit<Check, 'category'>): Check {
  return { ...input, category: 'performance' };
}

function notMeasured(id: string, name: string, reason: string): Check {
  return check({
    id, name,
    status: 'not_measured', measured: 'not_applicable', points: 0,
    evidence: ['Not measured in this scan.'],
    explanation: reason
  });
}

export function runPerformanceChecks(ctx: ScanContext): Check[] {
  const checks: Check[] = [];
  const facts = ctx.pageFacts;
  const headers = ctx.page?.headers ?? {};

  // ---- Real-field Core Web Vitals are not measurable without a browser / CrUX ----
  checks.push(notMeasured('perf-lighthouse-lcp', 'Largest Contentful Paint (LCP)',
    'LCP is a real-field Core Web Vitals metric measured in a real browser. This serverless scan cannot measure it, and TBT is not a substitute for INP. Check LCP in PageSpeed Insights or your Search Console CrUX report.'));
  checks.push(notMeasured('perf-lighthouse-inp', 'Interaction to Next Paint (INP)',
    'INP is a real-user field metric. It cannot be measured from server-side HTML and should not be approximated with TBT.'));
  checks.push(notMeasured('perf-lighthouse-cls', 'Cumulative Layout Shift (CLS)',
    'CLS measures visual stability in a rendered browser and cannot be measured from raw HTML alone. Image dimensions and container sizing hints are reported separately.'));
  checks.push(notMeasured('perf-lighthouse-tbt', 'Total Blocking Time (TBT)',
    'TBT is a lab metric that requires executing JavaScript in a browser. It is a diagnostic proxy for INP, not a field measurement.'));
  checks.push(notMeasured('perf-lighthouse-fcp', 'First Contentful Paint (FCP) & Speed Index',
    'FCP and Speed Index require a rendered browser session. They are not measured by this serverless scanner.'));

  if (!ctx.page) {
    checks.push(check({
      id: 'perf-http-unavailable', name: 'Performance HTTP signals',
      status: 'not_measured', measured: 'not_applicable', points: 0,
      evidence: ['Page could not be fetched.'],
      explanation: 'No HTTP response was available, so performance signals could not be measured.'
    }));
    return makeCategory('performance', checks);
  }

  // ---- Compression ----
  const encoding = (headers['content-encoding'] || '').toLowerCase();
  checks.push(check({
    id: 'perf-compression', name: 'Response is compressed',
    status: encoding ? 'pass' : 'warning',
    severity: encoding ? undefined : 'medium',
    measured: 'measured', points: 5,
    evidence: encoding ? [`Content-Encoding: ${encoding}`] : ['No Content-Encoding header (uncompressed response).'],
    explanation: encoding
      ? 'The HTML response is compressed, reducing transfer size.'
      : 'The response is not compressed. Enabling gzip or Brotli significantly reduces page weight.',
    fix: 'Enable gzip/Brotli compression for text responses on your web server or CDN.'
  }));
  // ---- Page weight ----
  const bytes = ctx.page.body.length;
  const kb = Math.round(bytes / 1024);
  checks.push(check({
    id: 'perf-page-weight', name: 'Page weight is reasonable',
    status: kb < 100 ? 'pass' : kb < 500 ? 'warning' : 'fail',
    severity: kb < 100 ? undefined : kb < 500 ? 'low' : 'medium',
    measured: 'measured', points: 6,
    evidence: [`HTML document: ${kb} KB (${bytes.toLocaleString()} bytes).`],
    explanation: kb < 100
      ? 'The HTML document is lightweight.'
      : `The HTML document is ${kb} KB. Note this is only the HTML — scripts, CSS, images and fonts add more.`,
    fix: kb < 100
      ? undefined
      : 'Reduce inline bloat, trim unnecessary markup and keep third-party scripts lean.'
  }));

  // ---- HTTP caching ----
  const cacheControl = headers['cache-control'] || '';
  const hasCache = /max-age|s-maxage|immutable|public|private/i.test(cacheControl) || Boolean(headers['expires']);
  checks.push(check({
    id: 'perf-http-caching', name: 'Static caching headers present',
    status: hasCache ? 'pass' : 'info',
    measured: 'measured', points: 4,
    evidence: hasCache
      ? [`Cache-Control: ${cacheControl || 'set'}`]
      : ['No strong cache header detected on the HTML response.'],
    explanation: hasCache
      ? 'The response sets caching headers, which helps repeat visits load faster.'
      : 'The HTML response has no strong cache headers. Caching is most important for static assets (images, CSS, JS) rather than the HTML itself.',
    docs: [DOCS.caching]
  }));

  // ---- Render-blocking CSS ----
  const blockingCss = facts ? facts.headCss.filter((css) => !css.media || css.media === 'all' || css.media === 'screen') : [];
  const externalCss = blockingCss.filter((css) => !css.inline).length;
  const inlineCss = blockingCss.filter((css) => css.inline).length;
  checks.push(check({
    id: 'perf-render-blocking-css', name: 'CSS does not block rendering',
    status: facts ? (externalCss <= 2 && inlineCss <= 1 ? 'pass' : externalCss <= 4 ? 'warning' : 'fail') : 'not_measured',
    severity: facts ? (externalCss > 2 ? 'medium' : undefined) : undefined,
    measured: facts ? 'measured' : 'not_applicable', points: 5,
    evidence: facts ? [`${externalCss} external stylesheet(s) and ${inlineCss} inline <style> block(s) in <head>.`] : ['No page content.'],
    explanation: facts
      ? 'Every stylesheet in the <head> is render-blocking until downloaded. A large number of stylesheets delays first paint.'
      : 'Not measured — page content unavailable.',
    fix: 'Inline critical CSS, defer non-critical stylesheets, or combine/reduce the number of stylesheets.'
  }));
  // ---- Render-blocking JS ----
  const blockingJs = facts ? facts.headScripts.filter((s) => !s.defer && !s.async) : [];
  checks.push(check({
    id: 'perf-render-blocking-js', name: 'Scripts do not block rendering',
    status: facts ? (blockingJs.length === 0 ? 'pass' : blockingJs.length <= 2 ? 'warning' : 'fail') : 'not_measured',
    severity: facts ? (blockingJs.length > 0 ? 'medium' : undefined) : undefined,
    measured: facts ? 'measured' : 'not_applicable', points: 5,
    evidence: facts ? [`${blockingJs.length} script(s) in <head> without defer/async.`] : ['No page content.'],
    explanation: facts
      ? 'Scripts in the <head> without defer or async delay parsing and rendering while they download and run.'
      : 'Not measured — page content unavailable.',
    fix: 'Add defer (or async where appropriate) to non-critical scripts, or move them to the end of <body>.'
  }));

  // ---- Third-party scripts ----
  const thirdParty = facts ? facts.thirdPartyScripts : [];
  checks.push(check({
    id: 'perf-third-party-scripts', name: 'Third-party scripts are controlled',
    status: facts ? (thirdParty.length === 0 ? 'pass' : thirdParty.length <= 4 ? 'warning' : 'fail') : 'not_measured',
    severity: facts ? (thirdParty.length > 4 ? 'medium' : thirdParty.length > 0 ? 'low' : undefined) : undefined,
    measured: facts ? 'measured' : 'not_applicable', points: 4,
    evidence: facts ? thirdParty.slice(0, 8).map((s) => `${s.host} (${s.src.slice(0, 60)})`) : ['No page content.'],
    explanation: facts
      ? 'Each third-party script adds requests and main-thread work. Excessive third-party scripts are a common cause of slow sites.'
      : 'Not measured — page content unavailable.',
    fix: 'Audit third-party scripts, remove unnecessary ones and load the rest asynchronously.'
  }));

  // ---- Image optimisation ----
  const images = facts ? facts.images : [];
  const missingDimensions = images.filter((img) => !img.width || !img.height).length;
  checks.push(check({
    id: 'perf-image-optimization', name: 'Images are optimisation-friendly',
    status: facts ? (missingDimensions === 0 ? 'pass' : missingDimensions <= 3 ? 'warning' : 'fail') : 'not_measured',
    severity: facts ? (missingDimensions > 0 ? 'low' : undefined) : undefined,
    measured: facts ? 'measured' : 'not_applicable', points: 3,
    evidence: facts ? [`${images.length} image(s); ${missingDimensions} without explicit dimensions.`] : ['No page content.'],
    explanation: facts
      ? 'Images without width/height cause layout shift and prevent efficient decoding hints. Actual image byte sizes require a browser and are not measured here.'
      : 'Not measured — page content unavailable.',
    fix: 'Add width/height attributes, use modern formats (AVIF/WebP) and serve appropriately sized images.'
  }));

  return makeCategory('performance', checks);
}


