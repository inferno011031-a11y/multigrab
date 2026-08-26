import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MultiGrab - Universal Video & Audio Downloader',
    short_name: 'MultiGrab',
    description: 'Download public videos and MP3 audio from YouTube, Spotify, TikTok, Instagram, X/Twitter, Reddit, Facebook, and more with MultiGrab.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
