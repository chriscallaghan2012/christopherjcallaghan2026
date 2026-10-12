/**
 * Security checks based on observable public signals only.
 * No exploitation, no intrusive scanning — these are passive header,
 * protocol and certificate observations.
 */

import type { Check } from '../types';
import type { ScanContext } from '../context';
import { makeCategory } from '../context';

const DOCS = {
  csp: { label: 'MDN: Content-Security-Policy', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy' },
  hsts: { label: 'MDN: Strict-Transport-Security', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security' },
  xcto: { label: 'MDN: X-Content-Type-Options', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options' },
  xfo: { label: 'MDN: X-Frame-Options', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options' },
  referrer: { label: 'MDN: Referrer-Policy', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy' }
};

function check(input: Omit<Check, 'category'>): Check {
  return { ...input, category: 'security' };
}

function header(name: string, ctx: ScanContext): string | undefined {
  const value = ctx.page?.headers[name.toLowerCase()];
  return value;
}

export function runSecurityChecks(ctx: ScanContext): Check[] {
  const checks: Check[] = [];
  const facts = ctx.pageFacts;
  const isHttps = ctx.finalUrl.startsWith('https://');

  // ---- HTTPS ----
  checks.push(check({
    id: 'sec-https', name: 'Site is served over HTTPS',
    status: isHttps ? 'pass' : 'fail',
    severity: isHttps ? undefined : 'critical',
    measured: 'measured', points: 8,
    evidence: [`Final URL protocol: ${new URL(ctx.finalUrl).protocol}`, `Final URL: ${ctx.finalUrl}`],
    explanation: isHttps
      ? 'The site is served over HTTPS.'
      : 'The site is served over unencrypted HTTP, exposing traffic to interception. HTTPS is expected for any modern website.',
    fix: 'Install a TLS certificate and redirect all HTTP traffic to HTTPS.'
  }));

  // ---- Certificate ----
  if (ctx.tls) {
    if (ctx.tls.valid) {
      checks.push(check({
        id: 'sec-certificate', name: 'TLS certificate is valid',
        status: 'pass', measured: 'measured', points: 8,
        evidence: [
          ...(ctx.tls.issuedTo ? [`Issued to: ${ctx.tls.issuedTo}`] : []),
          ...(ctx.tls.validTo ? [`Expires: ${ctx.tls.validTo}`] : []),
          ...(ctx.tls.daysToExpiry !== undefined ? [`${ctx.tls.daysToExpiry} day(s) until expiry.`] : [])
        ],
        explanation: 'The TLS certificate is valid and unexpired.'
      }));
    } else {
      checks.push(check({
        id: 'sec-certificate', name: 'TLS certificate is valid',
        status: 'fail', severity: 'critical', measured: 'measured', points: 8,
        evidence: [`Certificate problem: ${ctx.tls.error ?? 'invalid certificate'}`],
        explanation: 'The site has a TLS certificate problem, which breaks secure connections and warns visitors.',
        fix: 'Replace or repair the TLS certificate (check expiry, hostname coverage and trust chain).'
      }));
    }
  } else if (isHttps) {
    checks.push(check({
      id: 'sec-certificate', name: 'TLS certificate is valid',
      status: 'not_measured', measured: 'not_applicable', points: 0,
      evidence: ['Certificate could not be verified in this scan.'],
      explanation: 'The certificate could not be inspected, possibly because the page was unreachable.'
    }));
  } else {
    checks.push(check({
      id: 'sec-certificate', name: 'TLS certificate is valid',
      status: 'not_measured', measured: 'not_applicable', points: 0,
      evidence: ['Site is not served over HTTPS.'],
      explanation: 'No HTTPS certificate is in use.'
    }));
  }

  // ---- HTTP -> HTTPS redirect ----
  if (ctx.httpProbe) {
    if (ctx.httpProbe.redirected) {
      checks.push(check({
        id: 'sec-http-redirect', name: 'HTTP redirects to HTTPS',
        status: 'pass', measured: 'measured', points: 5,
        evidence: [`HTTP request was redirected (status ${ctx.httpProbe.status ?? '—'}).`],
        explanation: 'Visitors on plain HTTP are redirected to the secure version of the site.'
      }));
    } else if (ctx.httpProbe.error) {
      checks.push(check({
        id: 'sec-http-redirect', name: 'HTTP redirects to HTTPS',
        status: 'not_measured', measured: 'not_applicable', points: 0,
        evidence: [`HTTP probe failed: ${ctx.httpProbe.error}`],
        explanation: 'The HTTP endpoint could not be probed, so redirect behaviour was not measured.'
      }));
    } else {
      checks.push(check({
        id: 'sec-http-redirect', name: 'HTTP redirects to HTTPS',
        status: 'warning', severity: 'medium', measured: 'measured', points: 5,
        evidence: [`HTTP returned status ${ctx.httpProbe.status} without redirecting to HTTPS.`],
        explanation: 'Plain HTTP is served without redirecting to HTTPS. Visitors or bots reaching the HTTP version stay unencrypted.',
        fix: 'Add a 301 redirect from HTTP to HTTPS for all requests.'
      }));
    }
  } else {
    checks.push(check({
      id: 'sec-http-redirect', name: 'HTTP redirects to HTTPS',
      status: 'not_measured', measured: 'not_applicable', points: 0,
      evidence: ['HTTP probe not run.'],
      explanation: 'HTTP redirect behaviour was not measured.'
    }));
  }
  // ---- Content-Security-Policy ----
  const csp = header('content-security-policy', ctx);
  checks.push(check({
    id: 'sec-csp', name: 'Content-Security-Policy is set',
    status: csp ? 'pass' : 'info',
    measured: 'measured', points: 6,
    evidence: csp ? [`Content-Security-Policy: ${csp.slice(0, 160)}${csp.length > 160 ? '…' : ''}`] : ['No Content-Security-Policy header found.'],
    explanation: csp
      ? 'A Content-Security-Policy is present, which helps mitigate XSS and injection risks.'
      : 'No CSP header was found. CSP is strongly recommended but must be tuned to avoid breaking the site — treat it as a high-priority improvement rather than an instant failure.',
    fix: csp
      ? 'Review the CSP to ensure it is restrictive enough without breaking functionality.'
      : 'Add a Content-Security-Policy header, starting with a report-only policy if needed.',
    docs: [DOCS.csp]
  }));

  // ---- X-Content-Type-Options ----
  const xcto = header('x-content-type-options', ctx);
  checks.push(check({
    id: 'sec-x-content-type-options', name: 'MIME sniffing is disabled',
    status: xcto && xcto.toLowerCase().includes('nosniff') ? 'pass' : 'warning',
    severity: xcto ? undefined : 'low',
    measured: 'measured', points: 4,
    evidence: xcto ? [`X-Content-Type-Options: ${xcto}`] : ['No X-Content-Type-Options header found.'],
    explanation: xcto
      ? 'The server sets X-Content-Type-Options: nosniff, preventing MIME-type sniffing attacks.'
      : 'The server does not send X-Content-Type-Options. Add "nosniff" to harden response handling.',
    fix: 'Send X-Content-Type-Options: nosniff on all responses.',
    docs: [DOCS.xcto]
  }));

  // ---- Referrer-Policy ----
  const referrer = header('referrer-policy', ctx);
  checks.push(check({
    id: 'sec-referrer-policy', name: 'Referrer policy is set',
    status: referrer ? 'pass' : 'info',
    measured: 'measured', points: 3,
    evidence: referrer ? [`Referrer-Policy: ${referrer}`] : ['No Referrer-Policy header found.'],
    explanation: referrer
      ? 'A referrer policy is configured.'
      : 'No Referrer-Policy header was found. Without one, browsers use default behaviour which may leak full URLs to third parties.',
    fix: 'Set a Referrer-Policy such as strict-origin-when-cross-origin.',
    docs: [DOCS.referrer]
  }));

  // ---- Frame protection ----
  const frameAncestors = csp ? /frame-ancestors\s+[^;]+/i.exec(csp)?.[0] : undefined;
  const xfo = header('x-frame-options', ctx);
  const frameProtected = Boolean(frameAncestors || (xfo && /deny|sameorigin/i.test(xfo)));
  checks.push(check({
    id: 'sec-frame-protection', name: 'Clickjacking protection is set',
    status: frameProtected ? 'pass' : 'warning',
    severity: frameProtected ? undefined : 'medium',
    measured: 'measured', points: 4,
    evidence: frameProtected
      ? [frameAncestors ? `CSP: ${frameAncestors}` : `X-Frame-Options: ${xfo}`]
      : ['No frame-ancestors (CSP) or X-Frame-Options header found.'],
    explanation: frameProtected
      ? 'The page is protected against clickjacking via frame restrictions.'
      : 'No frame protection header was found, so the page could potentially be embedded in a frame on another site.',
    fix: 'Add CSP frame-ancestors or X-Frame-Options: DENY/SAMEORIGIN.',
    docs: [DOCS.xfo]
  }));

  // ---- Mixed content ----
  const mixedContent: string[] = [];
  if (isHttps && facts) {
    for (const link of facts.links) {
      if (link.absolute && link.href.startsWith('http://')) mixedContent.push(link.href.slice(0, 120));
      if (mixedContent.length >= 3) break;
    }
    for (const img of facts.images) {
      if (img.src.startsWith('http://')) mixedContent.push(img.src.slice(0, 120));
      if (mixedContent.length >= 3) break;
    }
    for (const s of facts.thirdPartyScripts) {
      if (s.src.startsWith('http://')) mixedContent.push(s.src.slice(0, 120));
      if (mixedContent.length >= 3) break;
    }
  }
  if (!isHttps) {
    checks.push(check({
      id: 'sec-mixed-content', name: 'No mixed content on HTTPS pages',
      status: 'info', measured: 'measured', points: 5,
      evidence: ['Page is not HTTPS, so mixed content does not apply.'],
      explanation: 'Mixed-content concerns only apply to HTTPS pages.'
    }));
  } else if (mixedContent.length === 0) {
    checks.push(check({
      id: 'sec-mixed-content', name: 'No mixed content on HTTPS pages',
      status: 'pass', measured: 'measured', points: 5,
      evidence: ['No http:// subresources detected in the HTML.'],
      explanation: 'No insecure (http://) subresources were detected on this HTTPS page.'
    }));
  } else {
    checks.push(check({
      id: 'sec-mixed-content', name: 'No mixed content on HTTPS pages',
      status: 'warning', severity: 'medium', measured: 'measured', points: 5,
      evidence: mixedContent,
      explanation: 'The HTTPS page references insecure http:// resources. Browsers may block or warn on these, degrading functionality and security.',
      fix: 'Change all http:// subresource URLs to https:// (or protocol-relative).'
    }));
  }
  // ---- Exposed server headers ----
  const serverHeader = header('server', ctx);
  const poweredBy = header('x-powered-by', ctx);
  const exposed = [serverHeader ? `Server: ${serverHeader}` : null, poweredBy ? `X-Powered-By: ${poweredBy}` : null].filter(Boolean) as string[];
  checks.push(check({
    id: 'sec-server-headers', name: 'Server headers are not over-exposed',
    status: exposed.length === 0 ? 'pass' : 'info',
    measured: 'measured', points: 3,
    evidence: exposed.length ? exposed : ['No obvious server identity headers observed.'],
    explanation: exposed.length
      ? 'The server reveals its software identity. This is informational — knowing the stack does not by itself create a vulnerability, but removing unnecessary headers reduces the attack surface.'
      : 'No obvious server identity headers were observed.'
  }));

  // ---- HSTS ----
  const hsts = header('strict-transport-security', ctx);
  checks.push(check({
    id: 'sec-hsts', name: 'HSTS is set on HTTPS',
    status: isHttps && hsts ? 'pass' : 'info',
    measured: 'measured', points: 2,
    evidence: hsts ? [`Strict-Transport-Security: ${hsts.slice(0, 120)}`] : ['No Strict-Transport-Security header found.'],
    explanation: hsts
      ? 'HTTP Strict Transport Security is enabled, telling browsers to only use HTTPS.'
      : 'HSTS was not detected. It is a valuable hardening step for HTTPS sites, but not a failure on its own.'
  }));

  return makeCategory('security', checks);
}


