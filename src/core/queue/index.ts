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

      const isProduction = process.env.NODE_ENV === 'production';

      if (config.queue.useRedis || process.env.REDIS_URL) {
        try {
          QueueFactory.instance = new BullMQJobQueue();
          logger.info('Using BullMQ Redis queue engine', 'QUEUE');
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          if (isProduction) {
            logger.error(`CRITICAL: Failed to initialize Redis queue in production: ${errorMessage}`, 'QUEUE');
            throw new Error(`Production requires a valid Redis connection. Failed to connect: ${errorMessage}`);
          } else {
            logger.warn(`Development fallback: Using In-Memory Queue (${errorMessage})`, 'QUEUE');
            QueueFactory.instance = new InMemoryJobQueue();
          }
        }
      } else {
        if (isProduction && process.env.STRICT_QUEUE_MODE === 'true') {
          throw new Error('REDIS_URL must be configured for queue processing in strict production mode.');
        }
        logger.info('Initialized In-Memory Worker Queue', 'QUEUE');
        QueueFactory.instance = new InMemoryJobQueue();
      }
    }
    return QueueFactory.instance;
  }
}

export const jobQueue = QueueFactory.getQueue();
