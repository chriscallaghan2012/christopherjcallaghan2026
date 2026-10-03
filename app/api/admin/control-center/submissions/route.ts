import { NextResponse } from 'next/server';
import { deleteAdminSubmission, isDatabaseConfigured, listAdminSubmissions, updateAdminSubmissionStatus } from '@/lib/database';
import { isSameOriginRequest, verifyAdminSession } from '@/lib/adminAuth';

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: Request) {
  if (!verifyAdminSession(request)) return errorResponse('Sign in to view form submissions.', 401);
  if (!isDatabaseConfigured) return errorResponse('DATABASE_URL is not configured.', 503);
  try {
    return NextResponse.json({ submissions: await listAdminSubmissions() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to load admin submissions:', error);
    return errorResponse('Could not load submissions. Check that the form tables exist in Neon.', 503);
  }
}

export async function PATCH(request: Request) {
  if (!verifyAdminSession(request)) return errorResponse('Sign in to update form submissions.', 401);
  if (!isSameOriginRequest(request)) return errorResponse('Request origin is not allowed.', 403);
  if (!isDatabaseConfigured) return errorResponse('DATABASE_URL is not configured.', 503);
  try {
    const body = await request.json();
    const kind = body.kind === 'contact' || body.kind === 'consultation' ? body.kind : null;
    const id = typeof body.id === 'string' && /^\d+$/.test(body.id) ? body.id : null;
    const status = body.status === 'reviewed' || body.status === 'pending' ? body.status : null;
    if (!kind || !id || !status) return errorResponse('A valid submission, type, and status are required.', 400);
    return await updateAdminSubmissionStatus(kind, id, status)
      ? NextResponse.json({ success: true })
      : errorResponse('Submission not found.', 404);
  } catch (error) {
    console.error('Failed to update admin submission:', error);
    return errorResponse('Could not update the submission.', 500);
  }
}

export async function DELETE(request: Request) {
  if (!verifyAdminSession(request)) return errorResponse('Sign in to delete form submissions.', 401);
  if (!isSameOriginRequest(request)) return errorResponse('Request origin is not allowed.', 403);
  if (!isDatabaseConfigured) return errorResponse('DATABASE_URL is not configured.', 503);
  const parameters = new URL(request.url).searchParams;
  const kind = parameters.get('kind');
  const id = parameters.get('id');
  if ((kind !== 'contact' && kind !== 'consultation') || !id || !/^\d+$/.test(id)) {
    return errorResponse('A valid submission id and type are required.', 400);
  }
  try {
    return await deleteAdminSubmission(kind, id)
      ? NextResponse.json({ success: true })
      : errorResponse('Submission not found.', 404);
  } catch (error) {
    console.error('Failed to delete admin submission:', error);
    return errorResponse('Could not delete the submission.', 500);
  }
}