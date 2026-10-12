export interface LlmsTxtLink {
  id: string;
  title: string;
  url: string;
  description: string;
}

export interface LlmsTxtSection {
  id: string;
  title: string;
  links: LlmsTxtLink[];
}

export interface LlmsTxtInput {
  siteName: string;
  siteUrl: string;
  summary: string;
  guidance: string;
  sections: LlmsTxtSection[];
}

export interface LlmsTxtErrors {
  siteName?: string;
  siteUrl?: string;
  summary?: string;
  guidance?: string;
  sectionTitles: Record<string, string>;
  linkTitles: Record<string, string>;
  linkUrls: Record<string, string>;
  linkDescriptions: Record<string, string>;
}

export function normalizeLlmsUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    url.hash = '';
    return url.toString();
  } catch {
    return null;
  }
}

function escapeMarkdown(value: string): string {
  return value.trim().replace(/[\\`*_{}\[\]()#+.!|>~-]/g, '\\$&');
}

function escapeDestination(value: string): string {
  return value.replace(/[()]/g, (character) => character === '(' ? '%28' : '%29');
}

export function validateLlmsInput(input: LlmsTxtInput): LlmsTxtErrors {
  const errors: LlmsTxtErrors = {
    sectionTitles: {},
    linkTitles: {},
    linkUrls: {},
    linkDescriptions: {}
  };

  if (!input.siteName.trim()) errors.siteName = 'Enter a site or business name.';
  else if (input.siteName.trim().length > 120) errors.siteName = 'Use 120 characters or fewer.';

  if (!normalizeLlmsUrl(input.siteUrl)) errors.siteUrl = 'Enter a valid HTTP or HTTPS website address.';

  if (!input.summary.trim()) errors.summary = 'Add a short summary of the site.';
  else if (input.summary.trim().length > 280) errors.summary = 'Keep the summary to 280 characters or fewer.';

  if (input.guidance.length > 2000) errors.guidance = 'Keep guidance to 2,000 characters or fewer.';

  for (const section of input.sections) {
    const hasAnyLinkContent = section.links.some((link) => link.title.trim() || link.url.trim() || link.description.trim());
    if (hasAnyLinkContent && !section.title.trim()) errors.sectionTitles[section.id] = 'Name this section.';

    for (const link of section.links) {
      if (!link.title.trim() && !link.url.trim() && !link.description.trim()) continue;
      if (!link.title.trim()) errors.linkTitles[link.id] = 'Add a link title.';
      else if (link.title.trim().length > 140) errors.linkTitles[link.id] = 'Use 140 characters or fewer.';
      if (!normalizeLlmsUrl(link.url)) errors.linkUrls[link.id] = 'Enter a valid HTTP or HTTPS URL.';
      if (link.description.trim().length > 240) errors.linkDescriptions[link.id] = 'Keep the description to 240 characters or fewer.';
    }
  }

  return errors;
}

export function buildLlmsTxt(input: LlmsTxtInput): string {
  const lines: string[] = [];
  const siteName = input.siteName.trim();
  const summary = input.summary.trim();
  const siteUrl = normalizeLlmsUrl(input.siteUrl);

  if (siteName) lines.push(`# ${escapeMarkdown(siteName)}`);
  if (summary) lines.push('', `> ${escapeMarkdown(summary)}`);
  if (siteUrl) lines.push('', `Canonical website: ${escapeDestination(siteUrl)}`);

  const guidance = input.guidance.trim();
  if (guidance) {
    lines.push('');
    for (const paragraph of guidance.split(/\n\s*\n/)) {
      const text = paragraph.split(/\r?\n/).map((line) => escapeMarkdown(line)).filter(Boolean).join(' ');
      if (text) lines.push(text, '');
    }
    while (lines.at(-1) === '') lines.pop();
  }

  for (const section of input.sections) {
    const entries = section.links
      .map((link) => ({ ...link, url: normalizeLlmsUrl(link.url) }))
      .filter((link) => link.title.trim() && link.url);
    if (!section.title.trim() || entries.length === 0) continue;

    lines.push('', `## ${escapeMarkdown(section.title)}`, '');
    for (const link of entries) {
      const description = link.description.trim();
      const suffix = description ? `: ${escapeMarkdown(description)}` : '';
      lines.push(`- [${escapeMarkdown(link.title)}](${escapeDestination(link.url!)})${suffix}`);
    }
  }

  return lines.join('\n').trimEnd() + (lines.length ? '\n' : '');
}