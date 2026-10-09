import { NextResponse } from 'next/server';
import {
  createCustomerAccount,
  createCustomerSessionToken,
  CUSTOMER_SESSION_COOKIE,
  CUSTOMER_SESSION_MAX_AGE,
  isCustomerAuthConfigured
} from '@/lib/customerAccounts';
import { isSameOriginRequest } from '@/lib/adminAuth';

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  }
  if (!isCustomerAuthConfigured()) {
    return NextResponse.json({ error: 'Customer accounts are not configured yet.' }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Enter your name, email and password.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Enter your name, email and password.' }, { status: 400 });
  }

  const { name, email, password } = body as Record<string, unknown>;
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100
    || typeof email !== 'string' || email.trim().length > 254
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    || typeof password !== 'string' || password.length < 12 || password.length > 128) {
    return NextResponse.json({ error: 'Enter a valid name and email, and use a password between 12 and 128 characters.' }, { status: 400 });
  }

  try {
    const account = await createCustomerAccount({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password
    });
    if (!account) {
      return NextResponse.json({ error: 'An account already exists for this email. Sign in instead.' }, { status: 409 });
    }

    const response = NextResponse.json({ customer: account }, { headers: { 'Cache-Control': 'no-store' } });
    response.cookies.set(CUSTOMER_SESSION_COOKIE, createCustomerSessionToken(account.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: CUSTOMER_SESSION_MAX_AGE,
      priority: 'high'
    });
    return response;
  } catch (error) {
    console.error('Customer account registration failed:', error);
    return NextResponse.json({ error: 'Could not create your account. Please try again shortly.' }, { status: 500 });
  }
}
