import assert from 'node:assert/strict';
import { validateStructuredData } from '../lib/structuredDataValidator';

const valid = validateStructuredData(JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', name: 'Acme', url: 'https://example.com' },
    { '@type': 'Product', name: 'Widget', image: 'https://example.com/widget.jpg', offers: { '@type': 'Offer', price: '12.00', priceCurrency: 'GBP' } }
  ]
}));
assert.equal(valid.parseErrors.length, 0);
assert.equal(valid.entityCount, 2);
assert.deepEqual(valid.types, ['Organization', 'Product']);
assert.ok(valid.findings.some((finding) => finding.title === 'JSON syntax is valid'));

const html = validateStructuredData(`<!doctype html><html><head><script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Ada"}</script><script type='application/ld+json'>{"@type":"WebSite","name":"Example"}</script></head></html>`);
assert.equal(html.inputKind, 'html');
assert.equal(html.scriptCount, 2);
assert.equal(html.entityCount, 2);
assert.ok(html.types.includes('Person'));
assert.ok(html.types.includes('WebSite'));

const broken = validateStructuredData('{"@type": "Product", invalid}');
assert.equal(broken.parseErrors.length, 1);
assert.ok(broken.findings.some((finding) => finding.severity === 'error'));

const noSchema = validateStructuredData('<html><body><p>Hello</p></body></html>');
assert.equal(noSchema.inputKind, 'html');
assert.equal(noSchema.scriptCount, 0);
assert.ok(noSchema.findings.some((finding) => finding.title === 'No JSON-LD blocks found'));

assert.equal(validateStructuredData('  ').inputKind, 'empty');
console.log('Structured Data Validator tests passed.');
