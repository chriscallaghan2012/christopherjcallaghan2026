/**
 * AI Search / answer-engine readiness checks.
 * Assesses observable signals only. This tool never claims to know whether
 * ChatGPT, Gemini or other AI systems will cite a page, and a missing
 * llms.txt is informational, not a failure.
 */

import type { Check } from '../types';
import type { ScanContext } from '../context';
import { makeCategory } from '../context';

const AI_CRAWLER_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'anthropic-ai',
  'PerplexityBot',
  'CCBot'
] as const;

interface RobotsRuleGroup {
  agents: string[];
  rules: Array<{ allow: boolean; path: string }>;
}

/**
 * Returns known AI crawler user agents whose matching robots.txt group
 * disallows the requested path. Robots rules are grouped by consecutive
 * User-agent lines; the most specific matching path wins, with Allow winning
 * ties. This is intentionally a bounded diagnostic, not a full RFC parser.
 */
export function findBlockedAiCrawlers(robotsTxt: string | null, pathname: string): string[] {
  if (robotsTxt === null) return [];

  const groups: RobotsRuleGroup[] = [];
  let current: RobotsRuleGroup | null = null;
  let sawDirective = false;

  for (const rawLine of robotsTxt.split(/\r?\n/)) {
    const line = rawLine.split('#', 1)[0]?.trim();
    if (!line) continue;
    const separator = line.indexOf(':');
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    if (key === 'user-agent') {
      if (!value) continue;
      if (!current || sawDirective) {
        current = { agents: [], rules: [] };
        groups.push(current);
        sawDirective = false;
      }
      current.agents.push(value.toLowerCase());
      continue;
    }
    if (current) sawDirective = true;
    if (!current || (key !== 'allow' && key !== 'disallow')) continue;
    if (value) current.rules.push({ allow: key === 'allow', path: value });
  }

  const blocked: string[] = [];
  for (const crawler of AI_CRAWLER_AGENTS) {
    const token = crawler.toLowerCase();
    const specific = groups.filter((group) => group.agents.some((agent) => agent !== '*' && token.includes(agent)));
    const applicable = specific.length > 0
      ? specific
      : groups.filter((group) => group.agents.includes('*'));
    const rules = applicable.flatMap((group) => group.rules)
      .filter((rule) => pathname.startsWith(rule.path))
      .sort((a, b) => b.path.length - a.path.length || Number(b.allow) - Number(a.allow));
    if (rules[0] && !rules[0].allow) blocked.push(crawler);
  }
  return blocked;
}

function collectNamedIdentityEntities(value: unknown): string[] {
  const names = new Set<string>();
  const identityType = /^(Organization|Person|LocalBusiness|ProfessionalService)$/i;
  const visit = (node: unknown): void => {
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    if (!node || typeof node !== 'object') return;
    const record = node as Record<string, unknown>;
    const rawType = record['@type'];
    const types = Array.isArray(rawType) ? rawType : [rawType];
    const isIdentity = types.some((type) => typeof type === 'string' && identityType.test(type.split('/').pop() ?? type));
    if (isIdentity && typeof record.name === 'string' && record.name.trim()) names.add(record.name.trim());
    for (const child of Object.values(record)) if (child && typeof child === 'object') visit(child);
  };
  visit(value);
  return [...names];
}

const DOCS = {
  llms: { label: 'llms.txt', url: 'https://llmstxt.org/' },
  structured: { label: 'Google: structured data', url: 'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data' },
  robotsAi: { label: 'Search engine robots', url: 'https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag' }
};

function check(input: Omit<Check, 'category'>): Check {
  return { ...input, category: 'ai' };
}

