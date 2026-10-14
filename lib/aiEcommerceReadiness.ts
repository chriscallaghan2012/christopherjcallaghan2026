import { load } from 'cheerio';

export type ProductFindingStatus = 'pass' | 'warning' | 'info' | 'unknown';

export interface ProductReadinessFinding {
  status: ProductFindingStatus;
  title: string;
  detail: string;
  evidence?: string;
}

export interface ProductReadinessReport {
  requestedUrl: string;
  finalUrl: string;
  pageTitle: string | null;
  description: string | null;
  canonicalUrl: string | null;
  productTypes: string[];
  price: string | null;
  priceCurrency: string | null;
  availability: string | null;
  imageCount: number;
  imagesMissingAlt: number;
  documentLanguage: string | null;
  findings: ProductReadinessFinding[];
  limitations: string[];
}

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
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

function collectObjects(value: unknown): JsonObject[] {
  if (Array.isArray(value)) return value.flatMap(collectObjects);
  if (!isObject(value)) return [];
  const result: JsonObject[] = [value];
  for (const child of Object.values(value)) {
    if (Array.isArray(child) || isObject(child)) result.push(...collectObjects(child));
  }
  return result;
}

function textValue(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return null;
}

export function analyzeProductPage(html: string, requestedUrl: string, finalUrl = requestedUrl): ProductReadinessReport {
  const $ = load(html);
  const pageTitle = $('title').first().text().trim() || null;
  const description = $('meta[name="description"]').attr('content')?.trim() || null;
  const canonicalRaw = $('link[rel="canonical"]').first().attr('href')?.trim() || null;
  let canonicalUrl: string | null = null;
  if (canonicalRaw) {
    try { canonicalUrl = new URL(canonicalRaw, finalUrl).toString(); } catch { canonicalUrl = null; }
  }
  const imageCount = $('img[src]').length;
  const imagesMissingAlt = $('img').filter((_, element) => $(element).attr('alt') === undefined).length;
  const documentLanguage = $('html').attr('lang')?.trim() || null;
  const jsonObjects: JsonObject[] = [];
  let malformedJsonLd = 0;
  $('script[type="application/ld+json"]').each((_, element) => {
    const raw = $(element).contents().text().trim();
    if (!raw) return;
    try { jsonObjects.push(...collectObjects(JSON.parse(raw))); } catch { malformedJsonLd += 1; }
  });
  const products = jsonObjects.filter((node) => typeNames(node['@type']).some((name) => name.toLowerCase() === 'product'));
  const productTypes = [...new Set(products.flatMap((product) => typeNames(product['@type'])))];
  const firstProduct = products[0];
  const productImages = firstProduct ? (Array.isArray(firstProduct.image) ? firstProduct.image : [firstProduct.image]).map(textValue).filter((value): value is string => Boolean(value)) : [];
  const imageEvidence = imageCount > 0 ? `${imageCount} HTML image(s) detected` : null;
  const offerValues = firstProduct ? (Array.isArray(firstProduct.offers) ? firstProduct.offers : [firstProduct.offers]) : [];
  const offerObjects = offerValues.filter(isObject);
  const price = offerObjects.map((offer) => textValue(offer.price ?? offer.lowPrice)).find(Boolean) ?? null;
  const priceCurrency = offerObjects.map((offer) => textValue(offer.priceCurrency)).find(Boolean) ?? null;
  const availabilityRaw = offerObjects.map((offer) => textValue(offer.availability)).find(Boolean) ?? null;
  const availability = availabilityRaw?.split(/[\/#]/).filter(Boolean).pop() ?? null;
  const findings: ProductReadinessFinding[] = [];

  findings.push(pageTitle
    ? { status: 'pass', title: 'Product page title detected', detail: 'A non-empty HTML title was found.', evidence: pageTitle }
    : { status: 'warning', title: 'Page title missing', detail: 'No non-empty HTML title was detected.' });
  findings.push(description
    ? { status: 'pass', title: 'Meta description detected', detail: 'A non-empty meta description was found.', evidence: description }
    : { status: 'warning', title: 'Meta description missing', detail: 'No non-empty meta description was detected.' });
  findings.push(canonicalUrl
    ? { status: 'pass', title: 'Canonical URL detected', detail: 'A canonical link was found and resolved against the final page URL.', evidence: canonicalUrl }
    : { status: 'info', title: 'Canonical URL not detected', detail: 'No usable canonical link was found. Confirm whether this page needs a canonical URL.' });
  findings.push(products.length > 0
    ? { status: 'pass', title: 'Product structured data detected', detail: `Detected ${products.length} Product entity/entities in JSON-LD.`, evidence: productTypes.join(', ') }
    : { status: 'warning', title: 'Product structured data not detected', detail: 'No Product entity was detected in parseable JSON-LD. It may be absent, malformed, injected later by JavaScript, or represented in another format.' });
  findings.push((productImages.length > 0 || imageCount > 0)
    ? { status: 'pass', title: 'Product/page images detected', detail: 'Images were found in JSON-LD or HTML.', evidence: [...productImages.slice(0, 3), ...(imageEvidence ? [imageEvidence] : [])].join('; ') }
    : { status: 'warning', title: 'No images detected', detail: 'No image URL in Product JSON-LD and no HTML img[src] element were detected.' });
  findings.push(imagesMissingAlt > 0
    ? { status: 'warning', title: 'Image alt attributes missing', detail: `${imagesMissingAlt} HTML image(s) have no alt attribute. Add useful alternative text to informative images; use an empty alt only for decorative images.`, evidence: `${imagesMissingAlt} image(s) missing alt out of ${$('img').length} detected` }
    : { status: 'pass', title: 'Image alt attributes present', detail: 'Every detected HTML image has an alt attribute. Automated checks cannot judge whether the text is meaningful.' });
  findings.push(documentLanguage
    ? { status: 'pass', title: 'Document language declared', detail: 'The HTML root declares a language.', evidence: documentLanguage }
    : { status: 'warning', title: 'Document language not detected', detail: 'The html element has no lang attribute. Declare the page language so assistive technology can pronounce content appropriately.' });
  findings.push(price
    ? { status: 'pass', title: 'Price observable in Product offers', detail: 'A price value was found in the first detected Product offer.', evidence: `Product JSON-LD offers.price: ${price}${priceCurrency ? ` ${priceCurrency}` : ''}` }
    : { status: products.length > 0 ? 'info' : 'unknown', title: products.length > 0 ? 'Price not detected in Product offers' : 'Price not assessed', detail: products.length > 0 ? 'No price/lowPrice was found in the detected Product offer. Price may be displayed elsewhere or loaded dynamically.' : 'Without a detected Product entity, this scanner cannot reliably attribute a price to a product.' });
  findings.push(availability
    ? { status: 'pass', title: 'Availability observable in Product offers', detail: 'An availability value was found in the first detected Product offer.', evidence: `Product JSON-LD offers.availability: ${availability}` }
    : { status: products.length > 0 ? 'info' : 'unknown', title: products.length > 0 ? 'Availability not detected' : 'Availability not assessed', detail: 'No availability value was detected in Product offers. This does not prove the item is unavailable.' });
  if (malformedJsonLd > 0) findings.push({ status: 'warning', title: 'Malformed JSON-LD block(s)', detail: `${malformedJsonLd} JSON-LD script block(s) could not be parsed. Product entities in those blocks may have been missed.` });
  findings.push({ status: 'info', title: 'Open Graph product signals', detail: $('meta[property="og:title"]').attr('content') ? 'og:title is present.' : 'og:title was not detected.', evidence: $('meta[property="og:title"]').attr('content')?.trim() || undefined });

  const priority: Record<ProductFindingStatus, number> = { warning: 0, unknown: 1, info: 2, pass: 3 };
  findings.sort((left, right) => priority[left.status] - priority[right.status]);

  return {
    requestedUrl,
    finalUrl,
    pageTitle,
    description,
    canonicalUrl,
    productTypes,
    price,
    priceCurrency,
    availability,
    imageCount,
    imagesMissingAlt,
    documentLanguage,
    findings,
    limitations: [
      'This is an evidence-led technical readiness checklist, not a measure of whether ChatGPT, Google AI Overviews or another AI system recommends the product.',
      'Only HTML returned to the scanner is analysed. JavaScript-rendered content, private merchant feeds, checkout state and inventory systems may not be visible.',
      'Detected price and availability values are reported only when present in the first detected Product offer; they may be stale and should be checked against the live product page.',
      'This is not a full Schema.org validator or a Google rich-result eligibility test.'
    ]
  };
}
