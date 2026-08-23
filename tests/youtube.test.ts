import { describe, it, expect } from 'vitest';
import { YouTubeProvider } from '@/core/providers/youtube.provider';

describe('YouTube Provider Integration', () => {
  const provider = new YouTubeProvider();

  it('correctly handles YouTube video URLs', () => {
    expect(provider.canHandle('https://www.youtube.com/watch?v=jNQXAC9IVRw')).toBe(true);
    expect(provider.canHandle('https://youtu.be/jNQXAC9IVRw')).toBe(true);
    expect(provider.canHandle('https://vimeo.com/12345')).toBe(false);
  });

  it('fetches real metadata for public YouTube video (Me at the zoo)', async () => {
    // Standard test video: "Me at the zoo" - First YouTube video
    const url = 'https://www.youtube.com/watch?v=jNQXAC9IVRw';
    const meta = await provider.getMetadata(url);

    expect(meta.id).toBe('jNQXAC9IVRw');
    expect(meta.platform).toBe('youtube');
    expect(meta.title).toBeTruthy();
    expect(meta.author).toBeTruthy();
    expect(meta.duration).toBeGreaterThan(0);
    expect(meta.availableQualities.video.length).toBeGreaterThan(0);
    expect(meta.availableQualities.audio.length).toBeGreaterThan(0);
  });
});
