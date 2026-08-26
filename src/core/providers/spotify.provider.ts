import path from 'path';
import { BaseMediaProvider } from './base.provider';
import { MediaMetadata, SupportedPlatform, MediaFormat } from '@/core/types/media';
import { SubprocessExecutor, ProgressCallback } from '@/core/process/executor';
import { TempStorageManager } from '@/core/storage/temp-storage';
import { config } from '@/lib/config';
import { logger } from '@/lib/logger';

interface SpotifyTrackDetails {
  title: string;
  artist: string;
  thumbnail: string;
  searchQuery: string;
}

export class SpotifyProvider extends BaseMediaProvider {
  readonly platform: SupportedPlatform = 'spotify';
  readonly name: string = 'Spotify';
  readonly supportedDomains: string[] = [
    'spotify.com',
    'open.spotify.com',
    'spotify.link',
  ];

  /**
   * Cleans and normalizes Spotify track URLs by stripping tracking parameters.
   */
  private cleanUrl(rawUrl: string): string {
    try {
      const u = new URL(rawUrl);
      u.search = '';
      return u.toString();
    } catch {
      return rawUrl;
    }
  }

  /**
   * Fetches and parses Spotify metadata via open.spotify.com HTML and oEmbed API.
   */
  private async extractSpotifyInfo(url: string): Promise<SpotifyTrackDetails> {
    const cleanedUrl = this.cleanUrl(url);
    let title = '';
    let artist = '';
    let thumbnail = '';

    // 1. Try Spotify oEmbed first
    try {
      const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(cleanedUrl)}`;
      const res = await fetch(oembedUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/json',
        },
      });

      if (res.ok) {
        const data = (await res.json()) as { title?: string; thumbnail_url?: string };
        if (data.title) {
          title = data.title;
        }
        if (data.thumbnail_url) {
          thumbnail = data.thumbnail_url;
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      logger.warn(`Spotify oEmbed failed: ${errorMessage}`, 'SPOTIFY_PROVIDER');
    }

    // 2. Fetch Spotify HTML to extract artist name & precise metadata
    try {
      const pageRes = await fetch(cleanedUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });

      if (pageRes.ok) {
        const html = await pageRes.text();

        // Extract <title> e.g. "Song Name - song and lyrics by Artist | Spotify"
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
          const rawTitleText = titleMatch[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"');
          const byArtistMatch = rawTitleText.match(/^(.*?)\s*-\s*(?:song and lyrics by|song by|track by)\s*(.*?)(?:\s*\|\s*Spotify|$)/i);
          if (byArtistMatch) {
            if (!title) title = byArtistMatch[1].trim();
            if (!artist) artist = byArtistMatch[2].trim();
          } else {
            const pipeSplit = rawTitleText.replace(/\s*\|\s*Spotify\s*$/i, '').split(' - ');
            if (pipeSplit.length >= 2) {
              if (!title) title = pipeSplit[0].trim();
              if (!artist) artist = pipeSplit[1].trim();
            } else if (!title) {
              title = pipeSplit[0].trim();
            }
          }
        }

        // Extract OpenGraph og:title
        if (!title) {
          const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i);
          if (ogTitleMatch && ogTitleMatch[1]) {
            title = ogTitleMatch[1].replace(/&amp;/g, '&');
          }
        }

        // Extract OpenGraph og:description (e.g. "Artist · Song · 2022")
        if (!artist) {
          const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i);
          if (ogDescMatch && ogDescMatch[1]) {
            const parts = ogDescMatch[1].split('·').map((p) => p.trim());
            if (parts.length > 0 && parts[0]) {
              artist = parts[0];
            }
          }
        }

        // Extract OpenGraph og:image
        if (!thumbnail) {
          const ogImgMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i);
          if (ogImgMatch && ogImgMatch[1]) {
            thumbnail = ogImgMatch[1];
          }
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      logger.warn(`Spotify HTML scraping fallback failed: ${errorMessage}`, 'SPOTIFY_PROVIDER');
    }

    // Fallback if title still empty
    if (!title) {
      const pathParts = new URL(cleanedUrl).pathname.split('/').filter(Boolean);
      title = pathParts[pathParts.length - 1] || 'Spotify Track';
    }

    if (!artist) {
      artist = 'Spotify Artist';
    }

    const searchQuery = artist && artist !== 'Spotify Artist'
      ? `${artist} - ${title} audio`
      : `${title} audio`;

    return {
      title,
      artist,
      thumbnail,
      searchQuery,
    };
  }

  /**
   * Fetches public track metadata via Spotify oEmbed and matches public audio stream.
   */
  public async getMetadata(url: string): Promise<MediaMetadata> {
    logger.info(`Fetching Spotify metadata for URL`, 'SPOTIFY_PROVIDER', { url });

    const info = await this.extractSpotifyInfo(url);
    let trackTitle = info.title;
    let trackArtist = info.artist;
    let thumbnail = info.thumbnail;
    let duration: number | undefined;
    let matchedId = 'spotify-track';

    try {
      const searchTarget = `ytsearch1:${info.searchQuery}`;
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
      if (trackArtist === 'Spotify Artist' && typeof entry.uploader === 'string') {
        trackArtist = entry.uploader;
      }
    } catch {
      // Fallback: SoundCloud search (unrestricted on cloud datacenters)
      try {
        const scTarget = `scsearch1:${info.searchQuery}`;
        const scData = await SubprocessExecutor.extractJson(scTarget, ['--default-search', 'scsearch']);
        const scEntry = Array.isArray(scData.entries) && scData.entries[0]
          ? (scData.entries[0] as Record<string, unknown>)
          : scData;

        if (typeof scEntry.duration === 'number') {
          duration = scEntry.duration;
        }
        if (scEntry.id) {
          matchedId = String(scEntry.id);
        }
        if (!thumbnail && typeof scEntry.thumbnail === 'string') {
          thumbnail = scEntry.thumbnail;
        }
      } catch (scErr: unknown) {
        const errorMessage = scErr instanceof Error ? scErr.message : String(scErr);
        logger.warn(`Could not match public audio for Spotify search: ${errorMessage}`, 'SPOTIFY_PROVIDER');
      }
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
      title: trackArtist && trackArtist !== 'Spotify Artist' ? `${trackArtist} - ${trackTitle}` : trackTitle,
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

    // 1. Extract accurate search query for audio matching
    const info = await this.extractSpotifyInfo(url);
    const query = `ytsearch1:${info.searchQuery}`;

    const outputTemplate = path.join(jobDir, '%(title).100B-%(id)s.%(ext)s');

    const downloadArgs = [
      ...baseArgs,
      ...SubprocessExecutor.getCloudBypassArgs(),
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
      downloadArgs.push('--embed-metadata');
      downloadArgs.push('--embed-thumbnail');
    }

    if (formatId === 'audio-mp3-320' || formatId === 'audio-mp3') {
      downloadArgs.push('-f', 'ba/b', '-x', '--audio-format', 'mp3', '--audio-quality', '320K');
    } else if (formatId === 'audio-mp3-128') {
      downloadArgs.push('-f', 'ba/b', '-x', '--audio-format', 'mp3', '--audio-quality', '128K');
    } else if (formatId === 'audio-m4a') {
      downloadArgs.push('-f', 'ba[ext=m4a]/ba/b', '-x', '--audio-format', 'm4a');
    } else {
      downloadArgs.push('-f', 'ba/b', '-x', '--audio-format', 'mp3', '--audio-quality', '320K');
    }

    downloadArgs.push(query);

    logger.info(`Starting Spotify audio match download via ${cmd}`, 'SPOTIFY_PROVIDER', { query });

    try {
      await SubprocessExecutor.runRaw(cmd, downloadArgs, {
        cwd: jobDir,
        timeout: config.security.downloadTimeoutMs,
        onProgress,
      });
    } catch (err: unknown) {
      const errMsg = String(err);
      if (errMsg.includes('Sign in to confirm') || errMsg.includes('bot') || errMsg.includes('blocked')) {
        logger.warn(`YouTube bot check encountered, retrying Spotify audio match via SoundCloud`, 'SPOTIFY_PROVIDER');
        const scQuery = `scsearch1:${info.searchQuery}`;
        const scArgs = downloadArgs.map((arg) => (arg === query ? scQuery : arg));
        await SubprocessExecutor.runRaw(cmd, scArgs, {
          cwd: jobDir,
          timeout: config.security.downloadTimeoutMs,
          onProgress,
        });
      } else {
        throw err;
      }
    }

    const fileResult = await TempStorageManager.findJobFile(jobId);
    if (!fileResult) {
      throw new Error('Spotify audio file was not created. Please try another quality.');
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
