import { NextResponse } from 'next/server';
import { providerRegistry } from '@/core/providers/registry';
import { ProvidersResponse } from '@/core/types/api';

export async function GET(): Promise<NextResponse> {
  const platforms = providerRegistry.getSupportedPlatformsInfo();

  const responseBody: ProvidersResponse = {
    success: true,
    data: platforms,
    meta: {
      timestamp: Date.now(),
    },
  };

  return NextResponse.json(responseBody, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
