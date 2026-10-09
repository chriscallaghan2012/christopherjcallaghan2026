import { NextResponse } from 'next/server';
import {
  authenticateCustomer,
  clearCustomerLoginAttempts,
  consumeCustomerLoginAttempt,
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
    return NextResponse.json({ error: 'Enter your email and password.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Enter your email and password.' }, { status: 400 });
  }

  const { email, password } = body as Record<string, unknown>;
  if (typeof email !== 'string' || typeof password !== 'string'
    || email.length > 254 || password.length > 128) {
    return NextResponse.json({ error: 'Enter a valid email and password.' }, { status: 400 });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    if (!await consumeCustomerLoginAttempt(normalizedEmail)) {
      return NextResponse.json({ error: 'Too many sign-in attempts. Please wait 15 minutes before trying again.' }, { status: 429 });
    }

    const account = await authenticateCustomer(normalizedEmail, password);
    if (!account) {
      return NextResponse.json({ error: 'The email or password is incorrect.' }, { status: 401 });
    }

    await clearCustomerLoginAttempts(normalizedEmail);
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
    console.error('Customer login failed:', error);
    return NextResponse.json({ error: 'Could not sign in. Please try again shortly.' }, { status: 500 });
  }
}
