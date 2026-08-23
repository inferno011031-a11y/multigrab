import { BaseMediaProvider } from './base.provider';
import { MediaMetadata, SupportedPlatform } from '@/core/types/media';
import { SubprocessExecutor } from '@/core/process/executor';
import { logger } from '@/lib/logger';

export class YouTubeProvider extends BaseMediaProvider {
  readonly platform: SupportedPlatform = 'youtube';
  readonly name: string = 'YouTube';
  readonly supportedDomains: string[] = [
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
    'youtu.be',
    'music.youtube.com',
  ];

  public async getMetadata(url: string): Promise<MediaMetadata> {
    logger.info(`Fetching metadata for YouTube URL`, 'YOUTUBE_PROVIDER');

    const raw = await SubprocessExecutor.extractJson(url);

    const id = String(raw.id || '');
    const title = String(raw.title || 'YouTube Video');
    const description = typeof raw.description === 'string' ? raw.description : undefined;
    const author = String(raw.uploader || raw.channel || 'YouTube Creator');
    const authorUrl = typeof raw.uploader_url === 'string' ? raw.uploader_url : undefined;
    const duration = typeof raw.duration === 'number' ? raw.duration : undefined;
    const thumbnail = String(raw.thumbnail || '');
    const viewCount = typeof raw.view_count === 'number' ? raw.view_count : undefined;
    const likeCount = typeof raw.like_count === 'number' ? raw.like_count : undefined;
    const uploadDate = typeof raw.upload_date === 'string' ? raw.upload_date : undefined;

    const rawFormats = Array.isArray(raw.formats) ? (raw.formats as Array<Record<string, unknown>>) : [];
    const normalized = this.normalizeExtractorFormats(rawFormats, duration);

    return {
      id,
      originalUrl: url,
      canonicalUrl: `https://www.youtube.com/watch?v=${id}`,
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
      uploadDate,
      formats: normalized.all,
      availableQualities: {
        video: normalized.video,
        audio: normalized.audio,
      },
      isLive: Boolean(raw.is_live),
    };
  }
}
