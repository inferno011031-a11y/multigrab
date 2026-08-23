import { NextResponse } from 'next/server';
import { existsSync } from 'fs';
import { SubprocessExecutor } from '@/core/process/executor';
import { config } from '@/lib/config';

export async function GET(): Promise<NextResponse> {
  let extractorAvailable = false;
  let extractorVersion = 'unknown';
  let ffmpegAvailable = false;

  try {
    const { cmd, baseArgs } = await SubprocessExecutor.getExtractorCommand();
    const result = await SubprocessExecutor.runRaw(cmd, [...baseArgs, '--version'], { timeout: 3000 });
    extractorAvailable = result.exitCode === 0;
    extractorVersion = result.stdout.trim();
  } catch {
    extractorAvailable = false;
  }

  try {
    const ffmpegPath = await SubprocessExecutor.getFfmpegPath();
    ffmpegAvailable = Boolean(ffmpegPath);
  } catch {
    ffmpegAvailable = false;
  }

  const storageAvailable = existsSync(config.storage.tempDir);

  const responseBody = {
    success: true,
    data: {
      status: extractorAvailable && storageAvailable ? 'healthy' : 'degraded',
      version: '1.0.0',
      uptime: process.uptime(),
      environment: config.env,
      checks: {
        extractor: {
          available: extractorAvailable,
          version: extractorVersion,
        },
        ffmpeg: {
          available: ffmpegAvailable,
        },
        storage: {
          available: storageAvailable,
          tempDir: config.storage.tempDir,
        },
        queue: {
          mode: config.queue.useRedis ? 'bullmq' : 'memory',
          connected: true,
        },
        redis: {
          connected: Boolean(config.queue.useRedis),
        },
      },
    },
    meta: {
      timestamp: Date.now(),
    },
  };

  return NextResponse.json(responseBody, {
    status: responseBody.data.status === 'healthy' ? 200 : 503,
  });
}
