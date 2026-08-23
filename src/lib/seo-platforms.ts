import { SupportedPlatform } from '@/core/types/media';

export interface SeoPlatformData {
  slug: string;
  platform: SupportedPlatform;
  title: string;
  metaDescription: string;
  heading: string;
  subheading: string;
  heroBadge: string;
  iconName: string;
  features: string[];
  steps: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  exampleUrl: string;
}

export const SEO_PLATFORMS: Record<string, SeoPlatformData> = {
  'youtube-downloader': {
    slug: 'youtube-downloader',
    platform: 'youtube',
    title: 'YouTube Video Downloader & MP3 Converter - Free 4K / 1080p | MediaDrop',
    metaDescription: 'Download YouTube videos and Shorts in 4K, 1440p, 1080p Full HD, 720p HD, and high-quality 320kbps MP3 audio for free without software installation.',
    heading: 'Free YouTube Video Downloader & MP3 Extractor',
    subheading: 'Paste any public YouTube video link or Shorts URL to save high-definition MP4 videos or extract pure MP3 audio tracks instantly.',
    heroBadge: 'Fast YouTube 4K & MP3 Downloader',
    iconName: 'youtube',
    features: [
      'Download 4K UHD, 1080p Full HD, 720p HD MP4 video streams',
      'Extract high-bitrate 320 kbps and 128 kbps MP3 audio',
      'Supports YouTube Shorts, standard videos, and music clips',
      'Zero ads, no software installation, completely free',
    ],
    steps: [
      { title: 'Copy YouTube URL', desc: 'Open YouTube and copy the link to the video or Short you want to download.' },
      { title: 'Paste into MediaDrop', desc: 'Paste the URL into the input field above and click Download.' },
      { title: 'Choose Resolution', desc: 'Select your preferred video resolution (4K, 1080p, 720p) or MP3 audio track to save.' },
    ],
    faqs: [
      { q: 'Is this YouTube downloader free?', a: 'Yes, MediaDrop is 100% free with unlimited high-speed downloads.' },
      { q: 'Can I download YouTube Shorts?', a: 'Yes! Simply copy any YouTube Shorts link and paste it into the downloader.' },
      { q: 'What audio quality is extracted?', a: 'You can download audio in 320 kbps high-fidelity MP3, 128 kbps MP3, or M4A.' },
    ],
    exampleUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  'spotify-downloader': {
    slug: 'spotify-downloader',
    platform: 'spotify',
    title: 'Spotify Downloader - Save Tracks & Podcasts in MP3 320kbps | MediaDrop',
    metaDescription: 'Download public Spotify tracks, songs, and podcast episodes in high quality 320kbps MP3 audio for offline listening.',
    heading: 'Spotify Track & Song MP3 Downloader',
    subheading: 'Paste any Spotify track or episode URL to extract and download high-fidelity 320 kbps MP3 audio with album art and metadata.',
    heroBadge: 'High-Quality Spotify MP3 Extractor',
    iconName: 'spotify',
    features: [
      'Extract 320 kbps High Quality MP3 audio tracks',
      'Preserves song title, artist metadata, and cover art',
      'Supports open.spotify.com song & podcast links',
      '100% cloud-based with instant conversion',
    ],
    steps: [
      { title: 'Copy Spotify Song Link', desc: 'In the Spotify app or web player, click Share and copy the song link.' },
      { title: 'Paste Link', desc: 'Paste the Spotify URL into the search bar above.' },
      { title: 'Save MP3', desc: 'Click Download to convert and save the 320 kbps MP3 file to your device.' },
    ],
    faqs: [
      { q: 'Does this download full high-quality audio?', a: 'Yes, we provide 320 kbps and 128 kbps MP3 options as well as M4A streams.' },
      { q: 'Do I need a Spotify Premium account?', a: 'No premium account or login is required.' },
    ],
    exampleUrl: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
  },
  'tiktok-downloader': {
    slug: 'tiktok-downloader',
    platform: 'tiktok',
    title: 'TikTok Video Downloader Without Watermark - Free HD MP4 | MediaDrop',
    metaDescription: 'Download public TikTok videos in HD MP4 or extract audio in MP3 without software.',
    heading: 'Download TikTok Videos & Audio',
    subheading: 'Save public TikTok videos in HD MP4 resolution or extract the original background sound in MP3.',
    heroBadge: 'Fast TikTok Video & Audio Saver',
    iconName: 'tiktok',
    features: [
      'Download high-definition TikTok videos in MP4 format',
      'Extract original TikTok sounds and background music',
      'Supports standard tiktok.com and mobile vm.tiktok.com links',
      'Blazing fast processing on mobile and desktop',
    ],
    steps: [
      { title: 'Copy TikTok Link', desc: 'Open TikTok, tap Share on any public video and copy the link.' },
      { title: 'Paste & Analyze', desc: 'Paste the link above and tap Download to analyze available formats.' },
      { title: 'Download File', desc: 'Select HD video or audio extraction to save directly to your phone or PC.' },
    ],
    faqs: [
      { q: 'Can I download TikTok videos on iPhone/Android?', a: 'Yes, MediaDrop works directly inside Safari, Chrome, and all mobile browsers.' },
      { q: 'How do I extract TikTok music?', a: 'Choose the Separate Audio Tracks option on the download screen.' },
    ],
    exampleUrl: 'https://www.tiktok.com/@tiktok/video/7106594312292453678',
  },
  'instagram-downloader': {
    slug: 'instagram-downloader',
    platform: 'instagram',
    title: 'Instagram Reels & Video Downloader - Save IG Videos in HD | MediaDrop',
    metaDescription: 'Download Instagram Reels, IGTV, and public video posts in original quality MP4 for free.',
    heading: 'Instagram Reels & Video Downloader',
    subheading: 'Download public Instagram Reels and videos in crisp HD quality directly to your phone or computer.',
    heroBadge: 'Instagram Reels & Video Tool',
    iconName: 'instagram',
    features: [
      'Download Instagram Reels in high definition MP4',
      'Extract separate audio and music from Reels',
      'Supports instagram.com links on mobile and web',
      'No Instagram login required',
    ],
    steps: [
      { title: 'Copy Reel Link', desc: 'Tap the three dots on the Instagram Reel and copy the link.' },
      { title: 'Paste Link', desc: 'Paste the URL into MediaDrop.' },
      { title: 'Save Video', desc: 'Choose video or audio to download immediately.' },
    ],
    faqs: [
      { q: 'Can I download private Instagram posts?', a: 'No, MediaDrop only supports publicly available Instagram Reels and videos.' },
    ],
    exampleUrl: 'https://www.instagram.com/reel/C123456789/',
  },
  'twitter-downloader': {
    slug: 'twitter-downloader',
    platform: 'twitter',
    title: 'X / Twitter Video Downloader - Save Tweets & GIFs in MP4 | MediaDrop',
    metaDescription: 'Download Twitter (X) videos, clips, and GIFs in multiple MP4 resolutions for free.',
    heading: 'X (Twitter) Video & GIF Downloader',
    subheading: 'Save videos and GIFs from X/Twitter in 1080p, 720p, or 480p MP4 formats instantly.',
    heroBadge: 'X / Twitter Video Saver',
    iconName: 'twitter',
    features: [
      'Save public X / Twitter videos in top resolutions',
      'Extract animated GIFs as MP4 video files',
      'Supports x.com and twitter.com URLs',
    ],
    steps: [
      { title: 'Copy Post Link', desc: 'Click the Share icon on any tweet containing a video and copy the URL.' },
      { title: 'Paste & Download', desc: 'Paste into MediaDrop and click Download.' },
    ],
    faqs: [
      { q: 'Does it work with x.com links?', a: 'Yes, both x.com and twitter.com links are fully supported.' },
    ],
    exampleUrl: 'https://x.com/Interior/status/463440424141459456',
  },
  'facebook-downloader': {
    slug: 'facebook-downloader',
    platform: 'facebook',
    title: 'Facebook Video Downloader - Save FB Watch & Reels in HD | MediaDrop',
    metaDescription: 'Download public Facebook Watch videos and Reels in Full HD and SD MP4 formats.',
    heading: 'Facebook Video & Reels Downloader',
    subheading: 'Download public Facebook videos and Reels directly to your device in high definition.',
    heroBadge: 'Facebook HD Video Saver',
    iconName: 'facebook',
    features: [
      'Download Facebook Watch videos and Reels in HD',
      'Supports fb.watch and facebook.com URLs',
      'Clean audio and video sync',
    ],
    steps: [
      { title: 'Copy Facebook Link', desc: 'Click Share on a public video and copy the link.' },
      { title: 'Paste in MediaDrop', desc: 'Paste the link and select your resolution.' },
    ],
    faqs: [
      { q: 'Can I download private Facebook videos?', a: 'Only publicly visible Facebook videos can be processed.' },
    ],
    exampleUrl: 'https://www.facebook.com/watch/?v=123456789',
  },
  'reddit-downloader': {
    slug: 'reddit-downloader',
    platform: 'reddit',
    title: 'Reddit Video Downloader with Audio - Save Reddit Videos in HD | MediaDrop',
    metaDescription: 'Download Reddit videos with sound in 1080p, 720p HD MP4. Automatically muxes separated v.redd.it audio and video.',
    heading: 'Reddit Video Downloader with Synced Audio',
    subheading: 'Download Reddit videos with crystal clear sound in high-definition MP4 format.',
    heroBadge: 'Reddit Video with Audio',
    iconName: 'reddit',
    features: [
      'Automatically synchronizes and merges Reddit video and audio',
      'Supports 1080p, 720p, and 480p resolutions',
      'Compatible with reddit.com and v.redd.it links',
    ],
    steps: [
      { title: 'Copy Reddit Post URL', desc: 'Copy the URL of the Reddit post containing the video.' },
      { title: 'Paste & Process', desc: 'Paste into MediaDrop and click Download.' },
    ],
    faqs: [
      { q: 'Why do other downloaders have no sound on Reddit videos?', a: 'Reddit stores video and audio on separate streams. MediaDrop automatically merges them with FFmpeg so your download always has perfect sound.' },
    ],
    exampleUrl: 'https://www.reddit.com/r/videos/comments/6x9y1x/test/',
  },
  'pinterest-downloader': {
    slug: 'pinterest-downloader',
    platform: 'pinterest',
    title: 'Pinterest Video Downloader - Save Idea Pins & Videos | MediaDrop',
    metaDescription: 'Download public Pinterest videos and Idea Pins in original quality MP4 format.',
    heading: 'Pinterest Video & Pin Downloader',
    subheading: 'Download Pinterest video pins and idea clips in high-definition MP4 quality.',
    heroBadge: 'Pinterest Video Saver',
    iconName: 'pinterest',
    features: [
      'Download Pinterest video pins in MP4',
      'Supports pin.it short links and pinterest.com URLs',
    ],
    steps: [
      { title: 'Copy Pin Link', desc: 'Tap Share on any Pinterest video pin and copy the link.' },
      { title: 'Paste and Save', desc: 'Paste into MediaDrop and save the MP4 video.' },
    ],
    faqs: [
      { q: 'Does it support pin.it links?', a: 'Yes, both full URLs and short pin.it links work seamlessly.' },
    ],
    exampleUrl: 'https://www.pinterest.com/pin/123456789/',
  },
  'vimeo-downloader': {
    slug: 'vimeo-downloader',
    platform: 'vimeo',
    title: 'Vimeo Video Downloader - Save Vimeo in 1080p & 4K | MediaDrop',
    metaDescription: 'Download public Vimeo videos in 4K, 1080p, 720p HD MP4 format for free.',
    heading: 'Vimeo Video Downloader in Full HD',
    subheading: 'Save public Vimeo videos in 4K, 1080p, 720p, and 480p MP4 quality.',
    heroBadge: 'Vimeo High-Res Downloader',
    iconName: 'vimeo',
    features: [
      'Download Vimeo videos in progressive 1080p and 720p HD',
      'Extract high-bitrate audio in MP3 format',
    ],
    steps: [
      { title: 'Copy Vimeo URL', desc: 'Copy the link from the Vimeo video page.' },
      { title: 'Paste & Download', desc: 'Paste into MediaDrop and choose your resolution.' },
    ],
    faqs: [
      { q: 'Can I download password-protected Vimeo videos?', a: 'No, only publicly accessible Vimeo videos can be downloaded.' },
    ],
    exampleUrl: 'https://vimeo.com/76979871',
  },
};
