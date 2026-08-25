import React from 'react';
import Link from 'next/link';
import { ArrowDownToLine, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-neutral-900 bg-black py-12 px-4 sm:px-6 lg:px-8 text-neutral-400">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-neutral-900">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black">
                <ArrowDownToLine className="h-4 w-4 stroke-[2.5]" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                MediaDrop
              </span>
            </div>
            <p className="text-xs leading-relaxed text-neutral-500">
              The modern, clean online media downloader. Save public videos and high-fidelity MP3 audio in top quality with no ads, no trackers, and zero software required.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>100% Free • No Logs • Safe Downloads</span>
            </div>
          </div>

          {/* Col 2: YouTube Downloader Cluster */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              YouTube Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/youtube-downloader" className="hover:text-white transition-colors">
                  YouTube Video Downloader (4K/1080p)
                </Link>
              </li>
              <li>
                <Link href="/youtube-to-mp3" className="hover:text-white transition-colors">
                  YouTube to MP3 (320 kbps)
                </Link>
              </li>
              <li>
                <Link href="/youtube-shorts-downloader" className="hover:text-white transition-colors">
                  YouTube Shorts Downloader
                </Link>
              </li>
              <li>
                <Link href="/youtube-to-mp4" className="hover:text-white transition-colors">
                  YouTube to MP4 Converter
                </Link>
              </li>
              <li>
                <Link href="/youtube-1080p-downloader" className="hover:text-white transition-colors">
                  YouTube 1080p 60FPS Downloader
                </Link>
              </li>
              <li>
                <Link href="/youtube-4k-downloader" className="hover:text-white transition-colors">
                  YouTube 4K UHD Downloader
                </Link>
              </li>
              <li>
                <Link href="/youtube-audio-downloader" className="hover:text-white transition-colors">
                  YouTube Audio Track Extractor
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Other Popular Downloaders */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Social Downloaders
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/spotify-downloader" className="hover:text-white transition-colors">
                  Spotify Song Downloader (320kbps MP3)
                </Link>
              </li>
              <li>
                <Link href="/tiktok-downloader" className="hover:text-white transition-colors">
                  TikTok Downloader Without Watermark
                </Link>
              </li>
              <li>
                <Link href="/instagram-downloader" className="hover:text-white transition-colors">
                  Instagram Reels Downloader
                </Link>
              </li>
              <li>
                <Link href="/twitter-downloader" className="hover:text-white transition-colors">
                  X / Twitter Video Downloader
                </Link>
              </li>
              <li>
                <Link href="/facebook-downloader" className="hover:text-white transition-colors">
                  Facebook Video Downloader
                </Link>
              </li>
              <li>
                <Link href="/reddit-downloader" className="hover:text-white transition-colors">
                  Reddit Video Downloader with Audio
                </Link>
              </li>
              <li>
                <Link href="/pinterest-downloader" className="hover:text-white transition-colors">
                  Pinterest Video Pin Saver
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: International & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Languages & Fair Use
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <Link href="/" className="hover:text-white transition-colors">🇺🇸 English</Link>
              <Link href="/es" className="hover:text-white transition-colors">🇪🇸 Español</Link>
              <Link href="/pt" className="hover:text-white transition-colors">🇧🇷 Português</Link>
              <Link href="/hi" className="hover:text-white transition-colors">🇮🇳 हिन्दी</Link>
              <Link href="/fr" className="hover:text-white transition-colors">🇫🇷 Français</Link>
              <Link href="/de" className="hover:text-white transition-colors">🇩🇪 Deutsch</Link>
              <Link href="/ar" className="hover:text-white transition-colors">🇸🇦 العربية</Link>
              <Link href="/id" className="hover:text-white transition-colors">🇮🇩 Indonesia</Link>
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed pt-2">
              MediaDrop is intended solely for personal, non-commercial offline archiving of public content under applicable fair use principles.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <div>
            © {new Date().getFullYear()} <strong className="text-neutral-300">MediaDrop</strong>. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/sitemap.xml" className="hover:text-white transition-colors">
              XML Sitemap
            </Link>
            <Link href="/robots.txt" className="hover:text-white transition-colors">
              Robots.txt
            </Link>
            <Link href="/api/health/providers" className="hover:text-white transition-colors">
              System Health
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
