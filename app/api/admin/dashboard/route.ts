import { NextResponse } from 'next/server';
import { isDatabaseConfigured, listAdminSubmissions } from '@/lib/database';
import { listAdminCustomerAccounts, listAdminCustomerPurchases } from '@/lib/customerAccounts';
import { verifyAdminSession } from '@/lib/adminAuth';

export async function GET(request: Request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Sign in to view the admin dashboard.' }, { status: 401 });
  }
  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: 'DATABASE_URL is not configured.' }, { status: 503 });
  }

  try {
    const [accounts, purchases, submissions] = await Promise.all([
      listAdminCustomerAccounts(),
      listAdminCustomerPurchases(),
      listAdminSubmissions()
    ]);
    return NextResponse.json({ accounts, purchases, submissions }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to load admin dashboard:', error);
    return NextResponse.json({ error: 'Could not load dashboard data. Check that the customer and form tables exist.' }, { status: 503 });
  }
}