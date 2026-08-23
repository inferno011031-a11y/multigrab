import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { DownloadRequestSchema } from '@/core/security/validator';
import { validateUrlSecurity } from '@/core/security/ssrf';
import { rateLimiter, getClientIp } from '@/core/security/rate-limiter';
import { providerRegistry } from '@/core/providers/registry';
import { jobQueue } from '@/core/queue';
import { TelemetryTracker } from '@/core/analytics/telemetry';
import { ApiErrorResponse, DownloadResponse } from '@/core/types/api';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const clientIp = getClientIp(req);

  // 1. Rate Limiting (15 download jobs per minute)
  const rateResult = rateLimiter.check(`download:${clientIp}`, 15, 60);
  if (!rateResult.allowed) {
    const errorBody: ApiErrorResponse = {
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: `Too many download jobs submitted. Please try again in ${rateResult.resetInSec} seconds.`,
      },
    };
    return NextResponse.json(errorBody, {
      status: 429,
      headers: {
        'Retry-After': String(rateResult.resetInSec),
      },
    });
  }

  // 2. Request Parsing & Zod Validation
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    const errorBody: ApiErrorResponse = {
      success: false,
      error: {
        code: 'INVALID_JSON',
        message: 'Request body must be valid JSON.',
      },
    };
    return NextResponse.json(errorBody, { status: 400 });
  }

  const parseResult = DownloadRequestSchema.safeParse(body);
  if (!parseResult.success) {
    const errorBody: ApiErrorResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: parseResult.error.issues[0]?.message || 'Invalid download parameters.',
        details: parseResult.error.issues,
      },
    };
    return NextResponse.json(errorBody, { status: 400 });
  }

  const { url: rawUrl, formatId } = parseResult.data;

  // 3. Security validation
  const securityCheck = await validateUrlSecurity(rawUrl);
  if (!securityCheck.valid || !securityCheck.sanitizedUrl) {
    const errorBody: ApiErrorResponse = {
      success: false,
      error: {
        code: 'INVALID_URL_SECURITY',
        message: securityCheck.error || 'The submitted URL is not permitted.',
      },
    };
    return NextResponse.json(errorBody, { status: 400 });
  }

  const provider = providerRegistry.resolveProvider(securityCheck.sanitizedUrl);
  const jobId = crypto.randomUUID();

  try {
    const job = await jobQueue.addJob({
      id: jobId,
      url: securityCheck.sanitizedUrl,
      formatId,
      platform: provider.platform,
      title: 'Processing Media',
    });

    TelemetryTracker.recordDownload(provider.platform);

    const responseBody: DownloadResponse = {
      success: true,
      data: {
        jobId: job.id,
        status: job.status,
        message: 'Download job has been scheduled.',
        pollUrl: `/api/job/${job.id}`,
      },
      meta: {
        timestamp: Date.now(),
      },
    };

    return NextResponse.json(responseBody, { status: 202 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logger.error(`Failed to enqueue job: ${errorMessage}`, 'API_DOWNLOAD');

    const errorBody: ApiErrorResponse = {
      success: false,
      error: {
        code: 'QUEUE_ERROR',
        message: 'Failed to queue the download job. Please try again.',
      },
    };
    return NextResponse.json(errorBody, { status: 500 });
  }
}
