'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowDownToLine,
  Clock,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { LanguageSelector } from '@/components/LanguageSelector';
import { SupportedLocale, UI_DICTIONARY } from '@/lib/i18n';

interface NavbarProps {
  onOpenHistory: () => void;
  historyCount: number;
  locale?: SupportedLocale;
}

export function Navbar({
  onOpenHistory,
  historyCount,
  locale = 'en',
}: NavbarProps) {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = UI_DICTIONARY[locale] || UI_DICTIONARY.en;

  const tools = [
    { name: 'YouTube Downloader', href: '/youtube-downloader', badge: '4K/1080p' },
    { name: 'YouTube to MP3', href: '/youtube-to-mp3', badge: '320kbps' },
    { name: 'YouTube Shorts Saver', href: '/youtube-shorts-downloader', badge: 'Shorts' },
    { name: 'Spotify Downloader', href: '/spotify-downloader', badge: 'MP3' },
    { name: 'TikTok No Watermark', href: '/tiktok-downloader', badge: 'HD' },
    { name: 'TikTok to MP3 Audio', href: '/tiktok-to-mp3', badge: 'Sound' },
    { name: 'Instagram Reels Saver', href: '/instagram-downloader', badge: 'Reels' },
    { name: 'X / Twitter Video', href: '/twitter-downloader', badge: 'Direct' },
    { name: 'Facebook Video Saver', href: '/facebook-downloader', badge: 'MP4' },
    { name: 'Reddit Video Downloader', href: '/reddit-downloader', badge: 'Audio Mux' },
    { name: 'Pinterest Video Pin', href: '/pinterest-downloader', badge: 'HD' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href={locale === 'en' ? '/' : `/${locale}`} className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-500 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-zinc-950">
                <ArrowDownToLine className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1">
                Multi<span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Grab</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-zinc-300">
            {/* Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                onBlur={() => setTimeout(() => setIsToolsOpen(false), 200)}
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer"
                aria-haspopup="menu"
                aria-expanded={isToolsOpen}
                aria-label={t.navTools}
              >
                <span>{t.navTools}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    isToolsOpen ? 'rotate-180 text-cyan-400' : 'text-zinc-500'
                  }`}
                />
              </button>

              {isToolsOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 z-50 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Universal Extractors
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {tools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setIsToolsOpen(false)}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
                      >
                        <span>{tool.name}</span>
                        <span className="rounded-md bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300">
                          {tool.badge}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="#platforms"
              className="rounded-xl px-3 py-1.5 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              {t.navPlatforms}
            </Link>

            <Link
              href="#features"
              className="rounded-xl px-3 py-1.5 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              {t.navFeatures}
            </Link>
          </nav>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2.5">
          {/* Engine Live Status Pill */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>100% Active</span>
          </div>

          {/* History Drawer Trigger */}
          <button
            onClick={onOpenHistory}
            aria-label={historyCount > 0 ? `${historyCount} items in ${t.navHistory}` : t.navHistory}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-zinc-700 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer shadow-sm"
          >
            <Clock className="h-3.5 w-3.5 text-zinc-400" />
            <span className="hidden sm:inline">{t.navHistory}</span>
            {historyCount > 0 && (
              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white shadow-sm shadow-indigo-600/30">
                {historyCount}
              </span>
            )}
          </button>

          {/* Language Switcher */}
          <LanguageSelector currentLocale={locale} />

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="flex md:hidden rounded-xl border border-zinc-800 p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-4 py-4 space-y-3">
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-2 py-1">
              Top Downloaders
            </div>
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
              >
                <span>{tool.name}</span>
                <span className="rounded-md bg-indigo-500/10 text-[10px] font-semibold text-indigo-300 px-1.5 py-0.5">
                  {tool.badge}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
