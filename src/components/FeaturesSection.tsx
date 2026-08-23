'use client';

import React from 'react';
import { Shield, Zap, Sliders, Lock, CheckCircle, RefreshCw } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: <Zap className="w-5 h-5 text-cyan-400" />,
      title: 'Ultra-Fast Direct Extraction',
      description: 'Streamlined asynchronous pipeline that extracts and packages media directly without redundant transcoding lag.',
    },
    {
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      title: 'Security-First Architecture',
      description: 'Built-in SSRF protection firewall, isolated temporary sandbox folders, and strict parameter validation.',
    },
    {
      icon: <Sliders className="w-5 h-5 text-indigo-400" />,
      title: 'Multiple Quality Profiles',
      description: 'Choose your desired resolution up to 4K Ultra HD or extract clean, high-fidelity audio (MP3 / M4A).',
    },
    {
      icon: <Lock className="w-5 h-5 text-purple-400" />,
      title: 'Privacy & Automated Expiry',
      description: 'No unnecessary persistent logs of your downloaded media files. Temporary files are auto-purged within 30 minutes.',
    },
  ];

  return (
    <section className="mt-24 w-full max-w-6xl mx-auto px-4">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Engineered for Performance & Security
        </h2>
        <p className="mt-2 text-sm text-neutral-400 max-w-xl mx-auto">
          Every layer of MediaDrop is built with enterprise standards from background queues to secure streaming.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="flex items-start gap-4 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6 backdrop-blur-sm"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-900 border border-neutral-800">
              {f.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{f.title}</h3>
              <p className="mt-1 text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {f.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
