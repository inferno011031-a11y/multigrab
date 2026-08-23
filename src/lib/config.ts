import path from 'path';

export const config = {
  env: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: parseInt(process.env.PORT || '3000', 10),

  // Media Storage & Limits
  storage: {
    tempDir: process.env.TEMP_STORAGE_DIR || path.join(process.cwd(), 'tmp', 'downloads'),
    maxFileSizeMb: parseInt(process.env.MAX_DOWNLOAD_SIZE_MB || '500', 10),
    fileTtlMinutes: parseInt(process.env.TEMP_FILE_TTL_MINUTES || '30', 10),
    cleanupIntervalMinutes: parseInt(process.env.CLEANUP_INTERVAL_MINUTES || '10', 10),
  },

  // Security & Rate Limiting
  security: {
    tokenSecret: process.env.TOKEN_SECRET || 'mediadrop-default-secure-secret-key-change-in-prod',
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '30', 10),
    rateLimitWindowSec: parseInt(process.env.RATE_LIMIT_WINDOW_SECONDS || '60', 10),
    allowedProtocols: ['http:', 'https:'],
    requestTimeoutMs: parseInt(process.env.REQUEST_TIMEOUT_MS || '30000', 10),
    downloadTimeoutMs: parseInt(process.env.DOWNLOAD_TIMEOUT_MS || '180000', 10),
  },

  // Queue & Worker
  queue: {
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    useRedis: process.env.USE_REDIS === 'true',
    concurrency: parseInt(process.env.WORKER_CONCURRENCY || '3', 10),
  },

  // Subprocess executables
  extractor: {
    customBinaryPath: process.env.YT_DLP_PATH || '',
    pythonPath: process.env.PYTHON_PATH || 'python',
  },
} as const;
