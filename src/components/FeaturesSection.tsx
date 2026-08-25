'use client';

import React from 'react';
import {
  Film,
  Music,
  CheckCircle,
  Smartphone,
  Shield,
  Layers,
} from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: <Film className="w-5 h-5 text-white" />,
      title: 'Full Quality 4K & 1080p',
      description:
        'Download original quality video streams up to 4K 2160p and 1080p Full HD with synchronized stereo audio.',
    },
    {
      icon: <Music className="w-5 h-5 text-white" />,
      title: 'Direct MP3 Audio Extraction',
      description:
        'Convert any video or Spotify track into high-bitrate 320 kbps or 128 kbps MP3 files for offline listening.',
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-white" />,
      title: '100% Free & Unlimited',
      description:
        'No account required, no download queues, no paywalls, and no daily conversion caps.',
    },
    {
      icon: <Shield className="w-5 h-5 text-white" />,
      title: 'No Popups or Shady Redirects',
      description:
        'Clean and straightforward. No fake download buttons, intrusive pop-unders, or malware redirects.',
    },
    {
      icon: <Smartphone className="w-5 h-5 text-white" />,
      title: 'Works on Any Phone or PC',
      description:
        'Download directly in Safari, Chrome, or Firefox on iOS, Android, macOS, Windows, and Linux.',
    },
    {
      icon: <Layers className="w-5 h-5 text-white" />,
      title: 'All Your Favorite Platforms',
      description:
        'Supports YouTube, Spotify, TikTok, Instagram, X (Twitter), Facebook, Reddit, Pinterest, and Vimeo in one place.',
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Why Use MediaDrop?
        </h2>
        <p className="mt-2 text-sm text-neutral-400 max-w-xl mx-auto">
          Fast, direct downloads without the spam and popups found on other tools.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 transition-all hover:border-neutral-700 hover:bg-neutral-900/50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 mb-4">
              {f.icon}
            </div>
            <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
