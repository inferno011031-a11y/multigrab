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
    if (!detectedPlatform) return null;

    const iconMap: Record<string, React.ReactNode> = {
      youtube: <YoutubeIcon className="w-3.5 h-3.5 text-white" />,
      spotify: <SpotifyIcon className="w-3.5 h-3.5 text-white" />,
      tiktok: <TiktokIcon className="w-3.5 h-3.5 text-white" />,
      instagram: <InstagramIcon className="w-3.5 h-3.5 text-white" />,
      twitter: <TwitterIcon className="w-3.5 h-3.5 text-white" />,
      facebook: <FacebookIcon className="w-3.5 h-3.5 text-white" />,
      reddit: <RedditIcon className="w-3.5 h-3.5 text-white" />,
      pinterest: <PinterestIcon className="w-3.5 h-3.5 text-white" />,
      vimeo: <VimeoIcon className="w-3.5 h-3.5 text-white" />,
      generic: <Globe className="w-3.5 h-3.5 text-white" />,
    };

    const labelMap: Record<string, string> = {
      youtube: 'YouTube',
      spotify: 'Spotify',
      tiktok: 'TikTok',
      instagram: 'Instagram',
      twitter: 'X / Twitter',
      facebook: 'Facebook',
      reddit: 'Reddit',
      pinterest: 'Pinterest',
      vimeo: 'Vimeo',
      generic: 'Direct Web',
    };

    return (
      <div className="flex items-center gap-1.5 rounded-xl bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-xs font-medium text-white animate-in fade-in zoom-in-95 duration-200">
        {iconMap[detectedPlatform]}
        <span>{labelMap[detectedPlatform]}</span>
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative mx-auto w-full max-w-3xl"
    >
      <div className="relative flex flex-col sm:flex-row items-center rounded-2xl border border-neutral-800 bg-neutral-950 p-2 sm:p-2.5 shadow-2xl transition-all focus-within:border-neutral-600 focus-within:ring-1 focus-within:ring-white/10">
        {/* Left platform detected badge or globe */}
        <div className="hidden sm:flex items-center pl-3 pr-2">
          {renderPlatformBadge() || <Globe className="h-5 w-5 text-neutral-600" />}
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
              className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white cursor-pointer"
            >
              <Clipboard className="h-3.5 w-3.5" />
              <span>Paste</span>
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl bg-white text-black px-6 py-2.5 text-xs sm:text-sm font-semibold transition-all hover:bg-neutral-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-black" />
                <span>Extracting...</span>
              </>
            ) : (
              <>
                <span>Download</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
