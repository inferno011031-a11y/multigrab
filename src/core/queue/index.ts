import { IJobQueue } from './queue.interface';
import { InMemoryJobQueue } from './memory.queue';
import { BullMQJobQueue } from './bullmq.queue';
import { CleanupService } from '@/core/storage/cleanup';
import { config } from '@/lib/config';
import { logger } from '@/lib/logger';

class QueueFactory {
  private static instance: IJobQueue | null = null;

  public static getQueue(): IJobQueue {
    if (!QueueFactory.instance) {
      // Start background cleanup cron
      CleanupService.start();

      if (config.queue.useRedis && process.env.REDIS_URL) {
        try {
          QueueFactory.instance = new BullMQJobQueue();
          logger.info('Using BullMQ Redis queue engine', 'QUEUE');
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          logger.warn(`Failed to connect to Redis, falling back to In-Memory Queue: ${errorMessage}`, 'QUEUE');
          QueueFactory.instance = new InMemoryJobQueue();
        }
      } else {
        QueueFactory.instance = new InMemoryJobQueue();
      }
    }
    return QueueFactory.instance;
  }
}

export const jobQueue = QueueFactory.getQueue();
