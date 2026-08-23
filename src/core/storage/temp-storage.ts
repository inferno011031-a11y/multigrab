import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { config } from '@/lib/config';
import { logger } from '@/lib/logger';
import { sanitizeFilename, generateSignedDownloadToken } from '@/core/security/sanitize';

export class TempStorageManager {
  private static isInitialized = false;

  public static async init(): Promise<void> {
    if (this.isInitialized) return;
    try {
      await fs.mkdir(config.storage.tempDir, { recursive: true });
      this.isInitialized = true;
      logger.info(`Temp storage initialized at ${config.storage.tempDir}`, 'STORAGE');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      logger.error(`Failed to initialize storage dir: ${errorMessage}`, 'STORAGE');
    }
  }

  public static async getJobDirectory(jobId: string): Promise<string> {
    await this.init();
    const safeJobId = sanitizeFilename(jobId, 'job');
    const jobDir = path.join(config.storage.tempDir, safeJobId);
    await fs.mkdir(jobDir, { recursive: true });
    return jobDir;
  }

  public static async saveJobMetadata(
    jobId: string,
    metadata: { filename: string; mimeType: string; fileSize: number; createdAt: number }
  ): Promise<void> {
    const jobDir = await this.getJobDirectory(jobId);
    const metaPath = path.join(jobDir, 'meta.json');
    await fs.writeFile(metaPath, JSON.stringify(metadata, null, 2), 'utf8');
  }

  public static async getJobMetadata(
    jobId: string
  ): Promise<{ filename: string; mimeType: string; fileSize: number; createdAt: number } | null> {
    try {
      const safeJobId = sanitizeFilename(jobId, 'job');
      const metaPath = path.join(config.storage.tempDir, safeJobId, 'meta.json');
      if (!existsSync(metaPath)) return null;
      const data = await fs.readFile(metaPath, 'utf8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  public static async findJobFile(jobId: string): Promise<{ filePath: string; filename: string; size: number } | null> {
    try {
      const safeJobId = sanitizeFilename(jobId, 'job');
      const jobDir = path.join(config.storage.tempDir, safeJobId);
      if (!existsSync(jobDir)) return null;

      const entries = await fs.readdir(jobDir, { withFileTypes: true });
      const candidates: Array<{ filePath: string; filename: string; size: number; isVideo: boolean }> = [];

      for (const entry of entries) {
        if (entry.isFile() && entry.name !== 'meta.json' && !entry.name.endsWith('.part') && !entry.name.endsWith('.ytdl')) {
          const filePath = path.join(jobDir, entry.name);
          const stat = await fs.stat(filePath);
          const ext = path.extname(entry.name).toLowerCase();
          const isVideo = ['.mp4', '.mkv', '.webm', '.avi', '.mov'].includes(ext);

          candidates.push({
            filePath,
            filename: entry.name,
            size: stat.size,
            isVideo,
          });
        }
      }

      if (candidates.length === 0) return null;

      // Sort candidate files: videos first, then by size descending
      candidates.sort((a, b) => {
        if (a.isVideo && !b.isVideo) return -1;
        if (!a.isVideo && b.isVideo) return 1;
        return b.size - a.size;
      });

      const best = candidates[0];
      return { filePath: best.filePath, filename: best.filename, size: best.size };
    } catch {
      return null;
    }
  }

  public static createDownloadToken(jobId: string, filename: string): string {
    return generateSignedDownloadToken(jobId, filename, config.storage.fileTtlMinutes);
  }

  public static async deleteJob(jobId: string): Promise<void> {
    try {
      const safeJobId = sanitizeFilename(jobId, 'job');
      const jobDir = path.join(config.storage.tempDir, safeJobId);
      if (existsSync(jobDir)) {
        await fs.rm(jobDir, { recursive: true, force: true });
        logger.info(`Cleaned up temp files for job ${jobId}`, 'STORAGE');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      logger.warn(`Error cleaning up job ${jobId}: ${errorMessage}`, 'STORAGE');
    }
  }
}
