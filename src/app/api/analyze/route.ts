import { NextRequest, NextResponse } from 'next/server';
import { AnalyzeRequestSchema } from '@/core/security/validator';
import { validateUrlSecurity } from '@/core/security/ssrf';
import { rateLimiter, getClientIp } from '@/core/security/rate-limiter';
import { providerRegistry } from '@/core/providers/registry';
import { ApiErrorResponse, ApiSuccessResponse } from '@/core/types/api';
import { MediaMetadata } from '@/core/types/media';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  const clientIp = getClientIp(req);

  // 1. Rate Limiting
  const rateResult = rateLimiter.check(`analyze:${clientIp}`, 40, 60);
  if (!rateResult.allowed) {
    const errorBody: ApiErrorResponse = {
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: `Too many requests. Please try again in ${rateResult.resetInSec} seconds.`,
      },
    };
    return NextResponse.json(errorBody, {
      status: 429,
      headers: {
        'Retry-After': String(rateResult.resetInSec),
        'X-RateLimit-Remaining': '0',
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

  const parseResult = AnalyzeRequestSchema.safeParse(body);
  if (!parseResult.success) {
    const errorBody: ApiErrorResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: parseResult.error.issues[0]?.message || 'Invalid URL parameters.',
        details: parseResult.error.issues,
      },
    };
    return NextResponse.json(errorBody, { status: 400 });
  }

  const rawUrl = parseResult.data.url;

  // 3. Strict SSRF and URL validation
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

  // 4. Resolve Provider
  const provider = providerRegistry.resolveProvider(securityCheck.sanitizedUrl);
  logger.info(`Analyzing URL for platform: ${provider.platform}`, 'API_ANALYZE', {
    url: securityCheck.sanitizedUrl,
  });

  // 5. Fetch Metadata
  try {
    const metadata = await provider.getMetadata(securityCheck.sanitizedUrl);

    const responseBody: ApiSuccessResponse<MediaMetadata> = {
      success: true,
      data: metadata,
      meta: {
        timestamp: Date.now(),
        processingTimeMs: Date.now() - startTime,
      },
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logger.error(`Analysis failed for ${securityCheck.sanitizedUrl}: ${errorMessage}`, 'API_ANALYZE');

    let userMessage = 'Could not extract media metadata from the provided URL.';
    let code = 'EXTRACTION_FAILED';
    let statusCode = 422;

    if (errorMessage.includes('Private video') || errorMessage.includes('Sign in') || errorMessage.includes('login')) {
      userMessage = 'This content is private or requires authentication, which is not supported.';
      code = 'AUTHENTICATION_REQUIRED';
      statusCode = 403;
    } else if (errorMessage.includes('Video unavailable') || errorMessage.includes('does not exist')) {
      userMessage = 'This media is unavailable, deleted, or region-restricted.';
      code = 'MEDIA_UNAVAILABLE';
      statusCode = 404;
    } else if (errorMessage.includes('timed out')) {
      userMessage = 'The request to analyze media timed out. Please try again.';
      code = 'TIMEOUT';
      statusCode = 504;
    }

    const errorBody: ApiErrorResponse = {
      success: false,
      error: {
        code,
        message: userMessage,
      },
      meta: {
        timestamp: Date.now(),
        requestId: crypto.randomUUID(),
      },
    };

    return NextResponse.json(errorBody, { status: statusCode });
  }
}
