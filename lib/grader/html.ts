/**
 * Cheerio-based HTML parsing for the Website Grader.
 * Produces a deterministic `PageFacts` object consumed by the check modules.
 */

import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';

export interface PageImage {
  src: string;
  alt: string;
  hasAlt: boolean;
  width: string;
  height: string;
  loading: string;
}

export interface PageLink {
  href: string;
  text: string;
  hasText: boolean;
  absolute: boolean;
  internal: boolean;
  relNofollow: boolean;
}

export interface StructuredDataBlock {
  type: string | null;
  raw: string;
  validJson: boolean;
  data: unknown;
  error?: string;
}

export interface PageFacts {
  title: string;
  titleLength: number;
  metaDescription: string;
  metaDescriptionLength: number;
  h1Count: number;
  h1Texts: string[];
  headingLevels: number[];
  canonical: string | null;
  robotsMeta: string | null;
  og: { title: string | null; description: string | null; image: string | null; url: string | null; type: string | null };
  twitter: { card: string | null; title: string | null; description: string | null; image: string | null };
  lang: string | null;
  viewport: string | null;
  images: PageImage[];
  links: PageLink[];
  internalLinks: string[];
  externalLinks: string[];
  forms: { hasInput: boolean; inputCount: number; labeledInputs: number; unlabeledInputs: number } | null;
  buttons: { total: number; unnamed: number };
  structuredData: StructuredDataBlock[];
  jsonLdTypes: string[];
  bodyText: string;
  wordCount: number;
  headScripts: { src: string; defer: boolean; async: boolean }[];
  headCss: { href: string | null; inline: boolean; media: string }[];
  thirdPartyScripts: { src: string; host: string }[];
  hasMain: boolean;
  hasNav: boolean;
  hasHeader: boolean;
  hasFooter: boolean;
  hasHreflang: boolean;
  favicon: string | null;
  metaRobotsValues: string[];
}

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;

/** Collect JSON-LD types recursively, including @graph, arrays and nested entities. */
function collectJsonLdTypes(value: unknown): string[] {
  const found = new Set<string>();
  const visit = (node: unknown): void => {
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    if (!node || typeof node !== 'object') return;
    const record = node as Record<string, unknown>;
    const type = record['@type'];
    if (typeof type === 'string' && type.trim()) found.add(type.trim());
    else if (Array.isArray(type)) {
      for (const item of type) if (typeof item === 'string' && item.trim()) found.add(item.trim());
    }
    for (const child of Object.values(record)) {
      if (child && typeof child === 'object') visit(child);
    }
  };
  visit(value);
  return [...found];
}

function cleanText(value: string | undefined | null): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

/** Best-effort hostname extraction from a URL string (may be relative). */
function hostOf(href: string): string {
  try {
    return new URL(href).hostname.toLowerCase();
  } catch {
    return '';
  }
}

