/**
 * Sends the Website Grader report by email via Resend.
 * The user's email is used only for this one-off send and is never stored.
 */

import { Resend } from 'resend';
import type { ScanReport } from './types';
import { CATEGORY_LABELS } from './types';

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
    await resend.emails.send({
      from: senderIdentity,
      to: [email],
      replyTo: submissionEmail,
      subject: `Your website audit for ${report.targetUrl.slice(0, 120)}`,
      html
    });
    return { status: 'sent' };
  } catch (err) {
    console.error('Failed to send grader report email:', err);
    return { status: 'failed', error: err instanceof Error ? err.message : 'Email could not be sent.' };
  }
}



