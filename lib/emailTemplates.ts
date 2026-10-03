export interface EmailPayload {
  name: string;
  email: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  message?: string;
  fundingGoal?: string;
  packageScope?: string;
  aiBlueprint?: string;
  attachments?: string[];
  type?: 'contact' | 'consultation';
  submittedAt?: string;
}

const BRAND = {
  background: '#060608',
  panel: '#101014',
  red: '#ff003c',
  orange: '#ffb347',
  purple: '#df80ff',
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

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || 'there';
}

function detailRow(label: string, value: string, accent = BRAND.text): string {
  return `<tr>
    <td style="padding:9px 10px 9px 0;color:${BRAND.muted};font-size:12px;vertical-align:top;width:34%;">${escapeHtml(label)}</td>
    <td style="padding:9px 0;color:${accent};font-size:13px;font-weight:600;line-height:1.5;vertical-align:top;">${escapeHtml(value)}</td>
  </tr>`;
}

function contentSection(title: string, content: string, accent = BRAND.red): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:20px 0 0;border:1px solid ${BRAND.border};background:#0b0b0f;">
    <tr><td style="padding:15px 17px 7px;color:${accent};font-family:monospace;font-size:10px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;">${escapeHtml(title)}</td></tr>
    <tr><td style="padding:0 17px 17px;color:${BRAND.text};font-size:13px;line-height:1.7;white-space:pre-wrap;overflow-wrap:anywhere;">${content}</td></tr>
  </table>`;
}

function renderEmail(data: EmailPayload, options: {
  preheader: string;
  eyebrow: string;
  title: string;
  intro: string;
  body: string;
  action?: { label: string; href: string };
}): string {
  const action = options.action
    ? `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px 0 4px;"><tr><td bgcolor="${BRAND.red}" style="background:${BRAND.red};"><a href="${escapeHtml(options.action.href)}" style="display:inline-block;padding:13px 19px;color:#ffffff;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;letter-spacing:1px;text-decoration:none;text-transform:uppercase;">${escapeHtml(options.action.label)}</a></td></tr></table>`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="dark">
  <title>${escapeHtml(options.title)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.background};font-family:Arial,Helvetica,sans-serif;color:${BRAND.text};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(options.preheader)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;background:${BRAND.background};">
    <tr><td align="center" style="padding:28px 12px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;max-width:620px;background:${BRAND.panel};border:1px solid ${BRAND.border};">
        <tr><td style="padding:24px 26px;border-bottom:1px solid ${BRAND.border};">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>
            <td width="44" valign="middle"><div style="width:38px;height:38px;background:${BRAND.red};color:#fff;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;line-height:38px;text-align:center;">CJC</div></td>
            <td valign="middle" style="padding-left:12px;color:${BRAND.text};font-size:13px;font-weight:bold;">Christopher J. Callaghan<br><span style="color:${BRAND.muted};font-family:monospace;font-size:10px;font-weight:normal;">DIGITAL BUILDER / MANCHESTER, UK</span></td>
          </tr></table>
        </td></tr>
        <tr><td style="height:3px;background:${BRAND.red};font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="padding:28px 26px 30px;">
          <p style="margin:0 0 10px;color:${BRAND.orange};font-family:monospace;font-size:10px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;">${escapeHtml(options.eyebrow)}</p>
          <h1 style="margin:0 0 12px;color:${BRAND.text};font-size:26px;line-height:1.2;">${escapeHtml(options.title)}</h1>
          <p style="margin:0;color:${BRAND.muted};font-size:14px;line-height:1.65;">${options.intro}</p>
          ${options.body}
          ${action}
        </td></tr>
        <tr><td style="padding:17px 26px;border-top:1px solid ${BRAND.border};color:${BRAND.muted};font-family:monospace;font-size:10px;line-height:1.7;">
          <span style="color:${BRAND.purple};">christopherjcallaghan.com</span><br>
          © ${new Date().getFullYear()} Christopher J. Callaghan
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function getScope(data: EmailPayload): string {
  return data.packageScope || data.projectType || 'General enquiry';
}

function renderBlueprint(data: EmailPayload): string {
  if (!data.aiBlueprint) return '';
  return contentSection('AI architecture notes', escapeHtml(data.aiBlueprint), BRAND.purple);
}

function renderAttachments(data: EmailPayload): string {
  if (!data.attachments?.length) return '';
  return contentSection('Files received', data.attachments.map(escapeHtml).join('<br>'), BRAND.purple);
}

export function generateAdminNotificationEmail(data: EmailPayload): string {
  const isConsultation = data.type === 'consultation';
  const scope = getScope(data);
  const subject = encodeURIComponent(`Re: ${isConsultation ? 'Project brief' : 'Enquiry'} - Christopher J. Callaghan`);
  const body = `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;border-top:1px solid ${BRAND.border};border-bottom:1px solid ${BRAND.border};">
    ${detailRow('Name', data.name)}
    ${detailRow('Email', data.email, BRAND.orange)}
    ${detailRow('Submission', isConsultation ? 'Project brief' : 'Contact enquiry', BRAND.purple)}
    ${detailRow('Selected scope and options', scope)}
    ${detailRow('Budget', data.budget || data.fundingGoal || 'Not specified', BRAND.orange)}
    ${detailRow('Timing', data.timeline || 'Flexible')}
  </table>
  ${data.message ? contentSection('Project details', escapeHtml(data.message)) : ''}
  ${renderAttachments(data)}
  ${renderBlueprint(data)}`;

  return renderEmail(data, {
    preheader: `New ${isConsultation ? 'project brief' : 'contact enquiry'} from ${data.name}`,
    eyebrow: isConsultation ? 'New project brief' : 'New contact enquiry',
    title: isConsultation ? 'A new project brief has arrived.' : 'A new enquiry has arrived.',
    intro: 'Review the details below and reply directly to the sender.',
    body,
    action: {
      label: `Reply to ${firstName(data.name)}`,
      href: `mailto:${encodeURIComponent(data.email)}?subject=${subject}`
    }
  });
}

export function generateClientConfirmationEmail(data: EmailPayload): string {
  const isConsultation = data.type === 'consultation';
  const scope = getScope(data);
  const body = `<p style="margin:22px 0 0;padding:15px 17px;border-left:3px solid ${BRAND.orange};background:#0b0b0f;color:${BRAND.text};font-size:13px;line-height:1.7;">
    I’ll review what you sent and get back to you. No technical plan needed to get started.
  </p>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;border-top:1px solid ${BRAND.border};border-bottom:1px solid ${BRAND.border};">
    ${detailRow('Selected scope and options', scope)}
    ${detailRow('Budget', data.budget || data.fundingGoal || 'Not specified', BRAND.orange)}
    ${detailRow('Timing', data.timeline || 'Flexible')}
  </table>
  ${data.message ? contentSection('Your notes', escapeHtml(data.message)) : ''}
  ${renderAttachments(data)}
  ${renderBlueprint(data)}`;

  return renderEmail(data, {
    preheader: 'Your message has been received by Christopher J. Callaghan.',
    eyebrow: isConsultation ? 'Project brief received' : 'Enquiry received',
    title: `Thanks, ${firstName(data.name)}.`,
    intro: isConsultation
      ? 'Your project brief has reached me. I’ll look over the idea, scope, and goals you shared.'
      : 'Thanks for getting in touch. Your message has reached me and I’ll take a look shortly.',
    body,
    action: { label: 'Visit the website', href: 'https://christopherjcallaghan.com' }
  });
}