'use client';

import React, { useState } from 'react';
import {
  Film,
  Music,
  Clock,
  User,
  Eye,
  Download,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { MediaMetadata } from '@/core/types/media';

interface MediaInspectorProps {
  metadata: MediaMetadata;
  onDownload: (formatId: string, qualityLabel: string) => void;
  isProcessing: boolean;
}

export function MediaInspector({ metadata, onDownload, isProcessing }: MediaInspectorProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'audio'>('all');

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
                  <span>Open Original</span>
                </a>
              )}
            </div>
          </div>

          {/* Tabs Filter */}
          <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-neutral-800 pb-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All ({videoFormats.length + audioFormats.length})</span>
            </button>

            {videoFormats.length > 0 && (
              <button
                onClick={() => setActiveTab('video')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'video'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Video ({videoFormats.length})</span>
              </button>
            )}

            {audioFormats.length > 0 && (
              <button
                onClick={() => setActiveTab('audio')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'audio'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>Audio ({audioFormats.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Available Video Qualities Section */}
      {(activeTab === 'all' || activeTab === 'video') && videoFormats.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Film className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Video Downloads
            </h3>
            <span className="text-xs text-neutral-500">({videoFormats.length} options)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {videoFormats.map((format, idx) => (
              <div
                key={format.formatId || idx}
                className="group relative flex flex-col justify-between rounded-2xl border border-neutral-800/80 bg-neutral-950/60 p-4 transition-all hover:border-indigo-500/50 hover:bg-neutral-900/90 shadow-md"
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
                      Synced Video + Audio
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
                  <span>Download {format.height ? `${format.height}p MP4` : 'Video'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Separate Audio Tracks Section */}
      {(activeTab === 'all' || activeTab === 'audio') && audioFormats.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Music className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Audio Downloads
            </h3>
            <span className="text-xs text-neutral-500">({audioFormats.length} options)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {audioFormats.map((format, idx) => (
              <div
                key={format.formatId || idx}
                className="group relative flex flex-col justify-between rounded-2xl border border-neutral-800/80 bg-neutral-950/60 p-4 transition-all hover:border-purple-500/50 hover:bg-neutral-900/90 shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">
                      {format.qualityLabel}
                    </span>
                    <span className="rounded-md bg-purple-950/80 border border-purple-800/40 px-2 py-0.5 text-[11px] font-semibold text-purple-300 uppercase">
                      {format.ext.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-neutral-400">
                    <span>Audio Track</span>
                    <span className="font-medium text-neutral-300">
                      {formatFileSize(format.filesize || format.filesizeApprox)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDownload(format.formatId, format.qualityLabel)}
                  disabled={isProcessing}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-800 py-2.5 text-xs font-semibold text-white transition-all hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 hover:shadow-md hover:shadow-purple-500/20 disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download {format.ext.toUpperCase()}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
