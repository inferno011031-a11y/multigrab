'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { UrlForm } from '@/components/UrlForm';
import { MediaInspector } from '@/components/MediaInspector';
import { MediaInspectorSkeleton } from '@/components/MediaInspectorSkeleton';
import { DownloadProgressModal } from '@/components/DownloadProgressModal';
import { PlatformGrid } from '@/components/PlatformGrid';
import { DownloadHistory } from '@/components/DownloadHistory';
import { DeveloperApiModal } from '@/components/DeveloperApiModal';
import { FeaturesSection } from '@/components/FeaturesSection';
import { FaqSection } from '@/components/FaqSection';
import { Footer } from '@/components/Footer';
import { AdBanner } from '@/components/AdBanner';
import { MediaMetadata, PlatformInfo, DownloadJob } from '@/core/types/media';
import { AlertCircle, ArrowDownToLine, Share2 } from 'lucide-react';

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

function MainContent() {
  const searchParams = useSearchParams();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metadata, setMetadata] = useState<MediaMetadata | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active download job
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // History & Platforms state
  const [platforms, setPlatforms] = useState<PlatformInfo[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('mediadrop_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Load platforms
  useEffect(() => {
    fetch('/api/providers')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setPlatforms(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const saveToHistory = (item: HistoryItem) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.id !== item.id);
      const updated = [item, ...filtered].slice(0, 30);
      try {
        localStorage.setItem('mediadrop_history', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('mediadrop_history');
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

  // Auto-analyze if URL query parameter ?url=... is present
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
          title: 'MediaDrop - Universal Media Downloader',
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
    <div className="flex flex-col min-h-screen bg-black text-neutral-100">
      <Navbar
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenApi={() => setIsApiModalOpen(true)}
        historyCount={history.length}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-10 sm:pt-24 sm:pb-16 px-4 text-center">
          {/* Subtle Monochromatic Dark Radial Gradient */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/60 via-black to-black pointer-events-none -z-10" />

          <div className="mx-auto max-w-4xl">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/90 px-3.5 py-1 text-xs font-medium text-neutral-300 mb-6">
              <ArrowDownToLine className="w-3.5 h-3.5 text-white" />
              <span>Universal Video & Audio Downloader</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              Paste a link.{' '}
              <span className="text-neutral-400">
                Download the file.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-5 text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed font-normal">
              Download videos and audio from YouTube, Spotify, TikTok, Instagram, X/Twitter, Reddit, Facebook, Pinterest, and Vimeo in top quality. Free, fast, and no software required.
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
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-950 px-3.5 py-1 text-xs text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{shareCopied ? 'Link Copied' : 'Share MediaDrop'}</span>
              </button>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="mt-6 mx-auto max-w-xl flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-950 p-4 text-left text-sm text-neutral-200">
                <AlertCircle className="w-5 h-5 text-white shrink-0" />
                <span className="flex-1">{errorMessage}</span>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-xs font-bold text-white hover:underline cursor-pointer"
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
        <div id="platforms">
          <PlatformGrid
            platforms={platforms}
            onSelectPlatformSample={handleAnalyze}
          />
        </div>

        {/* Features Highlights */}
        <div id="features">
          <FeaturesSection />
        </div>

        {/* FAQ */}
        <FaqSection />
      </main>

      {/* Real-time Download Progress Modal */}
      {activeJobId && (
        <DownloadProgressModal
          jobId={activeJobId}
          onClose={() => setActiveJobId(null)}
          onCompleted={handleJobCompleted}
        />
      )}

      {/* Developer API Documentation Modal */}
      <DeveloperApiModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
      />

      {/* History Drawer */}
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

      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <MainContent />
    </Suspense>
  );
}
