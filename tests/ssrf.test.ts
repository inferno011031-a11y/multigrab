import { describe, it, expect } from 'vitest';
import { isPrivateOrReservedIPv4, isPrivateOrReservedIPv6, validateUrlSecurity } from '@/core/security/ssrf';

describe('SSRF Protection & URL Security', () => {
  it('identifies RFC 1918 and loopback IPv4 addresses as private/prohibited', () => {
    expect(isPrivateOrReservedIPv4('127.0.0.1')).toBe(true);
    expect(isPrivateOrReservedIPv4('127.255.255.254')).toBe(true);
    expect(isPrivateOrReservedIPv4('10.0.0.1')).toBe(true);
    expect(isPrivateOrReservedIPv4('10.254.12.1')).toBe(true);
    expect(isPrivateOrReservedIPv4('172.16.0.1')).toBe(true);
    expect(isPrivateOrReservedIPv4('172.31.255.255')).toBe(true);
    expect(isPrivateOrReservedIPv4('192.168.1.1')).toBe(true);
    expect(isPrivateOrReservedIPv4('192.168.254.254')).toBe(true);
    expect(isPrivateOrReservedIPv4('169.254.169.254')).toBe(true); // AWS/cloud metadata
    expect(isPrivateOrReservedIPv4('0.0.0.0')).toBe(true);
    expect(isPrivateOrReservedIPv4('224.0.0.1')).toBe(true); // Multicast
  });

  it('allows public IPv4 addresses', () => {
    expect(isPrivateOrReservedIPv4('8.8.8.8')).toBe(false);
    expect(isPrivateOrReservedIPv4('1.1.1.1')).toBe(false);
    expect(isPrivateOrReservedIPv4('142.250.190.46')).toBe(false);
  });

  it('identifies private & reserved IPv6 addresses as prohibited', () => {
    expect(isPrivateOrReservedIPv6('::1')).toBe(true);
    expect(isPrivateOrReservedIPv6('::')).toBe(true);
    expect(isPrivateOrReservedIPv6('fc00::1')).toBe(true);
    expect(isPrivateOrReservedIPv6('fe80::1')).toBe(true);
    expect(isPrivateOrReservedIPv6('::ffff:127.0.0.1')).toBe(true);
  });

  it('blocks localhost, internal domains, and non-http protocols', async () => {
    const r1 = await validateUrlSecurity('http://localhost:3000/secret');
    expect(r1.valid).toBe(false);

    const r2 = await validateUrlSecurity('file:///etc/passwd');
    expect(r2.valid).toBe(false);

    const r3 = await validateUrlSecurity('ftp://example.com/file.mp4');
    expect(r3.valid).toBe(false);

    const r4 = await validateUrlSecurity('http://169.254.169.254/latest/meta-data/');
    expect(r4.valid).toBe(false);

    const r5 = await validateUrlSecurity('http://127.0.0.1:8080');
    expect(r5.valid).toBe(false);

    const r6 = await validateUrlSecurity('http://router');
    expect(r6.valid).toBe(false);
  });

  it('permits valid public YouTube URLs', async () => {
    const r = await validateUrlSecurity('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(r.valid).toBe(true);
    expect(r.host).toBe('www.youtube.com');
  });
});
