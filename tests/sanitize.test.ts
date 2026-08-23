import { describe, it, expect } from 'vitest';
import { sanitizeFilename, generateSignedDownloadToken, verifySignedDownloadToken } from '@/core/security/sanitize';

describe('Sanitization & Cryptographic Signed Tokens', () => {
  it('sanitizes dangerous characters and directory traversal from filenames', () => {
    expect(sanitizeFilename('../../../etc/passwd')).toBe('etc_passwd');
    expect(sanitizeFilename('my cool video / with <pipes> & "quotes".mp4')).toBe('my cool video _ with _pipes_ & _quotes_.mp4');
    expect(sanitizeFilename('C:\\Windows\\System32\\cmd.exe')).toBe('C_Windows_System32_cmd.exe');
    expect(sanitizeFilename('')).toBe('media-download');
  });

  it('generates and successfully validates signed download tokens', () => {
    const jobId = 'test-job-12345';
    const filename = 'sample_video.mp4';
    const token = generateSignedDownloadToken(jobId, filename, 30);

    const verified = verifySignedDownloadToken(token);
    expect(verified.valid).toBe(true);
    expect(verified.jobId).toBe(jobId);
    expect(verified.filename).toBe(filename);
  });

  it('rejects tampered or malformed tokens', () => {
    const invalidToken = 'invalid-base64-payload';
    const verified = verifySignedDownloadToken(invalidToken);
    expect(verified.valid).toBe(false);
  });
});
