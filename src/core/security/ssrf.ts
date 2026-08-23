import dns from 'dns/promises';
import { logger } from '@/lib/logger';

// IP Range checks in numerical form
function ipToLong(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

function inRange(ipNum: number, cidrBase: string, prefixLen: number): boolean {
  const baseNum = ipToLong(cidrBase);
  const mask = prefixLen === 0 ? 0 : (~0 << (32 - prefixLen)) >>> 0;
  return (ipNum & mask) === (baseNum & mask);
}

export function isPrivateOrReservedIPv4(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return true;
  for (const part of parts) {
    const n = parseInt(part, 10);
    if (isNaN(n) || n < 0 || n > 255) return true;
  }

  const num = ipToLong(ip);

  // Private & Reserved IPv4 Ranges
  const forbiddenRanges: Array<[string, number]> = [
    ['0.0.0.0', 8],        // "This host on this network"
    ['10.0.0.0', 8],       // Private-Use (RFC 1918)
    ['100.64.0.0', 10],    // Shared Address Space (RFC 6598)
    ['127.0.0.0', 8],      // Loopback (RFC 1122)
    ['169.254.0.0', 16],   // Link Local & Cloud Metadata (RFC 3927)
    ['172.16.0.0', 12],    // Private-Use (RFC 1918)
    ['192.0.0.0', 24],     // IETF Protocol Assignments
    ['192.0.2.0', 24],     // Documentation (TEST-NET-1)
    ['192.88.99.0', 24],   // 6to4 Relay Anycast
    ['192.168.0.0', 16],   // Private-Use (RFC 1918)
    ['198.18.0.0', 15],    // Benchmarking (RFC 2544)
    ['198.51.100.0', 24],  // Documentation (TEST-NET-2)
    ['203.0.113.0', 24],   // Documentation (TEST-NET-3)
    ['224.0.0.0', 4],      // Multicast (RFC 5771)
    ['240.0.0.0', 4],      // Reserved (RFC 1112)
    ['255.255.255.255', 32] // Limited Broadcast
  ];

  for (const [base, prefix] of forbiddenRanges) {
    if (inRange(num, base, prefix)) {
      return true;
    }
  }

  return false;
}

export function isPrivateOrReservedIPv6(ip: string): boolean {
  const clean = ip.toLowerCase().trim();

  // Loopback & Unspecified
  if (clean === '::1' || clean === '::' || clean === '0:0:0:0:0:0:0:1' || clean === '0:0:0:0:0:0:0:0') {
    return true;
  }

  // IPv4-mapped IPv6 (::ffff:127.0.0.1)
  if (clean.startsWith('::ffff:')) {
    const v4Part = clean.replace('::ffff:', '');
    return isPrivateOrReservedIPv4(v4Part);
  }

  // Unique Local (fc00::/7) -> fc00 to fdff
  if (clean.startsWith('fc') || clean.startsWith('fd')) {
    return true;
  }

  // Link-Local (fe80::/10) -> fe80 to febf
  if (/^fe[89ab]/i.test(clean)) {
    return true;
  }

  // Multicast (ff00::/8)
  if (clean.startsWith('ff')) {
    return true;
  }

  return false;
}

export interface SecurityCheckResult {
  valid: boolean;
  sanitizedUrl?: string;
  error?: string;
  host?: string;
}

export async function validateUrlSecurity(rawUrl: string): Promise<SecurityCheckResult> {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { valid: false, error: 'URL is required.' };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return { valid: false, error: 'Invalid URL format.' };
  }

  // Protocol whitelist
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { valid: false, error: `Invalid protocol: ${parsed.protocol}. Only http and https are allowed.` };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block localhost, dotless hostnames, intranet names
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.lan') ||
    hostname.endsWith('.corp') ||
    hostname.endsWith('.home') ||
    hostname.endsWith('.onion') ||
    !hostname.includes('.') // reject unqualified hostnames like "router"
  ) {
    return { valid: false, error: 'Access to local, internal, or non-public domains is blocked.' };
  }

  // Direct IP checks (if hostname is an IP string)
  const isIpv4Literal = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  if (isIpv4Literal) {
    if (isPrivateOrReservedIPv4(hostname)) {
      logger.warn('Blocked direct private IPv4 address', 'SSRF_PROTECTION', { host: hostname });
      return { valid: false, error: 'Access to private or reserved IP addresses is prohibited.' };
    }
  }

  // IPv6 literal check
  if (hostname.startsWith('[') && hostname.endsWith(']')) {
    const rawV6 = hostname.slice(1, -1);
    if (isPrivateOrReservedIPv6(rawV6)) {
      logger.warn('Blocked direct private IPv6 address', 'SSRF_PROTECTION', { host: hostname });
      return { valid: false, error: 'Access to private or reserved IPv6 addresses is prohibited.' };
    }
  }

  // DNS pre-resolution SSRF check to prevent DNS rebinding or private hostname alias attacks
  try {
    const addresses = await dns.lookup(hostname, { all: true, verbatim: true });
    if (!addresses || addresses.length === 0) {
      return { valid: false, error: 'Could not resolve domain name.' };
    }

    for (const addr of addresses) {
      if (addr.family === 4) {
        if (isPrivateOrReservedIPv4(addr.address)) {
          logger.warn('Blocked domain resolving to private IPv4', 'SSRF_PROTECTION', {
            host: hostname,
            resolvedIp: addr.address,
          });
          return { valid: false, error: 'Domain resolves to a prohibited internal IP address.' };
        }
      } else if (addr.family === 6) {
        if (isPrivateOrReservedIPv6(addr.address)) {
          logger.warn('Blocked domain resolving to private IPv6', 'SSRF_PROTECTION', {
            host: hostname,
            resolvedIp: addr.address,
          });
          return { valid: false, error: 'Domain resolves to a prohibited internal IPv6 address.' };
        }
      }
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logger.warn('DNS lookup failed for URL', 'SSRF_PROTECTION', { host: hostname, error: errorMessage });
    return { valid: false, error: `Domain name resolution failed: ${hostname}` };
  }

  return {
    valid: true,
    sanitizedUrl: parsed.toString(),
    host: hostname,
  };
}
