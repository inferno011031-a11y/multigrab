'use client';

import React from 'react';
import { X, Trash2, Download, ExternalLink, Film, Clock } from 'lucide-react';
import { DownloadJob } from '@/core/types/media';

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

interface DownloadHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClearHistory: () => void;
  onSelectUrl: (url: string) => void;
}

export function DownloadHistory({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onSelectUrl,
}: DownloadHistoryProps) {
  if (!isOpen) return null;

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-neutral-800 bg-neutral-950 p-6 shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Recent Activity</h3>
            <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-900 hover:text-rose-400 transition-colors"
                title="Clear History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center text-neutral-500">
              <Film className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm font-medium">No recent downloads</p>
              <p className="text-xs text-neutral-600 mt-1">
                Your analyzed and downloaded media will appear here locally.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl border border-neutral-800 bg-neutral-900/60 p-3.5 transition-all hover:border-neutral-700 hover:bg-neutral-900"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <span className="inline-block rounded-md bg-neutral-800 px-2 py-0.5 text-[10px] font-bold text-neutral-300 uppercase mb-1">
                      {item.platform}
                    </span>
                    <h4 className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                  </div>
                  <span className="text-[10px] text-neutral-500 shrink-0">
                    {formatDate(item.timestamp)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-neutral-800/80 pt-2 text-xs">
                  <span className="text-[11px] text-neutral-400">
                    {formatFileSize(item.fileSize)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelectUrl(item.url);
                        onClose();
                      }}
                      className="text-[11px] font-semibold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Analyze Again</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Privacy Note */}
        <div className="border-t border-neutral-800 pt-3 text-center">
          <p className="text-[11px] text-neutral-500">
            Stored locally on your browser. Zero tracking.
          </p>
        </div>
      </div>
    </div>
  );
}
