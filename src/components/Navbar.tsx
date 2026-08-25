'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowDownToLine, History, Terminal, ChevronDown, Activity, PlaySquare } from 'lucide-react';
import { LanguageSelector } from '@/components/LanguageSelector';
import { SupportedLocale } from '@/lib/i18n';

interface NavbarProps {
  onOpenHistory: () => void;
  onOpenApi: () => void;
  historyCount: number;
  locale?: SupportedLocale;
}

export function Navbar({ onOpenHistory, onOpenApi, historyCount, locale = 'en' }: NavbarProps) {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isYoutubeOpen, setIsYoutubeOpen] = useState(false);

  const prefix = locale === 'en' ? '' : `/${locale}`;

  const youtubeTools = [
    { name: 'YouTube Video Downloader (4K/1080p)', href: `${prefix}/youtube-downloader` },
    { name: 'YouTube to MP3 (320 kbps)', href: `${prefix}/youtube-to-mp3` },
    { name: 'YouTube Shorts Downloader', href: `${prefix}/youtube-shorts-downloader` },
    { name: 'YouTube to MP4 Converter', href: `${prefix}/youtube-to-mp4` },
    { name: 'YouTube 1080p 60FPS Downloader', href: `${prefix}/youtube-1080p-downloader` },
    { name: 'YouTube 4K UHD Downloader', href: `${prefix}/youtube-4k-downloader` },
    { name: 'YouTube Audio Extractor', href: `${prefix}/youtube-audio-downloader` },
  ];

  const otherTools = [
    { name: 'Spotify Downloader (320kbps MP3)', href: `${prefix}/spotify-downloader` },
    { name: 'Spotify to MP3', href: `${prefix}/spotify-to-mp3` },
    { name: 'TikTok Downloader (No Watermark)', href: `${prefix}/tiktok-downloader` },
    { name: 'TikTok to MP3', href: `${prefix}/tiktok-mp3-downloader` },
    { name: 'Instagram Reels Downloader', href: `${prefix}/instagram-downloader` },
    { name: 'X / Twitter Video Downloader', href: `${prefix}/twitter-downloader` },
    { name: 'Facebook Video Downloader', href: `${prefix}/facebook-downloader` },
    { name: 'Reddit Video Downloader', href: `${prefix}/reddit-downloader` },
    { name: 'Pinterest Video Downloader', href: `${prefix}/pinterest-downloader` },
    { name: 'Vimeo Video Downloader', href: `${prefix}/vimeo-downloader` },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-900 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href={prefix || '/'} className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black transition-transform group-hover:scale-105">
              <ArrowDownToLine className="h-4 w-4 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white">
                  MediaDrop
                </span>
                <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-medium text-neutral-400 border border-neutral-800">
                  FREE
                </span>
              </div>
              <span className="text-[11px] text-neutral-500">Universal Downloader</span>
            </div>
          </Link>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-neutral-400">
          <Link href={prefix || '/'} className="hover:text-white transition-colors">
            Home
          </Link>

          {/* YouTube Hub Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsYoutubeOpen(!isYoutubeOpen);
                setIsToolsOpen(false);
              }}
              onBlur={() => setTimeout(() => setIsYoutubeOpen(false), 200)}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <PlaySquare className="w-3.5 h-3.5" />
              <span>YouTube</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isYoutubeOpen ? 'rotate-180' : ''}`} />
            </button>

            {isYoutubeOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl border border-neutral-800 bg-neutral-950 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  YouTube Tools
                </div>
                {youtubeTools.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    onClick={() => setIsYoutubeOpen(false)}
                    className="block rounded-xl px-3 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* All Platforms Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsToolsOpen(!isToolsOpen);
                setIsYoutubeOpen(false);
              }}
              onBlur={() => setTimeout(() => setIsToolsOpen(false), 200)}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <span>Platforms</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
            </button>

            {isToolsOpen && (
              <div className="absolute top-full left-0 mt-2 w-60 rounded-2xl border border-neutral-800 bg-neutral-950 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 z-50">
                {otherTools.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    onClick={() => setIsToolsOpen(false)}
                    className="block rounded-xl px-3 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href={`${prefix || ''}/#features`} className="hover:text-white transition-colors">
            Features
          </Link>

          <button
            onClick={onOpenApi}
            className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>API</span>
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <LanguageSelector currentLocale={locale} />

          <Link
            href="/api/health/providers"
            target="_blank"
            rel="noopener noreferrer"
            title="Live Status"
            className="hidden lg:flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900/60 px-2.5 py-1.5 text-[11px] font-medium text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
          >
            <Activity className="w-3 h-3 text-white" />
            <span>Status</span>
          </Link>

          <button
            onClick={onOpenHistory}
            className="group relative flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/90 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-all hover:border-neutral-700 hover:bg-neutral-800 hover:text-white cursor-pointer"
          >
            <History className="h-4 w-4 text-neutral-400 transition-transform group-hover:text-white" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="flex h-4 min-w-[18px] items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-black">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
