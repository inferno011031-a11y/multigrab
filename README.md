# MediaDrop — Fast Multi-Platform Public Media Downloader

MediaDrop is a production-ready, commercial-grade web application and API service for analyzing and downloading publicly accessible media across major platforms (YouTube, TikTok, Instagram, X/Twitter, Facebook, Reddit, Pinterest, Vimeo, and direct web media).

---

## Key Highlights

- **Multi-Platform Support**: Modular provider architecture with automated URL pattern matching and format normalizers.
- **Strict SSRF Firewall**: DNS pre-resolution blocks RFC 1918 private IPs (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), loopbacks (`127.0.0.1`, `::1`), link-local metadata (`169.254.169.254`), broadcast, and intranet domains.
- **Asynchronous Queue Engine**: Redis + BullMQ for multi-node scalable background workers, with automatic In-Memory queue fallback for seamless standalone local development.
- **Secure File Lifecycle**: Ephemeral HMAC-signed download tokens with 30-minute expiration, automatic garbage collection cron, zero shell injection vulnerability (`shell: false` subprocess execution), and path traversal filtering.
- **High-End User Interface**: Built with Next.js 14+ App Router, Tailwind CSS, auto-clipboard paste detection, real-time download progress modal with speed/ETA, and client-side history.
- **Zero DRM/Auth Circumvention**: Complies with platform boundaries; works strictly with permitted public endpoints.

---

## System Architecture

```text
/src
  ├── app/
  │   ├── api/
  │   │   ├── analyze/route.ts        # POST: URL security check & metadata extraction
  │   │   ├── download/route.ts       # POST: Job creation & queue dispatch
  │   │   ├── job/[id]/route.ts       # GET: Job polling status & progress
  │   │   ├── file/[token]/route.ts   # GET: Signed streaming file download
  │   │   ├── health/route.ts         # GET: System health & dependency check
  │   │   └── providers/route.ts      # GET: List supported providers
  │   ├── layout.tsx
  │   └── page.tsx                    # Primary responsive UI
  ├── components/                     # Reusable React UI components
  ├── core/
  │   ├── providers/                  # Modular provider framework
  │   │   ├── base.provider.ts        # Abstract BaseMediaProvider
  │   │   ├── youtube.provider.ts     # YouTube provider
  │   │   ├── tiktok.provider.ts      # TikTok provider
  │   │   ├── instagram.provider.ts   # Instagram provider
  │   │   ├── twitter.provider.ts     # X/Twitter provider
  │   │   ├── facebook.provider.ts    # Facebook provider
  │   │   ├── reddit.provider.ts      # Reddit provider
  │   │   ├── pinterest.provider.ts   # Pinterest provider
  │   │   ├── vimeo.provider.ts       # Vimeo provider
  │   │   ├── generic.provider.ts     # Direct media fallback
  │   │   └── registry.ts             # Dispatcher registry
  │   ├── security/                   # SSRF protection, sanitization, rate-limiter
  │   ├── queue/                      # BullMQ & In-Memory queue implementations
  │   ├── storage/                    # Temp storage manager & automated cleanup cron
  │   └── process/                    # Subprocess runner (no shell injection)
  └── lib/
      ├── config.ts                   # Environment configuration
      └── logger.ts                   # Structured JSON logger
```

---

## API Specification

### 1. Analyze URL
`POST /api/analyze`

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "dQw4w9WgXcQ",
    "originalUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "canonicalUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "platform": "youtube",
    "platformName": "YouTube",
    "title": "Rick Astley - Never Gonna Give You Up",
    "author": "Rick Astley",
    "duration": 213,
    "durationFormatted": "03:33",
    "thumbnail": "https://i.ytimg.com/...",
    "availableQualities": {
      "video": [
        { "formatId": "137", "ext": "mp4", "qualityLabel": "1080p", "filesize": 45000000 }
      ],
      "audio": [
        { "formatId": "audio-mp3", "ext": "mp3", "qualityLabel": "High Quality MP3" }
      ]
    }
  }
}
```

### 2. Schedule Download Job
`POST /api/download`

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "formatId": "137"
}
```

**Response (202 Accepted):**
```json
{
  "success": true,
  "data": {
    "jobId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "status": "queued",
    "message": "Download job has been scheduled.",
    "pollUrl": "/api/job/f47ac10b-58cc-4372-a567-0e02b2c3d479"
  }
}
```

### 3. Check Job Status
`GET /api/job/:jobId`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "status": "completed",
    "progress": 100,
    "downloadToken": "eyJhbGciOi...",
    "downloadUrl": "/api/file/eyJhbGciOi...",
    "filename": "Rick_Astley_Never_Gonna_Give_You_Up.mp4",
    "fileSize": 45123982
  }
}
```

### 4. Stream Media File
`GET /api/file/:signedToken`

Streams the binary file with appropriate `Content-Disposition`, `Content-Length`, and `Content-Type` headers.

---

## Local Development Setup

### Prerequisites
- Node.js 18+
- Python 3.9+ with `yt-dlp` (`pip install yt-dlp`)
- ffmpeg (optional, for muxing)

### Installation
```bash
# 1. Clone repository
git clone <repo-url>
cd modest-bell

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env

# 4. Run automated test suite
npm test

# 5. Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Docker Production Deployment

```bash
# Start full stack (App + Redis + Postgres)
docker-compose up -d --build

# View logs
docker-compose logs -f app
```

---

## Running Tests

Run all unit tests, SSRF security validation, and provider tests:
```bash
npx vitest run
```
