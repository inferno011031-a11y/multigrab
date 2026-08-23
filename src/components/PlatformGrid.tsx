'use client';

import React from 'react';
import {
  Video,
  Sparkles,
} from 'lucide-react';
import {
  YouTubeIcon,
  TikTokIcon,
  InstagramIcon,
  TwitterXIcon,
  FacebookIcon,
  RedditIcon,
  PinterestIcon,
  VimeoIcon,
} from './PlatformIcons';
import { PlatformInfo } from '@/core/types/media';

interface PlatformGridProps {
  platforms: PlatformInfo[];
  onSelectPlatformSample?: (url: string) => void;
}

export function PlatformGrid({ platforms, onSelectPlatformSample }: PlatformGridProps) {
  const getIcon = (id: string) => {
    switch (id) {
      case 'youtube':
        return <YouTubeIcon className="w-5 h-5 text-red-500" />;
      case 'tiktok':
        return <TikTokIcon className="w-5 h-5 text-pink-400" />;
      case 'instagram':
        return <InstagramIcon className="w-5 h-5 text-purple-400" />;
      case 'twitter':
        return <TwitterXIcon className="w-5 h-5 text-slate-200" />;
      case 'facebook':
        return <FacebookIcon className="w-5 h-5 text-blue-500" />;
      case 'reddit':
        return <RedditIcon className="w-5 h-5 text-orange-500" />;
      case 'pinterest':
        return <PinterestIcon className="w-5 h-5 text-rose-500" />;
      case 'vimeo':
        return <VimeoIcon className="w-5 h-5 text-cyan-400" />;
      default:
        return <Video className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section className="mt-20 w-full max-w-6xl mx-auto px-4">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Universal Platform Support</span>
        </div>
        <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Supported Media Platforms
        </h2>
        <p className="mt-2 text-sm text-neutral-400 max-w-xl mx-auto">
          MediaDrop connects to permitted public endpoints and extracts original quality video, audio, and thumbnails.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {platforms.map((p) => (
          <div
            key={p.id}
            className="group relative rounded-2xl border border-neutral-800/90 bg-neutral-950/60 p-5 backdrop-blur-sm transition-all hover:border-neutral-700 hover:bg-neutral-900/60 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 group-hover:border-indigo-500/40 transition-colors">
                  {getIcon(p.id)}
                </div>
                <span className="font-bold text-white text-base">{p.name}</span>
              </div>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20" />
            </div>

            <p className="mt-3 text-xs text-neutral-400 leading-relaxed line-clamp-2">
              {p.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5 text-[10px] font-medium text-neutral-300">
              {p.supportedFeatures.video && (
                <span className="rounded-md bg-neutral-900 border border-neutral-800 px-2 py-0.5">
                  ✓ MP4 Video
                </span>
              )}
              {p.supportedFeatures.audio && (
                <span className="rounded-md bg-neutral-900 border border-neutral-800 px-2 py-0.5">
                  ✓ MP3 Audio
                </span>
              )}
              {p.supportedFeatures.hd && (
                <span className="rounded-md bg-indigo-950/60 border border-indigo-800/40 text-indigo-300 px-2 py-0.5">
                  HD / 4K
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
