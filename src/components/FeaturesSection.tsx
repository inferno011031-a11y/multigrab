'use client';

import React from 'react';
import {
  ShieldCheck,
  Zap,
  Sliders,
  Layers,
  FileCheck,
  Server,
} from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: <Zap className="w-5 h-5 text-cyan-400" />,
      title: 'Ultra-Fast Subprocess Engine',
      description:
        'Zero shell-injection execution with native streaming pipes for real-time progress, speed, and ETA calculation.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: 'DNS Pre-Lookup SSRF Firewall',
      description:
        'Blocks RFC 1918 private subnets, cloud metadata IPs, loopbacks, and intranet endpoints with strict pre-resolution.',
    },
    {
      icon: <Sliders className="w-5 h-5 text-indigo-400" />,
      title: 'Adaptive Video & Audio Muxing',
      description:
        'Automatically merges separate high-bitrate video streams and AAC audio tracks into standard MP4 containers.',
    },
    {
      icon: <Layers className="w-5 h-5 text-purple-400" />,
      title: 'Asynchronous Queue Architecture',
      description:
        'Powered by BullMQ and Redis for high-concurrency background job processing with seamless in-memory fallback.',
    },
    {
      icon: <FileCheck className="w-5 h-5 text-teal-400" />,
      title: 'HMAC-Signed Download Tokens',
      description:
        'Cryptographically signed ephemeral download URLs with automatic 30-minute expiration and background garbage collection.',
    },
    {
      icon: <Server className="w-5 h-5 text-amber-400" />,
      title: 'Universal Platform Providers',
      description:
        'Modular object-oriented provider registry supporting YouTube, TikTok, Instagram, X/Twitter, Facebook, Reddit, Pinterest, and Vimeo.',
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Engineered for Performance & Security
        </h2>
        <p className="mt-2 text-sm text-neutral-400 max-w-xl mx-auto">
          MediaDrop combines cutting-edge full-stack architecture with enterprise-grade security.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, idx) => (
          <div
            key={idx}
            className="rounded-3xl border border-neutral-800/80 bg-neutral-900/40 p-6 backdrop-blur-md transition-all hover:border-neutral-700 hover:bg-neutral-900/70 shadow-lg"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-800/80 mb-4 ring-1 ring-white/10">
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
