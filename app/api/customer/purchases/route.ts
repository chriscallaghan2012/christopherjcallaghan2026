import { NextResponse } from 'next/server';
import { getCustomerSession, listCustomerPurchases, isCustomerAuthConfigured } from '@/lib/customerAccounts';

export async function GET(request: Request) {
  if (!isCustomerAuthConfigured()) {
    return NextResponse.json({ error: 'Customer accounts are not configured yet.' }, { status: 503 });
  }

  try {
    const customer = await getCustomerSession(request);
    if (!customer) return NextResponse.json({ error: 'Sign in to view your purchases.' }, { status: 401 });

    const purchases = await listCustomerPurchases(customer.id);
    return NextResponse.json({ purchases }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Could not load customer purchases:', error);
    return NextResponse.json({ error: 'Could not load your purchases.' }, { status: 500 });
  }
}
