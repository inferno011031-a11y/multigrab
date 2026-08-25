import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://mediadrop.live'),
  title: {
    default: 'MediaDrop — Free Universal Video & Audio Downloader (4K, 1080p, MP3)',
    template: '%s | MediaDrop',
  },
  description:
    'MediaDrop is a fast, clean, and free online tool to download videos and extract MP3 audio from YouTube, Spotify, TikTok, Instagram, X/Twitter, Reddit, Facebook, Pinterest, and Vimeo in top quality (4K, 1080p, 320kbps). No software or login required.',
  keywords: [
    'MediaDrop',
    'MediaDrop YouTube Downloader',
    'MediaDrop video downloader',
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
    'Instagram reels downloader',
    'Twitter video downloader',
    'Reddit video downloader with audio',
    'online video downloader',
    'MP3 converter',
  ],
  authors: [{ name: 'MediaDrop Team', url: 'https://mediadrop.live' }],
  creator: 'MediaDrop',
  publisher: 'MediaDrop',
  applicationName: 'MediaDrop',
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
    url: 'https://mediadrop.live',
    siteName: 'MediaDrop',
    title: 'MediaDrop — Free Universal Video & Audio Downloader',
    description:
      'Download videos and MP3 audio from YouTube, Spotify, TikTok, Instagram, and more in 4K, 1080p, and 320kbps with MediaDrop. Free, fast, and no software required.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MediaDrop — Free Universal Video & Audio Downloader',
    description:
      'Download videos and MP3 audio from YouTube, Spotify, TikTok, Instagram, and more in 4K, 1080p, and 320kbps with MediaDrop.',
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
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://mediadrop.live/#organization',
        name: 'MediaDrop',
        url: 'https://mediadrop.live',
        logo: 'https://mediadrop.live/favicon.ico',
        description: 'Universal online video downloader and audio converter platform.',
        sameAs: ['https://twitter.com/mediadrop', 'https://github.com/mediadrop'],
      },
      {
        '@type': 'WebApplication',
        '@id': 'https://mediadrop.live/#webapp',
        name: 'MediaDrop - Universal Video & Audio Downloader',
        url: 'https://mediadrop.live',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All (Web, iOS, Android, Windows, macOS, Linux)',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        provider: {
          '@id': 'https://mediadrop.live/#organization',
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
          'Free online tool by MediaDrop to download videos and extract MP3 audio from YouTube, Spotify, TikTok, Instagram, X/Twitter, Reddit, Facebook, Pinterest, and Vimeo in full quality.',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://mediadrop.live/#website',
        url: 'https://mediadrop.live',
        name: 'MediaDrop',
        publisher: {
          '@id': 'https://mediadrop.live/#organization',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://mediadrop.live/?url={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      className="dark bg-black text-neutral-100 antialiased selection:bg-white selection:text-black"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootSchema) }}
        />
      </head>
      <body className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