export function parsePage(html: string, origin: string): PageFacts {
  const $ = cheerio.load(html);

  const originHost = (() => {
    try {
      return new URL(origin).hostname.toLowerCase();
    } catch {
      return '';
    }
  })();

  const title = cleanText($('head title').first().text());
  const metaDescription = cleanText($('meta[name="description"]').first().attr('content'));

  const h1Count = $('h1').length;
  const h1Texts: string[] = [];
  $('h1').each((_i, el) => {
    const text = cleanText($(el).text());
    if (text) h1Texts.push(text);
  });

  const headingLevels: number[] = [];
  for (const level of HEADING_LEVELS) {
    $(`h${level}`).each(() => { headingLevels.push(level); });
  }

  const canonical = (() => {
    const href = $('link[rel="canonical"]').first().attr('href');
    return href ? href.trim() : null;
  })();

  const robotsMeta = $('meta[name="robots"]').first().attr('content') ?? null;
  const metaRobotsValues = $('meta[name="robots"]').map((_i, el) => cleanText($(el).attr('content'))).get();

  const og = {
    title: $('meta[property="og:title"]').first().attr('content') ?? null,
    description: $('meta[property="og:description"]').first().attr('content') ?? null,
    image: $('meta[property="og:image"]').first().attr('content') ?? null,
    url: $('meta[property="og:url"]').first().attr('content') ?? null,
    type: $('meta[property="og:type"]').first().attr('content') ?? null
  };

  const twitter = {
    card: $('meta[name="twitter:card"]').first().attr('content') ?? null,
    title: $('meta[name="twitter:title"]').first().attr('content') ?? null,
    description: $('meta[name="twitter:description"]').first().attr('content') ?? null,
    image: $('meta[name="twitter:image"]').first().attr('content') ?? null
  };

  const lang = $('html').first().attr('lang') ?? null;
  const viewport = $('meta[name="viewport"]').first().attr('content') ?? null;
  const hasHreflang = $('link[rel="alternate"][hreflang]').length > 0;
  const favicon = $('link[rel*="icon"]').first().attr('href') ?? null;
  const images: PageImage[] = [];
  $('img').each((_i, el) => {
    const $img = $(el);
    images.push({
      src: $img.attr('src') ?? $img.attr('data-src') ?? '',
      alt: $img.attr('alt') ?? '',
      hasAlt: $img.attr('alt') !== undefined,
      width: $img.attr('width') ?? '',
      height: $img.attr('height') ?? '',
      loading: $img.attr('loading') ?? ''
    });
  });

  const links: PageLink[] = [];
  const internalLinks: string[] = [];
  const externalLinks: string[] = [];
  $('a[href]').each((_i, el) => {
    const $a = $(el);
    const href = ($a.attr('href') || '').trim();
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    const text = cleanText($a.text());
    const host = hostOf(href);
    const internal = host === '' || host === originHost;
    const absolute = host !== '';
    const link: PageLink = {
      href,
      text,
      hasText: text.length > 0 && text.toLowerCase() !== 'click here',
      absolute,
      internal,
      relNofollow: ($a.attr('rel') || '').split(/\s+/).includes('nofollow')
    };
    links.push(link);
    if (internal) internalLinks.push(absolute ? href : new URL(href, origin).toString());
    else externalLinks.push(href);
  });

  const forms = $('form').length > 0
    ? (() => {
        let inputCount = 0;
        let labeledInputs = 0;
        let unlabeledInputs = 0;
        $('form').each((_fi, formEl) => {
          $(formEl).find('input:not([type="hidden"]), textarea, select').each((_ii, inputEl) => {
            const $input = $(inputEl);
            const id = $input.attr('id');
            inputCount += 1;
            const hasLabel = $input.attr('aria-label')
              || $input.attr('aria-labelledby')
              || $input.attr('placeholder')
              || $input.attr('title')
              || (id && $(`label[for="${id}"]`).length > 0);
            if (hasLabel) labeledInputs += 1;
            else unlabeledInputs += 1;
          });
        });
        return { hasInput: true, inputCount, labeledInputs, unlabeledInputs };
      })()
    : null;

  const buttons = (() => {
    let total = 0;
    let unnamed = 0;
    $('button, [role="button"]').each((_i, el) => {
      const $el = $(el);
      total += 1;
      const text = cleanText($el.text());
      const label = $el.attr('aria-label');
      if (!text && !label && !$el.attr('title')) unnamed += 1;
    });
    return { total, unnamed };
  })();

  const structuredData: StructuredDataBlock[] = [];
  const jsonLdTypes: string[] = [];
  $('script[type="application/ld+json"]').each((_i, el) => {
    const raw = $(el).contents().text() || $(el).text();
    try {
      const parsed: unknown = JSON.parse(raw);
      const types = collectJsonLdTypes(parsed);
      structuredData.push({ type: types.join(', ') || null, raw, validJson: true, data: parsed });
      for (const type of types) if (!jsonLdTypes.includes(type)) jsonLdTypes.push(type);
    } catch (err) {
      structuredData.push({ type: null, raw, validJson: false, data: null, error: err instanceof Error ? err.message : 'Invalid JSON' });
    }
  });

  const bodyText = cleanText($('body').text());
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;

  const headScripts: PageFacts['headScripts'] = [];
  $('head script[src]').each((_i, el) => {
    const $s = $(el);
    headScripts.push({
      src: $s.attr('src') || '',
      defer: $s.attr('defer') !== undefined,
      async: $s.attr('async') !== undefined
    });
  });

  const headCss: PageFacts['headCss'] = [];
  $('head link[rel="stylesheet"]').each((_i, el) => {
    const $l = $(el);
    headCss.push({ href: $l.attr('href') ?? null, inline: false, media: $l.attr('media') ?? '' });
  });
  $('head style').each(() => { headCss.push({ href: null, inline: true, media: '' }); });

  const thirdPartyScripts: PageFacts['thirdPartyScripts'] = [];
  $('script[src]').each((_i, el) => {
    const src = $(el).attr('src') || '';
    const host = hostOf(src);
    if (host && host !== originHost && !src.startsWith('/') && !src.startsWith('./') && !src.startsWith('../')) {
      thirdPartyScripts.push({ src, host });
    }
  });

  const hasMain = $('main').length > 0;
  const hasNav = $('nav').length > 0;
  const hasHeader = $('header').length > 0;
  const hasFooter = $('footer').length > 0;

  return {
    title,
    titleLength: title.length,
    metaDescription,
    metaDescriptionLength: metaDescription.length,
    h1Count,
    h1Texts,
    headingLevels,
    canonical,
    robotsMeta,
    og,
    twitter,
    lang,
    viewport,
    images,
    links,
    internalLinks,
    externalLinks,
    forms,
    buttons,
    structuredData,
    jsonLdTypes,
    bodyText,
    wordCount,
    headScripts,
    headCss,
    thirdPartyScripts,
    hasMain,
    hasNav,
    hasHeader,
    hasFooter,
    hasHreflang,
    favicon,
    metaRobotsValues
  };
}

export type { CheerioAPI };

