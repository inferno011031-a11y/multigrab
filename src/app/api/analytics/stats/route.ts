import { NextResponse } from 'next/server';
import { TelemetryTracker } from '@/core/analytics/telemetry';

export async function GET(): Promise<NextResponse> {
  const stats = TelemetryTracker.getStats();
  return NextResponse.json({
    success: true,
    data: stats,
    meta: {
      timestamp: Date.now(),
    },
  });
}
