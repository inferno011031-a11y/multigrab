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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Status */}
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-white">
            {job?.status === 'completed' ? (
              <CheckCircle2 className="h-5 w-5 text-white" />
            ) : job?.status === 'failed' ? (
              <AlertTriangle className="h-5 w-5 text-neutral-400" />
            ) : (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            )}
          </div>

          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {job?.status === 'completed'
                ? 'Ready for Download'
                : job?.status === 'failed'
                ? 'Processing Error'
                : 'Processing Media Stream'}
            </h3>
            <p className="text-xs text-neutral-400">
              {job?.status === 'completed'
                ? 'Secure download token generated. Valid for 30 minutes.'
                : job?.status === 'failed'
                ? job.error || 'Could not process format. Please try another quality.'
                : 'Streaming and muxing media directly...'}
            </p>
          </div>
        </div>

        {/* Progress Bar & Indicators */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-medium text-neutral-400 mb-2">
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
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-900 border border-neutral-800">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                job?.status === 'completed'
                  ? 'bg-white'
                  : job?.status === 'failed'
                  ? 'bg-neutral-600'
                  : 'bg-white animate-pulse'
              }`}
              style={{ width: `${job?.progress || (job?.status === 'processing' ? 25 : 5)}%` }}
            />
          </div>

          {/* Speed / ETA info */}
          {job?.status === 'processing' && (job.speed || job.eta) && (
            <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
              <span>Speed: {job.speed || 'Calculating...'}</span>
              <span>ETA: {job.eta || 'A few seconds'}</span>
            </div>
          )}
        </div>

        {/* Output details when completed */}
        {job?.status === 'completed' && (
          <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300 font-medium truncate max-w-[260px]">
                {job.filename}
              </span>
              <span className="text-white font-bold font-mono">
                {formatFileSize(job.fileSize)}
              </span>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <a
                href={job.downloadUrl}
                download={job.filename}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-black hover:bg-neutral-200 transition-all text-center cursor-pointer"
              >
                <Download className="h-4 w-4 stroke-[2.5]" />
                <span>Save File to Device</span>
              </a>
              <a
                href={job.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
                title="Direct Stream Link"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-6 flex items-center justify-between border-t border-neutral-800/80 pt-4 text-[11px] text-neutral-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-white" />
            <span>Encrypted Token</span>
          </div>
          <span>Automatic disk cleanup</span>
        </div>
      </div>
    </div>
  );
}
