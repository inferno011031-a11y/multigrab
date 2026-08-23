import { describe, it, expect } from 'vitest';
import { YouTubeProvider } from '@/core/providers/youtube.provider';
import { TempStorageManager } from '@/core/storage/temp-storage';
import { existsSync } from 'fs';

describe('End-to-End YouTube Processing & Download', () => {
  it('downloads a short public YouTube video and verifies output file creation', async () => {
    const provider = new YouTubeProvider();
    const jobId = `test-${Date.now()}`;
    const url = 'https://www.youtube.com/watch?v=jNQXAC9IVRw'; // "Me at the zoo" (19 seconds)

    const result = await provider.processDownload(url, 'best', jobId);

    expect(result).toBeDefined();
    expect(result.filename).toBeTruthy();
    expect(result.filePath).toBeTruthy();
    expect(existsSync(result.filePath)).toBe(true);
    expect(result.size).toBeGreaterThan(1000); // Greater than 1KB

    // Cleanup test job
    await TempStorageManager.deleteJob(jobId);
    expect(existsSync(result.filePath)).toBe(false);
  }, 45000);
});
