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
      if (!current || sawDirective) {
        current = { agents: [], rules: [] };
        groups.push(current);
        sawDirective = false;
      }
      current.agents.push(value.toLowerCase());
      continue;
    }
    if (!current || (key !== 'allow' && key !== 'disallow')) continue;
    sawDirective = true;
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
  const hasIdentitySchema = facts.jsonLdTypes.some((t) => /Organization|Person|LocalBusiness|ProfessionalService/i.test(t));
  const hasVisibleName = /christopher|company|business|agency|studio|limited|ltd|& co/i.test(facts.bodyText.slice(0, 2000));
  const identityStrength = hasIdentitySchema && hasVisibleName;
  if (identityStrength) {
    checks.push(check({
      id: 'ai-business-identity', name: 'Business identity is clear',
      status: 'pass', measured: 'measured', points: 10,
      evidence: ['Organization/Person schema present and a business name appears in the page text.'],
      explanation: 'AI systems can clearly identify who owns this content, which supports accurate attribution.'
    }));
  } else if (hasIdentitySchema || hasVisibleName) {
    checks.push(check({
      id: 'ai-business-identity', name: 'Business identity is clear',
      status: 'warning', severity: 'low', measured: 'measured', points: 10,
      evidence: [
        ...(hasIdentitySchema ? ['Identity schema present.'] : []),
        ...(hasVisibleName ? ['Business name appears in page text.'] : [])
      ],
      explanation: 'Some identity signals exist but the picture is incomplete. Adding both a clear name in the content and identity schema strengthens it.',
      fix: 'Make sure your business name and a short description appear on the page, and add Organization or Person JSON-LD.'
    }));
  } else {
    checks.push(check({
      id: 'ai-business-identity', name: 'Business identity is clear',
      status: 'fail', severity: 'medium', measured: 'measured', points: 10,
      evidence: ['No organisation schema and no obvious business name found in the page text.'],
      explanation: 'It is unclear who provides this content. AI systems may struggle to attribute it correctly.',
      fix: 'State who you are and what you do on the page, and add an Organization/Person schema block.',
      docs: [DOCS.structured]
    }));
  }

  // ---- Service clarity / value proposition ----
  const wordCount = facts.wordCount;
  if (wordCount >= 300) {
    checks.push(check({
      id: 'ai-service-clarity', name: 'Value proposition is explained',
      status: 'pass', measured: 'measured', points: 8,
      evidence: [`Approx. ${wordCount} words of page text.`],
      explanation: 'The page has enough descriptive text for an AI system to understand what it offers.'
    }));
  } else if (wordCount >= 100) {
    checks.push(check({
      id: 'ai-service-clarity', name: 'Value proposition is explained',
      status: 'warning', severity: 'low', measured: 'measured', points: 8,
      evidence: [`Approx. ${wordCount} words of page text.`],
      explanation: `The page has about ${wordCount} words. More descriptive, directly useful copy would help AI systems extract a clear answer.`,
      fix: 'Expand the copy with a clear description of what you do, who it is for, and the outcome you deliver.'
    }));
  } else {
    checks.push(check({
      id: 'ai-service-clarity', name: 'Value proposition is explained',
      status: 'fail', severity: 'medium', measured: 'measured', points: 8,
      evidence: [`Only approx. ${wordCount} words of page text found.`],
      explanation: 'There is very little text on the page, so there is not enough substance for an AI system to describe or recommend it.',
      fix: 'Add clear, descriptive content that directly answers what the business does and for whom.'
    }));
  }

  // ---- Topical focus ----
  const topics = new Set<string>();
  const stopwords = new Set(['the', 'and', 'for', 'with', 'from', 'that', 'this', 'your', 'our', 'are', 'was', 'have', 'has', 'not', 'but', 'you', 'will', 'can', 'all', 'any', 'into', 'about']);
  const words = facts.bodyText.toLowerCase().match(/[a-z]{4,}/g) || [];
  for (const word of words.slice(0, 3000)) {
    if (!stopwords.has(word)) topics.add(word);
  }
  checks.push(check({
    id: 'ai-topical-focus', name: 'Content has a clear topical focus',
    status: topics.size >= 40 ? 'pass' : topics.size >= 12 ? 'warning' : 'fail',
    severity: topics.size >= 12 ? 'low' : 'medium',
    measured: 'measured', points: 6,
    evidence: [`Detected roughly ${topics.size} distinct content words.`],
    explanation: topics.size >= 40
      ? 'The page contains a varied vocabulary, suggesting focused, substantial content.'
      : `The page has a narrow vocabulary (${topics.size} distinct words). It may be too thin for AI systems to extract useful answers.`,
    fix: 'Write substantive content that explains the topic in depth rather than a few sentences.'
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
  const directAnswerStrength = hasFaqSchema || (hasQuestionHeading && wordCount >= 200);
  checks.push(check({
    id: 'ai-direct-answers', name: 'Page answers likely customer questions',
    status: directAnswerStrength ? 'pass' : hasQuestionHeading ? 'warning' : 'info',
    severity: hasQuestionHeading && !directAnswerStrength ? 'low' : undefined,
    measured: 'measured', points: 6,
    evidence: [
      ...(hasFaqSchema ? ['FAQ/Q&A structured data present.'] : []),
      ...(hasQuestionHeading ? ['Question-style language detected in the content.'] : [])
    ],
    explanation: directAnswerStrength
      ? 'The page addresses common questions directly, which makes it more likely to be useful to AI answer engines.'
      : hasQuestionHeading
        ? 'The page touches on questions but may not answer them in enough depth.'
        : 'No obvious question-and-answer structure was detected. AI systems favour pages that directly answer specific questions.',
    fix: 'Add a clear FAQ or Q&A section that answers the questions your customers actually ask.'
  }));
  // ---- Descriptive title/meta (inferred from SEO checks) ----
  const titleOk = facts.title.length > 0;
  const metaOk = facts.metaDescription.length > 0;
  checks.push(check({
    id: 'ai-title-meta', name: 'Descriptive title and meta summary',
    status: titleOk && metaOk ? 'pass' : titleOk || metaOk ? 'warning' : 'fail',
    severity: titleOk && metaOk ? undefined : 'low',
    measured: 'inferred', points: 3,
    evidence: [
      ...(titleOk ? [`Title: ${facts.title}`] : ['No title.']),
      ...(metaOk ? ['Meta description present.'] : ['No meta description.'])
    ],
    explanation: 'Clear titles and descriptions help both search engines and AI systems summarise what the page is about.',
    fix: 'Write a descriptive title and meta description that summarise the page accurately.',
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
    id: 'ai-internal-relations', name: 'Related pages are linked together',
    status: facts.internalLinks.length >= 3 ? 'pass' : facts.internalLinks.length > 0 ? 'warning' : 'fail',
    severity: facts.internalLinks.length >= 3 ? undefined : 'low',
    measured: 'inferred', points: 3,
    evidence: [`${facts.internalLinks.length} internal link(s) found.`],
    explanation: 'Internal links help AI systems connect related content and build a fuller picture of your site.',
    fix: 'Link related pages together with descriptive anchor text.',
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




