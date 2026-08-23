'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldAlert } from 'lucide-react';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Which platforms are currently supported?',
      a: 'MediaDrop supports YouTube, TikTok, Instagram (Reels/Posts), X (Twitter), Facebook, Reddit, Pinterest, Vimeo, and direct media URLs.',
    },
    {
      q: 'Does MediaDrop download private or DRM-protected content?',
      a: 'No. MediaDrop is strictly designed for publicly accessible media. We do not bypass DRM, authentication walls, paywalls, or private account permissions under any circumstances.',
    },
    {
      q: 'How long are downloaded files kept on the server?',
      a: 'All downloaded temporary files are automatically deleted from server storage within 30 minutes to safeguard disk integrity and user privacy.',
    },
    {
      q: 'Can I extract audio only (e.g. MP3)?',
      a: 'Yes. For any supported video source, you can select the "Audio Only" tab to extract high-bitrate audio in MP3 or M4A container formats.',
    },
  ];

  return (
    <section className="mt-24 w-full max-w-4xl mx-auto px-4">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          Everything you need to know about formats, privacy, and supported platforms.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="rounded-2xl border border-neutral-800 bg-neutral-950/60 overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-white transition-colors hover:bg-neutral-900/50 cursor-pointer"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                  openIndex === i ? 'rotate-180 text-cyan-400' : ''
                }`}
              />
            </button>

            {openIndex === i && (
              <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-400 leading-relaxed border-t border-neutral-800/60 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legal & Usage Notice Banner */}
      <div className="mt-12 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5 flex items-start gap-3.5">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-neutral-400 leading-relaxed">
          <strong className="text-neutral-200 block mb-1">Legal & Fair Use Notice</strong>
          MediaDrop is intended for personal archiving and fair use of publicly available content. Users are responsible for complying with the terms of service of respective media hosts and applicable copyright laws in their jurisdiction.
        </div>
      </div>
    </section>
  );
}
