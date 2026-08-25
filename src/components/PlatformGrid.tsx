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
import { Globe, Video, Music, ArrowRight } from 'lucide-react';

interface PlatformGridProps {
  platforms: PlatformInfo[];
  onSelectPlatformSample?: (url: string) => void;
}

export function PlatformGrid({ platforms, onSelectPlatformSample }: PlatformGridProps) {
  const getPlatformConfig = (iconName: string) => {
    switch (iconName) {
      case 'youtube':
        return {
          icon: <YoutubeIcon className="w-6 h-6" />,
          accentGlow: 'hover:border-red-500/50 hover:shadow-red-500/10 group-hover:bg-red-500/10',
          badgeBg: 'bg-red-500/10 text-red-400 border-red-500/20',
          borderHover: 'hover:border-red-500/40',
        };
      case 'spotify':
        return {
          icon: <SpotifyIcon className="w-6 h-6" />,
          accentGlow: 'hover:border-emerald-500/50 hover:shadow-emerald-500/10 group-hover:bg-emerald-500/10',
          badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          borderHover: 'hover:border-emerald-500/40',
        };
      case 'tiktok':
        return {
          icon: <TiktokIcon className="w-6 h-6" />,
          accentGlow: 'hover:border-cyan-400/50 hover:shadow-cyan-500/10 group-hover:bg-cyan-500/10',
          badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
          borderHover: 'hover:border-cyan-400/40',
        };
      case 'instagram':
        return {
          icon: <InstagramIcon className="w-6 h-6" />,
          accentGlow: 'hover:border-pink-500/50 hover:shadow-pink-500/10 group-hover:bg-pink-500/10',
          badgeBg: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
          borderHover: 'hover:border-pink-500/40',
        };
      case 'twitter':
        return {
          icon: <TwitterIcon className="w-6 h-6" />,
          accentGlow: 'hover:border-sky-500/50 hover:shadow-sky-500/10 group-hover:bg-sky-500/10',
          badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
          borderHover: 'hover:border-sky-500/40',
        };
      case 'facebook':
        return {
          icon: <FacebookIcon className="w-6 h-6" />,
          accentGlow: 'hover:border-blue-500/50 hover:shadow-blue-500/10 group-hover:bg-blue-500/10',
          badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          borderHover: 'hover:border-blue-500/40',
        };
      case 'reddit':
        return {
          icon: <RedditIcon className="w-6 h-6" />,
          accentGlow: 'hover:border-orange-500/50 hover:shadow-orange-500/10 group-hover:bg-orange-500/10',
          badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
          borderHover: 'hover:border-orange-500/40',
        };
      case 'pinterest':
        return {
          icon: <PinterestIcon className="w-6 h-6" />,
          accentGlow: 'hover:border-rose-600/50 hover:shadow-rose-600/10 group-hover:bg-rose-600/10',
          badgeBg: 'bg-rose-600/10 text-rose-400 border-rose-600/20',
          borderHover: 'hover:border-rose-600/40',
        };
      case 'vimeo':
        return {
          icon: <VimeoIcon className="w-6 h-6" />,
          accentGlow: 'hover:border-cyan-500/50 hover:shadow-cyan-500/10 group-hover:bg-cyan-500/10',
          badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
          borderHover: 'hover:border-cyan-500/40',
        };
      default:
        return {
          icon: <Globe className="w-6 h-6 text-indigo-400" />,
          accentGlow: 'hover:border-indigo-500/50 hover:shadow-indigo-500/10 group-hover:bg-indigo-500/10',
          badgeBg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
          borderHover: 'hover:border-indigo-500/40',
        };
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 mb-3">
          <span>100% Native Provider Engine</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Supported Media Platforms
        </h2>
        <p className="mt-2 text-sm text-zinc-400 max-w-xl mx-auto">
          Download HD video streams and master audio tracks from the web’s top content ecosystems.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform) => {
          const config = getPlatformConfig(platform.iconName);
          return (
            <div
              key={platform.id}
              className={`group relative flex flex-col justify-between rounded-3xl border border-zinc-800/80 bg-zinc-950/60 p-5 backdrop-blur-xl transition-all duration-300 ${config.borderHover} hover:bg-zinc-900/80 shadow-lg hover:shadow-2xl`}
            >
              <div>
                <div className="flex items-center justify-between">
                  {/* Platform Logo Box */}
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 transition-all duration-300 ${config.accentGlow}`}>
                    {config.icon}
                  </div>

                  {/* Micro Badges */}
                  <div className="flex items-center gap-1.5">
                    {platform.supportedFeatures.video && (
                      <span className="flex items-center gap-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
                        <Video className="w-3 h-3 text-indigo-400" />
                        <span>Video</span>
                      </span>
                    )}
                    {platform.supportedFeatures.audio && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                        <Music className="w-3 h-3 text-emerald-400" />
                        <span>Audio</span>
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="mt-4 text-base font-bold text-white tracking-tight group-hover:text-zinc-100 transition-colors">
                  {platform.name}
                </h3>
                <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {platform.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
                <span className="truncate max-w-[150px] font-mono text-zinc-400">{platform.domainPattern}</span>
                {Boolean(platform.examples && platform.examples.length > 0 && onSelectPlatformSample) && (
                  <button
                    onClick={() => onSelectPlatformSample?.(platform.examples![0])}
                    className="flex items-center gap-1 font-semibold text-indigo-400 hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    <span>Try Sample</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
