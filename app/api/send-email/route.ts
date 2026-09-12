import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateAdminNotificationEmail, generateClientConfirmationEmail } from '@/lib/emailTemplates';
import { submitContactForm, submitConsultationRequest, submitAiBlueprint } from '@/lib/supabase';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const adminEmail = process.env.VITE_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'hello@christopherjcallaghan.com';

/** Escapes user-generated content before injecting it into email HTML. */
function escapeHtml(input: string): string {
  return (input || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Builds a readable, escaped summary of an AI Studio blueprint for admin/client emails. */
function formatBlueprintForEmail(ctx: { blueprint?: any; prompt?: string; model?: string; scale?: string }): string {
  const bp = ctx?.blueprint;
  if (!bp) return '';

  return [
    `[AI ARCHITECTURE STUDIO] ${escapeHtml(bp.title || 'Untitled Blueprint')}`,
    `Domain: ${escapeHtml(bp.domain || '—')}`,
    `Scale Target: ${escapeHtml(ctx.scale || '—')}`,
    `Model: ${escapeHtml(ctx.model || '—')}`,
    `Frontend: ${escapeHtml(bp.frontend || '—')}`,
    `Backend: ${escapeHtml(bp.backend || '—')}`,
    `Database: ${escapeHtml(bp.database || '—')}`,
    `AI Engine: ${escapeHtml(bp.aiEngine || '—')}`,
    `DevOps: ${escapeHtml(bp.devops || '—')}`,
    `Latency Target: ${escapeHtml(bp.latencyTarget || '—')}`,
    '',
    'Recommended Execution Stages:',
    ...(Array.isArray(bp.keyWorkflows)
      ? bp.keyWorkflows.map((wf: string) => `  • ${escapeHtml(wf)}`)
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

    // 1. Database Persistence (Supabase / Local Fallback)
    let dbResult = null;
    let blueprintResult = null;
    if (!isSandboxTest) {
      if (type === 'consultation') {
        dbResult = await submitConsultationRequest({
          name,
          email,
          package_scope: payload.packageScope,
          funding_goal: fundingGoal || budget || 'N/A',
          timeline: payload.timeline,
          details: payload.message
        });
      } else {
        dbResult = await submitContactForm({
          name,
          email,
          project_type: payload.projectType,
          budget: payload.budget,
          timeline: payload.timeline,
          message: payload.message
        });
      }

      // Archive the AI Studio blueprint with the lead when one is attached
      if (aiContext?.blueprint) {
        blueprintResult = await submitAiBlueprint({
          title: aiContext.blueprint.title || 'AI Architecture Blueprint',
          domain: aiContext.blueprint.domain || 'General',
          user_prompt: aiContext.prompt || aiContext.blueprint.title || 'Generated via AI Architecture Studio',
          model_used: aiContext.model || 'Gemini 2.0 Flash',
          blueprint_json: aiContext.blueprint
        });
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
          from: 'Christopher Callaghan Architect <onboarding@resend.dev>',
          to: [recipient],
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
          from: 'CJC Signal Gateway <onboarding@resend.dev>',
          to: [adminEmail],
          subject: `⚡ New Project Brief: ${payload.name} (${payload.packageScope})`,
          html: generateAdminNotificationEmail(payload)
        });
        adminEmailSent = true;
      } catch (e: any) {
        console.error('Failed to send admin email via Resend:', e);
      }

      try {
        // Send Client Confirmation Receipt
        await resend.emails.send({
          from: 'Christopher J. Callaghan <onboarding@resend.dev>',
          to: [email],
          subject: `Signal Received: Project Specification Review - Christopher J. Callaghan`,
          html: generateClientConfirmationEmail(payload)
        });
        clientEmailSent = true;
      } catch (e: any) {
        console.error('Failed to send client confirmation email via Resend:', e);
      }
    } else {
      console.log('RESEND_API_KEY not set in .env. Form stored successfully, email simulated.');
    }

    return NextResponse.json({
      success: true,
      message: 'Project specification transmitted successfully!',
      refCode: dbResult?.refCode || 'REF-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
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
