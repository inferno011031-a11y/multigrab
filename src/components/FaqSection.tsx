'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';

export function FaqSection() {
  const faqs = [
    {
      q: 'Is MediaDrop free to use?',
      a: 'Yes, MediaDrop is 100% free and open-source with no registration, no hidden fees, and no artificial download throttling.',
    },
    {
      q: 'What media qualities are supported?',
      a: 'We support all formats published by the creator: 4K Ultra HD (2160p), 2K Quad HD (1440p), 1080p Full HD, 720p HD, 480p SD, 360p, and audio extractions (MP3 320 kbps & 128 kbps, M4A).',
    },
    {
      q: 'How are downloaded files kept secure?',
      a: 'Every download link is protected by an ephemeral HMAC-SHA256 signed token valid for 30 minutes. Once downloaded or expired, temporary media files are automatically removed from our servers by our automated garbage collector.',
    },
    {
      q: 'Can I download private or password-protected media?',
      a: 'No. MediaDrop strictly respects platform boundaries and DRM controls. It only extracts and processes publicly accessible media.',
    },
  ];

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          Everything you need to know about formats, security, and policies.
        </p>
      </div>

      <div className="grid gap-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-5 sm:p-6 backdrop-blur-md"
          >
            <h3 className="text-sm sm:text-base font-bold text-white mb-2">
              {faq.q}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      {/* Fair use notice */}
      <div className="mt-10 flex items-start gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/30 p-4 text-xs text-neutral-400">
        <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-neutral-200">Fair Use & Platform Compliance:</span>{' '}
          MediaDrop is designed for personal archival and downloading of publicly accessible content. Please respect copyright laws and creator intellectual property rights.
        </div>
      </div>
    </section>
  );
}
