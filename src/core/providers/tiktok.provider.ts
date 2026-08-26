import { BaseMediaProvider } from './base.provider';
import { MediaFormat, MediaMetadata, SupportedPlatform } from '@/core/types/media';
import { SubprocessExecutor } from '@/core/process/executor';
import { TempStorageManager } from '@/core/storage/temp-storage';
import { logger } from '@/lib/logger';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';

export class TikTokProvider extends BaseMediaProvider {
  readonly platform: SupportedPlatform = 'tiktok';
  readonly name: string = 'TikTok';
  readonly supportedDomains: string[] = [
    'tiktok.com',
    'www.tiktok.com',
    'vm.tiktok.com',
    'vt.tiktok.com',
  ];

  public async getMetadata(url: string): Promise<MediaMetadata> {
    logger.info(`Fetching metadata for TikTok URL`, 'TIKTOK_PROVIDER');

    // 1. Try standard extractor with cloud bypass args
    try {
      const raw = await SubprocessExecutor.extractJson(url);

      const id = String(raw.id || '');
      const title = String(raw.title || raw.description || 'TikTok Video');
      const description = typeof raw.description === 'string' ? raw.description : undefined;
      const author = String(raw.uploader || raw.creator || 'TikTok Creator');
      const authorUrl = typeof raw.uploader_url === 'string' ? raw.uploader_url : undefined;
      const duration = typeof raw.duration === 'number' ? raw.duration : undefined;
      const thumbnail = String(raw.thumbnail || '');
      const viewCount = typeof raw.view_count === 'number' ? raw.view_count : undefined;
      const likeCount = typeof raw.like_count === 'number' ? raw.like_count : undefined;

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
    } catch (err: unknown) {
      logger.warn(`Primary TikTok extractor failed, falling back to TikWM API: ${String(err)}`, 'TIKTOK_PROVIDER');

      // 2. TikWM API Fallback (Works 100% on datacenter IPs without blocks)
      try {
        const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          },
        });

        if (!res.ok) {
          throw new Error(`TikWM HTTP ${res.status}`);
        }

        const json = await res.json();
        if (!json || json.code !== 0 || !json.data) {
          throw new Error(json?.msg || 'Could not parse TikTok stream via fallback API');
        }

        const d = json.data;
        const id = String(d.id || 'tiktok-video');
        const title = String(d.title || `TikTok Video by @${d.author?.unique_id || 'creator'}`);
        const author = String(d.author?.nickname || d.author?.unique_id || 'TikTok Creator');
        const authorUrl = d.author?.unique_id ? `https://www.tiktok.com/@${d.author.unique_id}` : undefined;
        const thumbnail = String(d.cover || d.origin_cover || '');
        const duration = typeof d.duration === 'number' ? d.duration : undefined;

        const formats: MediaFormat[] = [
          {
            formatId: 'tiktok-nowm-hd',
            ext: 'mp4',
            qualityLabel: 'HD Video (No Watermark)',
            hasVideo: true,
            hasAudio: true,
            isAudioOnly: false,
            isVideoOnly: false,
            url: d.hdplay || d.play,
          },
          {
            formatId: 'tiktok-watermark',
            ext: 'mp4',
            qualityLabel: 'Standard Video (With Watermark)',
            hasVideo: true,
            hasAudio: true,
            isAudioOnly: false,
            isVideoOnly: false,
            url: d.wmplay || d.play,
          },
          {
            formatId: 'tiktok-mp3-audio',
            ext: 'mp3',
            qualityLabel: 'MP3 Original Audio Track',
            hasVideo: false,
            hasAudio: true,
            isAudioOnly: true,
            isVideoOnly: false,
            url: d.music,
          },
        ];

        return {
          id,
          originalUrl: url,
          canonicalUrl: url,
          platform: this.platform,
          platformName: this.name,
          title,
          author,
          authorUrl,
          thumbnail,
          duration,
          durationFormatted: this.formatDuration(duration),
          formats,
          availableQualities: {
            video: formats.filter((f) => f.hasVideo),
            audio: formats.filter((f) => f.isAudioOnly),
          },
        };
      } catch (fallbackErr: unknown) {
        throw new Error(`Failed to extract TikTok media: ${String(fallbackErr)}`);
      }
    }
  }

  public override async processDownload(
    url: string,
    formatId: string,
    jobId: string,
    onProgress?: (progress: { percent: number; speed?: string; eta?: string }) => void
  ): Promise<{ filePath: string; filename: string; mimeType: string; size: number }> {
    // Check if format is a direct TikWM URL
    if (formatId.startsWith('tiktok-')) {
      const meta = await this.getMetadata(url);
      const chosen = meta.formats.find((f) => f.formatId === formatId) || meta.formats[0];

      if (chosen && chosen.url) {
        const jobDir = await TempStorageManager.getJobDirectory(jobId);
        const ext = chosen.ext || (chosen.isAudioOnly ? 'mp3' : 'mp4');
        const filename = `${meta.id}-${formatId}.${ext}`;
        const filePath = path.join(jobDir, filename);

        const res = await fetch(chosen.url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            Referer: 'https://www.tiktok.com/',
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to stream media: HTTP ${res.status}`);
        }

        const buffer = await res.arrayBuffer();
        await fsp.writeFile(filePath, Buffer.from(buffer));

        if (onProgress) {
          onProgress({ percent: 100 });
        }

        const stat = await fsp.stat(filePath);
        return {
          filePath,
          filename,
          mimeType: chosen.isAudioOnly ? 'audio/mpeg' : 'video/mp4',
          size: stat.size,
        };
      }
    }

    // Default subprocess download
    return super.processDownload(url, formatId, jobId, onProgress);
  }
}

