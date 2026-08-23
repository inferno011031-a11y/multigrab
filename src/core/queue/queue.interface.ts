import { DownloadJob } from '@/core/types/media';

export interface IJobQueue {
  addJob(job: Omit<DownloadJob, 'createdAt' | 'status' | 'progress'>): Promise<DownloadJob>;
  getJob(jobId: string): Promise<DownloadJob | null>;
  updateJob(jobId: string, partial: Partial<DownloadJob>): Promise<DownloadJob | null>;
  cleanExpiredJobs(): Promise<number>;
}
