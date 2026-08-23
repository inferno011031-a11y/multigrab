'use client';

import React from 'react';
import { ArrowDownToLine, History, Sparkles, Terminal, Crown } from 'lucide-react';

interface NavbarProps {
  onOpenHistory: () => void;
  onOpenApi: () => void;
  onOpenPricing: () => void;
  historyCount: number;
}

export function Navbar({ onOpenHistory, onOpenApi, onOpenPricing, historyCount }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-neutral-950">
                <ArrowDownToLine className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">Media<span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Drop</span></span>
                <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-400 ring-1 ring-cyan-500/30">
                  SAAS v1.0
                </span>
              </div>
              <span className="text-[11px] text-neutral-400">Multi-Platform Downloader</span>
            </div>
          </a>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-300">
          <a href="#" className="hover:text-white transition-colors">Downloader</a>
          <button onClick={onOpenPricing} className="hover:text-white transition-colors cursor-pointer">Pricing</button>
          <button onClick={onOpenApi} className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Developer API</span>
          </button>
        </nav>

        {/* Actions & Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenHistory}
            className="group relative flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/90 px-3.5 py-2 text-xs font-medium text-neutral-300 transition-all hover:border-neutral-700 hover:bg-neutral-800 hover:text-white cursor-pointer"
          >
            <History className="h-4 w-4 text-neutral-400 transition-transform group-hover:rotate-[-20deg] group-hover:text-cyan-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-indigo-500/20 px-1 text-[11px] font-bold text-indigo-400 ring-1 ring-indigo-500/40">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenPricing}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-3.5 py-2 text-xs font-bold text-black shadow-md shadow-cyan-500/20 hover:opacity-95 transition-all cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Get Pro</span>
          </button>
        </div>
      </div>
    </header>
  );
}
