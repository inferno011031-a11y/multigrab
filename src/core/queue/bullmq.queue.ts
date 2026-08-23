import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { IJobQueue } from './queue.interface';
import { DownloadJob } from '@/core/types/media';
import { providerRegistry } from '@/core/providers/registry';
import { TempStorageManager } from '@/core/storage/temp-storage';
import { config } from '@/lib/config';
import { logger } from '@/lib/logger';

export class BullMQJobQueue implements IJobQueue {
  private queue: Queue;
  private worker: Worker | null = null;
  private redisClient: Redis;
  private jobMetadataKeyPrefix = 'mediadrop:job:';

  constructor() {
    this.redisClient = new Redis(config.queue.redisUrl, {
      maxRetriesPerRequest: null,
      lazyConnect: true,
    });

    this.queue = new Queue('media-downloads', {
      connection: this.redisClient,
    });

    this.initWorker();
    logger.info('Initialized BullMQ Queue with Redis connection', 'QUEUE');
  }

  private initWorker() {
    this.worker = new Worker(
      'media-downloads',
      async (bullJob: Job) => {
        const { jobId, url, formatId, platform } = bullJob.data;
        logger.info(`Processing BullMQ Job ${jobId}`, 'BULLMQ_WORKER', { platform, url });

        const provider = providerRegistry.getByPlatform(platform) || providerRegistry.resolveProvider(url);

        const downloadResult = await provider.processDownload(
          url,
          formatId,
          jobId,
          (progress) => {
            bullJob.updateProgress(Math.round(progress.percent));
            this.redisClient.hset(`${this.jobMetadataKeyPrefix}${jobId}`, {
              progress: Math.round(progress.percent),
              speed: progress.speed || '',
              eta: progress.eta || '',
            });
          }
        );

        const expiresAt = Date.now() + config.storage.fileTtlMinutes * 60 * 1000;
        const downloadToken = TempStorageManager.createDownloadToken(jobId, downloadResult.filename);

        const resultData = {
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

        await this.redisClient.hset(`${this.jobMetadataKeyPrefix}${jobId}`, resultData);
        return resultData;
      },
      {
        connection: this.redisClient,
        concurrency: config.queue.concurrency,
      }
    );

    this.worker.on('failed', async (job, err) => {
      if (!job) return;
      logger.error(`BullMQ job ${job.id} failed: ${err.message}`, 'BULLMQ_WORKER');
      await this.redisClient.hset(`${this.jobMetadataKeyPrefix}${job.data.jobId}`, {
        status: 'failed',
        error: err.message,
      });
    });
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

    // Store in Redis Hash
    await this.redisClient.hset(`${this.jobMetadataKeyPrefix}${job.id}`, {
      id: job.id,
      url: job.url,
      formatId: job.formatId,
      platform: job.platform,
      title: job.title,
      status: 'queued',
      progress: 0,
      createdAt: job.createdAt,
    });

    // Set TTL on redis key
    await this.redisClient.expire(`${this.jobMetadataKeyPrefix}${job.id}`, config.storage.fileTtlMinutes * 60);

    // Enqueue
    await this.queue.add('download', {
      jobId: job.id,
      url: job.url,
      formatId: job.formatId,
      platform: job.platform,
      title: job.title,
    });

    return job;
  }

  public async getJob(jobId: string): Promise<DownloadJob | null> {
    const raw = await this.redisClient.hgetall(`${this.jobMetadataKeyPrefix}${jobId}`);
    if (!raw || Object.keys(raw).length === 0) return null;

    return {
      id: raw.id || jobId,
      url: raw.url,
      formatId: raw.formatId,
      platform: raw.platform as DownloadJob['platform'],
      title: raw.title,
      status: raw.status as DownloadJob['status'],
      progress: parseInt(raw.progress || '0', 10),
      speed: raw.speed,
      eta: raw.eta,
      error: raw.error,
      downloadToken: raw.downloadToken,
      downloadUrl: raw.downloadUrl,
      filePath: raw.filePath,
      fileSize: raw.fileSize ? parseInt(raw.fileSize, 10) : undefined,
      mimeType: raw.mimeType,
      filename: raw.filename,
      createdAt: parseInt(raw.createdAt || '0', 10),
      completedAt: raw.completedAt ? parseInt(raw.completedAt, 10) : undefined,
      expiresAt: raw.expiresAt ? parseInt(raw.expiresAt, 10) : undefined,
    };
  }

  public async updateJob(jobId: string, partial: Partial<DownloadJob>): Promise<DownloadJob | null> {
    const stringified: Record<string, string | number> = {};
    for (const [k, v] of Object.entries(partial)) {
      if (v !== undefined) {
        stringified[k] = typeof v === 'object' ? JSON.stringify(v) : (v as string | number);
      }
    }
    await this.redisClient.hset(`${this.jobMetadataKeyPrefix}${jobId}`, stringified);
    return this.getJob(jobId);
  }

  public async cleanExpiredJobs(): Promise<number> {
    return 0; // BullMQ/Redis automatically handles TTL expirations
  }
}
