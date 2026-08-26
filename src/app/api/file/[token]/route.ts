import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import fsp from 'fs/promises';
import { Readable } from 'stream';
import path from 'path';
import { verifySignedDownloadToken, sanitizeFilename } from '@/core/security/sanitize';
import { TempStorageManager } from '@/core/storage/temp-storage';
import { ApiErrorResponse } from '@/core/types/api';
import { config } from '@/lib/config';
import { logger } from '@/lib/logger';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
): Promise<NextResponse | Response> {
  const { token: rawToken } = await params;
  const token = decodeURIComponent(rawToken || '');

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

  // 1. Try sanitized path
  let targetPath = normalizedPath;

  // 2. If sanitized path does not exist, check exact token filename or find job file
  if (!fs.existsSync(targetPath)) {
    const directPath = path.normalize(path.join(normalizedTempDir, safeJobId, tokenData.filename));
    if (directPath.startsWith(normalizedTempDir) && fs.existsSync(directPath)) {
      targetPath = directPath;
    } else {
      const jobFile = await TempStorageManager.findJobFile(safeJobId);
      if (jobFile && fs.existsSync(jobFile.filePath)) {
        targetPath = jobFile.filePath;
      }
    }
  }

  if (!fs.existsSync(targetPath)) {
    const errorBody: ApiErrorResponse = {
      success: false,
      error: { code: 'FILE_NOT_FOUND', message: 'File no longer exists on server or has expired.' },
    };
    return NextResponse.json(errorBody, { status: 404 });
  }

  try {
    const stat = await fsp.stat(targetPath);
    const meta = await TempStorageManager.getJobMetadata(safeJobId);
    const mimeType = meta?.mimeType || 'application/octet-stream';

    // Clean safe filename for Content-Disposition header (prevents OS file naming errors)
    const cleanHeaderFilename = sanitizeFilename(tokenData.filename || safeFilename, 'media-download.mp4');

    // 1. Create clean ASCII fallback for HTTP header (RFC 6266)
    const asciiFilename = cleanHeaderFilename
      .replace(/[^\x20-\x7E]/g, '_')
      .replace(/["\\]/g, '')
      .trim() || 'media-download.mp4';

    // 2. Create RFC 5987 UTF-8 encoded filename
    const utf8Encoded = encodeURIComponent(cleanHeaderFilename)
      .replace(/['()]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
      .replace(/\*/g, '%2A');

    // Read complete file buffer
    const fileBuffer = await fsp.readFile(targetPath);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': String(fileBuffer.length),
        'Content-Disposition': `attachment; filename="${asciiFilename}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
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
