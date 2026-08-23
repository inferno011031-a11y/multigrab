import { describe, it, expect } from 'vitest';
import { providerRegistry } from '@/core/providers/registry';

describe('Provider Registry & Platform Dispatching', () => {
  it('correctly maps URLs to appropriate platforms', () => {
    expect(providerRegistry.resolveProvider('https://www.youtube.com/watch?v=dQw4w9WgXcQ').platform).toBe('youtube');
    expect(providerRegistry.resolveProvider('https://youtu.be/kJQP7kiw5Fk').platform).toBe('youtube');
    expect(providerRegistry.resolveProvider('https://www.tiktok.com/@user/video/123456789').platform).toBe('tiktok');
    expect(providerRegistry.resolveProvider('https://www.instagram.com/reel/C123456789/').platform).toBe('instagram');
    expect(providerRegistry.resolveProvider('https://twitter.com/elonmusk/status/1234567890').platform).toBe('twitter');
    expect(providerRegistry.resolveProvider('https://x.com/openai/status/1234567890').platform).toBe('twitter');
    expect(providerRegistry.resolveProvider('https://www.facebook.com/watch/?v=123456789').platform).toBe('facebook');
    expect(providerRegistry.resolveProvider('https://www.reddit.com/r/videos/comments/abc123/funny_video/').platform).toBe('reddit');
    expect(providerRegistry.resolveProvider('https://www.pinterest.com/pin/123456789/').platform).toBe('pinterest');
    expect(providerRegistry.resolveProvider('https://vimeo.com/76979871').platform).toBe('vimeo');
    expect(providerRegistry.resolveProvider('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4').platform).toBe('generic');
  });

  it('returns comprehensive platform information list', () => {
    const list = providerRegistry.getSupportedPlatformsInfo();
    expect(list.length).toBeGreaterThanOrEqual(8);
    expect(list.some((p) => p.id === 'youtube')).toBe(true);
    expect(list.some((p) => p.id === 'tiktok')).toBe(true);
    expect(list.some((p) => p.id === 'instagram')).toBe(true);
  });
});
