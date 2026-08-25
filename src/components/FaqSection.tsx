'use client';

import React from 'react';

export function FaqSection() {
  const faqs = [
    {
      q: 'Is MediaDrop free to use?',
      a: 'Yes, MediaDrop is 100% free with no sign-ups, no subscriptions, and no download limits.',
    },
    {
      q: 'What video and audio qualities are available?',
      a: 'We support all formats published by the creator: 4K (2160p), 1440p, 1080p Full HD, 720p HD, and MP3 audio at 320 kbps and 128 kbps.',
    },
    {
      q: 'Does it work on mobile phones?',
      a: 'Yes. MediaDrop works directly in Safari on iOS and Chrome on Android without needing any app.',
    },
    {
      q: 'Where are my downloaded files saved?',
      a: 'Files are saved to your browser’s default Downloads folder or your device’s Files/Gallery app.',
    },
    {
      q: 'Can I download private or password-protected content?',
      a: 'No. MediaDrop only processes publicly accessible links.',
    },
  ];

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          Everything you need to know about formats and compatibility.
        </p>
      </div>

      <div className="grid gap-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6"
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
    </section>
  );
}
