import React from 'react';
import Link from 'next/link';
import { ArrowDownToLine, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950/90 py-12 px-4 sm:px-6 lg:px-8 text-zinc-300">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-zinc-800/60">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/20">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-950">
                  <ArrowDownToLine className="h-4 w-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Multi<span className="text-cyan-400">Grab</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400">
              MultiGrab is a modern universal media downloader. Save public videos and high-fidelity MP3 audio in top quality with no ads, no trackers, and zero software required.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
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
                <Link href="/youtube-downloader" className="text-zinc-300 hover:text-cyan-400 transition-colors">
                  YouTube Video Downloader (4K/1080p)
                </Link>
              </li>
              <li>
                <Link href="/youtube-to-mp3" className="text-zinc-300 hover:text-cyan-400 transition-colors">
                  YouTube to MP3 (320 kbps)
                </Link>
              </li>
              <li>
                <Link href="/youtube-shorts-downloader" className="text-zinc-300 hover:text-cyan-400 transition-colors">
                  YouTube Shorts Downloader
                </Link>
              </li>
              <li>
                <Link href="/youtube-to-mp4" className="text-zinc-300 hover:text-cyan-400 transition-colors">
                  YouTube to MP4 Converter
                </Link>
              </li>
              <li>
                <Link href="/youtube-1080p-downloader" className="text-zinc-300 hover:text-cyan-400 transition-colors">
                  YouTube 1080p 60FPS Downloader
                </Link>
              </li>
              <li>
                <Link href="/youtube-4k-downloader" className="text-zinc-300 hover:text-cyan-400 transition-colors">
                  YouTube 4K UHD Downloader
                </Link>
              </li>
              <li>
                <Link href="/youtube-audio-downloader" className="text-zinc-300 hover:text-cyan-400 transition-colors">
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
                <Link href="/tiktok-downloader" className="text-zinc-300 hover:text-cyan-400 transition-colors">
                  TikTok Downloader Without Watermark
                </Link>
              </li>
              <li>
                <Link href="/tiktok-to-mp3" className="text-zinc-300 hover:text-cyan-400 transition-colors">
                  TikTok to MP3 Audio Extractor
                </Link>
              </li>
              <li>
                <Link href="/spotify-downloader" className="text-zinc-300 hover:text-emerald-400 transition-colors">
                  Spotify Song Downloader (320kbps MP3)
                </Link>
              </li>
              <li>
                <Link href="/spotify-to-mp3" className="text-zinc-300 hover:text-emerald-400 transition-colors">
                  Spotify to MP3 Music Converter
                </Link>
              </li>
              <li>
                <Link href="/instagram-downloader" className="text-zinc-300 hover:text-pink-400 transition-colors">
                  Instagram Reels Downloader
                </Link>
              </li>
              <li>
                <Link href="/instagram-reels-downloader" className="text-zinc-300 hover:text-pink-400 transition-colors">
                  Instagram Reels 1080p HD Saver
                </Link>
              </li>
              <li>
                <Link href="/twitter-downloader" className="text-zinc-300 hover:text-sky-400 transition-colors">
                  X / Twitter Video Downloader
                </Link>
              </li>
              <li>
                <Link href="/facebook-downloader" className="text-zinc-300 hover:text-blue-400 transition-colors">
                  Facebook Video Downloader
                </Link>
              </li>
              <li>
                <Link href="/reddit-downloader" className="text-zinc-300 hover:text-orange-400 transition-colors">
                  Reddit Video Downloader with Audio
                </Link>
              </li>
              <li>
                <Link href="/pinterest-downloader" className="text-zinc-300 hover:text-rose-400 transition-colors">
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
              <Link href="/" className="text-zinc-300 hover:text-white transition-colors">🇺🇸 English</Link>
              <Link href="/es" className="text-zinc-300 hover:text-white transition-colors">🇪🇸 Español</Link>
              <Link href="/pt" className="text-zinc-300 hover:text-white transition-colors">🇧🇷 Português</Link>
              <Link href="/hi" className="text-zinc-300 hover:text-white transition-colors">🇮🇳 हिन्दी</Link>
              <Link href="/fr" className="text-zinc-300 hover:text-white transition-colors">🇫🇷 Français</Link>
              <Link href="/de" className="text-zinc-300 hover:text-white transition-colors">🇩🇪 Deutsch</Link>
              <Link href="/ar" className="text-zinc-300 hover:text-white transition-colors">🇸🇦 العربية</Link>
              <Link href="/id" className="text-zinc-300 hover:text-white transition-colors">🇮🇩 Indonesia</Link>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed pt-2">
              MultiGrab is intended solely for personal, non-commercial offline archiving of public content under applicable fair use principles.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <div>
            © {new Date().getFullYear()} <strong className="text-zinc-200">MultiGrab</strong>. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/sitemap.xml" className="text-zinc-400 hover:text-white transition-colors">
              XML Sitemap
            </Link>
            <Link href="/robots.txt" className="text-zinc-400 hover:text-white transition-colors">
              Robots.txt
            </Link>
            <Link href="/api/health/providers" className="text-zinc-400 hover:text-white transition-colors">
              System Health
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
