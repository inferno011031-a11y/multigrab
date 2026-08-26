'use client';

import React, { useEffect, useState } from 'react';
import {
  Download,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { DownloadJob } from '@/core/types/media';

interface DownloadProgressModalProps {
  jobId: string;
  onClose: () => void;
  onCompleted?: (job: DownloadJob) => void;
}

export function DownloadProgressModal({
  jobId,
  onClose,
  onCompleted,
}: DownloadProgressModalProps) {
  const [job, setJob] = useState<DownloadJob | null>(null);

  useEffect(() => {
    let isMounted = true;

    const pollJob = async () => {
      try {
        const res = await fetch(`/api/job/${jobId}`);
        if (!res.ok) {
          throw new Error('Failed to retrieve job status');
        }

        const json = await res.json();
        if (isMounted && json.success && json.data) {
          const currentJob = json.data as DownloadJob;
          setJob(currentJob);

          if (currentJob.status === 'completed' || currentJob.status === 'failed') {
            if (currentJob.status === 'completed' && onCompleted) {
              onCompleted(currentJob);
            }
            clearInterval(interval);
          }
        }
      } catch {
        // Polling retry
      }
    };

    pollJob();
    const interval = setInterval(pollJob, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [jobId, onCompleted]);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Calculating...';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1000) {
      return `${(mb / 1024).toFixed(2)} GB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Top ambient glow */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 blur-[80px] pointer-events-none ${
            job?.status === 'completed'
              ? 'bg-emerald-500/20'
              : job?.status === 'failed'
              ? 'bg-rose-500/20'
              : 'bg-indigo-500/20'
          }`}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close download progress"
          className="absolute top-5 right-5 rounded-full p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Status */}
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              job?.status === 'completed'
                ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30'
                : job?.status === 'failed'
                ? 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30'
                : 'bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/30'
            }`}
          >
            {job?.status === 'completed' ? (
              <CheckCircle2 className="h-6 w-6" />
            ) : job?.status === 'failed' ? (
              <AlertTriangle className="h-6 w-6" />
            ) : (
              <Loader2 className="h-6 w-6 animate-spin" />
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {job?.status === 'completed'
                ? 'Ready for Download'
                : job?.status === 'failed'
                ? 'Processing Error'
                : 'Processing Media Stream'}
            </h3>
            <p className="text-xs text-zinc-400">
              {job?.status === 'completed'
                ? 'Secure download token generated. Ready to save.'
                : job?.status === 'failed'
                ? job.error || 'Could not process format. Please try another quality.'
                : 'Streaming and muxing media directly...'}
            </p>
          </div>
        </div>

        {/* Progress Bar & Indicators */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-2">
            <span>
              {job?.status === 'queued'
                ? 'In Queue...'
                : job?.status === 'processing'
                ? 'Downloading stream...'
                : job?.status === 'completed'
                ? 'Finished (100%)'
                : 'Stopped'}
            </span>
            <span className="text-white font-mono">{job?.progress || 0}%</span>
          </div>

          {/* Bar */}
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-900 border border-zinc-800 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                job?.status === 'completed'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : job?.status === 'failed'
                  ? 'bg-rose-500'
                  : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 animate-pulse'
              }`}
              style={{ width: `${job?.progress || (job?.status === 'processing' ? 25 : 5)}%` }}
            />
          </div>

          {/* Speed / ETA info */}
          {job?.status === 'processing' && (job.speed || job.eta) && (
            <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>Speed: {job.speed || 'Calculating...'}</span>
              <span>ETA: {job.eta || 'A few seconds'}</span>
            </div>
          )}
        </div>

        {/* Output details when completed */}
        {job?.status === 'completed' && (
          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-300 font-medium truncate max-w-[260px]">
                {job.filename}
              </span>
              <span className="text-white font-bold font-mono">
                {formatFileSize(job.fileSize)}
              </span>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <a
                href={job.downloadUrl}
                download={job.filename || 'media-download'}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all text-center cursor-pointer"
              >
                <Download className="h-4 w-4 stroke-[2.5]" />
                <span>Save File to Device</span>
              </a>
              <a
                href={job.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-3 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                aria-label="Open direct stream link in new tab"
                title="Direct Stream Link"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-4 text-[11px] text-zinc-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Encrypted Token</span>
          </div>
          <span>Automatic disk cleanup</span>
        </div>
      </div>
    </div>
  );
}
