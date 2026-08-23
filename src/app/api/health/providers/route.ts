import { NextRequest, NextResponse } from 'next/server';
import { HealthMonitor } from '@/core/monitoring/health-monitor';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const force = req.nextUrl.searchParams.get('force') === 'true';
  const reports = await HealthMonitor.checkAllProviders(force);

  const overallStatus = reports.every((r) => r.status === 'operational')
    ? 'healthy'
    : reports.some((r) => r.status === 'down')
    ? 'critical'
    : 'degraded';

  return NextResponse.json({
    status: overallStatus,
    timestamp: Date.now(),
    providers: reports,
  });
}
