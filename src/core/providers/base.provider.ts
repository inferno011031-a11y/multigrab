import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { SupportedPlatform, MediaMetadata, MediaFormat, DownloadJob } from '@/core/types/media';
import { SubprocessExecutor, ProgressCallback } from '@/core/process/executor';
import { TempStorageManager } from '@/core/storage/temp-storage';
import { sanitizeFilename } from '@/core/security/sanitize';
import { config } from '@/lib/config';
import { logger } from '@/lib/logger';

export abstract class BaseMediaProvider {
  abstract readonly platform: SupportedPlatform;
  abstract readonly name: string;
  abstract readonly supportedDomains: string[];

  /**
   * Checks if this provider is capable of processing the given URL.
   */
  public canHandle(rawUrl: string): boolean {
    try {
      const parsed = new URL(rawUrl);
      const hostname = parsed.hostname.toLowerCase();
      return this.supportedDomains.some(
        (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
      );
    } catch {
      return false;
    }
  }

  /**
   * Retrieves media metadata (title, author, duration, thumbnail, formats).
   */
  abstract getMetadata(url: string): Promise<MediaMetadata>;

  /**
   * Processes the media download for a given format and outputs the file to the job folder.
   */
  public async processDownload(
    url: string,
    formatId: string,
    jobId: string,
    onProgress?: ProgressCallback
  ): Promise<{ filePath: string; filename: string; mimeType: string; size: number }> {
    const jobDir = await TempStorageManager.getJobDirectory(jobId);
    const { cmd, baseArgs } = await SubprocessExecutor.getExtractorCommand();

    // Output template to place file directly inside isolated job folder
    const outputTemplate = path.join(jobDir, '%(title).100B-%(id)s.%(ext)s');

    const downloadArgs = [
      ...baseArgs,
      '--no-warnings',
      '--no-playlist',
      '--no-check-certificates',
      '--max-filesize',
      `${config.storage.maxFileSizeMb}M`,
      '--newline',
      '--extractor-args',
      'youtube:player_client=android,web',
      '-o',
      outputTemplate,
    ];

    // Format selection logic
    if (formatId === 'audio-mp3' || formatId === 'bestaudio') {
      downloadArgs.push('-f', 'ba/b', '-x', '--audio-format', 'mp3');
    } else if (formatId === 'audio-m4a') {
      downloadArgs.push('-f', 'ba[ext=m4a]/ba/b', '-x', '--audio-format', 'm4a');
    } else if (formatId === 'best' || !formatId) {
      downloadArgs.push('-f', 'b/bv*+ba/best');
    } else {
      // Direct format id first, then fallback to format+bestaudio, then best
      downloadArgs.push('-f', `${formatId}/${formatId}+ba/b/best`);
    }

    downloadArgs.push(url);

    logger.info(`Starting download job ${jobId} with format ${formatId}`, 'PROVIDER', {
      platform: this.platform,
    });

    await SubprocessExecutor.runRaw(cmd, downloadArgs, {
      cwd: jobDir,
      timeout: config.security.downloadTimeoutMs,
      onProgress,
    });

    // Locate the downloaded file
    const fileResult = await TempStorageManager.findJobFile(jobId);
    if (!fileResult) {
      throw new Error('Downloaded media file was not found in destination directory.');
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

  /**
   * Helper to format seconds into HH:MM:SS or MM:SS.
   */
  protected formatDuration(seconds?: number): string | undefined {
    if (!seconds || seconds <= 0) return undefined;
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const pad = (n: number) => n.toString().padStart(2, '0');
    if (hrs > 0) {
      return `${hrs}:${pad(mins)}:${pad(secs)}`;
    }
    return `${mins}:${pad(secs)}`;
  }

  /**
   * Returns a standard MIME type from filename extension.
   */
  protected getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase().replace('.', '');
    const mimeMap: Record<string, string> = {
      mp4: 'video/mp4',
      webm: 'video/webm',
      mkv: 'video/x-matroska',
      avi: 'video/x-msvideo',
      mov: 'video/quicktime',
      mp3: 'audio/mpeg',
      m4a: 'audio/mp4',
      ogg: 'audio/ogg',
      opus: 'audio/opus',
      wav: 'audio/wav',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
    };
    return mimeMap[ext] || 'application/octet-stream';
  }

  /**
   * Normalizes extractor JSON formats into standardized MediaFormat entries.
   */
  protected normalizeExtractorFormats(rawFormats: Array<Record<string, unknown>>): {
    video: MediaFormat[];
    audio: MediaFormat[];
    all: MediaFormat[];
  } {
    const all: MediaFormat[] = [];
    const videoMap = new Map<string, MediaFormat>();
    const audioList: MediaFormat[] = [];

    for (const f of rawFormats) {
      const formatId = String(f.format_id || '');
      if (!formatId) continue;

      const vcodec = String(f.vcodec || 'none');
      const acodec = String(f.acodec || 'none');
      const ext = String(f.ext || 'mp4');
      const width = typeof f.width === 'number' ? f.width : undefined;
      const height = typeof f.height === 'number' ? f.height : undefined;
      const fps = typeof f.fps === 'number' ? f.fps : undefined;
      const filesize = typeof f.filesize === 'number' ? f.filesize : undefined;
      const filesizeApprox = typeof f.filesize_approx === 'number' ? f.filesize_approx : undefined;
      const tbr = typeof f.tbr === 'number' ? f.tbr : undefined;
      const formatNote = typeof f.format_note === 'string' ? f.format_note : undefined;

      const isAudioOnly = vcodec === 'none' && acodec !== 'none';
      const isVideoOnly = acodec === 'none' && vcodec !== 'none';
      const hasVideo = vcodec !== 'none';
      const hasAudio = acodec !== 'none';

      let qualityLabel = '';
      let resolution = '';

      if (height) {
        resolution = width ? `${width}x${height}` : `${height}p`;
        qualityLabel = `${height}p`;
        if (fps && fps > 30) qualityLabel += `${fps}`;
      } else if (isAudioOnly) {
        const abr = typeof f.abr === 'number' ? Math.round(f.abr) : Math.round(tbr || 128);
        qualityLabel = `${abr} kbps (${ext.toUpperCase()})`;
      } else {
        qualityLabel = formatNote || ext.toUpperCase();
      }

      const formatItem: MediaFormat = {
        formatId,
        ext,
        resolution,
        qualityLabel,
        width,
        height,
        fps,
        vcodec: vcodec !== 'none' ? vcodec : undefined,
        acodec: acodec !== 'none' ? acodec : undefined,
        filesize,
        filesizeApprox,
        isAudioOnly,
        isVideoOnly,
        hasVideo,
        hasAudio,
        formatNote,
        tbr,
      };

      all.push(formatItem);

      if (isAudioOnly) {
        audioList.push(formatItem);
      } else if (hasVideo && height && height >= 144) {
        // Group video formats by height, preferring MP4 / standard codecs
        const key = `${height}p`;
        const existing = videoMap.get(key);
        if (!existing || (ext === 'mp4' && existing.ext !== 'mp4') || (tbr && existing.tbr && tbr > existing.tbr)) {
          videoMap.set(key, formatItem);
        }
      }
    }

    // Sort video by height descending (e.g., 2160p -> 1080p -> 720p -> 480p -> 360p)
    const sortedVideo = Array.from(videoMap.values()).sort((a, b) => (b.height || 0) - (a.height || 0));

    // Sort audio by bitrate descending
    const sortedAudio = audioList.sort((a, b) => (b.tbr || 0) - (a.tbr || 0));

    // Ensure we always have sensible options
    if (sortedVideo.length === 0) {
      sortedVideo.push({
        formatId: 'best',
        ext: 'mp4',
        qualityLabel: 'Best Video Quality',
        isAudioOnly: false,
        isVideoOnly: false,
        hasVideo: true,
        hasAudio: true,
      });
    }

    // Add generic high-quality MP3 audio converter option
    sortedAudio.unshift({
      formatId: 'audio-mp3',
      ext: 'mp3',
      qualityLabel: 'High Quality MP3 (Audio)',
      isAudioOnly: true,
      isVideoOnly: false,
      hasVideo: false,
      hasAudio: true,
    });

    return { video: sortedVideo, audio: sortedAudio, all };
  }
}
