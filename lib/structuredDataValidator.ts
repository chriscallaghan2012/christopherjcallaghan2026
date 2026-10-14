export type StructuredFindingSeverity = 'error' | 'warning' | 'info';

export interface StructuredFinding {
  severity: StructuredFindingSeverity;
  title: string;
  detail: string;
}

export interface StructuredDataResult {
  inputKind: 'jsonld' | 'html' | 'empty';
  scriptCount: number;
  entityCount: number;
  types: string[];
  parseErrors: string[];
  findings: StructuredFinding[];
}

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function typeNames(value: unknown): string[] {
  const values = Array.isArray(value) ? value : [value];
  return values.flatMap((item) => {
    if (typeof item !== 'string') return [];
    const name = item.split(/[\/#]/).filter(Boolean).pop();
    return name ? [name] : [];
  });
}

function collectEntities(value: unknown): JsonRecord[] {
  if (Array.isArray(value)) return value.flatMap(collectEntities);
  if (!isRecord(value)) return [];
  const entities: JsonRecord[] = [];
  if (value['@type']) entities.push(value);
  if (Array.isArray(value['@graph'])) entities.push(...collectEntities(value['@graph']));
  for (const [key, child] of Object.entries(value)) {
    if (key !== '@graph' && (Array.isArray(child) || isRecord(child))) entities.push(...collectEntities(child));
  }
  return entities;
}

function extractJsonLdBlocks(input: string): { blocks: string[]; isHtml: boolean } {
  const blocks: string[] = [];
  const scriptPattern = /<script\b[^>]*>[\s\S]*?<\/script\s*>/gi;
  let match: RegExpExecArray | null;
  let sawScript = false;
  while ((match = scriptPattern.exec(input)) !== null) {
    sawScript = true;
    const script = match[0];
    const openingTag = script.match(/^<script\b[^>]*>/i)?.[0] ?? '';
    const type = openingTag.match(/\btype\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const contentType = (type?.[1] ?? type?.[2] ?? type?.[3] ?? '').trim().toLowerCase();
    if (contentType !== 'application/ld+json') continue;
    blocks.push(script.slice(openingTag.length).replace(/<\/script\s*>$/i, '').trim());
  }
  return { blocks, isHtml: sawScript || /<html\b|<!doctype\s+html/i.test(input) };
}

function hasValue(record: JsonRecord, key: string): boolean {
  const value = record[key];
  if (typeof value === 'string') return value.trim().length > 0;
  return value !== undefined && value !== null && value !== false;
}

/**
 * Checks JSON syntax and a small set of common, transparent property hints.
 * It is not a full Schema.org validator or a Google rich-result eligibility test.
 */
export function validateStructuredData(input: string): StructuredDataResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { inputKind: 'empty', scriptCount: 0, entityCount: 0, types: [], parseErrors: [], findings: [{ severity: 'info', title: 'Paste structured data to begin', detail: 'Paste JSON-LD or HTML containing application/ld+json script blocks. Nothing is sent to a server.' }] };
  }

  const extracted = extractJsonLdBlocks(trimmed);
  const blocks = extracted.blocks.length > 0 ? extracted.blocks : extracted.isHtml ? [] : [trimmed];
  const parseErrors: string[] = [];
  const parsed: unknown[] = [];
  for (let index = 0; index < blocks.length; index += 1) {
    try {
      parsed.push(JSON.parse(blocks[index]));
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Invalid JSON.';
      parseErrors.push(`Block ${index + 1}: ${detail}`);
    }
  }

  const entities = parsed.flatMap(collectEntities);
  const types = [...new Set(entities.flatMap((entity) => typeNames(entity['@type'])))].sort();
  const findings: StructuredFinding[] = [];

  if (blocks.length === 0) {
    findings.push({ severity: 'info', title: 'No JSON-LD blocks found', detail: 'The pasted HTML did not contain a script with type="application/ld+json". Other structured-data formats are not checked by this tool.' });
  }
  if (parseErrors.length > 0) {
    findings.push({ severity: 'error', title: 'JSON syntax error', detail: parseErrors.join(' ') });
  }
  if (blocks.length > 0 && parseErrors.length === 0) {
    findings.push({ severity: 'info', title: 'JSON syntax is valid', detail: `Successfully parsed ${blocks.length} JSON-LD block${blocks.length === 1 ? '' : 's'}.` });
  }
  if (entities.length === 0 && parseErrors.length === 0 && blocks.length > 0) {
    findings.push({ severity: 'warning', title: 'No typed entities detected', detail: 'Valid JSON was found, but no object with an @type property was detected. Confirm that the input is intended to be JSON-LD.' });
  }

  for (const [index, entity] of entities.entries()) {
    const names = typeNames(entity['@type']);
    const label = names.join(', ') || `Entity ${index + 1}`;
    if (!hasValue(entity, '@context') && index === 0) {
      findings.push({ severity: 'warning', title: 'Check the JSON-LD context', detail: 'No @context was detected on the top-level object. Typical Schema.org JSON-LD uses "@context": "https://schema.org". Context placement can vary with arrays and graphs, so review this manually.' });
    }
    if (names.some((name) => /^(Organization|Person|LocalBusiness|ProfessionalService|WebSite)$/i.test(name)) && !hasValue(entity, 'name')) {
      findings.push({ severity: 'warning', title: `${label}: name is missing`, detail: 'A clear name is commonly expected for this entity. This is a practical property hint, not a complete schema validation.' });
    }
    if (names.some((name) => /^Product$/i.test(name))) {
      if (!hasValue(entity, 'name')) findings.push({ severity: 'warning', title: 'Product: name is missing', detail: 'A product name helps identify the item. Check the current Schema.org definition and any search feature requirements that apply.' });
      if (!hasValue(entity, 'image')) findings.push({ severity: 'info', title: 'Product: image not detected', detail: 'A product image is commonly useful. It may be supplied elsewhere or via another valid representation; review the source.' });
      if (!hasValue(entity, 'offers')) findings.push({ severity: 'info', title: 'Product: offers not detected', detail: 'No offers property was detected on this Product entity. Price and availability cannot be assessed from this entity alone.' });
    }
    if (names.some((name) => /^(Article|NewsArticle|BlogPosting)$/i.test(name))) {
      if (!hasValue(entity, 'headline')) findings.push({ severity: 'warning', title: `${label}: headline is missing`, detail: 'A headline is commonly used to describe article content.' });
      if (!hasValue(entity, 'author')) findings.push({ severity: 'info', title: `${label}: author not detected`, detail: 'Consider whether an author should be represented for this content.' });
    }
  }

  if (entities.length > 0) {
    findings.unshift({ severity: 'info', title: 'Entity types detected', detail: types.length ? types.join(', ') : 'No supported @type names could be extracted.' });
  }
  findings.push({ severity: 'info', title: 'Validation limits', detail: 'This tool checks JSON syntax, detects entities and offers a few common property hints. It does not fully validate the Schema.org vocabulary, confirm Google rich-result eligibility, or guarantee search or AI visibility.' });

  return {
    inputKind: blocks.length > 0 ? (extracted.isHtml ? 'html' : 'jsonld') : 'html',
    scriptCount: blocks.length,
    entityCount: entities.length,
    types,
    parseErrors,
    findings
  };
}
