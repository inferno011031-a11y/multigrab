import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MediaDrop — Fast Multi-Platform Public Media Downloader',
  description: 'Download publicly accessible media from YouTube, TikTok, Instagram, X/Twitter, Facebook, Reddit, Pinterest, Vimeo in high resolution MP4 & MP3.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-neutral-950 text-neutral-100 antialiased selection:bg-cyan-500 selection:text-black">
      <body className="min-h-screen bg-neutral-950 flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
