'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { UrlForm } from '@/components/UrlForm';
import { MediaInspector } from '@/components/MediaInspector';
import { MediaInspectorSkeleton } from '@/components/MediaInspectorSkeleton';
import { DownloadProgressModal } from '@/components/DownloadProgressModal';
import { DownloadHistory } from '@/components/DownloadHistory';
import { Footer } from '@/components/Footer';
import { SeoPlatformData } from '@/lib/seo-platforms';
import { MediaMetadata, DownloadJob } from '@/core/types/media';
import {
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Share2,
  Sparkles,
  Zap,
} from 'lucide-react';

interface SeoLandingClientProps {
  data: SeoPlatformData;
}

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

export function SeoLandingClient({ data }: SeoLandingClientProps) {
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
  const [copiedShare, setCopiedShare] = useState(false);

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

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: data.metaDescription,
          url: window.location.href,
        });
        return;
      } catch {}
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
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
        <section className="relative overflow-hidden pt-12 pb-10 sm:pt-20 sm:pb-14 px-4 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[450px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-[110px] pointer-events-none -z-10" />

          <div className="mx-auto max-w-4xl">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs text-zinc-500 mb-4">
              <Link href="/" className="hover:text-cyan-400 transition-colors">
                MultiGrab Home
              </Link>
              <span>/</span>
              <span className="text-zinc-300 font-medium capitalize">{data.platform} Downloader</span>
            </nav>

            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold text-indigo-300 mb-6 shadow-sm shadow-indigo-500/10">
              <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              <span>{data.heroBadge}</span>
            </div>

            {/* Main Headline (H1) */}
            <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              {data.heading}
            </h1>

            {/* Sub-headline */}
            <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              {data.subheading}
            </p>

            {/* URL Form Input */}
            <div className="mt-8">
              <UrlForm
                onAnalyze={handleAnalyze}
                isLoading={isAnalyzing}
              />
            </div>

            {/* Quick Share / Sample Actions */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{copiedShare ? 'Link Copied!' : 'Share MultiGrab'}</span>
              </button>

              <button
                onClick={() => handleAnalyze(data.exampleUrl)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors cursor-pointer font-medium"
              >
                <span>Test with Sample URL</span>
                <ArrowRight className="w-3 h-3 text-cyan-400" />
              </button>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="mt-6 mx-auto max-w-xl flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-left text-sm text-red-200 backdrop-blur-xl">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span className="flex-1">{errorMessage}</span>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-xs font-bold text-red-300 hover:underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Instant Skeleton Loading State */}
        {isAnalyzing && (
          <section className="px-4">
            <MediaInspectorSkeleton />
          </section>
        )}

        {/* Media Inspector Preview */}
        {!isAnalyzing && metadata && (
          <section className="px-4">
            <MediaInspector
              metadata={metadata}
              onDownload={handleStartDownload}
              isProcessing={isDownloading}
            />
          </section>
        )}

        {/* Related Tools Cluster (Hub-and-Spoke Silo Internal Linking) */}
        {data.relatedTools && data.relatedTools.length > 0 && (
          <section className="mx-auto max-w-5xl px-4 py-8">
            <div className="rounded-3xl border border-zinc-800/80 bg-zinc-950/60 p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Related MultiGrab Tools & Spokes
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.relatedTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/${tool.slug}`}
                    className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 hover:border-indigo-500/40 hover:bg-zinc-900 transition-all duration-300 flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                        <span>{tool.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                      </h3>
                      <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                        {tool.desc}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How to Download Steps (H2) */}
        <section className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-3xl font-extrabold text-white">
              How to Download from {data.platform.toUpperCase()}
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-zinc-400">
              Save your media in 3 simple steps without installing software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.steps.map((s, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-zinc-800/80 bg-zinc-950/60 p-6 backdrop-blur-xl hover:border-indigo-500/30 transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-xs font-black text-white mb-4 shadow-md shadow-indigo-500/20">
                  0{idx + 1}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Highlights (H2) */}
        <section className="mx-auto max-w-5xl px-4 py-10">
          <div className="rounded-3xl border border-zinc-800/80 bg-zinc-950/60 p-8 backdrop-blur-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
              Why Use MultiGrab for {data.platform.toUpperCase()} Downloads?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm text-zinc-300 font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform FAQs (H2) */}
        <section className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-2">
              <HelpCircle className="w-4 h-4" />
              <span>Questions & Answers</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-white">
              {data.platform.toUpperCase()} Downloader FAQs
            </h2>
          </div>

          <div className="grid gap-4">
            {data.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-5 backdrop-blur-xl"
              >
                <h3 className="text-sm sm:text-base font-bold text-white mb-2">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Real-time Download Progress Modal */}
      {activeJobId && (
        <DownloadProgressModal
          jobId={activeJobId}
          onClose={() => setActiveJobId(null)}
          onCompleted={handleJobCompleted}
        />
      )}

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
