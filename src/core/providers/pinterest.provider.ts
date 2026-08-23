import { BaseMediaProvider } from './base.provider';
import { MediaMetadata, SupportedPlatform } from '@/core/types/media';
import { SubprocessExecutor } from '@/core/process/executor';
import { logger } from '@/lib/logger';

export class PinterestProvider extends BaseMediaProvider {
  readonly platform: SupportedPlatform = 'pinterest';
  readonly name: string = 'Pinterest';
  readonly supportedDomains: string[] = [
    'pinterest.com',
    'www.pinterest.com',
    'pin.it',
    'pinterest.co.uk',
  ];

  public async getMetadata(url: string): Promise<MediaMetadata> {
    logger.info(`Fetching metadata for Pinterest URL`, 'PINTEREST_PROVIDER');

    const raw = await SubprocessExecutor.extractJson(url);

    const id = String(raw.id || '');
    const title = String(raw.title || raw.description || 'Pinterest Pin');
    const description = typeof raw.description === 'string' ? raw.description : undefined;
    const author = String(raw.uploader || 'Pinterest Creator');
    const authorUrl = typeof raw.uploader_url === 'string' ? raw.uploader_url : undefined;
    const duration = typeof raw.duration === 'number' ? raw.duration : undefined;
    const thumbnail = String(raw.thumbnail || '');
    const viewCount = typeof raw.view_count === 'number' ? raw.view_count : undefined;
    const likeCount = typeof raw.like_count === 'number' ? raw.like_count : undefined;

    const rawFormats = Array.isArray(raw.formats) ? (raw.formats as Array<Record<string, unknown>>) : [];
    const normalized = this.normalizeExtractorFormats(rawFormats);

    return {
      id,
      originalUrl: url,
      canonicalUrl: url,
      platform: this.platform,
      platformName: this.name,
      title,
      description,
      author,
      authorUrl,
      duration,
      durationFormatted: this.formatDuration(duration),
      thumbnail,
      viewCount,
      likeCount,
      formats: normalized.all,
      availableQualities: {
        video: normalized.video,
        audio: normalized.audio,
      },
    };
  }
}
