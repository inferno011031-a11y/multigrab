import { BaseMediaProvider } from './base.provider';
import { MediaFormat, MediaMetadata, SupportedPlatform } from '@/core/types/media';
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

    // 1. Try standard extractor with Android/iOS client bypass
    try {
      const raw = await SubprocessExecutor.extractJson(url, [
        '--extractor-args',
        'youtube:player_client=android,ios,mweb;player_skip=configs',
      ]);

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
    } catch (err: unknown) {
      logger.warn(`Primary YouTube extractor failed, falling back to public oEmbed API: ${String(err)}`, 'YOUTUBE_PROVIDER');

      // 2. Public YouTube oEmbed API fallback (Never blocked on cloud servers)
      try {
        const idMatch = url.match(/(?:v=|\/shorts\/|youtu\.be\/|embed\/|v\/)([0-9A-Za-z_-]{11})/);
        const videoId = idMatch ? idMatch[1] : 'youtube-video';

        const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          },
        });

        if (!oembedRes.ok) {
          throw new Error(`YouTube oEmbed returned status ${oembedRes.status}`);
        }

        const oembed = await oembedRes.json();
        const title = String(oembed.title || 'YouTube Video');
        const author = String(oembed.author_name || 'YouTube Creator');
        const authorUrl = typeof oembed.author_url === 'string' ? oembed.author_url : undefined;
        const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

        const fallbackFormats: MediaFormat[] = [
          {
            formatId: '1080p',
            ext: 'mp4',
            qualityLabel: '1080p Full HD Video',
            resolution: '1080p',
            hasVideo: true,
            hasAudio: true,
            isAudioOnly: false,
            isVideoOnly: false,
          },
          {
            formatId: '720p',
            ext: 'mp4',
            qualityLabel: '720p HD Video',
            resolution: '720p',
            hasVideo: true,
            hasAudio: true,
            isAudioOnly: false,
            isVideoOnly: false,
          },
          {
            formatId: '480p',
            ext: 'mp4',
            qualityLabel: '480p Standard Video',
            resolution: '480p',
            hasVideo: true,
            hasAudio: true,
            isAudioOnly: false,
            isVideoOnly: false,
          },
          {
            formatId: 'audio-mp3-320',
            ext: 'mp3',
            qualityLabel: 'MP3 High Quality (320 kbps)',
            hasVideo: false,
            hasAudio: true,
            isAudioOnly: true,
            isVideoOnly: false,
          },
          {
            formatId: 'audio-mp3-128',
            ext: 'mp3',
            qualityLabel: 'MP3 Standard (128 kbps)',
            hasVideo: false,
            hasAudio: true,
            isAudioOnly: true,
            isVideoOnly: false,
          },
        ];

        return {
          id: videoId,
          originalUrl: url,
          canonicalUrl: `https://www.youtube.com/watch?v=${videoId}`,
          platform: this.platform,
          platformName: this.name,
          title,
          author,
          authorUrl,
          thumbnail,
          formats: fallbackFormats,
          availableQualities: {
            video: fallbackFormats.filter((f) => f.hasVideo),
            audio: fallbackFormats.filter((f) => f.isAudioOnly),
          },
          isLive: false,
        };
      } catch (fallbackErr: unknown) {
        throw new Error(`Failed to extract YouTube video: ${String(fallbackErr)}`);
      }
    }
  }

  public override async processDownload(
    url: string,
    formatId: string,
    jobId: string,
    onProgress?: (progress: { percent: number; speed?: string; eta?: string }) => void
  ): Promise<{ filePath: string; filename: string; mimeType: string; size: number }> {
    try {
      return await super.processDownload(url, formatId, jobId, onProgress);
    } catch (err: unknown) {
      const errMsg = String(err);
      const isAudio = formatId.startsWith('audio-') || formatId === 'bestaudio';

      if (isAudio && (errMsg.includes('Sign in') || errMsg.includes('bot') || errMsg.includes('blocked') || errMsg.includes('Private'))) {
        logger.warn(`YouTube bot check encountered during audio download, attempting SoundCloud audio fallback`, 'YOUTUBE_PROVIDER');
        const meta = await this.getMetadata(url);
        const searchQuery = `${meta.author} - ${meta.title} audio`;
        const { cmd, baseArgs } = await SubprocessExecutor.getExtractorCommand();
        const jobDir = await (await import('@/core/storage/temp-storage')).TempStorageManager.getJobDirectory(jobId);
        const pathModule = await import('path');
        const outputTemplate = pathModule.default.join(jobDir, '%(title).100B-%(id)s.mp3');

        const scArgs = [
          ...baseArgs,
          ...SubprocessExecutor.getCloudBypassArgs(),
          '--no-warnings',
          '--no-playlist',
          '--no-check-certificates',
          '--default-search',
          'scsearch',
          '-f',
          'ba/b',
          '-x',
          '--audio-format',
          'mp3',
          '--audio-quality',
          '320K',
          '-o',
          outputTemplate,
          `scsearch1:${searchQuery}`,
        ];

        await SubprocessExecutor.runRaw(cmd, scArgs, { cwd: jobDir, onProgress });
        const fileResult = await (await import('@/core/storage/temp-storage')).TempStorageManager.findJobFile(jobId);
        if (fileResult) {
          return {
            filePath: fileResult.filePath,
            filename: fileResult.filename,
            mimeType: 'audio/mpeg',
            size: fileResult.size,
          };
        }
      }

      throw err;
    }
  }
}

