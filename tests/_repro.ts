import { buildLeadHtml, buildLeadText } from '../lib/grader/emailReport';
import process from 'node:process';
import type { ScanReport } from '../lib/grader/types';

const report: ScanReport = {
  scanId: 'wg_test123',
  targetUrl: 'https://example.com/',
  finalUrl: 'https://example.com/',
  createdAt: new Date().toISOString(),
  status: 'completed',
  overall: { score: 66, grade: 'C+', label: 'Fair' },
  categories: [
    { id: 'seo', label: 'Technical & On-page SEO', weight: 0.3, score: 59, checks: [], counts: { pass: 8, warning: 5, fail: 3, info: 2, notMeasured: 0 } },
    { id: 'performance', label: 'Performance & UX', weight: 0.2, score: 100, checks: [], counts: { pass: 6, warning: 0, fail: 0, info: 0, notMeasured: 5 } }
  ],
  recommendations: [
    { checkId: 'x', category: 'seo', title: 'Add a meta description', whatDetected: 'missing', whyItMatters: 'helps CTR', fix: 'Add one', priority: 'high', estimatedImpact: 'moderate', difficulty: 'straightforward', nonTechnical: true, cta: { label: 'Fix', href: '/contact' } }
  ],
  summary: { pass: 21, warning: 13, fail: 7, info: 25, notMeasured: 6 },
  executiveSummary: 'Your website scored fair overall. 21 checks passed.',
  limitations: [],
  scanMeta: { startedAt: '', completedAt: '', durationMs: 100, pageBytes: 577, httpStatus: 200, targetUrl: 'https://example.com/', finalUrl: 'https://example.com/', redirectChain: [], userAgent: 'test', checksRun: 40, checksNotMeasured: 6, stages: [] },
  version: '1.0.0'
};

const lead = { name: 'Jane <Smith> & Co', email: 'jane@example.com', phone: '+44 7700 900000', message: 'Please fix my site' };
const html = buildLeadHtml(report, lead);
const text = buildLeadText(report, lead);

process.stdout.write('html_len=' + html.length + '\n');
process.stdout.write('has_doctype=' + html.startsWith('<!doctype html>') + '\n');
process.stdout.write('escapes_name=' + (html.includes('Jane &lt;Smith&gt;') ? 'YES' : 'NO') + '\n');
process.stdout.write('has_contact=' + html.includes('jane@example.com') + '\n');
process.stdout.write('has_report_url=' + html.includes('scan=wg_test123') + '\n');
process.stdout.write('has_phone=' + text.includes('+44 7700 900000') + '\n');
process.stdout.write('has_rec=' + text.includes('Add a meta description') + '\n');
process.stdout.write('text_head=\\n' + text.split('\n').slice(0, 6).join('\n') + '\n');
process.exit(0);
