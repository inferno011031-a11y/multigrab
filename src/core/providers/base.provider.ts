import path from 'path';
import { SupportedPlatform, MediaMetadata, MediaFormat } from '@/core/types/media';
import { SubprocessExecutor, ProgressCallback } from '@/core/process/executor';
import { TempStorageManager } from '@/core/storage/temp-storage';
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
    const ffmpegPath = await SubprocessExecutor.getFfmpegPath();

    // Output template to place file directly inside isolated job folder
    const outputTemplate = path.join(jobDir, '%(title).100B-%(id)s.%(ext)s');

    const downloadArgs = [
      ...baseArgs,
      ...SubprocessExecutor.getCloudBypassArgs(),
      '--no-warnings',
      '--no-playlist',
      '--no-check-certificates',
      '--max-filesize',
      `${config.storage.maxFileSizeMb}M`,
      '--newline',
      '-o',
      outputTemplate,
    ];

    // Pass ffmpeg location if discovered
    if (ffmpegPath) {
      downloadArgs.push('--ffmpeg-location', ffmpegPath);
    }

    const isAudioOnly =
      formatId.startsWith('audio-') ||
      formatId === 'bestaudio' ||
      ['139', '140', '249', '250', '251', 'ba'].includes(formatId);

    if (isAudioOnly) {
      if (formatId === 'audio-mp3-320') {
        downloadArgs.push('-f', 'ba/b', '-x', '--audio-format', 'mp3', '--audio-quality', '320K');
      } else if (formatId === 'audio-mp3-128') {
        downloadArgs.push('-f', 'ba/b', '-x', '--audio-format', 'mp3', '--audio-quality', '128K');
      } else if (formatId === 'audio-m4a') {
        downloadArgs.push('-f', 'ba[ext=m4a]/ba/b', '-x', '--audio-format', 'm4a');
      } else if (formatId === 'bestaudio') {
        downloadArgs.push('-f', 'ba/b', '-x', '--audio-format', 'mp3', '--audio-quality', '0');
      } else {
        downloadArgs.push('-f', `${formatId}/ba/b`, '-x', '--audio-format', 'mp3');
      }
    } else {
      // For video downloads: download the video stream, mux with best audio stream,
      // and encode audio track as standard AAC 192k for 100% universal playback on all devices and players
      downloadArgs.push(
        '-f',
        `${formatId}+ba/bestvideo[format_id=${formatId}]+bestaudio/bestvideo+bestaudio/best`,
        '--merge-output-format',
        'mp4',
        '--postprocessor-args',
        'ffmpeg:-c:a aac -b:a 192k'
      );
    }

    downloadArgs.push(url);

    logger.info(`Starting download job ${jobId} with format ${formatId}`, 'PROVIDER', {
      platform: this.platform,
      isAudioOnly,
      hasFfmpeg: Boolean(ffmpegPath),
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
  protected normalizeExtractorFormats(
    rawFormats: Array<Record<string, unknown>>,
    durationSeconds?: number
  ): {
    video: MediaFormat[];
    audio: MediaFormat[];
    all: MediaFormat[];
  } {
    const all: MediaFormat[] = [];
    const videoMap = new Map<number, MediaFormat>();
    const audioList: MediaFormat[] = [];

    for (const f of rawFormats) {
      const formatId = String(f.format_id || '');
      const ext = String(f.ext || 'mp4').toLowerCase();
      const formatNote = typeof f.format_note === 'string' ? f.format_note : '';

      // Skip storyboard thumbnails and invalid container formats
      if (!formatId || ext === 'mhtml' || formatId.startsWith('sb') || formatNote.includes('storyboard')) {
        continue;
      }

      const vcodec = String(f.vcodec || 'none');
      const acodec = String(f.acodec || 'none');
      const width = typeof f.width === 'number' ? f.width : undefined;
      const height = typeof f.height === 'number' ? f.height : undefined;
      const fps = typeof f.fps === 'number' ? f.fps : undefined;
      let filesize = typeof f.filesize === 'number' ? f.filesize : undefined;
      const filesizeApprox = typeof f.filesize_approx === 'number' ? f.filesize_approx : undefined;
      const tbr = typeof f.tbr === 'number' ? f.tbr : undefined;

      // If filesize is not provided, estimate from bitrate and duration
      if (!filesize && filesizeApprox) {
        filesize = filesizeApprox;
      } else if (!filesize && tbr && durationSeconds && durationSeconds > 0) {
        filesize = Math.round((tbr * 1024 * durationSeconds) / 8);
      }

      const isAudioOnly = (vcodec === 'none' || !vcodec) && acodec !== 'none';
      const isVideoOnly = (acodec === 'none' || !acodec) && vcodec !== 'none';
      const hasVideo = vcodec !== 'none' && Boolean(vcodec);
      const hasAudio = acodec !== 'none' && Boolean(acodec);

      if (!hasVideo && !hasAudio) {
        continue;
      }

      let qualityLabel = '';
      let resolution = '';

      if (height) {
        resolution = width ? `${width}x${height}` : `${height}p`;
        if (height >= 2160) {
          qualityLabel = '4K Ultra HD (2160p)';
        } else if (height >= 1440) {
          qualityLabel = '2K Quad HD (1440p)';
        } else if (height >= 1080) {
          qualityLabel = '1080p Full HD';
        } else if (height >= 720) {
          qualityLabel = '720p HD';
        } else if (height >= 480) {
          qualityLabel = '480p SD';
        } else if (height >= 360) {
          qualityLabel = '360p Medium';
        } else if (height >= 240) {
          qualityLabel = '240p Low';
        } else {
          qualityLabel = `${height}p`;
        }

        if (fps && fps > 30) qualityLabel += ` ${fps}fps`;
      } else if (isAudioOnly) {
        const abr = typeof f.abr === 'number' ? Math.round(f.abr) : Math.round(tbr || 128);
        qualityLabel = `${abr} kbps (${ext.toUpperCase()})`;
      } else {
        qualityLabel = formatNote || ext.toUpperCase();
      }

      const formatItem: MediaFormat = {
        formatId,
        ext: height ? 'mp4' : ext, // Guarantee MP4 for video muxing
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
        // Group by height resolution to provide a clean, complete list
        const existing = videoMap.get(height);
        if (
          !existing ||
          (ext === 'mp4' && existing.ext !== 'mp4') ||
          (tbr && existing.tbr && tbr > existing.tbr)
        ) {
          videoMap.set(height, formatItem);
        }
      }
    }

    // Sort video by height descending (2160p -> 1440p -> 1080p -> 720p -> 480p -> 360p -> 240p -> 144p)
    const sortedVideo = Array.from(videoMap.values()).sort((a, b) => (b.height || 0) - (a.height || 0));

    // Curated high quality separate audio tracks
    const curatedAudio: MediaFormat[] = [
      {
        formatId: 'audio-mp3-320',
        ext: 'mp3',
        qualityLabel: 'MP3 High Quality (320 kbps)',
        isAudioOnly: true,
        isVideoOnly: false,
        hasVideo: false,
        hasAudio: true,
      },
      {
        formatId: 'audio-mp3-128',
        ext: 'mp3',
        qualityLabel: 'MP3 Standard (128 kbps)',
        isAudioOnly: true,
        isVideoOnly: false,
        hasVideo: false,
        hasAudio: true,
      },
      {
        formatId: 'audio-m4a',
        ext: 'm4a',
        qualityLabel: 'M4A / AAC Audio Stream',
        isAudioOnly: true,
        isVideoOnly: false,
        hasVideo: false,
        hasAudio: true,
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

    // Append direct source audio streams if available
    for (const a of audioList.slice(0, 3)) {
      if (!curatedAudio.some((c) => c.formatId === a.formatId)) {
        curatedAudio.push(a);
      }
    }

    // Ensure we always have sensible video options
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

    return { video: sortedVideo, audio: curatedAudio, all };
  }
}