export function runAiChecks(ctx: ScanContext): Check[] {
  const checks: Check[] = [];
  const facts = ctx.pageFacts;

  const accessible = ctx.page !== null && (ctx.page.status ?? 0) >= 200 && (ctx.page.status ?? 0) < 400;

  // ---- Public accessibility ----
  if (accessible) {
    checks.push(check({
      id: 'ai-publicly-accessible', name: 'Content is publicly accessible',
      status: 'pass', measured: 'measured', points: 8,
      evidence: [`Fetched HTTP ${ctx.page?.status} from ${ctx.finalUrl}`],
      explanation: 'The scanner could fetch the page without authentication, which is a prerequisite for any AI or search system to extract its content.'
    }));
  } else {
    checks.push(check({
      id: 'ai-publicly-accessible', name: 'Content is publicly accessible',
      status: 'fail', severity: 'critical', measured: 'measured', points: 8,
      evidence: [`Page status: ${ctx.page?.status ?? 'unreachable'}`],
      explanation: 'The page could not be fetched publicly, so AI systems and crawlers cannot extract its content either.',
      fix: 'Make the page publicly reachable over HTTPS without login walls or blocking rules.'
    }));
  }

  // ---- AI crawler rules (parse user-agent groups rather than matching unrelated lines) ----
  const blockedAiCrawlers = findBlockedAiCrawlers(ctx.robotsTxt, new URL(ctx.finalUrl).pathname);
  if (blockedAiCrawlers.length > 0) {
    checks.push(check({
      id: 'ai-crawler-permissive', name: 'Known AI crawlers are allowed by robots.txt',
      status: 'warning', severity: 'medium', measured: 'measured', points: 5,
      evidence: blockedAiCrawlers.map((crawler) => `robots.txt blocks ${crawler} from ${new URL(ctx.finalUrl).pathname}.`),
      explanation: 'robots.txt appears to disallow one or more known AI crawlers for this page. This is a choice, not automatically an SEO error; the impact depends on which services you want to access your content.',
      fix: 'If you want the listed services to crawl this content, review the matching User-agent group in robots.txt and adjust its Disallow/Allow rules deliberately.',
      docs: [DOCS.robotsAi],
      refs: ['seo-robots-txt']
    }));
  } else if (ctx.robotsTxt === null) {
    checks.push(check({
      id: 'ai-crawler-permissive', name: 'Known AI crawler rules',
      status: 'not_measured', measured: 'not_applicable', points: 0,
      evidence: ['robots.txt could not be fetched, so crawler-specific rules could not be checked.'],
      explanation: 'The scanner cannot determine crawler-specific access rules when robots.txt is unavailable.',
      docs: [DOCS.robotsAi],
      refs: ['seo-robots-txt']
    }));
  } else {
    checks.push(check({
      id: 'ai-crawler-permissive', name: 'Known AI crawlers are allowed by robots.txt',
      status: 'pass', measured: 'measured', points: 5,
      evidence: ['No disallow rule was found for the checked AI crawler user agents and this page path.'],
      explanation: 'No matching robots.txt rule was found that disallows the checked AI crawlers from this page. This does not prove that every AI service can fetch or use the content.',
      docs: [DOCS.robotsAi],
      refs: ['seo-robots-txt']
    }));
  }

  if (!facts) {
    checks.push(check({
      id: 'ai-content-unavailable', name: 'Content-level AI readiness',
      status: 'not_measured', measured: 'not_applicable', points: 0,
      evidence: ['No page content was available to analyse.'],
      explanation: 'Because the page could not be fetched, content-level AI readiness signals could not be measured.'
    }));
    return makeCategory('ai', checks);
  }
  // ---- Business / person identity ----
  const identityNames = facts.structuredData
    .filter((block) => block.validJson)
    .flatMap((block) => collectNamedIdentityEntities(block.data));
  const visiblePageText = `${facts.title} ${facts.h1Texts.join(' ')} ${facts.bodyText}`.toLowerCase();
  const visibleIdentityName = identityNames.find((name) => visiblePageText.includes(name.toLowerCase()));
  if (visibleIdentityName) {
    checks.push(check({
      id: 'ai-business-identity', name: 'Named entity schema matches visible page text',
      status: 'pass', measured: 'measured', points: 8,
      evidence: [`Named identity entity found in JSON-LD and visible title/headings/text: ${visibleIdentityName}`],
      explanation: 'A named Organization/Person/LocalBusiness entity in JSON-LD also appears in the extracted page text. This is a consistency signal, not proof of business legitimacy or authority.',
      docs: [DOCS.structured]
    }));
  } else if (identityNames.length > 0) {
    checks.push(check({
      id: 'ai-business-identity', name: 'Named entity schema matches visible page text',
      status: 'warning', severity: 'low', measured: 'inferred', points: 8,
      evidence: [`Named identity entity in JSON-LD not found verbatim in the extracted title, headings or body text: ${identityNames.slice(0, 3).join(', ')}`],
      explanation: 'The structured-data name did not match the extracted visible text verbatim. This may be a genuine mismatch or a formatting difference; review it manually.',
      fix: 'Confirm the Organization/Person name in JSON-LD accurately reflects the identity shown to visitors.',
      docs: [DOCS.structured]
    }));
  } else {
    checks.push(check({
      id: 'ai-business-identity', name: 'Named entity schema consistency',
      status: 'info', measured: 'inferred', points: 0,
      evidence: ['No named Organization/Person/LocalBusiness entity could be extracted from the detected JSON-LD.'],
      explanation: 'The scanner cannot reliably infer a business name from generic page words. Entity schema is optional, and absence alone is not treated as a failure.',
      fix: 'If relevant for this page, consider adding accurate Organization, Person or LocalBusiness JSON-LD with a name that matches visible content.',
      docs: [DOCS.structured]
    }));
  }

  // ---- Extractable text volume (informational; volume is not content quality) ----
  const wordCount = facts.wordCount;
  checks.push(check({
    id: 'ai-service-clarity', name: 'Extractable text volume (informational)',
    status: 'info', measured: 'measured', points: 0,
    evidence: [`Approximately ${wordCount} words of visible text were extracted.`],
    explanation: 'Word count is only a rough measurement of extractable text. It cannot determine whether the content is useful, accurate, authoritative or sufficiently clear, so it does not affect the AI-readiness score.',
    ...(wordCount < 30 ? { fix: 'If this page should explain a product or service, make sure its key information is available as readable HTML text.' } : {})
  }));

  // ---- Topical focus ----
  const topics = new Set<string>();
  const stopwords = new Set(['the', 'and', 'for', 'with', 'from', 'that', 'this', 'your', 'our', 'are', 'was', 'have', 'has', 'not', 'but', 'you', 'will', 'can', 'all', 'any', 'into', 'about']);
  const words = facts.bodyText.toLowerCase().match(/[a-z]{4,}/g) || [];
  for (const word of words.slice(0, 3000)) {
    if (!stopwords.has(word)) topics.add(word);
  }
  checks.push(check({
    id: 'ai-topical-focus', name: 'Content vocabulary sample (informational)',
    status: 'info', measured: 'measured', points: 0,
    evidence: [`Detected roughly ${topics.size} distinct content words in the sampled text.`],
    explanation: 'Distinct-word count is not a reliable measure of topical focus, expertise or content quality. This is shown as context only and does not affect the AI-readiness score.'
  }));
  // ---- Descriptive headings ----
  const headingCount = facts.headingLevels.length;
  checks.push(check({
    id: 'ai-heading-structure', name: 'Content uses descriptive headings',
    status: headingCount >= 3 ? 'pass' : headingCount >= 1 ? 'warning' : 'fail',
    severity: headingCount >= 1 ? 'low' : 'medium',
    measured: 'measured', points: 5,
    evidence: [`${headingCount} heading element(s) detected (H1–H6).`],
    explanation: headingCount >= 3
      ? 'The page uses multiple headings, giving AI systems a clear content outline.'
      : 'The page has few or no headings, making it harder to identify the structure and the questions the page answers.',
    fix: 'Structure the content with descriptive H2/H3 headings that summarise each section.'
  }));

  // ---- Direct answers ----
  const hasFaqSchema = facts.jsonLdTypes.some((t) => /FAQPage|QAPage|HowTo/i.test(t));
  const hasQuestionHeading = /(\?|\bhow\b|\bwhat\b|\bwhy\b|\bwhen\b|\bwhere\b|\bbest\b|\bcost\b|\bprice\b)/i.test(facts.bodyText.slice(0, 4000));
  const directAnswerStrength = hasQuestionHeading && wordCount >= 200;
  checks.push(check({
    id: 'ai-direct-answers', name: 'Question and answer signals',
    status: directAnswerStrength ? 'pass' : hasQuestionHeading || hasFaqSchema ? 'warning' : 'info',
    severity: hasQuestionHeading || hasFaqSchema ? 'low' : undefined,
    measured: 'inferred', points: 3,
    evidence: [
      ...(hasFaqSchema ? ['FAQ/Q&A/HowTo structured data detected; this alone does not prove the markup matches visible content.'] : []),
      ...(hasQuestionHeading ? ['Question-style language detected in the sampled content.'] : [])
    ],
    explanation: directAnswerStrength
      ? 'Question-style content and a reasonable amount of extractable text were detected. This is a structural signal only; answer quality and accuracy were not evaluated.'
      : hasQuestionHeading || hasFaqSchema
        ? 'Some question or FAQ-schema signals were detected, but the scanner cannot confirm answer quality or that structured data matches the visible content.'
        : 'No obvious question or FAQ-schema signals were detected. This check cannot judge whether the page is genuinely helpful or accurate.',
    fix: 'Where useful to visitors, answer real customer questions clearly in visible page content and ensure any structured data matches that content.'
  }));
  // ---- Descriptive title/meta (inferred from SEO checks) ----
  const titleOk = facts.title.length > 0;
  const metaOk = facts.metaDescription.length > 0;
  checks.push(check({
    id: 'ai-title-meta', name: 'Title and meta signals (scored in SEO)',
    status: 'info',
    measured: 'inferred', points: 0,
    evidence: [
      ...(titleOk ? [`Title: ${facts.title}`] : ['No title.']),
      ...(metaOk ? ['Meta description present.'] : ['No meta description.'])
    ],
    explanation: 'These title and meta signals are assessed and scored in the SEO category. They are repeated here for AI-search context only and do not add a second scoring penalty.',
    refs: ['seo-title', 'seo-meta-description']
  }));

  // ---- Structured data consistency ----
  const hasServiceOrFaq = facts.jsonLdTypes.some((t) => /Service|Product|FAQPage|Organization|LocalBusiness/i.test(t));
  checks.push(check({
    id: 'ai-structured-data-consistent', name: 'Structured data supports visible content',
    status: hasServiceOrFaq ? 'pass' : 'info',
    measured: 'inferred', points: 7,
    evidence: hasServiceOrFaq ? [`Schema types found: ${facts.jsonLdTypes.join(', ')}`] : ['No service/FAQ/organisation schema detected.'],
    explanation: hasServiceOrFaq
      ? 'Structured data is present that can help AI systems understand entities on the page.'
      : 'Adding Service, FAQ or Organization schema that matches your visible content helps AI systems parse it consistently.',
    fix: 'Add JSON-LD that matches what is shown on the page (e.g. Organization, Service, FAQPage).',
    docs: [DOCS.structured]
  }));

  // ---- Internal relations ----
  checks.push(check({
    id: 'ai-internal-relations', name: 'Internal linking context (scored in SEO)',
    status: 'info',
    measured: 'inferred', points: 0,
    evidence: [`${facts.internalLinks.length} internal link(s) found.`],
    explanation: 'The internal-link count is assessed and scored in the SEO category. This contextual duplicate does not add a second scoring penalty.',
    refs: ['seo-internal-links']
  }));

  // ---- Contact info ----
  const hasContact = /([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})|(\+?\d[\d\s().-]{7,})|(mailto:)/i.test(facts.bodyText.slice(0, 4000));
  checks.push(check({
    id: 'ai-contact-info', name: 'Contact information is available',
    status: hasContact ? 'pass' : 'info',
    measured: 'measured', points: 4,
    evidence: hasContact ? ['Email or phone contact details detected in the page text.'] : ['No obvious email/phone contact details in the visible text.'],
    explanation: hasContact
      ? 'Visible contact details make it easy for AI systems and users to find how to get in touch.'
      : 'Add a visible email or phone number (and ideally a contact page) so contact details are unambiguous.'
  }));
  // ---- llms.txt (informational) ----
  checks.push(check({
    id: 'ai-llms-txt', name: 'llms.txt (informational)',
    status: ctx.llmsTxt !== null ? 'pass' : 'info',
    measured: 'measured', points: 0,
    evidence: ctx.llmsTxt !== null ? ['/llms.txt was found.'] : ['/llms.txt was not found (informational — not a requirement).'],
    explanation: 'llms.txt is an emerging convention some AI tools use to find content. Its absence is not a failure and most sites do not have one yet.',
    docs: [DOCS.llms]
  }));

  // ---- Extraction barriers ----
  const barriers: string[] = [];
  if (wordCount < 30) barriers.push('very little extractable text');
  checks.push(check({
    id: 'ai-extraction-barriers', name: 'No obvious content extraction barriers',
    status: barriers.length === 0 ? 'pass' : 'warning',
    severity: barriers.length ? 'medium' : undefined,
    measured: 'measured', points: 4,
    evidence: barriers.length ? barriers : ['No obvious technical extraction barriers detected from the HTML.'],
    explanation: barriers.length
      ? 'Some barriers may prevent clean text extraction.'
      : 'The HTML contains extractable text. Note that this scanner reads raw HTML, not a rendered browser view — heavily JavaScript-dependent pages may behave differently for real crawlers.'
  }));

  // ---- Honest disclaimer ----
  checks.push(check({
    id: 'ai-citation-disclaimer', name: 'AI citation disclaimer',
    status: 'info', measured: 'not_applicable', points: 0,
    evidence: ['This tool does not predict AI citations or rankings.'],
    explanation: 'Whether ChatGPT, Gemini or other AI systems cite a page depends on factors outside this scan. These checks only describe observable signals that can help AI systems understand and reference your content.'
  }));

  return makeCategory('ai', checks);
}




