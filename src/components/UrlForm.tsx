'use client';

import React, { useState, useEffect } from 'react';
import { Search, Clipboard, X, Loader2, ArrowRight, Sparkles } from 'lucide-react';
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
import { SupportedPlatform } from '@/core/types/media';

interface UrlFormProps {
  onAnalyze: (url: string) => Promise<void>;
  isLoading: boolean;
  initialUrl?: string;
}

export function UrlForm({ onAnalyze, isLoading, initialUrl = '' }: UrlFormProps) {
  const [url, setUrl] = useState(initialUrl);
  const [detectedPlatform, setDetectedPlatform] = useState<SupportedPlatform | null>(null);

  // Quick platform detector for the UI badge
  useEffect(() => {
    const raw = url.trim().toLowerCase();
    if (!raw) {
      setDetectedPlatform(null);
      return;
    }

    if (raw.includes('youtube.com') || raw.includes('youtu.be')) {
      setDetectedPlatform('youtube');
    } else if (raw.includes('tiktok.com')) {
      setDetectedPlatform('tiktok');
    } else if (raw.includes('instagram.com') || raw.includes('instagr.am')) {
      setDetectedPlatform('instagram');
    } else if (raw.includes('twitter.com') || raw.includes('x.com')) {
      setDetectedPlatform('twitter');
    } else if (raw.includes('facebook.com') || raw.includes('fb.watch')) {
      setDetectedPlatform('facebook');
    } else if (raw.includes('reddit.com') || raw.includes('redd.it') || raw.includes('v.redd.it')) {
      setDetectedPlatform('reddit');
    } else if (raw.includes('pinterest.com') || raw.includes('pin.it')) {
      setDetectedPlatform('pinterest');
    } else if (raw.includes('vimeo.com')) {
      setDetectedPlatform('vimeo');
    } else if (raw.startsWith('http://') || raw.startsWith('https://')) {
      setDetectedPlatform('generic');
    } else {
      setDetectedPlatform(null);
    }
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isLoading) return;
    onAnalyze(url.trim());
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        onAnalyze(text.trim());
      }
    } catch {
      // Clipboard permissions denied
    }
  };

  const handleClear = () => {
    setUrl('');
    setDetectedPlatform(null);
  };

  const getPlatformBadge = () => {
    switch (detectedPlatform) {
      case 'youtube':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
            <YouTubeIcon className="w-3.5 h-3.5 text-red-500" />
            <span>YouTube Detected</span>
          </span>
        );
      case 'tiktok':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-pink-400 bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/20">
            <TikTokIcon className="w-3.5 h-3.5 text-pink-400" />
            <span>TikTok Detected</span>
          </span>
        );
      case 'instagram':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
            <InstagramIcon className="w-3.5 h-3.5 text-purple-400" />
            <span>Instagram Detected</span>
          </span>
        );
      case 'twitter':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
            <TwitterXIcon className="w-3.5 h-3.5 text-slate-200" />
            <span>X/Twitter Detected</span>
          </span>
        );
      case 'facebook':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
            <FacebookIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>Facebook Detected</span>
          </span>
        );
      case 'reddit':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
            <RedditIcon className="w-3.5 h-3.5 text-orange-400" />
            <span>Reddit Detected</span>
          </span>
        );
      case 'pinterest':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
            <PinterestIcon className="w-3.5 h-3.5 text-rose-400" />
            <span>Pinterest Detected</span>
          </span>
        );
      case 'vimeo':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
            <VimeoIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Vimeo Detected</span>
          </span>
        );
      case 'generic':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <span>Direct Web Media</span>
          </span>
        );
      default:
        return null;
    }
  };

  const sampleUrls = [
    { label: 'YouTube (Me at the zoo)', url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw' },
    { label: 'YouTube (Never Gonna Give You Up)', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { label: 'Vimeo Staff Pick', url: 'https://vimeo.com/76979871' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Input Form Card */}
      <div className="relative rounded-3xl p-1 bg-gradient-to-r from-cyan-500/30 via-indigo-500/30 to-purple-500/30 shadow-2xl shadow-indigo-950/50">
        <form
          onSubmit={handleSubmit}
          className="relative flex flex-col sm:flex-row items-center gap-2 rounded-[22px] bg-neutral-950 p-2 sm:p-2.5 border border-neutral-800"
        >
          {/* Left search icon */}
          <div className="hidden sm:flex pl-3 text-neutral-400">
            <Search className="h-5 w-5" />
          </div>

          {/* Main URL input */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste public link from YouTube, TikTok, Instagram, X, Reddit, Vimeo..."
              className="w-full bg-transparent px-3 py-3 text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none"
              disabled={isLoading}
              autoFocus
            />

            {/* Clear Button */}
            {url && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Actions Button Group */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Paste Button */}
            <button
              type="button"
              onClick={handlePaste}
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-xs font-medium text-neutral-300 transition-all hover:bg-neutral-800 hover:text-white"
            >
              <Clipboard className="h-4 w-4 text-neutral-400" />
              <span>Paste</span>
            </button>

            {/* Fetch / Analyze Submit Button */}
            <button
              type="submit"
              disabled={!url.trim() || isLoading}
              className="flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-500/20 transition-all hover:opacity-95 hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Fetch Media</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Platform Detection & Quick Examples */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-2">
        <div className="flex items-center gap-2">
          {detectedPlatform ? (
            getPlatformBadge()
          ) : (
            <span className="text-xs text-neutral-500">Supports public media only • Fast analysis</span>
          )}
        </div>

        {/* Quick Samples */}
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="hidden sm:inline text-neutral-500">Quick Test:</span>
          {sampleUrls.map((sample) => (
            <button
              key={sample.label}
              onClick={() => {
                setUrl(sample.url);
                onAnalyze(sample.url);
              }}
              disabled={isLoading}
              className="rounded-lg bg-neutral-900/80 px-2.5 py-1 text-[11px] text-neutral-400 hover:bg-neutral-800 hover:text-cyan-400 transition-colors cursor-pointer border border-neutral-800/80"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
