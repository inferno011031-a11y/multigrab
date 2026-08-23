import { MediaMetadata } from '@/core/types/media';

interface CacheEntry {
  metadata: MediaMetadata;
  expiresAt: number;
}

export class MetadataCache {
  private static cache = new Map<string, CacheEntry>();
  private static readonly DEFAULT_TTL_MS = 10 * 60 * 1000; // 10 minutes cache
  private static readonly MAX_ENTRIES = 500;

  public static get(url: string): MediaMetadata | null {
    const key = MetadataCache.normalizeKey(url);
    const entry = MetadataCache.cache.get(key);

    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      MetadataCache.cache.delete(key);
      return null;
    }

    return entry.metadata;
  }

  public static set(url: string, metadata: MediaMetadata, ttlMs = MetadataCache.DEFAULT_TTL_MS): void {
    const key = MetadataCache.normalizeKey(url);

    // Evict oldest if reaching capacity
    if (MetadataCache.cache.size >= MetadataCache.MAX_ENTRIES) {
      const firstKey = MetadataCache.cache.keys().next().value;
      if (firstKey) MetadataCache.cache.delete(firstKey);
    }

    MetadataCache.cache.set(key, {
      metadata,
      expiresAt: Date.now() + ttlMs,
    });
  }

  public static clear(): void {
    MetadataCache.cache.clear();
  }

  private static normalizeKey(url: string): string {
    try {
      const parsed = new URL(url.trim());
      // Strip tracking query params
      ['utm_source', 'utm_medium', 'utm_campaign', 'si', 'ref', 'feature'].forEach((p) =>
        parsed.searchParams.delete(p)
      );
      return parsed.toString().toLowerCase();
    } catch {
      return url.trim().toLowerCase();
    }
  }
}
