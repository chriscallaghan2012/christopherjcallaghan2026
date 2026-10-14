import assert from 'node:assert/strict';
import { analyzeProductPage } from '../lib/aiEcommerceReadiness';

const html = `<!doctype html><html><head>
<title>Handmade Mug</title><meta name="description" content="Ceramic handmade mug">
<link rel="canonical" href="/products/mug">
<meta property="og:title" content="Handmade Mug">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Handmade Mug","image":"https://shop.example/mug.jpg","offers":{"@type":"Offer","price":"18.50","priceCurrency":"GBP","availability":"https://schema.org/InStock"}}</script>
</head><body><main><h1>Handmade Mug</h1><img src="/mug.jpg" alt="Mug"></main></body></html>`;
const report = analyzeProductPage(html, 'https://shop.example/products/mug');
assert.equal(report.pageTitle, 'Handmade Mug');
assert.equal(report.canonicalUrl, 'https://shop.example/products/mug');
assert.deepEqual(report.productTypes, ['Product']);
assert.equal(report.price, '18.50');
assert.equal(report.availability, 'InStock');
assert.equal(report.imageCount, 1);
assert.ok(report.findings.some((finding) => finding.title === 'Product structured data detected' && finding.status === 'pass'));
assert.ok(report.limitations.some((limitation) => limitation.includes('not a measure')));

const unknown = analyzeProductPage('<html><head><title>Item</title></head><body>Unavailable</body></html>', 'https://shop.example/item');
assert.equal(unknown.price, null);
assert.equal(unknown.availability, null);
assert.ok(unknown.findings.some((finding) => finding.status === 'unknown' && finding.title === 'Price not assessed'));
console.log('AI eCommerce readiness tests passed.');
