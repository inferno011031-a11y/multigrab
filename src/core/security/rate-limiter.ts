import { config } from '@/lib/config';
import { logger } from '@/lib/logger';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class InMemoryRateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor() {
    // Periodic garbage collection for expired entries
    if (typeof setInterval !== 'undefined') {
      this.cleanupTimer = setInterval(() => this.cleanup(), 60000);
      if (this.cleanupTimer.unref) this.cleanupTimer.unref();
    }
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetAt) {
        this.store.delete(key);
      }
    }
  }

  public check(
    key: string,
    limit: number = config.security.rateLimitMax,
    windowSec: number = config.security.rateLimitWindowSec
  ): { allowed: boolean; remaining: number; resetInSec: number } {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetAt) {
      const resetAt = now + windowSec * 1000;
      this.store.set(key, { count: 1, resetAt });
      return { allowed: true, remaining: limit - 1, resetInSec: windowSec };
    }

    if (entry.count >= limit) {
      const resetInSec = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
      logger.warn(`Rate limit exceeded for key: ${key}`, 'RATE_LIMITER', { limit, resetInSec });
      return { allowed: false, remaining: 0, resetInSec };
    }

    entry.count += 1;
    const remaining = Math.max(0, limit - entry.count);
    const resetInSec = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    return { allowed: true, remaining, resetInSec };
  }
}

export const rateLimiter = new InMemoryRateLimiter();

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded.split(',');
    return parts[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}
