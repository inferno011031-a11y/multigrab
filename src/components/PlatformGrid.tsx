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
        return <YoutubeIcon className="w-6 h-6 text-red-500" />;
      case 'spotify':
        return <SpotifyIcon className="w-6 h-6 text-emerald-400" />;
      case 'tiktok':
        return <TiktokIcon className="w-6 h-6 text-pink-400" />;
      case 'instagram':
        return <InstagramIcon className="w-6 h-6 text-pink-500" />;
      case 'twitter':
        return <TwitterIcon className="w-6 h-6 text-cyan-400" />;
      case 'facebook':
        return <FacebookIcon className="w-6 h-6 text-blue-500" />;
      case 'reddit':
        return <RedditIcon className="w-6 h-6 text-orange-500" />;
      case 'pinterest':
        return <PinterestIcon className="w-6 h-6 text-rose-500" />;
      case 'vimeo':
        return <VimeoIcon className="w-6 h-6 text-cyan-500" />;
      default:
        return <Globe className="w-6 h-6 text-indigo-400" />;
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Supported Media Platforms
        </h2>
        <p className="mt-2 text-sm text-neutral-400 max-w-xl mx-auto">
          Built with an extensible modular provider engine supporting high-resolution downloads and audio across the web.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className="group relative flex flex-col justify-between rounded-3xl border border-neutral-800/80 bg-neutral-900/40 p-5 backdrop-blur-md transition-all hover:border-neutral-700 hover:bg-neutral-900/80 shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-800/80 ring-1 ring-white/10 group-hover:scale-105 transition-transform">
                  {getIcon(platform.iconName)}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-neutral-400">
                  {platform.supportedFeatures.video && (
                    <span className="flex items-center gap-0.5 rounded-md bg-neutral-800 px-1.5 py-0.5">
                      <Video className="w-2.5 h-2.5 text-cyan-400" />
                      <span>Video</span>
                    </span>
                  )}
                  {platform.supportedFeatures.audio && (
                    <span className="flex items-center gap-0.5 rounded-md bg-neutral-800 px-1.5 py-0.5">
                      <Music className="w-2.5 h-2.5 text-purple-400" />
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

            <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-500">
              <span className="truncate max-w-[150px] font-mono">{platform.domainPattern}</span>
              {Boolean(platform.examples && platform.examples.length > 0 && onSelectPlatformSample) && (
                <button
                  onClick={() => onSelectPlatformSample?.(platform.examples![0])}
                  className="text-indigo-400 hover:underline cursor-pointer"
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
