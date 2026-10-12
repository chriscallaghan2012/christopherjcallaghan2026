import PDFDocument from 'pdfkit';
import type { CategoryId, ScanReport } from './types';
import { CATEGORY_LABELS } from './types';

const COLORS = {
  red: '#e6003c',
  text: '#17171b',
  muted: '#66666f',
  border: '#d9d9df',
  pass: '#18794e',
  warning: '#a45b00',
  fail: '#c51f3a',
  info: '#54545d'
};

type ReportDocument = InstanceType<typeof PDFDocument>;

function pdfText(value: string): string {
  return value.normalize('NFKC').replace(/[^\x09\x0a\x0d\x20-\x7e\xa0-\xff]/g, '?');
}

function contentWidth(doc: ReportDocument): number {
  return doc.page.width - doc.page.margins.left - doc.page.margins.right;
}

function addBody(doc: ReportDocument, value: string, size = 9, color = COLORS.text): void {
  doc.font('Helvetica').fontSize(size).fillColor(color).text(pdfText(value), {
    width: contentWidth(doc),
    lineGap: 2
  });
  doc.moveDown(0.4);
}

function addSectionTitle(doc: ReportDocument, title: string): void {
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.red).text(pdfText(title), {
    width: contentWidth(doc)
  });
  doc.moveDown(0.25);
}

function addLabelValue(doc: ReportDocument, label: string, value: string): void {
  doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.text).text(`${pdfText(label)}: `, { continued: true });
  doc.font('Helvetica').fillColor(COLORS.muted).text(pdfText(value), { width: contentWidth(doc) });
  doc.moveDown(0.25);
}

function statusColor(status: string): string {
  if (status === 'pass') return COLORS.pass;
  if (status === 'warning') return COLORS.warning;
  if (status === 'fail') return COLORS.fail;
  return COLORS.info;
}

function categoryName(id: CategoryId): string {
  return CATEGORY_LABELS[id];
}

/** Creates a printable, complete copy of a completed website audit. */
export async function buildReportPdf(report: ScanReport): Promise<Buffer> {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 48, right: 48, bottom: 48, left: 48 },
    info: {
      Title: `Website Audit Report - ${report.targetUrl}`,
      Author: 'Christopher J. Callaghan',
      Subject: 'Website Grader results'
    }
  });

  const output = new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });

  const width = contentWidth(doc);
  doc.rect(doc.page.margins.left, doc.page.margins.top - 12, width, 4).fill(COLORS.red);
  doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.red).text('CHRISTOPHER J. CALLAGHAN  /  WEBSITE AUDIT');
  doc.moveDown(0.7);
  doc.font('Helvetica-Bold').fontSize(23).fillColor(COLORS.text).text('Website audit report', { width });
  doc.moveDown(0.4);
  addBody(doc, report.targetUrl, 11, COLORS.muted);
  if (report.finalUrl !== report.targetUrl) addLabelValue(doc, 'Final URL', report.finalUrl);
  addLabelValue(doc, 'Completed', report.createdAt);
  addLabelValue(doc, 'Scan ID', report.scanId || 'Not persisted');

  addSectionTitle(doc, 'Overall result');
  addLabelValue(doc, 'Score', report.overall.score === null
    ? `Not enough measurable data (${report.overall.grade})`
    : `${report.overall.score}/100 - ${report.overall.grade} - ${report.overall.label}`);
  addBody(doc, `${report.summary.pass} passed  |  ${report.summary.warning} warnings  |  ${report.summary.fail} failed  |  ${report.summary.info} informational  |  ${report.summary.notMeasured} not measured`);
  addBody(doc, report.executiveSummary);

  addSectionTitle(doc, 'Category results and checks');
  for (const category of report.categories) {
    doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.text).text(
      `${pdfText(category.label || categoryName(category.id))} - ${category.score === null ? 'Not measured' : `${category.score}/100`}`,
      { width }
    );
    addBody(doc, `${category.counts.pass} pass  |  ${category.counts.warning} warnings  |  ${category.counts.fail} failed  |  ${category.counts.notMeasured} not measured`, 8, COLORS.muted);

    for (const check of category.checks) {
      doc.font('Helvetica-Bold').fontSize(9).fillColor(statusColor(check.status)).text(
        `${check.status.replace('_', ' ').toUpperCase()} - ${pdfText(check.name)}`,
        { width }
      );
      addBody(doc, check.explanation, 8);
      if (check.evidence.length > 0) addBody(doc, `Evidence: ${check.evidence.map(pdfText).join(' | ')}`, 8, COLORS.muted);
      if (check.fix) addBody(doc, `Suggested fix: ${check.fix}`, 8);
      if (check.docs?.length) addBody(doc, `References: ${check.docs.map((link) => `${link.label} (${link.url})`).join(' | ')}`, 8, COLORS.muted);
      doc.moveDown(0.25);
    }
    doc.moveDown(0.35);
  }

  addSectionTitle(doc, 'Prioritised recommendations');
  if (report.recommendations.length === 0) {
    addBody(doc, 'No failing or warning checks generated a fix recommendation.');
  }
  for (const recommendation of report.recommendations) {
    doc.font('Helvetica-Bold').fontSize(10).fillColor(statusColor(recommendation.priority === 'critical' || recommendation.priority === 'high' ? 'fail' : 'warning'))
      .text(`${recommendation.priority.toUpperCase()} - ${pdfText(recommendation.title)}`, { width });
    addLabelValue(doc, 'Category', categoryName(recommendation.category));
    addLabelValue(doc, 'Detected', recommendation.whatDetected);
    addLabelValue(doc, 'Why it matters', recommendation.whyItMatters);
    addLabelValue(doc, 'Suggested fix', recommendation.fix);
    addLabelValue(doc, 'Estimated impact', recommendation.estimatedImpact);
    addLabelValue(doc, 'Difficulty', recommendation.difficulty);
    doc.moveDown(0.25);
  }

  addSectionTitle(doc, 'Scan limitations');
  for (const limitation of report.limitations) addBody(doc, `- ${limitation}`, 8, COLORS.muted);

  addSectionTitle(doc, 'Technical details');
  addLabelValue(doc, 'HTTP status', String(report.scanMeta.httpStatus || 'Not available'));
  addLabelValue(doc, 'Page size', `${(report.scanMeta.pageBytes / 1024).toFixed(1)} KB`);
  addLabelValue(doc, 'Duration', `${(report.scanMeta.durationMs / 1000).toFixed(1)} seconds`);
  addLabelValue(doc, 'Checks', `${report.scanMeta.checksRun} measured, ${report.scanMeta.checksNotMeasured} not measured`);
  addLabelValue(doc, 'Scanner version', report.version);
  addBody(doc, 'This is a diagnostic assessment of observable signals. It does not guarantee search rankings, conversions, revenue or AI citations.', 8, COLORS.muted);

  doc.end();
  return output;
}