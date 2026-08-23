import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MediaDrop - Universal Video & Audio Downloader',
    short_name: 'MediaDrop',
    description: 'Download public videos and MP3 audio from YouTube, Spotify, TikTok, Instagram, and more.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
