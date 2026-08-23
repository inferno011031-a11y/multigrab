'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowDownToLine } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-neutral-800/80 bg-neutral-950/80 backdrop-blur-xl mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/20 text-cyan-400">
              <ArrowDownToLine className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">
                Media<span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Drop</span>
              </span>
              <p className="text-xs text-neutral-500">Universal Video & Audio Downloader</p>
            </div>
          </div>

          {/* Clean Navigation Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/youtube-downloader" className="hover:text-white transition-colors">
              YouTube
            </Link>
            <Link href="/spotify-downloader" className="hover:text-white transition-colors">
              Spotify
            </Link>
            <Link href="/tiktok-downloader" className="hover:text-white transition-colors">
              TikTok
            </Link>
            <Link href="/instagram-downloader" className="hover:text-white transition-colors">
              Instagram
            </Link>
            <Link href="/#platforms" className="hover:text-white transition-colors">
              All Platforms
            </Link>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="mt-8 border-t border-neutral-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} MediaDrop. All rights reserved.</p>
          <p className="text-[11px] text-neutral-600">For personal archival and offline viewing of public media.</p>
        </div>
      </div>
    </footer>
  );
}
