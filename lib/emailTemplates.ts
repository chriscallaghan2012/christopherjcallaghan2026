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
  type?: 'contact' | 'consultation';
  submittedAt?: string;
}

/**
 * Generates high-impact HTML email sent to Admin (Christopher J. Callaghan)
 */
export function generateAdminNotificationEmail(data: EmailPayload): string {
  const timestamp = data.submittedAt || new Date().toISOString();
  const isConsultation = data.type === 'consultation';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Signal Transmitted</title>
</head>
<body style="margin: 0; padding: 0; background-color: #060608; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ededed;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #060608; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #0d0d12; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #180509 0%, #0d0d12 100%); padding: 30px; border-bottom: 1px solid rgba(255, 0, 60, 0.3);">
              <table role="presentation" width="100%">
                <tr>
                  <td>
                    <span style="display: inline-block; padding: 4px 12px; background-color: rgba(255, 0, 60, 0.15); border: 1px solid rgba(255, 0, 60, 0.4); border-radius: 50px; color: #FF003C; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; font-family: monospace;">
                      ${isConsultation ? '★ CONSULTATION REQUEST' : '⚡ INCOMING PROJECT SPEC'}
                    </span>
                    <h1 style="margin: 15px 0 5px 0; color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">
                      New Client Inquiry Received
                    </h1>
                    <p style="margin: 0; color: rgba(255,255,255,0.6); font-size: 13px;">
                      Transmitted via christopherjcallaghan.com
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Client Details Grid -->
          <tr>
            <td style="padding: 30px;">
              <table role="presentation" width="100%" style="margin-bottom: 25px;">
                <tr>
                  <td width="50%" style="padding-bottom: 15px;">
                    <span style="color: rgba(255,255,255,0.4); font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Client Name</span>
                    <strong style="color: #ffffff; font-size: 16px;">${data.name}</strong>
                  </td>
                  <td width="50%" style="padding-bottom: 15px;">
                    <span style="color: rgba(255,255,255,0.4); font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Corporate Email</span>
                    <a href="mailto:${data.email}" style="color: #FF003C; font-size: 15px; font-weight: bold; text-decoration: none;">${data.email}</a>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding-bottom: 15px;">
                    <span style="color: rgba(255,255,255,0.4); font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Archetype / Scope</span>
                    <span style="color: #ffffff; font-size: 14px; font-weight: 600;">${data.packageScope || data.projectType}</span>
                  </td>
                  <td width="50%" style="padding-bottom: 15px;">
                    <span style="color: rgba(255,255,255,0.4); font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Budget / Funding</span>
                    <span style="color: #10b981; font-size: 14px; font-weight: 700;">${data.budget || data.fundingGoal || 'N/A'}</span>
                  </td>
                </tr>
                <tr>
                  <td width="50%">
                    <span style="color: rgba(255,255,255,0.4); font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Expected Timeline</span>
                    <span style="color: rgba(255,255,255,0.8); font-size: 13px;">${data.timeline || 'Flexible'}</span>
                  </td>
                  <td width="50%">
                    <span style="color: rgba(255,255,255,0.4); font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Submission Time</span>
                    <span style="color: rgba(255,255,255,0.6); font-size: 12px; font-family: monospace;">${timestamp.substring(0, 19).replace('T', ' ')} UTC</span>
                  </td>
                </tr>
              </table>

              <!-- Specification Message Box -->
              <div style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                <span style="color: #FF003C; font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 1.5px; font-weight: bold; display: block; margin-bottom: 8px;">Technical Specification & Goals</span>
                <p style="margin: 0; color: #ffffff; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.message || data.message || 'No additional notes provided.'}</p>
              </div>

              ${data.aiBlueprint ? `
              <!-- AI Architecture Studio Blueprint Attachment -->
              <div style="background-color: rgba(168, 85, 247, 0.06); border: 1px solid rgba(168, 85, 247, 0.35); border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                <span style="color: #a855f7; font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 1.5px; font-weight: bold; display: block; margin-bottom: 8px;">🤖 AI Architecture Studio Blueprint Attached</span>
                <p style="margin: 0; color: #e9d5ff; font-size: 13px; line-height: 1.7; white-space: pre-wrap; font-family: monospace;">${data.aiBlueprint}</p>
              </div>` : ''/* aiBlueprint */}

              <!-- Action Button -->
              <table role="presentation" width="100%">
                <tr>
                  <td align="center">
                    <a href="mailto:${data.email}?subject=Re:%20Architectural%20Consultation%20-%20Christopher%20J.%20Callaghan" style="display: inline-block; padding: 14px 32px; background-color: #FF003C; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; border-radius: 12px; box-shadow: 0 0 25px rgba(255, 0, 60, 0.5);">
                      Reply to ${data.name.split(' ')[0]} Now
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: rgba(0, 0, 0, 0.4); padding: 20px 30px; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
              <p style="margin: 0; color: rgba(255,255,255,0.4); font-size: 11px; font-family: monospace;">
                Christopher J. Callaghan • Digital Architect & Senior Full-Stack Engineer • Manchester, UK
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generates automated acknowledgment receipt sent to the Client
 */
export function generateClientConfirmationEmail(data: EmailPayload): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Specification Received</title>
</head>
<body style="margin: 0; padding: 0; background-color: #060608; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ededed;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #060608; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #0d0d12; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d0d12 0%, #15050a 100%); padding: 35px 30px; border-bottom: 1px solid rgba(255, 0, 60, 0.3);">
              <table role="presentation" width="100%">
                <tr>
                  <td>
                    <div style="display: inline-block; width: 36px; height: 36px; background-color: #FF003C; border-radius: 50%; text-align: center; line-height: 36px; color: #ffffff; font-weight: 900; font-size: 14px; margin-bottom: 15px;">
                      CJC
                    </div>
                    <h1 style="margin: 0 0 8px 0; color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">
                      Signal Transmitted Successfully
                    </h1>
                    <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.5;">
                      Hello ${data.name}, thank you for reaching out.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 30px;">
              <p style="margin: 0 0 20px 0; color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.6;">
                I have received your project specification for <strong style="color: #ffffff;">${data.packageScope || data.projectType}</strong>. Every architectural brief is directly reviewed by me to evaluate technical feasibility and scope requirements.
              </p>

              <!-- Response Time Commitment Box -->
              <div style="background: linear-gradient(135deg, rgba(255,0,60,0.1) 0%, rgba(0,0,0,0.3) 100%); border: 1px solid rgba(255, 0, 60, 0.3); border-radius: 12px; padding: 18px; margin-bottom: 25px;">
                <div style="color: #FF003C; font-size: 11px; font-family: monospace; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">
                  ⚡ Guaranteed Response SLA
                </div>
                <div style="color: #ffffff; font-size: 13px; font-weight: 600;">
                  You will receive a direct technical response & breakdown within 24 business hours.
                </div>
              </div>

              <!-- Brief Overview -->
              <div style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 18px; margin-bottom: 25px;">
                <span style="color: rgba(255,255,255,0.4); font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">Submitted Brief Overview</span>
                <table role="presentation" width="100%" style="font-size: 13px; color: rgba(255,255,255,0.8);">
                  <tr>
                    <td style="padding: 3px 0; color: rgba(255,255,255,0.5);">Scope:</td>
                    <td style="padding: 3px 0; font-weight: 600; color: #ffffff;">${data.packageScope || data.projectType}</td>
                  </tr>
                  <tr>
                    <td style="padding: 3px 0; color: rgba(255,255,255,0.5);">Budget / Target:</td>
                    <td style="padding: 3px 0; font-weight: 600; color: #10b981;">${data.budget || data.fundingGoal || 'Standard Scope'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 3px 0; color: rgba(255,255,255,0.5);">Timeline:</td>
                    <td style="padding: 3px 0; color: #ffffff;">${data.timeline || 'Flexible'}</td>
                  </tr>
                </table>
              </div>

              ${data.aiBlueprint ? `
              <!-- AI Blueprint Receipt -->
              <div style="background-color: rgba(168, 85, 247, 0.06); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 12px; padding: 18px; margin-bottom: 25px;">
                <span style="color: #a855f7; font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 1.5px; font-weight: bold; display: block; margin-bottom: 8px;">Your AI Architecture Studio Blueprint</span>
                <p style="margin: 0; color: #e9d5ff; font-size: 12px; line-height: 1.65; white-space: pre-wrap; font-family: monospace;">${data.aiBlueprint}</p>
              </div>` : ''/* aiBlueprint */}

              <p style="margin: 0; color: rgba(255,255,255,0.6); font-size: 13px; line-height: 1.5;">
                In the meantime, feel free to explore my full engineering portfolio and interactive tools at <a href="https://christopherjcallaghan.com" style="color: #FF003C; text-decoration: none; font-weight: bold;">christopherjcallaghan.com</a>.
              </p>
            </td>
          </tr>

          <!-- Signature & Footer -->
          <tr>
            <td style="background-color: rgba(0, 0, 0, 0.5); padding: 25px 30px; border-top: 1px solid rgba(255, 255, 255, 0.05);">
              <strong style="color: #ffffff; font-size: 14px; display: block; margin-bottom: 2px;">Christopher J. Callaghan</strong>
              <span style="color: rgba(255,255,255,0.5); font-size: 12px; font-family: monospace; display: block; margin-bottom: 12px;">Digital Architect & Senior Full-Stack Engineer</span>
              <div style="font-size: 11px; color: rgba(255,255,255,0.3); font-family: monospace;">
                Manchester, UK • London • New York • Global Timezones
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
