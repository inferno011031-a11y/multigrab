'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Terminal } from 'lucide-react';

interface DeveloperApiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeveloperApiModal({ isOpen, onClose }: DeveloperApiModalProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, tabId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabId);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const curlExample = `# 1. Analyze any media URL (SSRF protected)
curl -X POST https://mediadrop.live/api/analyze \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'

# 2. Schedule download job for a format
curl -X POST https://mediadrop.live/api/download \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "formatId": "232"}'

# 3. Poll job status
curl https://mediadrop.live/api/job/JOB_ID_HERE`;

  const nodeExample = `import axios from 'axios';

async function downloadMedia(url: string) {
  // Step 1: Analyze URL
  const { data: analysis } = await axios.post('/api/analyze', { url });
  console.log('Title:', analysis.data.title);

  // Step 2: Request 1080p or best format
  const { data: job } = await axios.post('/api/download', {
    url,
    formatId: '270'
  });

  // Step 3: Poll until ready
  const interval = setInterval(async () => {
    const { data: status } = await axios.get(\`/api/job/\${job.data.jobId}\`);
    if (status.data.status === 'completed') {
      clearInterval(interval);
      console.log('Download URL:', status.data.downloadUrl);
    }
  }, 1500);
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Developer REST API</h3>
              <p className="text-xs text-neutral-400">Public HTTP Endpoints for MediaDrop Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-6 space-y-6 overflow-y-auto pr-1">
          {/* Endpoints Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Available Endpoints</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 p-3">
                <span className="font-mono text-cyan-400 font-bold">POST /api/analyze</span>
                <span className="text-neutral-400">Extracts video metadata & formats</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 p-3">
                <span className="font-mono text-indigo-400 font-bold">POST /api/download</span>
                <span className="text-neutral-400">Queues background muxing job</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 p-3">
                <span className="font-mono text-emerald-400 font-bold">GET /api/job/:id</span>
                <span className="text-neutral-400">Polls real-time download progress</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 p-3">
                <span className="font-mono text-purple-400 font-bold">GET /api/file/:token</span>
                <span className="text-neutral-400">Streams HMAC signed media binary</span>
              </div>
            </div>
          </div>

          {/* cURL Snippet */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">cURL Example</span>
              <button
                onClick={() => copyToClipboard(curlExample, 'curl')}
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white cursor-pointer"
              >
                {copiedTab === 'curl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTab === 'curl' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 text-xs font-mono text-neutral-300 overflow-x-auto">
              {curlExample}
            </pre>
          </div>

          {/* Node.js Snippet */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Node.js / TypeScript Example</span>
              <button
                onClick={() => copyToClipboard(nodeExample, 'node')}
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white cursor-pointer"
              >
                {copiedTab === 'node' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTab === 'node' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 text-xs font-mono text-neutral-300 overflow-x-auto">
              {nodeExample}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
