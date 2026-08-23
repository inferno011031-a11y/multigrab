import { BaseMediaProvider } from './base.provider';
import { YouTubeProvider } from './youtube.provider';
import { InstagramProvider } from './instagram.provider';
import { TikTokProvider } from './tiktok.provider';
import { TwitterProvider } from './twitter.provider';
import { FacebookProvider } from './facebook.provider';
import { RedditProvider } from './reddit.provider';
import { PinterestProvider } from './pinterest.provider';
import { VimeoProvider } from './vimeo.provider';
import { SpotifyProvider } from './spotify.provider';
import { GenericMediaProvider } from './generic.provider';
import { PlatformInfo, SupportedPlatform } from '@/core/types/media';

export class ProviderRegistry {
  private static instance: ProviderRegistry;
  private providers: BaseMediaProvider[] = [];
  private fallbackProvider: BaseMediaProvider;

  private constructor() {
    this.fallbackProvider = new GenericMediaProvider();

    // Register all core platforms in priority order
    this.register(new YouTubeProvider());
    this.register(new InstagramProvider());
    this.register(new TikTokProvider());
    this.register(new TwitterProvider());
    this.register(new FacebookProvider());
    this.register(new RedditProvider());
    this.register(new PinterestProvider());
    this.register(new VimeoProvider());
    this.register(new SpotifyProvider());
  }

  public static getInstance(): ProviderRegistry {
    if (!ProviderRegistry.instance) {
      ProviderRegistry.instance = new ProviderRegistry();
    }
    return ProviderRegistry.instance;
  }

  public register(provider: BaseMediaProvider): void {
    // Avoid duplicate registration
    if (!this.providers.some((p) => p.platform === provider.platform)) {
      this.providers.push(provider);
    }
  }

  /**
   * Dispatches and resolves the appropriate provider for any given URL.
   */
  public resolveProvider(url: string): BaseMediaProvider {
    for (const provider of this.providers) {
      if (provider.canHandle(url)) {
        return provider;
      }
    }
    return this.fallbackProvider;
  }

  /**
   * Retrieves a provider by platform identifier.
   */
  public getByPlatform(platform: SupportedPlatform): BaseMediaProvider | null {
    if (platform === 'generic') return this.fallbackProvider;
    return this.providers.find((p) => p.platform === platform) || null;
  }

  /**
   * Returns metadata and capability information for all supported platforms.
   */
  public getSupportedPlatformsInfo(): PlatformInfo[] {
    return [
      {
        id: 'youtube',
        name: 'YouTube',
        domainPattern: 'youtube.com, youtu.be',
        description: 'Download standard videos, Shorts, Music & high-resolution audio (up to 4K / 1080p / MP3).',
        iconName: 'youtube',
        badgeColor: 'from-red-500 to-red-600',
        supportedFeatures: { video: true, audio: true, hd: true, subtitles: true },
        examples: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://youtu.be/kJQP7kiw5Fk'],
      },
      {
        id: 'spotify',
        name: 'Spotify',
        domainPattern: 'spotify.com, open.spotify.com',
        description: 'Extract and download public tracks and podcast episodes in high-fidelity MP3 / M4A audio.',
        iconName: 'spotify',
        badgeColor: 'from-emerald-500 to-green-600',
        supportedFeatures: { video: false, audio: true, hd: true, subtitles: false },
        examples: ['https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT'],
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        domainPattern: 'tiktok.com, vm.tiktok.com',
        description: 'Extract public TikTok videos and audio in clean high-definition format.',
        iconName: 'tiktok',
        badgeColor: 'from-pink-500 via-rose-500 to-cyan-500',
        supportedFeatures: { video: true, audio: true, hd: true, subtitles: false },
        examples: ['https://www.tiktok.com/@creator/video/1234567890'],
      },
      {
        id: 'instagram',
        name: 'Instagram',
        domainPattern: 'instagram.com',
        description: 'Download public Reels, IGTV, and video posts with metadata.',
        iconName: 'instagram',
        badgeColor: 'from-purple-500 via-pink-500 to-yellow-500',
        supportedFeatures: { video: true, audio: true, hd: true, subtitles: false },
        examples: ['https://www.instagram.com/reel/C123456789/'],
      },
      {
        id: 'twitter',
        name: 'X / Twitter',
        domainPattern: 'twitter.com, x.com',
        description: 'Save public video posts, clips, and GIFs in multiple MP4 bitrates.',
        iconName: 'twitter',
        badgeColor: 'from-slate-700 to-slate-900',
        supportedFeatures: { video: true, audio: true, hd: true, subtitles: false },
        examples: ['https://x.com/user/status/1234567890'],
      },
      {
        id: 'facebook',
        name: 'Facebook',
        domainPattern: 'facebook.com, fb.watch',
        description: 'Fetch public Watch videos and Reels in standard and HD definitions.',
        iconName: 'facebook',
        badgeColor: 'from-blue-600 to-blue-700',
        supportedFeatures: { video: true, audio: true, hd: true, subtitles: false },
        examples: ['https://www.facebook.com/watch/?v=123456789'],
      },
      {
        id: 'reddit',
        name: 'Reddit',
        domainPattern: 'reddit.com, v.redd.it',
        description: 'Download Reddit videos with unified synced audio track in full quality.',
        iconName: 'reddit',
        badgeColor: 'from-orange-500 to-amber-600',
        supportedFeatures: { video: true, audio: true, hd: true, subtitles: false },
        examples: ['https://www.reddit.com/r/videos/comments/abc123/'],
      },
      {
        id: 'pinterest',
        name: 'Pinterest',
        domainPattern: 'pinterest.com, pin.it',
        description: 'Save public video pins and idea clips in high resolution.',
        iconName: 'pinterest',
        badgeColor: 'from-red-600 to-rose-700',
        supportedFeatures: { video: true, audio: true, hd: true, subtitles: false },
        examples: ['https://www.pinterest.com/pin/123456789/'],
      },
      {
        id: 'vimeo',
        name: 'Vimeo',
        domainPattern: 'vimeo.com',
        description: 'Download public Vimeo videos in progressive MP4 resolutions.',
        iconName: 'vimeo',
        badgeColor: 'from-cyan-500 to-blue-600',
        supportedFeatures: { video: true, audio: true, hd: true, subtitles: false },
        examples: ['https://vimeo.com/123456789'],
      },
    ];
  }
}

export const providerRegistry = ProviderRegistry.getInstance();
