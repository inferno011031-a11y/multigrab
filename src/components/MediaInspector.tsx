'use client';

import React, { useState } from 'react';
import {
  Film,
  Music,
  Clock,
  User,
  Eye,
  Download,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Layers,
} from 'lucide-react';
import { MediaMetadata, MediaFormat } from '@/core/types/media';

interface MediaInspectorProps {
  metadata: MediaMetadata;
  onDownload: (formatId: string, qualityLabel: string) => void;
  isProcessing: boolean;
}

export function MediaInspector({ metadata, onDownload, isProcessing }: MediaInspectorProps) {
  const [activeTab, setActiveTab] = useState<'video' | 'audio'>('video');

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes <= 0) return '~Estimated';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1000) {
      return `${(mb / 1024).toFixed(2)} GB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  const formatViews = (views?: number) => {
    if (!views) return null;
    if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B views`;
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K views`;
    return `${views} views`;
  };

  const videoFormats = metadata.availableQualities.video;
  const audioFormats = metadata.availableQualities.audio;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
      {/* Top Media Header Info */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Thumbnail preview */}
        <div className="relative w-full md:w-72 shrink-0 aspect-video rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-lg group">
          {metadata.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={metadata.thumbnail}
              alt={metadata.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex w-full h-full items-center justify-center text-neutral-600">
              <Film className="w-12 h-12" />
            </div>
          )}

          {/* Duration Badge */}
          {metadata.durationFormatted && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/80 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-md">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>{metadata.durationFormatted}</span>
            </div>
          )}

          {/* Platform Badge */}
          <div className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider backdrop-blur-md">
            {metadata.platformName}
          </div>
        </div>

        {/* Title and metadata details */}
        <div className="flex-1 flex flex-col justify-between w-full">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug line-clamp-2">
              {metadata.title}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-neutral-400">
              {metadata.author && (
                <div className="flex items-center gap-1.5 font-medium text-neutral-300">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{metadata.author}</span>
                </div>
              )}

              {metadata.viewCount && (
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{formatViews(metadata.viewCount)}</span>
                </div>
              )}

              {metadata.canonicalUrl && (
                <a
                  href={metadata.canonicalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-neutral-400 hover:text-cyan-400 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Source URL</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Format Type Tabs */}
          <div className="mt-6 flex items-center gap-2 border-b border-neutral-800 pb-2">
            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'video'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Video Formats ({videoFormats.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('audio')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'audio'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>Audio Only ({audioFormats.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Format Quality Grid */}
      <div className="mt-6">
        {activeTab === 'video' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {videoFormats.map((format, idx) => (
              <div
                key={format.formatId || idx}
                className="group relative flex flex-col justify-between rounded-2xl border border-neutral-800/80 bg-neutral-950/60 p-4 transition-all hover:border-indigo-500/50 hover:bg-neutral-900/90"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {format.qualityLabel || `${format.height}p`}
                    </span>
                    <span className="rounded-md bg-neutral-800 px-2 py-0.5 text-[11px] font-semibold text-neutral-300 uppercase">
                      {format.ext.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-neutral-400">
                    <span>
                      {format.fps && format.fps > 30 ? `${format.fps} FPS • ` : ''}
                      {format.vcodec && format.vcodec !== 'none' ? format.vcodec.split('.')[0] : 'Video + Audio'}
                    </span>
                    <span className="font-medium text-neutral-300">
                      {formatFileSize(format.filesize || format.filesizeApprox)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDownload(format.formatId, format.qualityLabel)}
                  disabled={isProcessing}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-800 py-2.5 text-xs font-semibold text-white transition-all hover:bg-gradient-to-r hover:from-indigo-500 hover:to-cyan-500 hover:shadow-md hover:shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Video</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {audioFormats.map((format, idx) => (
              <div
                key={format.formatId || idx}
                className="group relative flex flex-col justify-between rounded-2xl border border-neutral-800/80 bg-neutral-950/60 p-4 transition-all hover:border-indigo-500/50 hover:bg-neutral-900/90"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {format.qualityLabel || 'Audio Track'}
                    </span>
                    <span className="rounded-md bg-neutral-800 px-2 py-0.5 text-[11px] font-semibold text-neutral-300 uppercase">
                      {format.ext.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-neutral-400">
                    <span>High Fidelity Audio</span>
                    <span className="font-medium text-neutral-300">
                      {formatFileSize(format.filesize || format.filesizeApprox)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDownload(format.formatId, format.qualityLabel)}
                  disabled={isProcessing}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-800 py-2.5 text-xs font-semibold text-white transition-all hover:bg-gradient-to-r hover:from-indigo-500 hover:to-cyan-500 hover:shadow-md hover:shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Extract Audio</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
