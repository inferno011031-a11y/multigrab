'use client';

import React from 'react';
import { ArrowDownToLine, Shield, Code } from 'lucide-react';

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
              <p className="text-xs text-neutral-500">Universal Public Media Downloader & Audio Extractor</p>
            </div>
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>SSRF & Malware Firewall</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Code className="w-4 h-4 text-indigo-400" />
              <span>Open Source & Free</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 border-t border-neutral-800/60 pt-6 text-center text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} MediaDrop. All rights reserved. Built with Next.js, TypeScript & Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
