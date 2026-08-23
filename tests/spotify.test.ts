import { describe, it, expect } from 'vitest';
import { SpotifyProvider } from '@/core/providers/spotify.provider';

describe('Spotify Provider Integration', () => {
  const provider = new SpotifyProvider();

  it('correctly validates Spotify URLs', () => {
    expect(provider.canHandle('https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT')).toBe(true);
    expect(provider.canHandle('https://spotify.com/track/12345')).toBe(true);
    expect(provider.canHandle('https://spotify.link/xyz123')).toBe(true);
    expect(provider.canHandle('https://youtube.com/watch?v=123')).toBe(false);
  });

  it('fetches metadata for a public Spotify track', async () => {
    const trackUrl = 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT';
    const metadata = await provider.getMetadata(trackUrl);

    expect(metadata.platform).toBe('spotify');
    expect(metadata.title).toBeDefined();
    expect(metadata.title.length).toBeGreaterThan(0);
    expect(metadata.availableQualities.audio.length).toBeGreaterThan(0);
    expect(metadata.availableQualities.audio.some((a) => a.formatId === 'audio-mp3-320')).toBe(true);
  }, 15000);
});
