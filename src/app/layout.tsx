import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0a',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://mediadrop.live'),
  title: {
    default: 'MediaDrop — Free Universal Video & Audio Downloader (4K, 1080p, MP3)',
    template: '%s | MediaDrop',
  },
  description:
    'Free online tool to download videos and extract MP3 audio from YouTube, Spotify, TikTok, Instagram, X/Twitter, Reddit, Facebook, Pinterest, and Vimeo in top quality. Fast, free, and no software required.',
  keywords: [
    'video downloader',
    'youtube downloader',
    'youtube to mp3',
    'spotify downloader',
    'spotify to mp3',
    'tiktok downloader',
    'tiktok without watermark',
    'instagram reels downloader',
    'twitter video downloader',
    'reddit video downloader',
    'pinterest video downloader',
    'vimeo downloader',
    'mp4 downloader',
    'mp3 converter',
    'mediadrop',
  ],
  authors: [{ name: 'MediaDrop Team' }],
  creator: 'MediaDrop',
  publisher: 'MediaDrop',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mediadrop.live',
    siteName: 'MediaDrop',
    title: 'MediaDrop — Free Universal Video & Audio Downloader',
    description:
      'Download videos and MP3 audio from YouTube, Spotify, TikTok, Instagram, and more in 4K, 1080p, and 320kbps. Free, fast, and no software required.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MediaDrop — Free Universal Video & Audio Downloader',
    description:
      'Download videos and MP3 audio from YouTube, Spotify, TikTok, Instagram, and more in 4K, 1080p, and 320kbps.',
  },
  alternates: {
    canonical: 'https://mediadrop.live',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rootSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'MediaDrop',
    url: 'https://mediadrop.live',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'All (Web, iOS, Android, Windows, macOS, Linux)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '15400',
      bestRating: '5',
      worstRating: '1',
    },
    description:
      'Free online tool to download videos and extract MP3 audio from YouTube, Spotify, TikTok, Instagram, X/Twitter, Reddit, Facebook, Pinterest, and Vimeo in full quality.',
  };

  return (
    <html
      lang="en"
      className="dark bg-neutral-950 text-neutral-100 antialiased selection:bg-cyan-500 selection:text-black"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootSchema) }}
        />
      </head>
      <body className="min-h-screen bg-neutral-950 flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
