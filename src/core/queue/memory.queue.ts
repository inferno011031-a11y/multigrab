import { IJobQueue } from './queue.interface';
import { DownloadJob } from '@/core/types/media';
import { providerRegistry } from '@/core/providers/registry';
import { TempStorageManager } from '@/core/storage/temp-storage';
import { config } from '@/lib/config';
import { logger } from '@/lib/logger';

export class InMemoryJobQueue implements IJobQueue {
  private jobs = new Map<string, DownloadJob>();
  private activeCount = 0;
  private queue: string[] = [];

  constructor() {
    logger.info('Initialized In-Memory Worker Queue', 'QUEUE');
  }

  public async addJob(
    data: Omit<DownloadJob, 'createdAt' | 'status' | 'progress'>
  ): Promise<DownloadJob> {
    const job: DownloadJob = {
      ...data,
      status: 'queued',
      progress: 0,
      createdAt: Date.now(),
    };

    this.jobs.set(job.id, job);
    this.queue.push(job.id);
    logger.info(`Job ${job.id} queued for processing`, 'QUEUE', { platform: job.platform });

    // Trigger queue processing tick
    setTimeout(() => this.processNext(), 10);

    return job;
  }

  public async getJob(jobId: string): Promise<DownloadJob | null> {
    const job = this.jobs.get(jobId);
    if (!job) return null;

    // Check expiration
    if (job.expiresAt && Date.now() > job.expiresAt) {
      job.status = 'expired';
    }

    return job;
  }

  public async updateJob(jobId: string, partial: Partial<DownloadJob>): Promise<DownloadJob | null> {
    const job = this.jobs.get(jobId);
    if (!job) return null;

    const updated: DownloadJob = { ...job, ...partial };
    this.jobs.set(jobId, updated);
    return updated;
  }

  public async cleanExpiredJobs(): Promise<number> {
    const now = Date.now();
    let cleaned = 0;
    for (const [id, job] of this.jobs.entries()) {
      if (job.expiresAt && now > job.expiresAt) {
        this.jobs.delete(id);
        cleaned++;
      }
    }
    return cleaned;
  }

  private async processNext(): Promise<void> {
    if (this.activeCount >= config.queue.concurrency || this.queue.length === 0) {
      return;
    }

    const jobId = this.queue.shift();
    if (!jobId) return;

    const job = this.jobs.get(jobId);
    if (!job || job.status !== 'queued') {
      return;
    }

    this.activeCount++;
    job.status = 'processing';
    job.progress = 5;
    this.jobs.set(jobId, job);

    logger.info(`Starting download worker for job ${jobId}`, 'WORKER', { url: job.url, formatId: job.formatId });

    try {
      const provider = providerRegistry.getByPlatform(job.platform) || providerRegistry.resolveProvider(job.url);

      const downloadResult = await provider.processDownload(
        job.url,
        job.formatId,
        job.id,
        (progress) => {
          const current = this.jobs.get(jobId);
          if (current) {
            current.progress = Math.min(99, Math.round(progress.percent));
            current.speed = progress.speed;
            current.eta = progress.eta;
            this.jobs.set(jobId, current);
          }
        }
      );

      const expiresAt = Date.now() + config.storage.fileTtlMinutes * 60 * 1000;
      const downloadToken = TempStorageManager.createDownloadToken(job.id, downloadResult.filename);

      const completedJob: DownloadJob = {
        ...job,
        status: 'completed',
        progress: 100,
        filePath: downloadResult.filePath,
        filename: downloadResult.filename,
        fileSize: downloadResult.size,
        mimeType: downloadResult.mimeType,
        downloadToken,
        downloadUrl: `/api/file/${downloadToken}`,
        completedAt: Date.now(),
        expiresAt,
      };

      this.jobs.set(jobId, completedJob);
      logger.info(`Job ${jobId} successfully completed`, 'WORKER', {
        filename: downloadResult.filename,
        sizeMb: (downloadResult.size / 1024 / 1024).toFixed(2),
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      logger.error(`Job ${jobId} failed: ${errorMessage}`, 'WORKER');

      const failedJob: DownloadJob = {
        ...job,
        status: 'failed',
        error: errorMessage.includes('timed out')
          ? 'Download processing timed out.'
          : errorMessage.includes('max-filesize')
          ? `Media exceeds the maximum permitted download size (${config.storage.maxFileSizeMb}MB).`
          : 'Failed to process media download. Please try another format or URL.',
      };
      this.jobs.set(jobId, failedJob);
    } finally {
      this.activeCount--;
      // Process any remaining items in queue
      setTimeout(() => this.processNext(), 10);
    }
  }
}
