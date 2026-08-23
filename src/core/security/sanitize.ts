import crypto from 'crypto';
import path from 'path';
import { config } from '@/lib/config';

/**
 * Sanitizes a filename to prevent path traversal, null bytes, and illegal OS characters.
 */
export function sanitizeFilename(raw: string, fallback: string = 'media-download'): string {
  if (!raw || typeof raw !== 'string') return fallback;

  // Trim whitespace
  let name = raw.trim();

  // Strip null bytes and control chars
  name = name.replace(/[\x00-\x1f\x7f]/g, '');

  // Strip illegal Windows / Linux filename characters: / \ ? * : | " < > and path traversal dots
  name = name.replace(/\.\./g, '_');
  name = name.replace(/[/\\?%*:|"<>]/g, '_');

  // Collapse consecutive underscores
  name = name.replace(/_+/g, '_');

  // Strip leading and trailing underscores, dots, spaces
  name = name.replace(/^[._\s]+|[._\s]+$/g, '');

  // Truncate to maximum 120 characters to avoid filesystem limit issues
  if (name.length > 120) {
    const ext = path.extname(name);
    const base = path.basename(name, ext).slice(0, 120 - ext.length);
    name = `${base}${ext}`;
  }

  return name || fallback;
}

/**
 * Creates an HMAC signed temporary download token with an expiration timestamp.
 */
export function generateSignedDownloadToken(jobId: string, filename: string, ttlMinutes: number = config.storage.fileTtlMinutes): string {
  const expiresAt = Date.now() + ttlMinutes * 60 * 1000;
  const payload = `${jobId}:${expiresAt}:${filename}`;
  const hmac = crypto.createHmac('sha256', config.security.tokenSecret).update(payload).digest('hex');
  const token = Buffer.from(JSON.stringify({ jobId, expiresAt, filename, hmac })).toString('base64url');
  return token;
}

/**
 * Validates a signed download token and verifies signature and expiration.
 */
export function verifySignedDownloadToken(token: string): { valid: boolean; jobId?: string; filename?: string; error?: string } {
  try {
    const jsonStr = Buffer.from(token, 'base64url').toString('utf8');
    const data = JSON.parse(jsonStr) as { jobId: string; expiresAt: number; filename: string; hmac: string };

    if (!data.jobId || !data.expiresAt || !data.filename || !data.hmac) {
      return { valid: false, error: 'Malformed token payload.' };
    }

    if (Date.now() > data.expiresAt) {
      return { valid: false, error: 'Download token has expired.' };
    }

    const payload = `${data.jobId}:${data.expiresAt}:${data.filename}`;
    const expectedHmac = crypto.createHmac('sha256', config.security.tokenSecret).update(payload).digest('hex');

    const hmacBuffer = Buffer.from(data.hmac, 'hex');
    const expectedBuffer = Buffer.from(expectedHmac, 'hex');

    if (hmacBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(hmacBuffer, expectedBuffer)) {
      return { valid: false, error: 'Invalid token signature.' };
    }

    return {
      valid: true,
      jobId: data.jobId,
      filename: data.filename,
    };
  } catch {
    return { valid: false, error: 'Failed to parse download token.' };
  }
}
