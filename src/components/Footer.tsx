'use client';

import React from 'react';
import { ArrowDownToLine, ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-32 border-t border-neutral-850 bg-neutral-950 py-12 text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5">
              <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-neutral-950">
                <ArrowDownToLine className="h-4 w-4 text-cyan-400" />
              </div>
            </div>
            <span className="text-sm font-bold text-white tracking-tight">MediaDrop</span>
            <span className="text-xs text-neutral-500">© {new Date().getFullYear()} • Fast Public Media Downloader</span>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <span className="flex items-center gap-1.5 text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SSRF Protected</span>
            </span>
            <span className="text-neutral-600">•</span>
            <span>No DRM Bypassing</span>
            <span className="text-neutral-600">•</span>
            <span>Auto-Purge Storage</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
