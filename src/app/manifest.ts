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
    shortcuts: [
      {
        name: 'YouTube Downloader',
        short_name: 'YouTube',
        description: 'Download YouTube videos in 4K/1080p and 320kbps MP3',
        url: '/youtube-downloader',
        icons: [{ src: '/favicon.ico', sizes: 'any' }],
      },
      {
        name: 'Spotify MP3 Downloader',
        short_name: 'Spotify',
        description: 'Download Spotify songs & tracks in 320kbps MP3',
        url: '/spotify-mp3-downloader',
        icons: [{ src: '/favicon.ico', sizes: 'any' }],
      },
      {
        name: 'TikTok Video Downloader',
        short_name: 'TikTok',
        description: 'Download TikTok videos without watermark in HD',
        url: '/tiktok-downloader',
        icons: [{ src: '/favicon.ico', sizes: 'any' }],
      },
      {
        name: 'Instagram Video Downloader',
        short_name: 'Instagram',
        description: 'Download Instagram Reels and videos in HD',
        url: '/instagram-downloader',
        icons: [{ src: '/favicon.ico', sizes: 'any' }],
      },
      {
        name: 'Twitter (X) Downloader',
        short_name: 'Twitter',
        description: 'Download X/Twitter videos and GIFs in HD MP4',
        url: '/twitter-downloader',
        icons: [{ src: '/favicon.ico', sizes: 'any' }],
      },
    ],
  };
}
