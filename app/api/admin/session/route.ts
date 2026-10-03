import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
  isAdminAuthConfigured,
  isSameOriginRequest,
  verifyAdminPassword,
  verifyAdminSession
} from '@/lib/adminAuth';

export async function GET(request: Request) {
  return NextResponse.json({
    authenticated: verifyAdminSession(request),
    configured: isAdminAuthConfigured()
  }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  }
  if (!isAdminAuthConfigured()) {
    return NextResponse.json({ error: 'Set ADMIN_PASSWORD and a 32+ character ADMIN_SESSION_SECRET first.' }, { status: 503 });
  }

  try {
    const body = await request.json();
    if (typeof body.password !== 'string' || !verifyAdminPassword(body.password)) {
      return NextResponse.json({ error: 'The password is incorrect.' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/admin',
      maxAge: ADMIN_SESSION_MAX_AGE,
      priority: 'high'
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid login request.' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/admin',
    maxAge: 0
  });
  return response;
}