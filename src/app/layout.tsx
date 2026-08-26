import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://multigrab.online'),
  title: {
    default: 'MultiGrab - Universal Video & Audio Downloader',
    template: '%s | MultiGrab',
  },
  description:
    'MultiGrab is a fast, clean, and free online tool to download videos and extract MP3 audio from YouTube, Spotify, TikTok, Instagram, X/Twitter, Reddit, Facebook, Pinterest, and Vimeo in top quality (4K, 1080p, 320kbps). No software or login required.',
  keywords: [
    'MultiGrab',
    'MultiGrab Universal Video & Audio Downloader',
    'MultiGrab YouTube Downloader',
    'MultiGrab video downloader',
    'YouTube video downloader',
    'free YouTube downloader',
    'YouTube to MP3',
    'YouTube to MP4',
    'YouTube shorts downloader',
    'YouTube 1080p downloader',
    'YouTube 4k downloader',
    'Spotify downloader',
    'Spotify to MP3',
    'TikTok downloader without watermark',
    'TikTok to MP3',
    'Instagram reels downloader',
    'Twitter video downloader',
    'Reddit video downloader with audio',
    'online video downloader',
    'MP3 converter',
  ],
  authors: [{ name: 'MultiGrab Team', url: 'https://multigrab.online' }],
  creator: 'MultiGrab',
  publisher: 'MultiGrab',
  applicationName: 'MultiGrab',
  category: 'Multimedia Utility',
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
    url: 'https://multigrab.online',
    siteName: 'MultiGrab',
    title: 'MultiGrab - Universal Video & Audio Downloader',
    description:
      'Download videos and MP3 audio from YouTube, Spotify, TikTok, Instagram, and more in 4K, 1080p, and 320kbps with MultiGrab. Free, fast, and no software required.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MultiGrab - Universal Video & Audio Downloader',
    description:
      'Download videos and MP3 audio from YouTube, Spotify, TikTok, Instagram, and more in 4K, 1080p, and 320kbps with MultiGrab.',
  },
  alternates: {
    canonical: 'https://multigrab.online',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rootSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://multigrab.online/#organization',
        name: 'MultiGrab',
        url: 'https://multigrab.online',
        logo: 'https://multigrab.online/favicon.ico',
        description: 'Universal online video downloader and audio converter platform.',
        sameAs: ['https://twitter.com/multigrab', 'https://github.com/multigrab'],
      },
      {
        '@type': 'WebApplication',
        '@id': 'https://multigrab.online/#webapp',
        name: 'MultiGrab - Universal Video & Audio Downloader',
        url: 'https://multigrab.online',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All (Web, iOS, Android, Windows, macOS, Linux)',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        provider: {
          '@id': 'https://multigrab.online/#organization',
        },
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
          'Free online tool by MultiGrab to download videos and extract MP3 audio from YouTube, Spotify, TikTok, Instagram, X/Twitter, Reddit, Facebook, Pinterest, and Vimeo in full quality.',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://multigrab.online/#website',
        url: 'https://multigrab.online',
        name: 'MultiGrab',
        publisher: {
          '@id': 'https://multigrab.online/#organization',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://multigrab.online/?url={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="dark bg-black text-neutral-100 antialiased selection:bg-white selection:text-black"
    >
      <head>
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        <link rel="preconnect" href="https://i.scdn.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://i.scdn.co" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootSchema) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans"
      >
        {children}
      </body>
    </html>
  );
}
