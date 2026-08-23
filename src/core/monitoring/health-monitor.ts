import { providerRegistry } from '@/core/providers/registry';
import { SupportedPlatform } from '@/core/types/media';
import { logger } from '@/lib/logger';

export interface ProviderHealthReport {
  platform: SupportedPlatform;
  name: string;
  status: 'operational' | 'degraded' | 'down';
  latencyMs: number;
  lastChecked: number;
  error?: string;
}

export class HealthMonitor {
  private static reports = new Map<SupportedPlatform, ProviderHealthReport>();
  private static isProbing = false;
  private static lastProbeTime = 0;
  private static readonly PROBE_CACHE_TTL_MS = 60 * 1000; // 1 minute probe cache

  private static probeTargets: Record<SupportedPlatform, string | null> = {
    youtube: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    spotify: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
    tiktok: 'https://www.tiktok.com/@tiktok/video/7106594312292453678',
    instagram: 'https://www.instagram.com/reel/C123456789/',
    twitter: 'https://x.com/Interior/status/463440424141459456',
    facebook: 'https://www.facebook.com/watch/?v=123456789',
    reddit: 'https://www.reddit.com/r/videos/comments/6x9y1x/test/',
    pinterest: 'https://www.pinterest.com/pin/123456789/',
    vimeo: 'https://vimeo.com/76979871',
    generic: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  };

  public static async checkAllProviders(force = false): Promise<ProviderHealthReport[]> {
    const now = Date.now();
    if (!force && HealthMonitor.reports.size > 0 && now - HealthMonitor.lastProbeTime < HealthMonitor.PROBE_CACHE_TTL_MS) {
      return Array.from(HealthMonitor.reports.values());
    }

    if (HealthMonitor.isProbing) {
      return Array.from(HealthMonitor.reports.values());
    }

    HealthMonitor.isProbing = true;
    const platformsInfo = providerRegistry.getSupportedPlatformsInfo();

    for (const info of platformsInfo) {
      const platform = info.id;
      const targetUrl = HealthMonitor.probeTargets[platform];
      const provider = providerRegistry.getByPlatform(platform);

      if (!provider || !targetUrl) {
        HealthMonitor.reports.set(platform, {
          platform,
          name: info.name,
          status: 'operational',
          latencyMs: 1,
          lastChecked: now,
        });
        continue;
      }

      const start = Date.now();
      try {
        const metadata = await provider.getMetadata(targetUrl);
        const latency = Date.now() - start;

        HealthMonitor.reports.set(platform, {
          platform,
          name: info.name,
          status: metadata.formats.length > 0 ? 'operational' : 'degraded',
          latencyMs: latency,
          lastChecked: Date.now(),
        });
      } catch (err: unknown) {
        const latency = Date.now() - start;
        const errMsg = err instanceof Error ? err.message : String(err);
        logger.warn(`Provider health probe failed for ${platform}: ${errMsg}`, 'HEALTH_MONITOR');

        HealthMonitor.reports.set(platform, {
          platform,
          name: info.name,
          status: 'degraded',
          latencyMs: latency,
          lastChecked: Date.now(),
          error: errMsg.slice(0, 100),
        });
      }
    }

    HealthMonitor.lastProbeTime = Date.now();
    HealthMonitor.isProbing = false;

    return Array.from(HealthMonitor.reports.values());
  }
}
