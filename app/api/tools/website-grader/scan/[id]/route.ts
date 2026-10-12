import { NextRequest, NextResponse } from 'next/server';
import { getScan } from '@/lib/grader/storage';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const report = await getScan(id);
  if (!report) {
    return NextResponse.json(
      { success: false, error: 'Report not found. It may have expired or was never saved.' },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, status: report.status, report }, { status: 200 });
}
