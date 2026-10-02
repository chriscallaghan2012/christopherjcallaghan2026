import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateAdminNotificationEmail, generateClientConfirmationEmail } from '@/lib/emailTemplates';
import { isDatabaseConfigured, saveAiBlueprint, saveContactSubmission, saveConsultationRequest } from '@/lib/database';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const adminEmail = process.env.ADMIN_EMAIL || 'christopher@christopherjcallaghan.com';
const senderIdentity = 'Christopher J. Callaghan <christopher@christopherjcallaghan.com>';

/** Builds a plain-text AI Studio summary; the email template escapes it for HTML. */
function formatBlueprintForEmail(ctx: { blueprint?: any; prompt?: string; model?: string; scale?: string }): string {
  const bp = ctx?.blueprint;
  if (!bp) return '';

  return [
    `[AI ARCHITECTURE STUDIO] ${bp.title || 'Untitled Blueprint'}`,
    `Domain: ${bp.domain || '—'}`,
    `Scale Target: ${ctx.scale || '—'}`,
    `Model: ${ctx.model || '—'}`,
    `Frontend: ${bp.frontend || '—'}`,
    `Backend: ${bp.backend || '—'}`,
    `Database: ${bp.database || '—'}`,
    `AI Engine: ${bp.aiEngine || '—'}`,
    `DevOps: ${bp.devops || '—'}`,
    `Latency Target: ${bp.latencyTarget || '—'}`,
    '',
    'Recommended Execution Stages:',
    ...(Array.isArray(bp.keyWorkflows)
      ? bp.keyWorkflows.map((wf: string) => `  • ${wf}`)
      : [])
  ]
    .filter(Boolean)
    .join('\n');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      projectType,
      packageScope,
      budget,
      fundingGoal,
      timeline,
      message,
      details,
      aiContext,
      type = 'contact',
      testRecipient,
      templateType,
      isSandboxTest = false
    } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'Name and email are required fields.' }, { status: 400 });
    }

    if (!isSandboxTest && !isDatabaseConfigured && !resend) {
      return NextResponse.json({
        success: false,
        error: 'Project enquiries are not configured yet. Set DATABASE_URL for Neon or RESEND_API_KEY for email delivery.'
      }, { status: 503 });
    }

    const payload = {
      name,
      email,
      projectType: projectType || 'General Architectural Inquiry',
      packageScope: packageScope || projectType || 'General Scope',
      budget: budget || fundingGoal || 'Not Specified',
      fundingGoal,
      timeline: timeline || 'Flexible',
      message: message || details || '',
      aiBlueprint: aiContext ? formatBlueprintForEmail(aiContext) : undefined,
      type,
      submittedAt: new Date().toISOString()
    };
    const safeSubjectName = String(payload.name).replace(/[\r\n]+/g, ' ').slice(0, 120);
    const safeSubjectScope = String(payload.packageScope).replace(/[\r\n]+/g, ' ').slice(0, 160);
    const submissionLabel = type === 'consultation' ? 'Project brief' : 'Contact enquiry';

    // Persist on the server when Neon is configured; allow email-only intake before then.
    let dbResult = null;
    let blueprintResult = null;
    if (!isSandboxTest && isDatabaseConfigured) {
      try {
        if (type === 'consultation') {
          dbResult = await saveConsultationRequest({
            name,
            email,
            packageScope: payload.packageScope,
            fundingGoal: fundingGoal || budget || 'N/A',
            timeline: payload.timeline,
            details: payload.message
          });
        } else {
          dbResult = await saveContactSubmission({
            name,
            email,
            projectType: payload.projectType,
            budget: payload.budget,
            timeline: payload.timeline,
            message: payload.message
          });
        }

        if (aiContext?.blueprint) {
          blueprintResult = await saveAiBlueprint({
            title: aiContext.blueprint.title || 'AI Architecture Blueprint',
            domain: aiContext.blueprint.domain || 'General',
            userPrompt: aiContext.prompt || aiContext.blueprint.title || 'Generated via AI Architecture Studio',
            modelUsed: aiContext.model || 'Gemini 2.0 Flash',
            blueprint: aiContext.blueprint
          });
        }
      } catch (error) {
        console.error('Neon submission failed:', error);
        return NextResponse.json({ success: false, error: 'Your brief could not be saved. Please try again.' }, { status: 503 });
      }
    }

    // 2. Resend Email Dispatch
    if (isSandboxTest) {
      // Sandbox Test Delivery
      const recipient = testRecipient || adminEmail;
      const html = templateType === 'client' 
        ? generateClientConfirmationEmail(payload) 
        : generateAdminNotificationEmail(payload);

      if (resend) {
        const emailRes = await resend.emails.send({
          from: senderIdentity,
          to: [recipient],
          replyTo: adminEmail,
          subject: `[SANDBOX TEST] ${templateType === 'client' ? 'Client Confirmation Receipt' : 'New Project Specification Alert'}`,
          html
        });
        return NextResponse.json({
          success: true,
          message: `Test email (${templateType}) sent successfully to ${recipient} via Resend API!`,
          resendId: emailRes.data?.id,
          dbResult,
          blueprintResult
        });
      } else {
        return NextResponse.json({
          success: true,
          message: `[Simulated Sandbox Test] Email template (${templateType}) generated for ${recipient}. Add RESEND_API_KEY to .env to send live emails!`,
          dbResult,
          blueprintResult
        });
      }
    }

    // Live Submissions: Send dual emails (Admin alert + Client receipt)
    let adminEmailSent = false;
    let clientEmailSent = false;

    if (resend) {
      try {
        // Send Admin Notification
        await resend.emails.send({
          from: senderIdentity,
          to: [adminEmail],
          replyTo: email,
          subject: `⚡ New ${submissionLabel}: ${safeSubjectName} (${safeSubjectScope})`,
          html: generateAdminNotificationEmail(payload)
        });
        adminEmailSent = true;
      } catch (e: any) {
        console.error('Failed to send admin email via Resend:', e);
      }

      try {
        // Send Client Confirmation Receipt
        await resend.emails.send({
          from: senderIdentity,
          to: [email],
          replyTo: adminEmail,
          subject: type === 'consultation'
            ? 'We received your project brief - Christopher J. Callaghan'
            : 'Thanks for your enquiry - Christopher J. Callaghan',
          html: generateClientConfirmationEmail(payload)
        });
        clientEmailSent = true;
      } catch (e: any) {
        console.error('Failed to send client confirmation email via Resend:', e);
      }
    } else {
      console.log('RESEND_API_KEY is not set. The submission was stored in Neon.');
    }

    if (!isSandboxTest && !isDatabaseConfigured && resend && !adminEmailSent) {
      return NextResponse.json({
        success: false,
        error: 'Your enquiry could not be delivered. Please try again shortly.'
      }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      message: 'Project specification transmitted successfully!',
      refCode: dbResult?.refCode || 'REF-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      storage: isDatabaseConfigured ? 'neon' : 'email-only',
      emailStatus: {
        resendActive: Boolean(resend),
        adminEmailSent,
        clientEmailSent
      },
      dbResult,
      blueprintResult
    });

  } catch (error: any) {
    console.error('Error in send-email API handler:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
