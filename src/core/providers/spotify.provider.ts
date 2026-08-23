import path from 'path';
import { BaseMediaProvider } from './base.provider';
import { MediaMetadata, SupportedPlatform, MediaFormat } from '@/core/types/media';
import { SubprocessExecutor, ProgressCallback } from '@/core/process/executor';
import { TempStorageManager } from '@/core/storage/temp-storage';
import { config } from '@/lib/config';
import { logger } from '@/lib/logger';

export class SpotifyProvider extends BaseMediaProvider {
  readonly platform: SupportedPlatform = 'spotify';
  readonly name: string = 'Spotify';
  readonly supportedDomains: string[] = [
    'spotify.com',
    'open.spotify.com',
    'spotify.link',
  ];

  /**
   * Fetches public track metadata via Spotify oEmbed and matches public audio stream.
   */
  public async getMetadata(url: string): Promise<MediaMetadata> {
    logger.info(`Fetching Spotify metadata for URL`, 'SPOTIFY_PROVIDER', { url });

    let trackTitle = 'Spotify Track';
    let trackArtist = 'Spotify Artist';
    let thumbnail = '';

    try {
      const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`;
      const res = await fetch(oembedUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MediaDrop/1.0)' },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.title) trackTitle = data.title;
        if (data.thumbnail_url) thumbnail = data.thumbnail_url;
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      logger.warn(`Spotify oEmbed metadata fetch fallback: ${errorMessage}`, 'SPOTIFY_PROVIDER');
    }

    // Match audio stream via search
    let duration: number | undefined;
    let matchedId = 'spotify-track';

    try {
      const searchTarget = `ytsearch1:${trackTitle} audio`;
      const searchData = await SubprocessExecutor.extractJson(searchTarget, ['--default-search', 'ytsearch']);
      const entry = Array.isArray(searchData.entries) && searchData.entries[0]
        ? (searchData.entries[0] as Record<string, unknown>)
        : searchData;

      if (typeof entry.duration === 'number') {
        duration = entry.duration;
      }
      if (entry.id) {
        matchedId = String(entry.id);
      }
      if (!thumbnail && typeof entry.thumbnail === 'string') {
        thumbnail = entry.thumbnail;
      }
      if (typeof entry.uploader === 'string') {
        trackArtist = entry.uploader;
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      logger.warn(`Could not match public audio for Spotify search: ${errorMessage}`, 'SPOTIFY_PROVIDER');
    }

    const curatedAudio: MediaFormat[] = [
      {
        formatId: 'audio-mp3-320',
        ext: 'mp3',
        qualityLabel: 'MP3 High Quality (320 kbps)',
        isAudioOnly: true,
        isVideoOnly: false,
        hasVideo: false,
        hasAudio: true,
        filesize: duration ? Math.round((320 * 1024 * duration) / 8) : undefined,
      },
      {
        formatId: 'audio-mp3-128',
        ext: 'mp3',
        qualityLabel: 'MP3 Standard (128 kbps)',
        isAudioOnly: true,
        isVideoOnly: false,
        hasVideo: false,
        hasAudio: true,
        filesize: duration ? Math.round((128 * 1024 * duration) / 8) : undefined,
      },
      {
        formatId: 'audio-m4a',
        ext: 'm4a',
        qualityLabel: 'M4A / AAC Audio Stream',
        isAudioOnly: true,
        isVideoOnly: false,
        hasVideo: false,
        hasAudio: true,
        filesize: duration ? Math.round((192 * 1024 * duration) / 8) : undefined,
      },
      {
        formatId: 'bestaudio',
        ext: 'mp3',
        qualityLabel: 'Original Best Audio Track',
        isAudioOnly: true,
        isVideoOnly: false,
        hasVideo: false,
        hasAudio: true,
      },
    ];

    return {
      id: matchedId,
      originalUrl: url,
      canonicalUrl: url,
      platform: this.platform,
      platformName: this.name,
      title: trackTitle,
      author: trackArtist,
      duration,
      durationFormatted: this.formatDuration(duration),
      thumbnail,
      formats: curatedAudio,
      availableQualities: {
        video: [],
        audio: curatedAudio,
      },
    };
  }

  /**
   * Processes Spotify audio download by matching and extracting audio.
   */
  public override async processDownload(
    url: string,
    formatId: string,
    jobId: string,
    onProgress?: ProgressCallback
  ): Promise<{ filePath: string; filename: string; mimeType: string; size: number }> {
    const jobDir = await TempStorageManager.getJobDirectory(jobId);
    const { cmd, baseArgs } = await SubprocessExecutor.getExtractorCommand();
    const ffmpegPath = await SubprocessExecutor.getFfmpegPath();

    // 1. Get track title from metadata
    let query = url;
    try {
      const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`;
      const res = await fetch(oembedUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.title) {
          query = `ytsearch1:${data.title} audio`;
        }
      }
    } catch {}

    const outputTemplate = path.join(jobDir, '%(title).100B-%(id)s.%(ext)s');

    const downloadArgs = [
      ...baseArgs,
      '--no-warnings',
      '--no-playlist',
      '--no-check-certificates',
      '--default-search',
      'ytsearch',
      '--max-filesize',
      `${config.storage.maxFileSizeMb}M`,
      '--newline',
      '-o',
      outputTemplate,
    ];

    if (ffmpegPath) {
      downloadArgs.push('--ffmpeg-location', ffmpegPath);
    }

    if (formatId === 'audio-mp3-320' || formatId === 'audio-mp3') {
      downloadArgs.push('-f', 'ba/b', '-x', '--audio-format', 'mp3', '--audio-quality', '320K');
    } else if (formatId === 'audio-mp3-128') {
      downloadArgs.push('-f', 'ba/b', '-x', '--audio-format', 'mp3', '--audio-quality', '128K');
    } else if (formatId === 'audio-m4a') {
      downloadArgs.push('-f', 'ba[ext=m4a]/ba/b', '-x', '--audio-format', 'm4a');
    } else {
      downloadArgs.push('-f', 'ba/b', '-x', '--audio-format', 'mp3', '--audio-quality', '0');
    }

    downloadArgs.push(query);

    logger.info(`Starting Spotify audio download for ${jobId}`, 'SPOTIFY_PROVIDER', { query });

    await SubprocessExecutor.runRaw(cmd, downloadArgs, {
      cwd: jobDir,
      timeout: config.security.downloadTimeoutMs,
      onProgress,
    });

    const fileResult = await TempStorageManager.findJobFile(jobId);
    if (!fileResult) {
      throw new Error('Spotify audio file was not created.');
    }

    const mimeType = this.getMimeType(fileResult.filename);

    await TempStorageManager.saveJobMetadata(jobId, {
      filename: fileResult.filename,
      mimeType,
      fileSize: fileResult.size,
      createdAt: Date.now(),
    });

    return {
      filePath: fileResult.filePath,
      filename: fileResult.filename,
      mimeType,
      size: fileResult.size,
    };
  }
}
