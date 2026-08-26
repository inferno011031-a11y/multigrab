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
      icon: <Film className="w-5 h-5 text-cyan-400" />,
      title: 'Full Quality 4K & 1080p',
      description:
        'Download original quality video streams up to 4K 2160p and 1080p Full HD with synchronized stereo audio.',
      borderHover: 'hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      icon: <Music className="w-5 h-5 text-purple-400" />,
      title: 'Direct MP3 Audio Extraction',
      description:
        'Convert any video or Spotify track into high-bitrate 320 kbps or 128 kbps MP3 files for offline listening.',
      borderHover: 'hover:border-purple-500/40',
      iconBg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      title: '100% Free & Unlimited',
      description:
        'No account required, no download queues, no paywalls, and no daily conversion caps.',
      borderHover: 'hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: <Shield className="w-5 h-5 text-indigo-400" />,
      title: 'No Popups or Shady Redirects',
      description:
        'Clean and straightforward. No fake download buttons, intrusive pop-unders, or malware redirects.',
      borderHover: 'hover:border-indigo-500/40',
      iconBg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      icon: <Smartphone className="w-5 h-5 text-sky-400" />,
      title: 'Works on Any Phone or PC',
      description:
        'Download directly in Safari, Chrome, or Firefox on iOS, Android, macOS, Windows, and Linux.',
      borderHover: 'hover:border-sky-500/40',
      iconBg: 'bg-sky-500/10 border-sky-500/20',
    },
    {
      icon: <Layers className="w-5 h-5 text-amber-400" />,
      title: 'All Your Favorite Platforms',
      description:
        'Supports YouTube, Spotify, TikTok, Instagram, X (Twitter), Facebook, Reddit, Pinterest, and Vimeo in one place.',
      borderHover: 'hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Why Use MultiGrab?
        </h2>
        <p className="mt-2 text-sm text-zinc-400 max-w-xl mx-auto">
          Fast, direct downloads without the spam, redirects, and popups found on other tools.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, idx) => (
          <div
            key={idx}
            className={`rounded-3xl border border-zinc-800/80 bg-zinc-950/60 p-6 backdrop-blur-xl transition-all duration-300 ${f.borderHover} hover:bg-zinc-900/80 shadow-lg`}
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${f.iconBg} mb-4 shadow-sm`}>
              {f.icon}
            </div>
            <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
