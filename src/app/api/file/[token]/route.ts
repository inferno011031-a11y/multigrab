import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import { createReadStream, existsSync } from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { verifySignedDownloadToken, sanitizeFilename } from '@/core/security/sanitize';
import { TempStorageManager } from '@/core/storage/temp-storage';
import { ApiErrorResponse } from '@/core/types/api';
import { config } from '@/lib/config';
import { logger } from '@/lib/logger';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
): Promise<NextResponse | Response> {
  const { token } = await params;

  if (!token) {
    const errorBody: ApiErrorResponse = {
      success: false,
      error: { code: 'TOKEN_REQUIRED', message: 'Download token is required.' },
    };
    return NextResponse.json(errorBody, { status: 400 });
  }

  // 1. Verify token HMAC signature and expiration
  const tokenData = verifySignedDownloadToken(token);
  if (!tokenData.valid || !tokenData.jobId || !tokenData.filename) {
    const errorBody: ApiErrorResponse = {
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: tokenData.error || 'The download link is invalid or has expired.',
      },
    };
    return NextResponse.json(errorBody, { status: 403 });
  }

  const safeJobId = sanitizeFilename(tokenData.jobId, 'job');
  const safeFilename = sanitizeFilename(tokenData.filename, 'download');

  const filePath = path.join(config.storage.tempDir, safeJobId, safeFilename);

  // Security check: ensure path is within config.storage.tempDir
  const normalizedPath = path.normalize(filePath);
  const normalizedTempDir = path.normalize(config.storage.tempDir);

  if (!normalizedPath.startsWith(normalizedTempDir)) {
    logger.warn('Path traversal attempt detected on file route', 'API_FILE', { filePath });
    const errorBody: ApiErrorResponse = {
      success: false,
      error: { code: 'ACCESS_DENIED', message: 'Access denied.' },
    };
    return NextResponse.json(errorBody, { status: 403 });
  }

  if (!existsSync(normalizedPath)) {
    const errorBody: ApiErrorResponse = {
      success: false,
      error: { code: 'FILE_NOT_FOUND', message: 'File no longer exists on server or has expired.' },
    };
    return NextResponse.json(errorBody, { status: 404 });
  }

  try {
    const stat = await fs.stat(normalizedPath);
    const meta = await TempStorageManager.getJobMetadata(safeJobId);
    const mimeType = meta?.mimeType || 'application/octet-stream';

    // Create readable stream
    const nodeStream = createReadStream(normalizedPath);
    const webReadableStream = Readable.toWeb(nodeStream) as ReadableStream;

    // Clean RFC 5987 Content-Disposition header
    const encodedFilename = encodeURIComponent(safeFilename).replace(/['()]/g, escape).replace(/\*/g, '%2A');

    return new Response(webReadableStream, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': String(stat.size),
        'Content-Disposition': `attachment; filename="${safeFilename}"; filename*=UTF-8''${encodedFilename}`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Accept-Ranges': 'bytes',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logger.error(`Error streaming file: ${errorMessage}`, 'API_FILE');
    const errorBody: ApiErrorResponse = {
      success: false,
      error: { code: 'STREAM_ERROR', message: 'An error occurred while streaming the file.' },
    };
    return NextResponse.json(errorBody, { status: 500 });
  }
}
