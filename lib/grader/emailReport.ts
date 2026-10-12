/**
 * Sends the Website Grader report by email via Resend.
 * The user's email is used only for this one-off send and is never stored.
 */

import { Resend } from 'resend';
import { generateClientConfirmationEmail } from '../emailTemplates';
import type { ScanReport } from './types';
import { CATEGORY_LABELS } from './types';
import { buildReportPdf } from './pdfReport';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const senderIdentity = 'Christopher J. Callaghan <christopher@christopherjcallaghan.com>';
const submissionEmail = process.env.FORM_SUBMISSION_EMAIL || 'instantonlinesuccess@gmail.com';

export const isReportEmailConfigured = Boolean(resendApiKey);

const BRAND = {
  background: '#060608',
  panel: '#101014',
  red: '#ff003c',
  orange: '#ffb347',
  text: '#f5f5f5',
  muted: '#a4a4ad',
  border: '#2a2a31'
};

function escapeHtml(value: string | undefined): string {
  return (value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function scoreColor(score: number | null): string {
  if (score === null) return BRAND.muted;
  if (score >= 80) return '#4ade80';
  if (score >= 60) return BRAND.orange;
  return BRAND.red;
}

export interface ReportEmailResult {
  status: 'sent' | 'unavailable' | 'failed';
  confirmationEmailSent?: boolean;
  error?: string;
}
/** Builds the HTML body for the report email. */
export function buildReportEmailHtml(report: ScanReport): string {
  const score = report.overall.score;
  const color = scoreColor(score);
  const categoryRows = report.categories.map((category) => {
    const catScore = category.score === null ? '—' : `${category.score}/100`;
    const catColor = scoreColor(category.score);
    return `<tr>
      <td style="padding:9px 10px 9px 0;color:${BRAND.muted};font-size:12px;vertical-align:top;">${escapeHtml(CATEGORY_LABELS[category.id])}</td>
      <td style="padding:9px 0;color:${catColor};font-size:13px;font-weight:600;text-align:right;vertical-align:top;">${catScore}</td>
    </tr>`;
  }).join('');

  const topRecommendations = report.recommendations.slice(0, 5).map((rec) => `
    <tr>
      <td style="padding:12px 15px;border-bottom:1px solid ${BRAND.border};">
        <div style="color:${rec.priority === 'critical' || rec.priority === 'high' ? BRAND.red : BRAND.orange};font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">${escapeHtml(rec.priority)} priority · ${escapeHtml(CATEGORY_LABELS[rec.category])}</div>
        <div style="margin-top:5px;color:${BRAND.text};font-size:13px;font-weight:600;">${escapeHtml(rec.title)}</div>
        <div style="margin-top:4px;color:${BRAND.muted};font-size:12px;line-height:1.5;">${escapeHtml(rec.fix)}</div>
      </td>
    </tr>
  `).join('') || '<tr><td style="padding:12px 15px;color:#4ade80;font-size:13px;">No critical or warning findings to fix. Nice work.</td></tr>';
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="dark">
  <title>Website Audit Report — ${escapeHtml(report.targetUrl)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.background};font-family:Arial,Helvetica,sans-serif;color:${BRAND.text};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;background:${BRAND.background};">
    <tr><td align="center" style="padding:28px 12px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;max-width:620px;background:${BRAND.panel};border:1px solid ${BRAND.border};">
        <tr><td style="padding:24px 26px;border-bottom:1px solid ${BRAND.border};">
          <div style="font-family:monospace;font-size:10px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;color:${BRAND.red};">Free Website Audit</div>
          <h1 style="margin:10px 0 4px;font-size:22px;line-height:1.2;">Your website audit is ready.</h1>
          <p style="margin:6px 0 0;color:${BRAND.muted};font-size:13px;">${escapeHtml(report.targetUrl)}</p>
        </td></tr>
        <tr><td style="padding:24px 26px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" style="width:50%;">
                <div style="font-size:44px;font-weight:bold;color:${color};">${score === null ? '—' : score}<span style="font-size:18px;color:${BRAND.muted};">/100</span></div>
                <div style="margin-top:4px;font-size:12px;color:${BRAND.muted};">Overall score · ${escapeHtml(report.overall.label)}</div>
              </td>
              <td align="center" style="width:50%;border-left:1px solid ${BRAND.border};">
                <div style="font-size:24px;font-weight:bold;color:${BRAND.text};">${report.summary.fail} failed · ${report.summary.warning} warnings</div>
                <div style="margin-top:4px;font-size:12px;color:${BRAND.muted};">${report.summary.pass} passed checks</div>
              </td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 26px;">
          <div style="font-family:monospace;font-size:10px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;color:${BRAND.red};padding-bottom:8px;">Category scores</div>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid ${BRAND.border};border-bottom:1px solid ${BRAND.border};">
            ${categoryRows}
          </table>
        </td></tr>
        <tr><td style="padding:22px 26px;">
          <div style="font-family:monospace;font-size:10px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;color:${BRAND.red};padding-bottom:8px;">Top recommendations</div>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid ${BRAND.border};">
            ${topRecommendations}
          </table>
          <p style="margin:16px 0 0;color:${BRAND.muted};font-size:11px;line-height:1.6;">This is a diagnostic assessment of observable signals — not a guarantee of rankings, conversions or AI citations. ${report.scanMeta.checksNotMeasured} check(s) were not measured in this scan.</p>
        </td></tr>
        <tr><td align="center" style="padding:20px 26px 28px;border-top:1px solid ${BRAND.border};">
          <a href="https://christopherjcallaghan.com/contact" style="display:inline-block;background:${BRAND.red};color:#ffffff;padding:13px 22px;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;text-decoration:none;">Get a free consultation</a>
          <p style="margin:12px 0 0;color:${BRAND.muted};font-size:11px;">I can help turn these findings into a faster, better-optimised website.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
/** Sends the report to the visitor. Email is never persisted. */
export async function sendReportEmail(report: ScanReport, email: string): Promise<ReportEmailResult> {
  if (!resend) {
    return { status: 'unavailable', error: 'Email delivery is not configured on the server yet.' };
  }
  try {
    const html = buildReportEmailHtml(report);
    const pdf = await buildReportPdf(report);
    const result = await resend.emails.send({
      from: senderIdentity,
      to: [email],
      replyTo: submissionEmail,
      subject: `Your website audit for ${report.targetUrl.slice(0, 120)}`,
      html,
      attachments: [{ filename: `website-audit-${report.scanId || 'report'}.pdf`, content: pdf, contentType: 'application/pdf' }]
    });
    if (result.error) return { status: 'failed', error: result.error.message };
    return { status: 'sent' };
  } catch (err) {
    console.error('Failed to send grader report email:', err);
    return { status: 'failed', error: err instanceof Error ? err.message : 'Email could not be sent.' };
  }
}

export interface GraderLead {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  issueIds?: string[];
}

/** Issues actually requested; falls back to the top scan findings. */
export function selectRequestedRecommendations(report: ScanReport, issueIds?: string[]) {
  const ids = (issueIds ?? []).map((id) => id.trim()).filter(Boolean);
  if (ids.length === 0) return report.recommendations.slice(0, 12);
  const wanted = new Set(ids);
  const ordered = report.recommendations.filter((rec) => wanted.has(rec.checkId));
  return ordered.length > 0 ? ordered.slice(0, 12) : report.recommendations.slice(0, 12);
}

/** Plain-text digest of the full scan for the owner's inbox. */
export function buildLeadText(report: ScanReport, lead: GraderLead): string {
  const catLines = report.categories.map((c) => `  - ${CATEGORY_LABELS[c.id]}: ${c.score === null ? 'not measured' : c.score + '/100'}`).join('\n');
  const recLines = selectRequestedRecommendations(report, lead.issueIds)
    .map((r, i) => `  ${i + 1}. [${r.priority.toUpperCase()}] ${r.title}\n     Detected: ${r.whatDetected}\n     Fix: ${r.fix}`)
    .join('\n');
  return [
    'New Website Grader lead',
    '',
    `Name:    ${lead.name}`,
    `Email:   ${lead.email}`,
    lead.phone ? `Phone:   ${lead.phone}` : 'Phone:   (not provided)',
    '',
    `Audited URL:  ${report.targetUrl}`,
    `Final URL:    ${report.finalUrl}`,
    `Overall:      ${report.overall.score === null ? 'n/a' : report.overall.score + '/100'} (${report.overall.grade} - ${report.overall.label})`,
    `Checks:       ${report.summary.pass} passed / ${report.summary.warning} warnings / ${report.summary.fail} failed / ${report.summary.notMeasured} not measured`,
    `Scan ID:      ${report.scanId || 'in-memory'}`,
    `Scanned at:   ${report.createdAt}`,
    '',
    'Category scores:',
    catLines || '  (none)',
    '',
    'Top recommendations:',
    recLines || '  No failing checks were reported.',
    '',
    lead.message ? `Message from lead:\n${lead.message}\n` : '',
    `Executive summary:\n${report.executiveSummary}`
  ].filter(Boolean).join('\n');
}

/** HTML body for the owner notification email. */
export function buildLeadHtml(report: ScanReport, lead: GraderLead): string {
  const score = report.overall.score;
  const color = scoreColor(score);
  const categoryRows = report.categories.map((category) => {
    const catScore = category.score === null ? '—' : `${category.score}/100`;
    return `<tr>
      <td style="padding:9px 10px 9px 0;color:${BRAND.muted};font-size:12px;vertical-align:top;">${escapeHtml(CATEGORY_LABELS[category.id])}</td>
      <td style="padding:9px 0;color:${scoreColor(category.score)};font-size:13px;font-weight:600;text-align:right;vertical-align:top;">${catScore}</td>
    </tr>`;
  }).join('');
  const recRows = selectRequestedRecommendations(report, lead.issueIds).map((rec) => `
    <tr>
      <td style="padding:12px 15px;border-bottom:1px solid ${BRAND.border};">
        <div style="color:${rec.priority === 'critical' || rec.priority === 'high' ? BRAND.red : BRAND.orange};font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">${escapeHtml(rec.priority)} priority &middot; ${escapeHtml(CATEGORY_LABELS[rec.category])}</div>
        <div style="margin-top:5px;color:${BRAND.text};font-size:13px;font-weight:600;">${escapeHtml(rec.title)}</div>
        <div style="margin-top:4px;color:${BRAND.muted};font-size:12px;line-height:1.5;"><strong style="color:${BRAND.text};">Fix:</strong> ${escapeHtml(rec.fix)}</div>
      </td>
    </tr>
  `).join('') || `<tr><td style="padding:12px 15px;color:#4ade80;font-size:13px;">No critical or warning findings to fix. Nice work.</td></tr>`;
  const reportUrl = report.scanId ? `https://christopherjcallaghan.com/tools/website-grader?scan=${encodeURIComponent(report.scanId)}` : null;
  const contactRow = (label: string, value: string) => `<tr><td style="padding:3px 12px 3px 0;color:${BRAND.muted};">${label}</td><td>${value}</td></tr>`;
  const contactHtml = [
    contactRow('Name', escapeHtml(lead.name)),
    contactRow('Email', `<a href="mailto:${escapeHtml(lead.email)}" style="color:${BRAND.orange};text-decoration:none;">${escapeHtml(lead.email)}</a>`),
    contactRow('Phone', lead.phone ? escapeHtml(lead.phone) : '—')
  ].join('');
  const messageHtml = lead.message
    ? `<p style="margin:12px 0 0;padding:12px;background:${BRAND.background};border:1px solid ${BRAND.border};border-radius:10px;color:${BRAND.text};font-size:12px;line-height:1.6;">${escapeHtml(lead.message)}</p>`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="dark">
  <title>Website Grader lead — ${escapeHtml(report.targetUrl)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.background};font-family:Arial,Helvetica,sans-serif;color:${BRAND.text};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;background:${BRAND.background};">
    <tr><td align="center" style="padding:24px 12px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:${BRAND.panel};border:1px solid ${BRAND.border};border-radius:16px;overflow:hidden;">
        <tr><td style="padding:22px 26px;border-bottom:1px solid ${BRAND.border};">
          <p style="margin:0;font-family:monospace;font-size:10px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${BRAND.red};">Website Grader &middot; New lead</p>
          <h1 style="margin:8px 0 0;font-size:20px;color:${BRAND.text};">${escapeHtml(lead.name)} requested help</h1>
          <p style="margin:6px 0 0;color:${BRAND.muted};font-size:12px;">Audited <span style="color:${BRAND.text};">${escapeHtml(report.targetUrl)}</span></p>
        </td></tr>
        <tr><td style="padding:20px 26px;border-bottom:1px solid ${BRAND.border};">
          <div style="font-family:monospace;font-size:10px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;color:${BRAND.red};padding-bottom:8px;">Contact</div>
          <table role="presentation" cellspacing="0" cellpadding="0" style="font-size:13px;color:${BRAND.text};">${contactHtml}</table>
          ${messageHtml}
        </td></tr>
        <tr><td style="padding:20px 26px;border-bottom:1px solid ${BRAND.border};">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" style="width:50%;">
                <div style="font-size:44px;font-weight:bold;color:${color};">${score === null ? '—' : score}<span style="font-size:18px;color:${BRAND.muted};">/100</span></div>
                <div style="margin-top:4px;font-size:12px;color:${BRAND.muted};">${escapeHtml(report.overall.grade)} &middot; ${escapeHtml(report.overall.label)}</div>
              </td>
              <td align="center" style="width:50%;border-left:1px solid ${BRAND.border};">
                <div style="font-size:15px;font-weight:bold;color:${BRAND.text};">${report.summary.fail} failed &middot; ${report.summary.warning} warnings</div>
                <div style="margin-top:4px;font-size:12px;color:${BRAND.muted};">${report.summary.pass} passed &middot; ${report.summary.notMeasured} not measured</div>
              </td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 26px;">
          <div style="font-family:monospace;font-size:10px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;color:${BRAND.red};padding-bottom:8px;">Category scores</div>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid ${BRAND.border};border-bottom:1px solid ${BRAND.border};">${categoryRows}</table>
        </td></tr>
        <tr><td style="padding:22px 26px;">
          <div style="font-family:monospace;font-size:10px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;color:${BRAND.red};padding-bottom:8px;">Top recommendations</div>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid ${BRAND.border};">${recRows}</table>
          <p style="margin:16px 0 0;color:${BRAND.muted};font-size:11px;line-height:1.6;">${escapeHtml(report.executiveSummary)}</p>
          ${reportUrl ? `<p style="margin:14px 0 0;"><a href="${reportUrl}" style="display:inline-block;background:${BRAND.red};color:#ffffff;padding:11px 18px;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;text-decoration:none;border-radius:8px;">View full report</a></p>` : ''}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/**
 * Notifies the site owner of a new grader lead, attaching the full scan digest.
 * The lead's address is set as replyTo so the owner can respond directly.
 */
export async function sendLeadEmail(report: ScanReport, lead: GraderLead): Promise<ReportEmailResult> {
  if (!resend) {
    return { status: 'unavailable', error: 'Email delivery is not configured on the server yet.' };
  }
  try {
    const pdf = await buildReportPdf(report);
    const attachment = {
      filename: `website-audit-${report.scanId || 'report'}.pdf`,
      content: pdf,
      contentType: 'application/pdf'
    };
    const ownerResult = await resend.emails.send({
      from: senderIdentity,
      to: [submissionEmail],
      replyTo: lead.email,
      subject: `Website Grader lead: ${lead.name} — ${report.targetUrl.slice(0, 80)} (${report.overall.grade} ${report.overall.score ?? '—'}/100)`,
      html: buildLeadHtml(report, lead),
      text: `${buildLeadText(report, lead)}\n\nFull audit report PDF attached.`,
      attachments: [attachment]
    });
    if (ownerResult.error) return { status: 'failed', error: ownerResult.error.message };

    const requested = selectRequestedRecommendations(report, lead.issueIds);
    const confirmationHtml = generateClientConfirmationEmail({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      projectType: 'Website audit follow-up',
      packageScope: `Audit review for ${report.targetUrl} (${report.overall.score === null ? 'not enough measurable data' : `${report.overall.score}/100, ${report.overall.grade}`})`,
      message: [
        `Website: ${report.targetUrl}`,
        `Audit result: ${report.overall.score === null ? 'not enough measurable data' : `${report.overall.score}/100 - ${report.overall.grade} - ${report.overall.label}`}`,
        requested.length ? `Fixes requested: ${requested.map((item) => item.title).join('; ')}` : 'You asked me to review the full scan.',
        'The complete audit results are attached as a PDF.'
      ].join('\n'),
      type: 'contact'
    });

    try {
      const visitorResult = await resend.emails.send({
        from: senderIdentity,
        to: [lead.email],
        replyTo: submissionEmail,
        subject: `I received your website audit request`,
        html: confirmationHtml,
        text: `Thanks, ${lead.name}. I received your website audit request for ${report.targetUrl}. I will review the scan and be in touch. The full results are attached as a PDF.`,
        attachments: [attachment]
      });
      if (visitorResult.error) {
        console.error('Failed to send grader confirmation email:', visitorResult.error);
        return { status: 'sent', confirmationEmailSent: false };
      }
      return { status: 'sent', confirmationEmailSent: true };
    } catch (err) {
      console.error('Failed to send grader confirmation email:', err);
      return { status: 'sent', confirmationEmailSent: false };
    }
  } catch (err) {
    console.error('Failed to send grader lead email:', err);
    return { status: 'failed', error: err instanceof Error ? err.message : 'Lead could not be sent.' };
  }
}




