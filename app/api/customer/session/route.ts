import { NextResponse } from 'next/server';
import { getCustomerSession, isCustomerAuthConfigured } from '@/lib/customerAccounts';

export async function GET(request: Request) {
  if (!isCustomerAuthConfigured()) {
    return NextResponse.json({ authenticated: false, configured: false }, { headers: { 'Cache-Control': 'no-store' } });
  }

  try {
    const customer = await getCustomerSession(request);
    return NextResponse.json({ authenticated: Boolean(customer), configured: true, customer }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (error) {
    console.error('Could not read customer session:', error);
    return NextResponse.json({ error: 'Could not check your account session.' }, { status: 500 });
  }
}
