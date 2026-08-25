'use client';

import React from 'react';
import { PlatformInfo } from '@/core/types/media';
import {
  YoutubeIcon,
  SpotifyIcon,
  TiktokIcon,
  InstagramIcon,
  TwitterIcon,
  FacebookIcon,
  RedditIcon,
  PinterestIcon,
  VimeoIcon,
} from '@/components/PlatformIcons';
import { Globe, Video, Music } from 'lucide-react';

interface PlatformGridProps {
  platforms: PlatformInfo[];
  onSelectPlatformSample?: (url: string) => void;
}

export function PlatformGrid({ platforms, onSelectPlatformSample }: PlatformGridProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'youtube':
        return <YoutubeIcon className="w-5 h-5 text-white" />;
      case 'spotify':
        return <SpotifyIcon className="w-5 h-5 text-white" />;
      case 'tiktok':
        return <TiktokIcon className="w-5 h-5 text-white" />;
      case 'instagram':
        return <InstagramIcon className="w-5 h-5 text-white" />;
      case 'twitter':
        return <TwitterIcon className="w-5 h-5 text-white" />;
      case 'facebook':
        return <FacebookIcon className="w-5 h-5 text-white" />;
      case 'reddit':
        return <RedditIcon className="w-5 h-5 text-white" />;
      case 'pinterest':
        return <PinterestIcon className="w-5 h-5 text-white" />;
      case 'vimeo':
        return <VimeoIcon className="w-5 h-5 text-white" />;
      default:
        return <Globe className="w-5 h-5 text-white" />;
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Supported Media Platforms
        </h2>
        <p className="mt-2 text-sm text-neutral-400 max-w-xl mx-auto">
          Fast, universal video and audio extraction across all major services.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className="group relative flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-950 p-5 transition-all hover:border-neutral-700 hover:bg-neutral-900/50"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 transition-transform group-hover:scale-105">
                  {getIcon(platform.iconName)}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-neutral-400">
                  {platform.supportedFeatures.video && (
                    <span className="flex items-center gap-1 rounded-md bg-neutral-900 border border-neutral-800 px-2 py-0.5">
                      <Video className="w-3 h-3 text-neutral-300" />
                      <span>Video</span>
                    </span>
                  )}
                  {platform.supportedFeatures.audio && (
                    <span className="flex items-center gap-1 rounded-md bg-neutral-900 border border-neutral-800 px-2 py-0.5">
                      <Music className="w-3 h-3 text-neutral-300" />
                      <span>Audio</span>
                    </span>
                  )}
                </div>
              </div>

              <h3 className="mt-4 text-base font-bold text-white tracking-tight">
                {platform.name}
              </h3>
              <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed line-clamp-2">
                {platform.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
              <span className="truncate max-w-[150px] font-mono">{platform.domainPattern}</span>
              {Boolean(platform.examples && platform.examples.length > 0 && onSelectPlatformSample) && (
                <button
                  onClick={() => onSelectPlatformSample?.(platform.examples![0])}
                  className="text-white hover:underline cursor-pointer font-medium"
                >
                  Test Sample
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
