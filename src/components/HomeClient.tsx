'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { UrlForm } from '@/components/UrlForm';
import { MediaInspector } from '@/components/MediaInspector';
import { MediaInspectorSkeleton } from '@/components/MediaInspectorSkeleton';
import { PlatformGrid } from '@/components/PlatformGrid';
import { FeaturesSection } from '@/components/FeaturesSection';
import { FaqSection } from '@/components/FaqSection';
import { Footer } from '@/components/Footer';
import { AdBanner } from '@/components/AdBanner';
import { MediaMetadata, DownloadJob } from '@/core/types/media';
import { DEFAULT_PLATFORMS_INFO } from '@/lib/constants';
import { AlertCircle, Share2, Zap } from 'lucide-react';

const DownloadProgressModal = dynamic(
  () => import('@/components/DownloadProgressModal').then((m) => m.DownloadProgressModal),
  { ssr: false }
);

const DownloadHistory = dynamic(
  () => import('@/components/DownloadHistory').then((m) => m.DownloadHistory),
  { ssr: false }
);

interface HistoryItem {
  id: string;
  title: string;
  url: string;
  platform: string;
  filename?: string;
  fileSize?: number;
  downloadUrl?: string;
  timestamp: number;
}

export function HomeClient() {
  const searchParams = useSearchParams();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metadata, setMetadata] = useState<MediaMetadata | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('multigrab_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const saveToHistory = (item: HistoryItem) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.id !== item.id);
      const updated = [item, ...filtered].slice(0, 30);
      try {
        localStorage.setItem('multigrab_history', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('multigrab_history');
    } catch {}
  };

  const handleAnalyze = async (url: string) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setMetadata(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const json = await res.json();

      if (!json.success) {
        setErrorMessage(json.error?.message || 'Failed to extract media. Please verify URL.');
        return;
      }

      setMetadata(json.data);
    } catch {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    const queryUrl = searchParams.get('url');
    if (queryUrl && queryUrl.startsWith('http')) {
      const timer = setTimeout(() => {
        handleAnalyze(queryUrl);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleStartDownload = async (formatId: string, qualityLabel: string) => {
    if (!metadata) return;

    setIsDownloading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: metadata.originalUrl,
          formatId,
          quality: qualityLabel,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        setErrorMessage(json.error?.message || 'Failed to schedule download.');
        setIsDownloading(false);
        return;
      }

      setActiveJobId(json.data.jobId);
    } catch {
      setErrorMessage('Network error scheduling download job.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleJobCompleted = (job: DownloadJob) => {
    if (metadata) {
      saveToHistory({
        id: job.id,
        title: metadata.title,
        url: metadata.originalUrl,
        platform: metadata.platformName,
        filename: job.filename,
        fileSize: job.fileSize,
        downloadUrl: job.downloadUrl,
        timestamp: Date.now(),
      });
    }
  };

  const handleShareApp = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'MultiGrab - Universal Video & Audio Downloader',
          text: 'Download public videos and MP3 audio from YouTube, Spotify, TikTok, Instagram, and more!',
          url: window.location.origin,
        });
        return;
      } catch {}
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-zinc-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-10 sm:pt-24 sm:pb-16 px-4 text-center">
          {/* Ambient Gradient Mesh Backdrop Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[480px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-[110px] pointer-events-none -z-10" />
          <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

          <div className="mx-auto max-w-4xl">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 mb-6 shadow-sm shadow-indigo-500/10">
              <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              <span>Universal Video & Audio Downloader</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Paste a link.{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Download the file.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-5 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
              Download high-resolution videos and master MP3 audio from YouTube, Spotify, TikTok, Instagram, X/Twitter, Reddit, Facebook, Pinterest, and Vimeo. Free, instant, and no software required.
            </p>

            {/* URL Form Input */}
            <div className="mt-8 sm:mt-10">
              <UrlForm
                onAnalyze={handleAnalyze}
                isLoading={isAnalyzing}
              />
            </div>

            {/* Quick Share */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={handleShareApp}
                aria-label="Share MultiGrab"
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-950 px-3.5 py-1 text-xs text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{shareCopied ? 'Link Copied!' : 'Share MultiGrab'}</span>
              </button>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="mt-6 mx-auto max-w-xl flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-left text-sm text-red-200 backdrop-blur-xl">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span className="flex-1">{errorMessage}</span>
                <button
                  onClick={() => setErrorMessage(null)}
                  aria-label="Dismiss error message"
                  className="text-xs font-bold text-red-300 hover:underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Optional Monetization Banner Slot */}
        <AdBanner slotId="hero-bottom" />

        {/* Instant Skeleton Loading State */}
        {isAnalyzing && (
          <section className="px-4">
            <MediaInspectorSkeleton />
          </section>
        )}

        {/* Media Inspector Preview */}
        {!isAnalyzing && metadata && (
          <section className="px-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <MediaInspector
              metadata={metadata}
              onDownload={handleStartDownload}
              isProcessing={isDownloading}
            />
          </section>
        )}

        {/* Supported Platforms Grid */}
        <div id="platforms" className="content-auto">
          <PlatformGrid
            platforms={DEFAULT_PLATFORMS_INFO}
            onSelectPlatformSample={handleAnalyze}
          />
        </div>

        {/* Features Highlights */}
        <div id="features" className="content-auto">
          <FeaturesSection />
        </div>

        {/* FAQ */}
        <div className="content-auto">
          <FaqSection />
        </div>
      </main>

      {/* Real-time Download Progress Modal (Lazy Loaded) */}
      {activeJobId && (
        <DownloadProgressModal
          jobId={activeJobId}
          onClose={() => setActiveJobId(null)}
          onCompleted={handleJobCompleted}
        />
      )}

      {/* History Drawer (Lazy Loaded) */}
      {isHistoryOpen && (
        <DownloadHistory
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={history}
          onClearHistory={handleClearHistory}
          onSelectUrl={(url) => {
            handleAnalyze(url);
            setIsHistoryOpen(false);
          }}
        />
      )}

      <Footer />
    </div>
  );
}
