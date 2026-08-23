import { DownloadJob, MediaMetadata, PlatformInfo } from './media';

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    timestamp: number;
    processingTimeMs?: number;
    requestId?: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: number;
    requestId?: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface AnalyzeRequest {
  url: string;
}

export type AnalyzeResponse = ApiSuccessResponse<MediaMetadata>;

export interface DownloadRequest {
  url: string;
  formatId: string;
  quality?: string;
}

export interface DownloadResponseData {
  jobId: string;
  status: string;
  message: string;
  pollUrl: string;
}

export type DownloadResponse = ApiSuccessResponse<DownloadResponseData>;

export type JobStatusResponse = ApiSuccessResponse<DownloadJob>;

export interface HealthResponseData {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime: number;
  environment: string;
  checks: {
    extractor: { available: boolean; version?: string };
    storage: { available: boolean; tempDir: string; freeSpaceMb?: number };
    queue: { mode: 'bullmq' | 'memory'; connected: boolean };
    redis: { connected: boolean };
  };
}

export type HealthResponse = ApiSuccessResponse<HealthResponseData>;

export type ProvidersResponse = ApiSuccessResponse<PlatformInfo[]>;
