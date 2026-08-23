'use client';

import React from 'react';
import { X, Trash2, Clock, Film } from 'lucide-react';

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

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex h-full w-full max-w-md flex-col bg-neutral-900 border-l border-neutral-800 p-6 shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Clock className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Download History</h3>
            <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                title="Clear History"
                className="p-1.5 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Drawer List */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
          {history.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center text-neutral-500">
              <Film className="h-10 w-10 stroke-[1.5] mb-2 opacity-50" />
              <p className="text-sm font-medium text-neutral-400">No downloads yet</p>
              <p className="text-xs text-neutral-600 mt-1">Processed media will appear here</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col rounded-2xl border border-neutral-800/80 bg-neutral-950/60 p-3.5 transition-all hover:border-neutral-700 hover:bg-neutral-800/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                    {item.title}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="uppercase text-indigo-400 font-bold">{item.platform}</span>
                  <div className="flex items-center gap-2">
                    {item.fileSize && <span>{formatFileSize(item.fileSize)}</span>}
                    <span>• {formatDate(item.timestamp)}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 pt-2 border-t border-neutral-800/60">
                  <button
                    onClick={() => onSelectUrl(item.url)}
                    className="text-[11px] font-medium text-cyan-400 hover:underline cursor-pointer"
                  >
                    Analyze Again
                  </button>
                  {item.downloadUrl && (
                    <a
                      href={item.downloadUrl}
                      download={item.filename || 'download'}
                      className="text-[11px] font-medium text-emerald-400 hover:underline cursor-pointer ml-auto"
                    >
                      Download File
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
