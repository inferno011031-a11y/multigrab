'use client';

import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  Clipboard,
  Loader2,
  Globe,
} from 'lucide-react';
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

interface UrlFormProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export function UrlForm({ onAnalyze, isLoading }: UrlFormProps) {
  const [url, setUrl] = useState('');

  // Automatically detect platform badge derived directly from url
  const detectedPlatform = useMemo(() => {
    const raw = url.trim().toLowerCase();
    if (!raw) return null;

    if (raw.includes('youtube.com') || raw.includes('youtu.be')) return 'youtube';
    if (raw.includes('spotify.com') || raw.includes('spotify.link')) return 'spotify';
    if (raw.includes('tiktok.com')) return 'tiktok';
    if (raw.includes('instagram.com') || raw.includes('instagr.am')) return 'instagram';
    if (raw.includes('twitter.com') || raw.includes('x.com')) return 'twitter';
    if (raw.includes('facebook.com') || raw.includes('fb.watch')) return 'facebook';
    if (raw.includes('reddit.com') || raw.includes('v.redd.it')) return 'reddit';
    if (raw.includes('pinterest.com') || raw.includes('pin.it')) return 'pinterest';
    if (raw.includes('vimeo.com')) return 'vimeo';
    if (raw.startsWith('http://') || raw.startsWith('https://')) return 'generic';

    return null;
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      onAnalyze(url.trim());
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
      }
    } catch {
      // Clipboard access not allowed
    }
  };

  const renderPlatformBadge = () => {
    switch (detectedPlatform) {
      case 'youtube':
        return (
          <div className="flex items-center gap-1.5 rounded-xl bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400 ring-1 ring-red-500/30 animate-in fade-in zoom-in-95 duration-200">
            <YoutubeIcon className="w-3.5 h-3.5" />
            <span>YouTube</span>
          </div>
        );
      case 'spotify':
        return (
          <div className="flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/30 animate-in fade-in zoom-in-95 duration-200">
            <SpotifyIcon className="w-3.5 h-3.5" />
            <span>Spotify</span>
          </div>
        );
      case 'tiktok':
        return (
          <div className="flex items-center gap-1.5 rounded-xl bg-pink-500/10 px-2.5 py-1 text-xs font-semibold text-pink-400 ring-1 ring-pink-500/30 animate-in fade-in zoom-in-95 duration-200">
            <TiktokIcon className="w-3.5 h-3.5" />
            <span>TikTok</span>
          </div>
        );
      case 'instagram':
        return (
          <div className="flex items-center gap-1.5 rounded-xl bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-400 ring-1 ring-purple-500/30 animate-in fade-in zoom-in-95 duration-200">
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>Instagram</span>
          </div>
        );
      case 'twitter':
        return (
          <div className="flex items-center gap-1.5 rounded-xl bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-400 ring-1 ring-cyan-500/30 animate-in fade-in zoom-in-95 duration-200">
            <TwitterIcon className="w-3.5 h-3.5" />
            <span>X / Twitter</span>
          </div>
        );
      case 'facebook':
        return (
          <div className="flex items-center gap-1.5 rounded-xl bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/30 animate-in fade-in zoom-in-95 duration-200">
            <FacebookIcon className="w-3.5 h-3.5" />
            <span>Facebook</span>
          </div>
        );
      case 'reddit':
        return (
          <div className="flex items-center gap-1.5 rounded-xl bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-400 ring-1 ring-orange-500/30 animate-in fade-in zoom-in-95 duration-200">
            <RedditIcon className="w-3.5 h-3.5" />
            <span>Reddit</span>
          </div>
        );
      case 'pinterest':
        return (
          <div className="flex items-center gap-1.5 rounded-xl bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400 ring-1 ring-rose-500/30 animate-in fade-in zoom-in-95 duration-200">
            <PinterestIcon className="w-3.5 h-3.5" />
            <span>Pinterest</span>
          </div>
        );
      case 'vimeo':
        return (
          <div className="flex items-center gap-1.5 rounded-xl bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-400 ring-1 ring-sky-500/30 animate-in fade-in zoom-in-95 duration-200">
            <VimeoIcon className="w-3.5 h-3.5" />
            <span>Vimeo</span>
          </div>
        );
      case 'generic':
        return (
          <div className="flex items-center gap-1.5 rounded-xl bg-neutral-800 px-2.5 py-1 text-xs font-semibold text-neutral-300 ring-1 ring-neutral-700 animate-in fade-in zoom-in-95 duration-200">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>Direct Web</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative mx-auto w-full max-w-3xl"
    >
      <div className="relative flex flex-col sm:flex-row items-center rounded-3xl border border-neutral-800 bg-neutral-900/80 p-2 sm:p-2.5 shadow-2xl backdrop-blur-xl transition-all focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10">
        {/* Left platform detected badge or globe */}
        <div className="hidden sm:flex items-center pl-3 pr-2">
          {renderPlatformBadge() || <Globe className="h-5 w-5 text-neutral-500" />}
        </div>

        {/* Input field */}
        <input
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste public link (YouTube, Spotify, TikTok, Instagram, X, etc.)..."
          className="h-12 w-full bg-transparent px-3 text-sm text-white placeholder-neutral-500 focus:outline-none sm:text-base"
        />

        {/* Action buttons */}
        <div className="flex w-full sm:w-auto items-center justify-end gap-2 mt-2 sm:mt-0 px-2 sm:px-0">
          {!url && (
            <button
              type="button"
              onClick={handlePaste}
              className="flex items-center gap-1.5 rounded-2xl border border-neutral-800 bg-neutral-800/80 px-3.5 py-2.5 text-xs font-semibold text-neutral-300 transition-colors hover:border-neutral-700 hover:bg-neutral-700 hover:text-white cursor-pointer"
            >
              <Clipboard className="h-3.5 w-3.5" />
              <span>Paste</span>
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:opacity-95 hover:shadow-indigo-500/40 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Extracting...</span>
              </>
            ) : (
              <>
                <span>Download</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
