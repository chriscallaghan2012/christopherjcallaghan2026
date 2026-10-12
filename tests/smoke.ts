import http from 'node:http';
import zlib from 'node:zlib';
import { runScan } from '../lib/grader/engine';

const FIXTURE = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>Acme Widgets | Best Widgets in Manchester</title>
<meta name="description" content="Acme Widgets makes high-quality widgets for businesses across Manchester. Book a free demo today.">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="canonical" href="https://acme.test/">
<meta property="og:title" content="Acme Widgets"><meta property="og:description" content="Best widgets in Manchester."><meta property="og:image" content="https://acme.test/og.jpg">
<link rel="stylesheet" href="/styles.css">
<script src="/app.js" defer></script>
<script src="https://analytics.example.com/tag.js"></script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Acme Widgets","url":"https://acme.test"}</script>
</head><body>
<header><nav><a href="/">Home</a><a href="/services">Services</a><a href="/contact">Contact</a></nav></header>
<main><h1>Acme Widgets</h1><h2>What we do</h2>
<p>We build high quality widgets for businesses across Manchester and the UK. Our widgets help teams save time, reduce cost and grow revenue. Contact us at hello@acme.test or call 0161 123 4567 to get started.</p>
<h2>FAQ</h2><h3>How much do widgets cost?</h3><p>Prices start at 99.</p><h3>How fast is delivery?</h3><p>Within 48 hours.</p>
<img src="/hero.jpg" alt="Acme widget" width="800" height="400" loading="lazy">
<a href="/services">Read more about our services</a>
</main><footer><p>&copy; Acme Widgets Ltd, Manchester.</p></footer></body></html>`;

const server = http.createServer((req, res) => {
  if (req.url === '/robots.txt') { res.setHeader('content-type', 'text/plain'); res.end('User-agent: *\nAllow: /\n'); return; }
  if (req.url === '/sitemap.xml') { res.setHeader('content-type', 'text/xml'); res.end('<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://acme.test/</loc></url></urlset>'); return; }
  if (req.url === '/llms.txt') { res.setHeader('content-type', 'text/plain'); res.end('# Acme\n'); return; }
  if (req.url === '/services' || req.url === '/contact' || req.url === '/') {
    res.setHeader('content-type', 'text/html');
    res.setHeader('content-encoding', 'gzip');
    res.end(zlib.gzipSync(Buffer.from(FIXTURE)));
    return;
  }
  res.statusCode = 404;
  res.end('not found');
});

await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
const port = (server.address() as any).port;
process.env.ALLOW_PRIVATE_NETWORK_SCANS = 'true';

const events: string[] = [];
const report = await runScan({ targetUrl: `http://127.0.0.1:${port}/`, onEvent: (e) => events.push(e.id) });

console.log('stages:', events.join(','));
console.log('status:', report.status);
console.log('overall:', report.overall.score, report.overall.grade, report.overall.label);
for (const c of report.categories) {
  console.log('  ', c.id, c.score, 'pass:' + c.counts.pass, 'warn:' + c.counts.warning, 'fail:' + c.counts.fail, 'notMeasured:' + c.counts.notMeasured);
}
console.log('recs:', report.recommendations.length, 'summary:', JSON.stringify(report.summary));
console.log('exec:', report.executiveSummary.slice(0, 200));
console.log('meta:', JSON.stringify(report.scanMeta).slice(0, 320));
server.close();
