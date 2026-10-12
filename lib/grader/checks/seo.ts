/**
 * Technical & on-page SEO checks (deterministic, single-page scan).
 */

import type { Check } from '../types';
import type { ScanContext } from '../context';
import { makeCategory } from '../context';

const DOCS = {
  title: { label: 'Google: title links', url: 'https://developers.google.com/search/docs/appearance/title-link' },
  description: { label: 'Google: meta descriptions', url: 'https://developers.google.com/search/docs/appearance/snippet' },
  canonical: { label: 'Google: canonical URLs', url: 'https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls' },
  robots: { label: 'Google: robots meta', url: 'https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag' },
  robotsTxt: { label: 'Google: robots.txt', url: 'https://developers.google.com/search/docs/crawling-indexing/robots/intro' },
  sitemap: { label: 'Google: sitemaps', url: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview' },
  structuredData: { label: 'Google: structured data', url: 'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data' },
  openGraph: { label: 'The Open Graph protocol', url: 'https://ogp.me/' },
  viewport: { label: 'Responsive design basics', url: 'https://web.dev/articles/responsive-web-design-basics' }
};

function check(input: Omit<Check, 'category'>): Check {
  return { ...input, category: 'seo' };
}

export function runSeoChecks(ctx: ScanContext): Check[] {
  const checks: Check[] = [];
  const facts = ctx.pageFacts;

  // ---- HTTP status ----
  const status = ctx.page?.status ?? 0;
  if (ctx.page) {
    if (status === 200) {
      checks.push(check({
        id: 'seo-status', name: 'Page returns a 200 status',
        status: 'pass', measured: 'measured', points: 6,
        evidence: [`HTTP ${status} ${ctx.page.statusText}`, `Final URL: ${ctx.finalUrl}`],
        explanation: 'The page is reachable and returns a normal success status.',
        docs: [DOCS.canonical]
      }));
    } else if (status >= 400) {
      checks.push(check({
        id: 'seo-status', name: 'Page returns a success status',
        status: 'fail', severity: 'critical', measured: 'measured', points: 6,
        evidence: [`HTTP ${status} ${ctx.page.statusText}`, `Final URL: ${ctx.finalUrl}`],
        explanation: 'The page returned an error status, which prevents it from being served normally to visitors or crawlers.',
        fix: 'Fix the server or application error so the page returns a 200 OK status.',
        docs: [DOCS.canonical]
      }));
    } else {
      checks.push(check({
        id: 'seo-status', name: 'Page returns a 200 status',
        status: 'warning', severity: 'medium', measured: 'measured', points: 6,
        evidence: [`HTTP ${status} ${ctx.page.statusText}`],
        explanation: 'The page returned a non-standard status. This may be normal for some setups, but a 200 is expected for a canonical page you want indexed.',
        fix: 'Confirm the page intentionally returns this status and that it is not an error state.'
      }));
    }
  } else {
    checks.push(check({
      id: 'seo-status', name: 'Page returns a 200 status',
      status: 'fail', severity: 'critical', measured: 'measured', points: 6,
      evidence: ['The page could not be fetched.'],
      explanation: 'The scanner could not retrieve the page, so on-page SEO could not be verified.',
      fix: 'Check the site is live and reachable, then re-run the audit.'
    }));
  }
  // ---- Redirect chain ----
  if (ctx.page && ctx.page.redirectChain.length > 0) {
    const hops = ctx.page.redirectChain.length - 1;
    if (hops === 0) {
      checks.push(check({
        id: 'seo-redirect-chain', name: 'No unnecessary redirects',
        status: 'pass', measured: 'measured', points: 4,
        evidence: [`Loaded directly at ${ctx.finalUrl}`],
        explanation: 'The page loaded without redirects, which is ideal for performance and link equity.'
      }));
    } else if (hops <= 2) {
      checks.push(check({
        id: 'seo-redirect-chain', name: 'Short redirect chain',
        status: 'warning', severity: 'low', measured: 'measured', points: 4,
        evidence: ctx.page.redirectChain,
        explanation: `The page used ${hops} redirect(s). A short chain is acceptable but worth simplifying where possible.`,
        fix: 'Point internal links and the sitemap at the final destination URL to remove redirect hops.'
      }));
    } else {
      checks.push(check({
        id: 'seo-redirect-chain', name: 'Redirect chain is short',
        status: 'fail', severity: 'medium', measured: 'measured', points: 4,
        evidence: ctx.page.redirectChain,
        explanation: `The page used ${hops} redirects, which can slow loading and dilute link signals.`,
        fix: 'Replace the redirect chain with direct links to the final URL and configure a single redirect hop.'
      }));
    }
  } else {
    checks.push(check({
      id: 'seo-redirect-chain', name: 'No unnecessary redirects',
      status: 'not_measured', measured: 'not_applicable', points: 0,
      evidence: ['Page could not be fetched.'],
      explanation: 'Redirect behaviour could not be measured because the page was unreachable.'
    }));
  }

  // ---- HTTPS ----
  const isHttps = ctx.finalUrl.startsWith('https://');
  checks.push(check({
    id: 'seo-https', name: 'Page served over HTTPS',
    status: isHttps ? 'pass' : 'fail',
    severity: isHttps ? undefined : 'high',
    measured: 'measured', points: 5,
    evidence: [`Protocol: ${new URL(ctx.finalUrl).protocol}`, `Final URL: ${ctx.finalUrl}`],
    explanation: isHttps
      ? 'The page is served over an encrypted HTTPS connection.'
      : 'The page was served over plain HTTP. Search engines prefer HTTPS and browsers flag non-HTTPS pages.',
    fix: 'Enable a TLS certificate and redirect all HTTP traffic to HTTPS.',
    docs: [DOCS.canonical]
  }));

  if (!facts) {
    checks.push(check({
      id: 'seo-onpage-unavailable', name: 'On-page content analysis',
      status: 'not_measured', measured: 'not_applicable', points: 0,
      evidence: ['No page content was available to analyse.'],
      explanation: 'Because the page could not be fetched, on-page checks (title, meta, headings, canonical, images, links, structured data) were not measured.'
    }));
    return makeCategory('seo', checks);
  }
  // ---- Title ----
  if (!facts.title) {
    checks.push(check({
      id: 'seo-title', name: 'Page has a descriptive title tag',
      status: 'fail', severity: 'high', measured: 'measured', points: 8,
      evidence: ['No <title> element found in the page head.'],
      explanation: 'The page has no title tag. Titles are the primary label shown in search results and browser tabs.',
      fix: 'Add a unique, descriptive <title> around 50–60 characters that summarises the page.',
      docs: [DOCS.title]
    }));
  } else if (facts.titleLength > 65 || facts.titleLength < 30) {
    checks.push(check({
      id: 'seo-title', name: 'Page has a descriptive title tag',
      status: 'warning', severity: 'medium', measured: 'measured', points: 8,
      evidence: [`Title (${facts.titleLength} chars): ${facts.title}`],
      explanation: `The title tag is ${facts.titleLength} characters. Google typically displays about 50–60 characters.`,
      fix: 'Shorten or expand the title so the key message fits comfortably in search results.',
      docs: [DOCS.title]
    }));
  } else {
    checks.push(check({
      id: 'seo-title', name: 'Page has a descriptive title tag',
      status: 'pass', measured: 'measured', points: 8,
      evidence: [`Title (${facts.titleLength} chars): ${facts.title}`],
      explanation: 'The page has a title tag of a sensible length.'
    }));
  }

  // ---- Title duplication (single page) ----
  checks.push(check({
    id: 'seo-title-duplicate', name: 'Title uniqueness across pages',
    status: 'info', measured: 'inferred', points: 0,
    evidence: ['Single-page audit: duplicate detection requires scanning multiple pages.'],
    explanation: 'Duplicate titles are best detected across the site. This single-page audit cannot compare titles with other pages.'
  }));

  // ---- Meta description ----
  if (!facts.metaDescription) {
    checks.push(check({
      id: 'seo-meta-description', name: 'Page has a meta description',
      status: 'fail', severity: 'medium', measured: 'measured', points: 7,
      evidence: ['No meta description found.'],
      explanation: 'There is no meta description, so search engines may generate their own snippet from page content.',
      fix: 'Write a unique, useful description (around 150 characters) that accurately explains the page.',
      docs: [DOCS.description]
    }));
  } else if (facts.metaDescriptionLength < 70 || facts.metaDescriptionLength > 170) {
    checks.push(check({
      id: 'seo-meta-description', name: 'Page has a meta description',
      status: 'warning', severity: 'low', measured: 'measured', points: 7,
      evidence: [`Meta description (${facts.metaDescriptionLength} chars): ${facts.metaDescription.slice(0, 120)}${facts.metaDescriptionLength > 120 ? '…' : ''}`],
      explanation: `The meta description is ${facts.metaDescriptionLength} characters. Aim for roughly 70–160 characters.`,
      fix: 'Tighten the description so it reads well and stays within the usual display length.',
      docs: [DOCS.description]
    }));
  } else {
    checks.push(check({
      id: 'seo-meta-description', name: 'Page has a meta description',
      status: 'pass', measured: 'measured', points: 7,
      evidence: [`Meta description (${facts.metaDescriptionLength} chars) present.`],
      explanation: 'The page has a well-sized meta description.'
    }));
  }

  // ---- H1 ----
  if (facts.h1Count === 0) {
    checks.push(check({
      id: 'seo-h1', name: 'Page has a single H1 heading',
      status: 'fail', severity: 'high', measured: 'measured', points: 6,
      evidence: ['No H1 heading found.'],
      explanation: 'The page has no H1. The H1 is the primary heading that describes what the page is about.',
      fix: 'Add one clear H1 that describes the page topic and contains the primary keyword naturally.',
      docs: [DOCS.title]
    }));
  } else if (facts.h1Count > 1) {
    checks.push(check({
      id: 'seo-h1', name: 'Page has a single H1 heading',
      status: 'warning', severity: 'medium', measured: 'measured', points: 6,
      evidence: [`${facts.h1Count} H1 headings found.`],
      explanation: `The page uses ${facts.h1Count} H1 headings. A single H1 keeps the page hierarchy unambiguous.`,
      fix: 'Consolidate to one H1 and demote the rest to H2/H3.'
    }));
  } else {
    checks.push(check({
      id: 'seo-h1', name: 'Page has a single H1 heading',
      status: 'pass', measured: 'measured', points: 6,
      evidence: [`H1: ${facts.h1Texts[0] ?? ''}`],
      explanation: 'The page has exactly one H1 heading.'
    }));
  }
  // ---- Heading hierarchy ----
  const levels = facts.headingLevels;
  const hierarchyOk = levels.length === 0 || (levels[0] === 1 && !levels.some((l, i) => i > 0 && l > levels[i - 1] + 1));
  if (levels.length === 0) {
    checks.push(check({
      id: 'seo-heading-hierarchy', name: 'Heading structure is logical',
      status: 'info', measured: 'measured', points: 3,
      evidence: ['No headings detected on the page.'],
      explanation: 'There are no headings to evaluate, which itself usually signals content issues.'
    }));
  } else if (hierarchyOk) {
    checks.push(check({
      id: 'seo-heading-hierarchy', name: 'Heading structure is logical',
      status: 'pass', measured: 'measured', points: 3,
      evidence: [`Heading levels used: ${[...new Set(levels)].sort((a, b) => a - b).join(', ')}`],
      explanation: 'Headings descend in a logical order with no skipped levels.'
    }));
  } else {
    checks.push(check({
      id: 'seo-heading-hierarchy', name: 'Heading structure is logical',
      status: 'warning', severity: 'medium', measured: 'measured', points: 3,
      evidence: [`Heading levels detected: ${levels.join(', ')}`],
      explanation: 'Headings skip levels (for example an H3 with no H2 before it), which weakens the document outline.',
      fix: 'Restructure headings so each level follows its parent level in sequence.'
    }));
  }

  // ---- Canonical ----
  const finalUrl = new URL(ctx.finalUrl);
  if (!facts.canonical) {
    checks.push(check({
      id: 'seo-canonical', name: 'Page declares a canonical URL',
      status: 'warning', severity: 'medium', measured: 'measured', points: 4,
      evidence: ['No canonical link element found.'],
      explanation: 'There is no canonical tag. Without one, search engines must guess which URL is the primary version of the page.',
      fix: 'Add a self-referencing canonical URL pointing at the final destination of this page.',
      docs: [DOCS.canonical]
    }));
  } else {
    let canonicalTarget: URL | null = null;
    try { canonicalTarget = new URL(facts.canonical, ctx.finalUrl); } catch { canonicalTarget = null; }
    const selfReferencing = canonicalTarget !== null && canonicalTarget.href.replace(/\/$/, '') === finalUrl.href.replace(/\/$/, '');
    const sameHost = canonicalTarget !== null && canonicalTarget.hostname === finalUrl.hostname;
    if (!canonicalTarget) {
      checks.push(check({
        id: 'seo-canonical', name: 'Page declares a canonical URL',
        status: 'fail', severity: 'high', measured: 'measured', points: 4,
        evidence: [`Canonical value: ${facts.canonical}`],
        explanation: 'The canonical URL could not be parsed as a valid URL.',
        fix: 'Correct the canonical URL so it is a valid absolute (or valid relative) URL.',
        docs: [DOCS.canonical]
      }));
    } else if (!sameHost) {
      checks.push(check({
        id: 'seo-canonical', name: 'Page declares a canonical URL',
        status: 'warning', severity: 'medium', measured: 'measured', points: 4,
        evidence: [`Canonical: ${facts.canonical}`, `Page URL: ${ctx.finalUrl}`],
        explanation: 'The canonical points to a different domain. Only do this deliberately, e.g. syndication.',
        fix: 'Ensure the canonical points to the same-site version of this page unless cross-domain is intentional.',
        docs: [DOCS.canonical]
      }));
    } else if (selfReferencing) {
      checks.push(check({
        id: 'seo-canonical', name: 'Page declares a canonical URL',
        status: 'pass', measured: 'measured', points: 4,
        evidence: [`Canonical: ${facts.canonical}`],
        explanation: 'The page declares a self-referencing canonical for its final URL.'
      }));
    } else {
      checks.push(check({
        id: 'seo-canonical', name: 'Page declares a canonical URL',
        status: 'info', measured: 'measured', points: 4,
        evidence: [`Canonical: ${facts.canonical}`],
        explanation: 'The canonical points to a different URL on the same site. Confirm this is the intended consolidation target.'
      }));
    }
  }
  // ---- Robots directives ----
  const robotsValues = [...facts.metaRobotsValues];
  if (ctx.xRobotsTag) robotsValues.push(`X-Robots-Tag: ${ctx.xRobotsTag}`);
  const noindex = robotsValues.some((v) => /(^|,|\s)noindex(\s|,|$)/i.test(v));
  const nofollow = robotsValues.some((v) => /(^|,|\s)nofollow(\s|,|$)/i.test(v));
  if (noindex) {
    checks.push(check({
      id: 'seo-robots-directives', name: 'Page is crawlable and indexable',
      status: 'fail', severity: 'critical', measured: 'measured', points: 4,
      evidence: robotsValues.length ? robotsValues : ['No robots directives found.'],
      explanation: 'The page is set to noindex, meaning search engines are told not to show it in results.',
      fix: 'Remove the noindex directive if this page should appear in search results.',
      docs: [DOCS.robots]
    }));
  } else if (nofollow) {
    checks.push(check({
      id: 'seo-robots-directives', name: 'Page is crawlable and indexable',
      status: 'warning', severity: 'medium', measured: 'measured', points: 4,
      evidence: robotsValues,
      explanation: 'The page is marked nofollow, telling search engines not to follow its links.',
      fix: 'Remove nofollow if links on this page should pass signals to other pages.',
      docs: [DOCS.robots]
    }));
  } else {
    checks.push(check({
      id: 'seo-robots-directives', name: 'Page is crawlable and indexable',
      status: 'pass', measured: 'measured', points: 4,
      evidence: robotsValues.length ? robotsValues : ['No blocking robots directives found.'],
      explanation: 'No noindex or nofollow directives block this page.'
    }));
  }

  // ---- Indexability summary (informational) ----
  const indexBlockers: string[] = [];
  if (noindex) indexBlockers.push('noindex directive');
  if (facts.canonical && (() => { try { const c = new URL(facts.canonical, ctx.finalUrl); return c.href.replace(/\/$/, '') !== finalUrl.href.replace(/\/$/, ''); } catch { return true; } })()) indexBlockers.push('canonical points to a different URL');
  if (ctx.page && status >= 400) indexBlockers.push('non-success HTTP status');
  checks.push(check({
    id: 'seo-indexability', name: 'Indexability signal summary',
    status: indexBlockers.length === 0 ? 'info' : 'warning',
    severity: indexBlockers.length ? 'medium' : undefined,
    measured: 'inferred', points: 0,
    evidence: indexBlockers.length ? indexBlockers : ['No indexability blockers detected in this single-page scan.'],
    explanation: indexBlockers.length
      ? 'One or more signals may prevent this page from being indexed. None of this guarantees indexation — search engines decide final indexing.'
      : 'A crawlable page is not automatically indexed. This summary only reflects signals observable in a single-page scan.'
  }));
  // ---- robots.txt ----
  const robots = ctx.robotsTxt;
  if (robots === null) {
    checks.push(check({
      id: 'seo-robots-txt', name: 'robots.txt is available',
      status: 'warning', severity: 'low', measured: 'measured', points: 4,
      evidence: ['robots.txt could not be fetched.'],
      explanation: 'No robots.txt was found or it could not be fetched. Search engines assume all pages are crawlable, but a robots.txt helps control crawling.',
      fix: 'Add a robots.txt that allows crawling of the pages you want indexed.',
      docs: [DOCS.robotsTxt]
    }));
  } else {
    const disallowsAll = /^disallow:\s*\/\s*$/im.test(robots) && !/^allow:\s*\/\s*$/im.test(robots);
    if (disallowsAll) {
      checks.push(check({
        id: 'seo-robots-txt', name: 'robots.txt allows crawling',
        status: 'fail', severity: 'high', measured: 'measured', points: 4,
        evidence: ['robots.txt blocks all crawling (Disallow: /).'],
        explanation: 'robots.txt disallows crawling of the whole site, which prevents search engines from discovering pages.',
        fix: 'Update robots.txt to allow crawling of the pages you want indexed.',
        docs: [DOCS.robotsTxt]
      }));
    } else {
      checks.push(check({
        id: 'seo-robots-txt', name: 'robots.txt is available',
        status: 'pass', measured: 'measured', points: 4,
        evidence: ['robots.txt fetched successfully.'],
        explanation: 'robots.txt is available and does not block the whole site.'
      }));
    }
  }

  // ---- sitemap ----
  if (ctx.sitemapXml === null) {
    checks.push(check({
      id: 'seo-sitemap', name: 'XML sitemap is available',
      status: 'warning', severity: 'low', measured: 'measured', points: 4,
      evidence: ['No sitemap.xml found at the site root.'],
      explanation: 'No sitemap was found. A sitemap helps search engines discover and understand your important pages.',
      fix: 'Generate and submit an XML sitemap listing your key pages.',
      docs: [DOCS.sitemap]
    }));
  } else {
    const isXml = /<urlset[\s>]/i.test(ctx.sitemapXml) && /<url>/i.test(ctx.sitemapXml);
    if (isXml) {
      const urlCount = (ctx.sitemapXml.match(/<url>/g) || []).length;
      checks.push(check({
        id: 'seo-sitemap', name: 'XML sitemap is available',
        status: 'pass', measured: 'measured', points: 4,
        evidence: [`sitemap.xml parsed with ${urlCount} URL entr${urlCount === 1 ? 'y' : 'ies'}.`],
        explanation: 'A valid XML sitemap was found.'
      }));
    } else {
      checks.push(check({
        id: 'seo-sitemap', name: 'XML sitemap is available',
        status: 'warning', severity: 'medium', measured: 'measured', points: 4,
        evidence: ['sitemap.xml was fetched but did not parse as a valid sitemap.'],
        explanation: 'A sitemap file exists but does not look like a valid XML sitemap.',
        fix: 'Regenerate the sitemap in valid XML format and submit it to search consoles.',
        docs: [DOCS.sitemap]
      }));
    }
  }

  // ---- Internal links ----
  const internalCount = facts.internalLinks.length;
  if (internalCount === 0) {
    checks.push(check({
      id: 'seo-internal-links', name: 'Page has useful internal links',
      status: 'fail', severity: 'medium', measured: 'measured', points: 3,
      evidence: ['No internal links detected.'],
      explanation: 'The page has no internal links, making it hard for crawlers and users to navigate to related pages.',
      fix: 'Link from this page to relevant pages on the same site using descriptive anchor text.'
    }));
  } else if (internalCount < 3) {
    checks.push(check({
      id: 'seo-internal-links', name: 'Page has useful internal links',
      status: 'warning', severity: 'low', measured: 'measured', points: 3,
      evidence: [`${internalCount} internal link${internalCount === 1 ? '' : 's'} found.`],
      explanation: `The page has only ${internalCount} internal link(s). A few more contextual links would help discovery and navigation.`,
      fix: 'Add contextual internal links to related services, guides or supporting pages.'
    }));
  } else {
    checks.push(check({
      id: 'seo-internal-links', name: 'Page has useful internal links',
      status: 'pass', measured: 'measured', points: 3,
      evidence: [`${internalCount} internal link${internalCount === 1 ? '' : 's'} found.`],
      explanation: 'The page links out to a healthy number of internal pages.'
    }));
  }

  // ---- External links ----
  const externalCount = facts.externalLinks.length;
  checks.push(check({
    id: 'seo-external-links', name: 'Page links to relevant external sources',
    status: externalCount === 0 ? 'info' : 'pass',
    measured: 'measured', points: 2,
    evidence: externalCount === 0 ? ['No external links found.'] : [`${externalCount} external link${externalCount === 1 ? '' : 's'} found.`],
    explanation: externalCount === 0
      ? 'No outbound links were detected. External links are optional but can add credibility and context.'
      : 'The page links to external sources.'
  }));
  // ---- Broken internal links ----
  if (ctx.linkChecks.length === 0) {
    checks.push(check({
      id: 'seo-broken-links', name: 'No broken internal links detected',
      status: 'info', measured: 'not_applicable', points: 0,
      evidence: ['No internal links were sampled for checking.'],
      explanation: 'There were no internal links to test, so broken links could not be assessed.'
    }));
  } else {
    const broken = ctx.linkChecks.filter((l) => !l.ok);
    if (broken.length === 0) {
      checks.push(check({
        id: 'seo-broken-links', name: 'No broken internal links detected',
        status: 'pass', measured: 'measured', points: 4,
        evidence: [`${ctx.linkChecks.length} internal link${ctx.linkChecks.length === 1 ? '' : 's'} checked — none were broken.`],
        explanation: 'The sampled internal links all returned a healthy response.'
      }));
    } else {
      checks.push(check({
        id: 'seo-broken-links', name: 'No broken internal links detected',
        status: broken.length >= 2 ? 'fail' : 'warning',
        severity: broken.length >= 2 ? 'high' : 'medium',
        measured: 'measured', points: 4,
        evidence: broken.map((l) => `${l.url} — ${l.error ?? `HTTP ${l.status}`}`),
        explanation: `${broken.length} of ${ctx.linkChecks.length} sampled internal link(s) did not return a healthy response.`,
        fix: 'Fix or remove the broken internal links listed in the evidence.'
      }));
    }
  }

  // ---- Image alt attributes ----
  const missingAlt = facts.images.filter((img) => !img.hasAlt);
  const imagesWithAlt = facts.images.filter((img) => img.hasAlt);
  if (facts.images.length === 0) {
    checks.push(check({
      id: 'seo-img-alt', name: 'Images have alt text',
      status: 'info', measured: 'measured', points: 4,
      evidence: ['No images detected.'],
      explanation: 'There were no images on the page to evaluate.'
    }));
  } else if (missingAlt.length === 0) {
    checks.push(check({
      id: 'seo-img-alt', name: 'Images have alt text',
      status: 'pass', measured: 'measured', points: 4,
      evidence: [`All ${facts.images.length} image(s) have an alt attribute.`],
      explanation: 'Every image has an alt attribute. Empty alt text is acceptable for decorative images.'
    }));
  } else {
    checks.push(check({
      id: 'seo-img-alt', name: 'Images have alt text',
      status: 'fail', severity: 'medium', measured: 'measured', points: 4,
      evidence: [`${missingAlt.length} of ${facts.images.length} image(s) are missing the alt attribute.`],
      explanation: 'Some images have no alt attribute at all. Missing alt attributes leave no description for search engines or screen readers.',
      fix: 'Add meaningful alt text to informative images, and use empty alt="" for decorative images.'
    }));
  }

  // ---- Image dimensions ----
  const noDimensions = facts.images.filter((img) => !img.width || !img.height);
  checks.push(check({
    id: 'seo-image-dimensions', name: 'Images declare dimensions',
    status: noDimensions.length === 0 ? 'pass' : noDimensions.length <= 3 ? 'warning' : 'fail',
    severity: noDimensions.length === 0 ? undefined : 'low',
    measured: 'measured', points: 2,
    evidence: noDimensions.length === 0
      ? ['All images declare width and height attributes.']
      : [`${noDimensions.length} image(s) do not declare width/height.`],
    explanation: noDimensions.length === 0
      ? 'Images declare width and height, which helps prevent layout shift while they load.'
      : 'Images without width/height can cause layout shift (a Core Web Vitals signal) as they load.',
    fix: 'Add width and height attributes to images so the browser reserves the correct space.'
  }));

  // ---- Lazy loading (informational) ----
  const lazyImages = facts.images.filter((img) => img.loading === 'lazy').length;
  checks.push(check({
    id: 'seo-lazy-loading', name: 'Images use lazy loading where useful',
    status: 'info', measured: 'measured', points: 0,
    evidence: facts.images.length === 0
      ? ['No images detected.']
      : [`${lazyImages} of ${facts.images.length} image(s) use loading="lazy".`],
    explanation: 'Lazy loading below-the-fold images can improve initial load, but it is a progressive enhancement rather than a hard requirement.'
  }));
  // ---- Open Graph ----
  const ogComplete = facts.og.title && facts.og.description && facts.og.image;
  const ogPresent = facts.og.title || facts.og.description || facts.og.image;
  if (ogComplete) {
    checks.push(check({
      id: 'seo-og', name: 'Open Graph sharing metadata',
      status: 'pass', measured: 'measured', points: 4,
      evidence: ['og:title, og:description and og:image all present.'],
      explanation: 'Open Graph metadata is complete, so social platforms can render a rich preview when the page is shared.',
      docs: [DOCS.openGraph]
    }));
  } else if (!ogPresent) {
    checks.push(check({
      id: 'seo-og', name: 'Open Graph sharing metadata',
      status: 'warning', severity: 'low', measured: 'measured', points: 4,
      evidence: ['No Open Graph meta tags found.'],
      explanation: 'No Open Graph tags were found. Shared links will have less control over how they appear on social platforms.',
      fix: 'Add og:title, og:description and og:image meta tags.',
      docs: [DOCS.openGraph]
    }));
  } else {
    const missing = ['og:title', 'og:description', 'og:image'].filter((k) => !facts.og[k as keyof typeof facts.og]);
    checks.push(check({
      id: 'seo-og', name: 'Open Graph sharing metadata',
      status: 'warning', severity: 'low', measured: 'measured', points: 4,
      evidence: [`Missing: ${missing.join(', ')}`],
      explanation: 'Open Graph metadata is incomplete, so social previews may look inconsistent.',
      fix: `Add the missing Open Graph tags: ${missing.join(', ')}.`,
      docs: [DOCS.openGraph]
    }));
  }

  // ---- Twitter card ----
  checks.push(check({
    id: 'seo-twitter-card', name: 'Twitter card metadata',
    status: facts.twitter.card ? 'pass' : 'info',
    measured: 'measured', points: 1,
    evidence: facts.twitter.card ? [`twitter:card = ${facts.twitter.card}`] : ['No twitter:card meta found.'],
    explanation: facts.twitter.card
      ? 'Twitter card metadata is present.'
      : 'Twitter cards are optional; without twitter:card, X uses the Open Graph tags when available.'
  }));

  // ---- Language ----
  if (!facts.lang) {
    checks.push(check({
      id: 'seo-lang', name: 'HTML language is declared',
      status: 'fail', severity: 'medium', measured: 'measured', points: 2,
      evidence: ['No lang attribute on the <html> element.'],
      explanation: 'The page does not declare its language. This matters for search engines, translation and screen readers.',
      fix: 'Add a lang attribute to the <html> element, e.g. lang="en".'
    }));
  } else if (/^[a-z]{2}([-_][a-zA-Z0-9]+)*$/.test(facts.lang)) {
    checks.push(check({
      id: 'seo-lang', name: 'HTML language is declared',
      status: 'pass', measured: 'measured', points: 2,
      evidence: [`lang="${facts.lang}"`],
      explanation: 'The page declares a valid language.'
    }));
  } else {
    checks.push(check({
      id: 'seo-lang', name: 'HTML language is declared',
      status: 'warning', severity: 'low', measured: 'measured', points: 2,
      evidence: [`lang="${facts.lang}"`],
      explanation: 'The lang attribute does not look like a standard language code.',
      fix: 'Use a valid IETF language tag such as "en" or "en-GB".'
    }));
  }

  // ---- Viewport ----
  if (!facts.viewport) {
    checks.push(check({
      id: 'seo-viewport', name: 'Page sets a viewport for mobile',
      status: 'fail', severity: 'high', measured: 'measured', points: 3,
      evidence: ['No viewport meta tag found.'],
      explanation: 'Without a viewport meta tag, mobile browsers render the page at desktop width, hurting mobile UX and rankings.',
      fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.',
      docs: [DOCS.viewport]
    }));
  } else {
    checks.push(check({
      id: 'seo-viewport', name: 'Page sets a viewport for mobile',
      status: 'pass', measured: 'measured', points: 3,
      evidence: [`Viewport: ${facts.viewport}`],
      explanation: 'The page declares a mobile viewport.'
    }));
  }
  // ---- Structured data validity ----
  const jsonLd = facts.structuredData.filter((s) => s.validJson);
  const invalidJsonLd = facts.structuredData.filter((s) => !s.validJson);
  if (invalidJsonLd.length > 0) {
    checks.push(check({
      id: 'seo-structured-data', name: 'Structured data is valid',
      status: 'fail', severity: 'high', measured: 'measured', points: 4,
      evidence: invalidJsonLd.map((s) => `Invalid JSON-LD: ${s.error ?? 'parse error'}`),
      explanation: 'One or more JSON-LD blocks could not be parsed as valid JSON, which means search engines cannot read them.',
      fix: 'Correct the JSON syntax in the invalid JSON-LD blocks using the evidence above.',
      docs: [DOCS.structuredData]
    }));
  } else if (jsonLd.length === 0) {
    checks.push(check({
      id: 'seo-structured-data', name: 'Structured data is valid',
      status: 'info', measured: 'measured', points: 4,
      evidence: ['No JSON-LD structured data found.'],
      explanation: 'No JSON-LD structured data was detected. Structured data is optional but can enable richer search results.',
      fix: 'Consider adding JSON-LD such as Organization, Service or FAQ schema where relevant.',
      docs: [DOCS.structuredData]
    }));
  } else {
    checks.push(check({
      id: 'seo-structured-data', name: 'Structured data is valid',
      status: 'pass', measured: 'measured', points: 4,
      evidence: [`${jsonLd.length} valid JSON-LD block(s) found: ${facts.jsonLdTypes.join(', ') || 'types unknown'}`],
      explanation: 'Valid JSON-LD structured data is present.'
    }));
  }

  // ---- Breadcrumb / organisation schema (recommendation) ----
  const hasOrgSchema = facts.jsonLdTypes.some((t) => /Organization|Person|LocalBusiness|ProfessionalService/i.test(t));
  const hasBreadcrumb = facts.jsonLdTypes.some((t) => /BreadcrumbList/i.test(t));
  if (hasOrgSchema || hasBreadcrumb) {
    checks.push(check({
      id: 'seo-breadcrumb-org', name: 'Organisation / breadcrumb schema',
      status: 'pass', measured: 'measured', points: 2,
      evidence: [`Schemas present: ${facts.jsonLdTypes.join(', ')}`],
      explanation: 'The page includes organisation or breadcrumb structured data.'
    }));
  } else {
    checks.push(check({
      id: 'seo-breadcrumb-org', name: 'Organisation / breadcrumb schema',
      status: 'info', measured: 'inferred', points: 2,
      evidence: ['No Organization or BreadcrumbList schema detected on this page.'],
      explanation: 'Organisation and breadcrumb schema are helpful for entity clarity and navigation crumbs, but are not a hard requirement.'
    }));
  }

  // ---- Conflicting indexing signals ----
  const conflicts: string[] = [];
  if (facts.og.url && facts.canonical) {
    try {
      const ogUrl = new URL(facts.og.url, ctx.finalUrl).href.replace(/\/$/, '');
      const canUrl = new URL(facts.canonical, ctx.finalUrl).href.replace(/\/$/, '');
      if (ogUrl !== canUrl && ogUrl !== finalUrl.href.replace(/\/$/, '')) {
        conflicts.push('og:url does not match the canonical URL');
      }
    } catch { /* ignore parse issues already reported */ }
  }
  checks.push(check({
    id: 'seo-indexing-signals-conflict', name: 'Indexing signals are consistent',
    status: conflicts.length === 0 ? 'pass' : 'warning',
    severity: conflicts.length ? 'medium' : undefined,
    measured: 'measured', points: 3,
    evidence: conflicts.length ? conflicts : ['Canonical, og:url and page URL are consistent.'],
    explanation: conflicts.length
      ? 'Conflicting indexing signals were detected, which can confuse search engines about the preferred URL.'
      : 'No conflicting indexing signals were detected.'
  }));

  return makeCategory('seo', checks);
}








