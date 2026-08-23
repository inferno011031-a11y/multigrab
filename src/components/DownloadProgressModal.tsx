'use client';

import React, { useEffect, useState } from 'react';
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Download,
  Copy,
  Check,
  X,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { DownloadJob } from '@/core/types/media';

interface DownloadProgressModalProps {
  jobId: string;
  onClose: () => void;
  onCompleted?: (job: DownloadJob) => void;
}

export function DownloadProgressModal({ jobId, onClose, onCompleted }: DownloadProgressModalProps) {
  const [job, setJob] = useState<DownloadJob | null>(null);
  const [copied, setCopied] = useState(false);
  const [pollError, setPollError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let isCancelled = false;

    const pollJob = async () => {
      try {
        const res = await fetch(`/api/job/${jobId}`);
        const data = await res.json();

        if (!data.success) {
          setPollError(data.error?.message || 'Failed to check download status.');
          return;
        }

        if (isCancelled) return;

        const currentJob: DownloadJob = data.data;
        setJob(currentJob);

        if (currentJob.status === 'completed') {
          if (onCompleted) onCompleted(currentJob);
          clearInterval(interval);
        } else if (currentJob.status === 'failed' || currentJob.status === 'expired') {
          clearInterval(interval);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          setPollError('Network error checking job progress.');
        }
      }
    };

    pollJob();
    interval = setInterval(pollJob, 800);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [jobId, onCompleted]);

  const handleCopyLink = () => {
    if (job?.downloadUrl) {
      const fullUrl = `${window.location.origin}${job.downloadUrl}`;
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1000) return `${(mb / 1024).toFixed(2)} GB`;
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {job?.status === 'completed' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : job?.status === 'failed' ? (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            ) : (
              <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {job?.status === 'completed'
                ? 'Ready for Download'
                : job?.status === 'failed'
                ? 'Processing Failed'
                : 'Processing Media'}
            </h3>
            <p className="text-xs text-neutral-400">
              {job?.status === 'completed'
                ? 'Your media file has been packaged securely.'
                : job?.status === 'failed'
                ? job.error || 'Extraction failed for this format.'
                : 'Streaming and muxing media directly...'}
            </p>
          </div>
        </div>

        {/* Progress Bar & Indicators */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 mb-2">
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
          <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-900 border border-neutral-800 p-0.5">
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
            <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-500">
              <span>Speed: {job.speed || 'Calculating...'}</span>
              <span>ETA: {job.eta || 'A few seconds'}</span>
            </div>
          )}
        </div>

        {/* Output details when completed */}
        {job?.status === 'completed' && (
          <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 font-medium truncate max-w-[260px]">
                {job.filename}
              </span>
              <span className="text-neutral-300 font-bold">
                {formatFileSize(job.fileSize)}
              </span>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <a
                href={job.downloadUrl}
                download={job.filename}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all text-center cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Save File to Device</span>
              </a>

              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Error retry option */}
        {job?.status === 'failed' && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="flex items-center gap-2 rounded-xl bg-neutral-800 px-4 py-2.5 text-xs font-semibold text-white hover:bg-neutral-700 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Dismiss & Try Another Format</span>
            </button>
          </div>
        )}

        {/* Security / Expiration Note */}
        <div className="mt-6 border-t border-neutral-900 pt-3 text-center">
          <p className="text-[11px] text-neutral-500">
            Downloaded media files are automatically removed from temporary server storage after 30 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
