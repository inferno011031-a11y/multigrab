'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Code2, Sparkles, Key } from 'lucide-react';

interface DeveloperApiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeveloperApiModal({ isOpen, onClose }: DeveloperApiModalProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [lang, setLang] = useState<'curl' | 'node' | 'python'>('curl');

  if (!isOpen) return null;

  const curlCode = `# 1. Analyze media metadata
curl -X POST https://api.mediadrop.dev/api/analyze \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'

# 2. Schedule download job
curl -X POST https://api.mediadrop.dev/api/download \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "formatId": "best"}'

# 3. Poll job status
curl https://api.mediadrop.dev/api/job/JOB_ID_HERE`;

  const nodeCode = `// Node.js / TypeScript Example
import axios from 'axios';

const API_BASE = 'https://api.mediadrop.dev/api';

async function downloadMedia(url: string) {
  // Step 1: Analyze
  const { data: analysis } = await axios.post(\`\${API_BASE}/analyze\`, { url });
  console.log('Title:', analysis.data.title);

  // Step 2: Queue Download
  const { data: job } = await axios.post(\`\${API_BASE}/download\`, {
    url,
    formatId: 'best'
  });

  // Step 3: Poll until ready
  const pollTimer = setInterval(async () => {
    const { data: status } = await axios.get(\`\${API_BASE}/job/\${job.data.jobId}\`);
    if (status.data.status === 'completed') {
      clearInterval(pollTimer);
      console.log('Download URL:', status.data.downloadUrl);
    }
  }, 1000);
}`;

  const pythonCode = `# Python 3 Example
import requests
import time

API_BASE = "https://api.mediadrop.dev/api"

def download_media(url):
    # Step 1: Analyze
    res = requests.post(f"{API_BASE}/analyze", json={"url": url}).json()
    print("Title:", res["data"]["title"])
    
    # Step 2: Queue Job
    job = requests.post(f"{API_BASE}/download", json={"url": url, "formatId": "best"}).json()
    job_id = job["data"]["jobId"]
    
    # Step 3: Poll status
    while True:
        status = requests.get(f"{API_BASE}/job/{job_id}").json()["data"]
        if status["status"] == "completed":
            print("Download file ready:", status["downloadUrl"])
            break
        time.sleep(1)

download_media("https://www.youtube.com/watch?v=dQw4w9WgXcQ")`;

  const getCode = () => {
    switch (lang) {
      case 'node':
        return nodeCode;
      case 'python':
        return pythonCode;
      default:
        return curlCode;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCode());
    setCopiedTab(lang);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Terminal className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Developer REST API</h3>
            <p className="text-xs text-neutral-400">
              Integrate MediaDrop directly into your services and pipelines.
            </p>
          </div>
        </div>

        {/* Code Tabs */}
        <div className="mt-6 flex items-center justify-between border-b border-neutral-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang('curl')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                lang === 'curl' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              cURL
            </button>
            <button
              onClick={() => setLang('node')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                lang === 'node' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Node.js / TS
            </button>
            <button
              onClick={() => setLang('python')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                lang === 'python' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Python
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-medium text-neutral-300 hover:bg-neutral-800 cursor-pointer"
          >
            {copiedTab === lang ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedTab === lang ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Code Container */}
        <div className="mt-4 max-h-72 overflow-y-auto rounded-2xl bg-neutral-900/90 border border-neutral-800/90 p-4 font-mono text-xs text-neutral-200 leading-relaxed">
          <pre className="whitespace-pre-wrap">{getCode()}</pre>
        </div>

        {/* API Authentication Note */}
        <div className="mt-6 flex items-center justify-between border-t border-neutral-900 pt-4 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            <span>Public endpoints free for testing (40 req/min rate limit)</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
