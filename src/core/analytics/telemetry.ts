import { SupportedPlatform } from '@/core/types/media';

interface PlatformStats {
  analyses: number;
  downloads: number;
}

export class TelemetryTracker {
  private static platformCounts: Record<string, PlatformStats> = {
    youtube: { analyses: 0, downloads: 0 },
    spotify: { analyses: 0, downloads: 0 },
    tiktok: { analyses: 0, downloads: 0 },
    instagram: { analyses: 0, downloads: 0 },
    twitter: { analyses: 0, downloads: 0 },
    facebook: { analyses: 0, downloads: 0 },
    reddit: { analyses: 0, downloads: 0 },
    pinterest: { analyses: 0, downloads: 0 },
    vimeo: { analyses: 0, downloads: 0 },
    generic: { analyses: 0, downloads: 0 },
  };

  private static totalAnalyses = 0;
  private static totalDownloads = 0;
  private static startedAt = Date.now();

  public static recordAnalysis(platform: SupportedPlatform): void {
    TelemetryTracker.totalAnalyses++;
    if (!TelemetryTracker.platformCounts[platform]) {
      TelemetryTracker.platformCounts[platform] = { analyses: 0, downloads: 0 };
    }
    TelemetryTracker.platformCounts[platform].analyses++;
  }

  public static recordDownload(platform: SupportedPlatform): void {
    TelemetryTracker.totalDownloads++;
    if (!TelemetryTracker.platformCounts[platform]) {
      TelemetryTracker.platformCounts[platform] = { analyses: 0, downloads: 0 };
    }
    TelemetryTracker.platformCounts[platform].downloads++;
  }

  public static getStats() {
    return {
      totalAnalyses: TelemetryTracker.totalAnalyses,
      totalDownloads: TelemetryTracker.totalDownloads,
      uptimeSeconds: Math.floor((Date.now() - TelemetryTracker.startedAt) / 1000),
      byPlatform: TelemetryTracker.platformCounts,
    };
  }
}
