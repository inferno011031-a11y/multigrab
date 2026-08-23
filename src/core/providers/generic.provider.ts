import { BaseMediaProvider } from './base.provider';
import { MediaMetadata, SupportedPlatform } from '@/core/types/media';
import { SubprocessExecutor } from '@/core/process/executor';
import { logger } from '@/lib/logger';

export class GenericMediaProvider extends BaseMediaProvider {
  readonly platform: SupportedPlatform = 'generic';
  readonly name: string = 'Direct Media & Web';
  readonly supportedDomains: string[] = ['*'];

  public override canHandle(rawUrl: string): boolean {
    try {
      const parsed = new URL(rawUrl);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  public async getMetadata(url: string): Promise<MediaMetadata> {
    logger.info(`Fetching metadata via Generic provider for URL: ${url}`, 'GENERIC_PROVIDER');

    const raw = await SubprocessExecutor.extractJson(url);

    const id = String(raw.id || 'media');
    const title = String(raw.title || 'Direct Web Media');
    const description = typeof raw.description === 'string' ? raw.description : undefined;
    const author = String(raw.uploader || 'Web Host');
    const duration = typeof raw.duration === 'number' ? raw.duration : undefined;
    const thumbnail = typeof raw.thumbnail === 'string' ? raw.thumbnail : undefined;

    const rawFormats = Array.isArray(raw.formats) ? (raw.formats as Array<Record<string, unknown>>) : [];
    const normalized = this.normalizeExtractorFormats(rawFormats, duration);

    return {
      id,
      originalUrl: url,
      canonicalUrl: url,
      platform: this.platform,
      platformName: this.name,
      title,
      description,
      author,
      duration,
      durationFormatted: this.formatDuration(duration),
      thumbnail,
      formats: normalized.all,
      availableQualities: {
        video: normalized.video,
        audio: normalized.audio,
      },
    };
  }
}
