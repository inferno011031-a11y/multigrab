import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { config } from '@/lib/config';
import { logger } from '@/lib/logger';

export class CleanupService {
  private static timer: NodeJS.Timeout | null = null;

  public static start(): void {
    if (this.timer) return;

    logger.info('Starting periodic cleanup service for expired downloads...', 'CLEANUP');
    this.timer = setInterval(
      () => {
        this.runCleanup().catch((err: unknown) => {
          const errorMessage = err instanceof Error ? err.message : String(err);
          logger.error(`Error in cleanup service: ${errorMessage}`, 'CLEANUP');
        });
      },
      config.storage.cleanupIntervalMinutes * 60 * 1000
    );

    if (this.timer.unref) this.timer.unref();

    // Also run an initial pass
    this.runCleanup().catch(() => {});
  }

  public static async runCleanup(): Promise<{ cleanedJobs: number }> {
    const tempDir = config.storage.tempDir;
    if (!existsSync(tempDir)) return { cleanedJobs: 0 };

    const ttlMs = config.storage.fileTtlMinutes * 60 * 1000;
    const now = Date.now();
    let cleaned = 0;

    try {
      const entries = await fs.readdir(tempDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const jobDir = path.join(tempDir, entry.name);
          const stat = await fs.stat(jobDir);
          const ageMs = now - stat.mtimeMs;

          if (ageMs > ttlMs) {
            await fs.rm(jobDir, { recursive: true, force: true });
            cleaned++;
            logger.info(`Cleaned expired download folder: ${entry.name} (age: ${Math.round(ageMs / 60000)}m)`, 'CLEANUP');
          }
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      logger.warn(`Cleanup run encountered error: ${errorMessage}`, 'CLEANUP');
    }

    return { cleanedJobs: cleaned };
  }
}
