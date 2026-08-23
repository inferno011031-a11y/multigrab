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
    title: 'YouTube Video Downloader - Download 4K, 1080p, 720p HD MP4 Online Free | MediaDrop',
    metaDescription: 'Free online YouTube downloader to save videos and Shorts in 4K UHD, 1080p Full HD, and 720p MP4. Fast, secure, and no software required.',
    heading: 'YouTube Video Downloader in 4K & 1080p',
    subheading: 'Paste any YouTube video or Shorts link to download high-resolution MP4 video streams or extract audio files instantly.',
    heroBadge: 'Fast YouTube 4K & 1080p Downloader',
    iconName: 'youtube',
    features: [
      'Download 4K 2160p, 1440p, 1080p Full HD and 720p HD MP4 video streams',
      'Original high-bitrate synchronized audio tracks included in all video files',
      'Supports standard YouTube videos, music clips, and vertical Shorts',
      'Zero ads, no software installation, 100% free with unlimited conversions',
    ],
    steps: [
      { title: 'Copy YouTube URL', desc: 'Open YouTube and copy the link of the video or Short you want to save.' },
      { title: 'Paste into MediaDrop', desc: 'Paste the link into the search box above and click Download.' },
      { title: 'Save File', desc: 'Select your preferred video resolution (4K, 1080p, 720p) or audio format.' },
    ],
    faqs: [
      { q: 'Is this YouTube downloader free to use?', a: 'Yes, MediaDrop is 100% free with no registration, no daily caps, and no subscriptions.' },
      { q: 'Can I download YouTube Shorts?', a: 'Yes! Simply copy any YouTube Shorts link and paste it into the downloader.' },
      { q: 'What video resolutions are available?', a: 'We support all resolutions uploaded by the creator: 4K (2160p), 2K (1440p), 1080p Full HD, 720p HD, and 480p SD.' },
      { q: 'Does it work on iPhone and Android?', a: 'Yes, it works directly in Safari on iOS and Chrome on Android without needing any third-party app.' },
    ],
    exampleUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  'youtube-to-mp3': {
    slug: 'youtube-to-mp3',
    platform: 'youtube',
    title: 'YouTube to MP3 Converter - Free High Quality 320kbps Audio Extractor | MediaDrop',
    metaDescription: 'Convert YouTube videos and music clips to high quality 320kbps and 128kbps MP3 audio files online for free. Fast, clean, and no software required.',
    heading: 'YouTube to MP3 Converter (320 kbps)',
    subheading: 'Convert any YouTube video, song, or playlist item into crisp 320 kbps MP3 or M4A audio files for offline music listening.',
    heroBadge: 'YouTube to 320kbps MP3 Extractor',
    iconName: 'youtube',
    features: [
      'Extract studio-quality 320 kbps and standard 128 kbps MP3 audio',
      'M4A / AAC audio stream support with preserved bitrates',
      'Compatible with YouTube Music, official audio tracks, and music videos',
      'Fast cloud conversion with immediate direct file download',
    ],
    steps: [
      { title: 'Copy YouTube Link', desc: 'Copy the URL of the YouTube song or video you want to convert to MP3.' },
      { title: 'Paste into Converter', desc: 'Paste the link into the box above and hit Download.' },
      { title: 'Download MP3', desc: 'Click on the MP3 High Quality (320 kbps) button to save the audio file.' },
    ],
    faqs: [
      { q: 'What is the highest MP3 quality available?', a: 'MediaDrop extracts audio at up to 320 kbps constant bitrate with ID3 metadata.' },
      { q: 'Is there a limit on audio length?', a: 'You can convert short clips as well as long podcast and DJ set episodes.' },
      { q: 'Can I listen to downloaded MP3s offline?', a: 'Yes, downloaded MP3 files can be transferred and played on any device or music player.' },
    ],
    exampleUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  'youtube-shorts-downloader': {
    slug: 'youtube-shorts-downloader',
    platform: 'youtube',
    title: 'YouTube Shorts Downloader - Save Shorts in Full HD 1080p MP4 | MediaDrop',
    metaDescription: 'Download YouTube Shorts in original HD 1080p quality without watermarks. Free online YouTube Shorts video and audio saver for mobile and PC.',
    heading: 'YouTube Shorts Video Downloader',
    subheading: 'Save vertical YouTube Shorts videos in original high-definition 1080p MP4 format directly to your phone or computer.',
    heroBadge: 'Fast YouTube Shorts Saver',
    iconName: 'youtube',
    features: [
      'Download vertical Shorts in full 1080x1920 HD resolution',
      'Extract original audio and background sound in MP3',
      'Works seamlessly on mobile browsers with 1-tap download',
    ],
    steps: [
      { title: 'Copy Shorts URL', desc: 'Tap Share on the YouTube Short and copy the link.' },
      { title: 'Paste Link', desc: 'Paste the Shorts link into MediaDrop.' },
      { title: 'Save Video', desc: 'Choose 1080p HD to download the video instantly.' },
    ],
    faqs: [
      { q: 'How do I download Shorts on iPhone?', a: 'Paste the link in Safari on MediaDrop, click Download, and save the file directly to your Files or Photos.' },
    ],
    exampleUrl: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
  },
  'spotify-downloader': {
    slug: 'spotify-downloader',
    platform: 'spotify',
    title: 'Spotify Downloader - Save Songs & Tracks in 320kbps MP3 Online Free | MediaDrop',
    metaDescription: 'Free online Spotify downloader to save tracks, songs, and podcast episodes in high quality 320kbps MP3 audio with album art and metadata.',
    heading: 'Spotify Track & Song MP3 Downloader',
    subheading: 'Paste any Spotify track or episode URL to extract and download high-fidelity 320 kbps MP3 audio with album cover art and song title metadata.',
    heroBadge: 'Spotify 320kbps MP3 Saver',
    iconName: 'spotify',
    features: [
      'Extract 320 kbps High Quality MP3 and M4A audio tracks',
      'Preserves song title, artist name, and original album cover artwork',
      'Supports open.spotify.com track and episode links',
      'Zero software required — 100% cloud-based conversion',
    ],
    steps: [
      { title: 'Copy Spotify Song Link', desc: 'In the Spotify app or web player, tap Share and copy the song link.' },
      { title: 'Paste Link', desc: 'Paste the Spotify URL into the search bar above.' },
      { title: 'Save MP3', desc: 'Click Download to convert and save the 320 kbps MP3 file to your device.' },
    ],
    faqs: [
      { q: 'Do I need Spotify Premium to use this?', a: 'No premium account or Spotify login is needed. Anyone can download public tracks.' },
      { q: 'What audio formats are supported?', a: 'You can download MP3 at 320 kbps, MP3 at 128 kbps, or M4A audio streams.' },
      { q: 'Does the downloaded file include album cover art?', a: 'Yes, the original cover artwork and metadata are preserved.' },
    ],
    exampleUrl: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
  },
  'spotify-to-mp3': {
    slug: 'spotify-to-mp3',
    platform: 'spotify',
    title: 'Spotify to MP3 Converter - Download Spotify Songs Online Free | MediaDrop',
    metaDescription: 'Convert Spotify links to 320kbps MP3 music files online. Fast, free, and works on all devices without installing software.',
    heading: 'Spotify to MP3 Music Converter',
    subheading: 'Convert your favorite Spotify songs into universal MP3 audio files with high bitrate quality for offline listening anywhere.',
    heroBadge: 'Free Spotify to MP3 Converter',
    iconName: 'spotify',
    features: [
      'Fast conversion from Spotify song links to MP3 format',
      'High audio fidelity at 320 kbps bitrate',
      'Works on iPhone, Android, Windows, and Mac',
    ],
    steps: [
      { title: 'Copy Song Link', desc: 'Copy any track link from Spotify.' },
      { title: 'Paste in MediaDrop', desc: 'Paste the link above and click Download.' },
      { title: 'Save Audio', desc: 'Download the MP3 file directly to your device.' },
    ],
    faqs: [
      { q: 'Can I play the MP3 on my car stereo or MP3 player?', a: 'Yes! The downloaded MP3 files are standard audio files playable on any device.' },
    ],
    exampleUrl: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
  },
  'tiktok-downloader': {
    slug: 'tiktok-downloader',
    platform: 'tiktok',
    title: 'TikTok Video Downloader Without Watermark - Save TikTok in HD MP4 | MediaDrop',
    metaDescription: 'Download TikTok videos in original HD MP4 without watermarks. Free online TikTok video and audio saver for mobile and desktop.',
    heading: 'TikTok Video Downloader Without Watermark',
    subheading: 'Save public TikTok videos in crisp HD MP4 resolution or extract the original background sound and music in MP3.',
    heroBadge: 'TikTok HD Video & MP3 Saver',
    iconName: 'tiktok',
    features: [
      'Download high-definition TikTok videos in clean MP4 format',
      'Extract original TikTok sounds and background music in MP3',
      'Supports standard tiktok.com and mobile vm.tiktok.com links',
      'Blazing fast processing on mobile and desktop browsers',
    ],
    steps: [
      { title: 'Copy TikTok Link', desc: 'Open TikTok, tap Share on any public video and copy the link.' },
      { title: 'Paste & Analyze', desc: 'Paste the link above and tap Download to analyze available formats.' },
      { title: 'Download File', desc: 'Select HD video or audio extraction to save directly to your phone or PC.' },
    ],
    faqs: [
      { q: 'Can I download TikTok videos on iPhone/Android?', a: 'Yes, MediaDrop works directly inside Safari, Chrome, and all mobile browsers.' },
      { q: 'How do I extract TikTok music?', a: 'Choose the Separate Audio Tracks option on the download screen.' },
      { q: 'Does it remove the TikTok watermark?', a: 'Yes, we fetch the clean original stream provided by the platform.' },
    ],
    exampleUrl: 'https://www.tiktok.com/@tiktok/video/7106594312292453678',
  },
  'tiktok-mp3-downloader': {
    slug: 'tiktok-mp3-downloader',
    platform: 'tiktok',
    title: 'TikTok to MP3 Converter - Download TikTok Sounds & Audio Free | MediaDrop',
    metaDescription: 'Extract and download TikTok audio, sounds, and background music in high quality MP3 format for free online.',
    heading: 'TikTok Sound & Audio MP3 Downloader',
    subheading: 'Extract the background music, voiceover, or original sound from any TikTok video directly as an MP3 file.',
    heroBadge: 'TikTok to MP3 Extractor',
    iconName: 'tiktok',
    features: [
      'Extract full-length audio tracks from TikTok videos',
      'Save in standard MP3 format compatible with all music players',
      'Fast 1-click conversion with zero ads',
    ],
    steps: [
      { title: 'Copy Video Link', desc: 'Copy the share link from TikTok.' },
      { title: 'Paste URL', desc: 'Paste into the box above and click Download.' },
      { title: 'Save MP3', desc: 'Click Extract MP3 Audio to download the song.' },
    ],
    faqs: [
      { q: 'Can I use downloaded TikTok sounds as ringtones?', a: 'Yes, the downloaded MP3 files can be set as ringtones or alarms on any smartphone.' },
    ],
    exampleUrl: 'https://www.tiktok.com/@tiktok/video/7106594312292453678',
  },
  'instagram-downloader': {
    slug: 'instagram-downloader',
    platform: 'instagram',
    title: 'Instagram Video Downloader - Save Reels, IGTV & Videos in HD | MediaDrop',
    metaDescription: 'Download Instagram Reels, IGTV, and public video posts in original quality MP4 for free. Fast online Instagram downloader for iPhone and Android.',
    heading: 'Instagram Reels & Video Downloader',
    subheading: 'Download public Instagram Reels and videos in crisp HD quality directly to your phone or computer without installing software.',
    heroBadge: 'Instagram Reels & Video Saver',
    iconName: 'instagram',
    features: [
      'Download Instagram Reels in original high definition MP4',
      'Extract separate audio tracks and music from Reels',
      'Supports instagram.com links on mobile and web',
      'No Instagram login or app installation required',
    ],
    steps: [
      { title: 'Copy Reel Link', desc: 'Tap the three dots on the Instagram Reel and copy the link.' },
      { title: 'Paste Link', desc: 'Paste the URL into MediaDrop.' },
      { title: 'Save Video', desc: 'Choose video or audio to download immediately.' },
    ],
    faqs: [
      { q: 'Can I download private Instagram posts?', a: 'No, MediaDrop only supports publicly available Instagram Reels and videos.' },
      { q: 'How do I save Instagram Reels on iPhone?', a: 'Paste the link in Safari, tap Download, and tap Save to Photos.' },
    ],
    exampleUrl: 'https://www.instagram.com/reel/C123456789/',
  },
  'instagram-reels-downloader': {
    slug: 'instagram-reels-downloader',
    platform: 'instagram',
    title: 'Instagram Reels Downloader - Save IG Reels in 1080p HD MP4 | MediaDrop',
    metaDescription: 'Download Instagram Reels in high definition 1080p MP4 with sound online for free. Fast, simple, and works on all devices.',
    heading: 'Instagram Reels Video Downloader (1080p)',
    subheading: 'Download any public Instagram Reel with full audio in original 1080p resolution directly to your camera roll.',
    heroBadge: 'Instagram Reels HD Downloader',
    iconName: 'instagram',
    features: [
      'Save IG Reels in 1080p Full HD video quality',
      'Crystal clear original synced audio included',
      'Fast 1-click mobile download without app installs',
    ],
    steps: [
      { title: 'Copy Reel URL', desc: 'Tap the paper airplane or 3 dots on the Reel and select Copy Link.' },
      { title: 'Paste in MediaDrop', desc: 'Paste into the search field above.' },
      { title: 'Download MP4', desc: 'Click Download to save the 1080p video.' },
    ],
    faqs: [
      { q: 'Does it work for carousel video posts?', a: 'Yes, public video carousels and standalone Reels are fully supported.' },
    ],
    exampleUrl: 'https://www.instagram.com/reel/C123456789/',
  },
  'twitter-downloader': {
    slug: 'twitter-downloader',
    platform: 'twitter',
    title: 'X / Twitter Video Downloader - Save Tweets & GIFs in MP4 HD | MediaDrop',
    metaDescription: 'Download Twitter (X) videos, clips, and GIFs in multiple MP4 resolutions (1080p, 720p, 480p) online for free. Fast and secure.',
    heading: 'X (Twitter) Video & GIF Downloader',
    subheading: 'Save videos and animated GIFs from X/Twitter in 1080p, 720p, or 480p MP4 formats instantly.',
    heroBadge: 'X / Twitter Video Saver',
    iconName: 'twitter',
    features: [
      'Save public X / Twitter videos in top resolutions up to 1080p',
      'Convert and extract animated GIFs as standard MP4 files',
      'Supports both x.com and twitter.com URLs seamlessly',
    ],
    steps: [
      { title: 'Copy Post Link', desc: 'Click the Share icon on any tweet containing a video and copy the URL.' },
      { title: 'Paste & Download', desc: 'Paste into MediaDrop and click Download.' },
      { title: 'Select Quality', desc: 'Pick your preferred MP4 resolution and save the file.' },
    ],
    faqs: [
      { q: 'Does it work with x.com links?', a: 'Yes, both x.com and twitter.com links are fully supported.' },
      { q: 'How do I download Twitter GIFs?', a: 'Twitter GIFs are stored as MP4 videos. MediaDrop extracts them as standard playable MP4 files.' },
    ],
    exampleUrl: 'https://x.com/Interior/status/463440424141459456',
  },
  'twitter-video-downloader': {
    slug: 'twitter-video-downloader',
    platform: 'twitter',
    title: 'Twitter Video Downloader - Download X Videos Online in HD MP4 | MediaDrop',
    metaDescription: 'Download X (Twitter) videos in high definition 1080p and 720p MP4 online for free. Simple, fast, and no software required.',
    heading: 'Twitter (X) Video Downloader Online',
    subheading: 'Fast online tool to download videos from Twitter/X in high quality MP4 format.',
    heroBadge: 'Free Twitter Video Saver',
    iconName: 'twitter',
    features: [
      'Download 1080p, 720p, and 480p Twitter video streams',
      'Save directly to iOS, Android, Mac, or PC',
      'Instant processing with zero wait times',
    ],
    steps: [
      { title: 'Copy Tweet Link', desc: 'Copy the link of the video tweet.' },
      { title: 'Paste in MediaDrop', desc: 'Paste into the input box above.' },
      { title: 'Save File', desc: 'Click Download to save the video.' },
    ],
    faqs: [
      { q: 'Can I download videos from private Twitter accounts?', a: 'No, only public tweets can be downloaded.' },
    ],
    exampleUrl: 'https://x.com/Interior/status/463440424141459456',
  },
  'facebook-downloader': {
    slug: 'facebook-downloader',
    platform: 'facebook',
    title: 'Facebook Video Downloader - Save FB Watch & Reels in 1080p HD | MediaDrop',
    metaDescription: 'Download public Facebook Watch videos and Reels in Full HD 1080p and SD MP4 formats online for free. Fast and mobile-friendly.',
    heading: 'Facebook Video & Reels Downloader',
    subheading: 'Download public Facebook videos and Reels directly to your device in high definition with synchronized sound.',
    heroBadge: 'Facebook HD Video Saver',
    iconName: 'facebook',
    features: [
      'Download Facebook Watch videos and Reels in 1080p HD and SD',
      'Supports fb.watch, m.facebook.com, and facebook.com URLs',
      'Clean audio and video synchronization in MP4 container',
    ],
    steps: [
      { title: 'Copy Facebook Link', desc: 'Click Share on a public video and copy the link.' },
      { title: 'Paste in MediaDrop', desc: 'Paste the link and select your resolution.' },
      { title: 'Download MP4', desc: 'Save the video file to your gallery or downloads.' },
    ],
    faqs: [
      { q: 'Can I download private Facebook videos?', a: 'Only publicly visible Facebook videos can be processed.' },
      { q: 'Does it support Facebook Reels?', a: 'Yes, Facebook Reels and Watch videos are both supported in HD.' },
    ],
    exampleUrl: 'https://www.facebook.com/watch/?v=123456789',
  },
  'reddit-downloader': {
    slug: 'reddit-downloader',
    platform: 'reddit',
    title: 'Reddit Video Downloader with Audio - Save Reddit Videos in HD MP4 | MediaDrop',
    metaDescription: 'Download Reddit videos with sound in 1080p, 720p HD MP4. Automatically merges separated v.redd.it audio and video streams for free.',
    heading: 'Reddit Video Downloader with Synced Audio',
    subheading: 'Download Reddit videos with crystal clear sound in high-definition MP4 format. Automatically merges split video and audio tracks.',
    heroBadge: 'Reddit Video with Audio Saver',
    iconName: 'reddit',
    features: [
      'Automatically synchronizes and merges Reddit video and audio streams',
      'Supports 1080p, 720p, and 480p resolutions',
      'Compatible with reddit.com, old.reddit.com, and v.redd.it links',
    ],
    steps: [
      { title: 'Copy Reddit Post URL', desc: 'Copy the URL of the Reddit post containing the video.' },
      { title: 'Paste & Process', desc: 'Paste into MediaDrop and click Download.' },
      { title: 'Save with Audio', desc: 'Download the combined MP4 video with full sound.' },
    ],
    faqs: [
      { q: 'Why do other downloaders have no sound on Reddit videos?', a: 'Reddit stores video and audio on separate streams. MediaDrop automatically merges them with FFmpeg so your download always has perfect sound.' },
      { q: 'Does it work with NSFW Reddit videos?', a: 'As long as the video post is public, it can be processed.' },
    ],
    exampleUrl: 'https://www.reddit.com/r/videos/comments/6x9y1x/test/',
  },
  'pinterest-downloader': {
    slug: 'pinterest-downloader',
    platform: 'pinterest',
    title: 'Pinterest Video Downloader - Save Idea Pins & Videos in HD MP4 | MediaDrop',
    metaDescription: 'Download public Pinterest videos and Idea Pins in original quality MP4 format online for free. Fast and works on iPhone and Android.',
    heading: 'Pinterest Video & Pin Downloader',
    subheading: 'Download Pinterest video pins and idea clips in high-definition MP4 quality directly to your phone or computer.',
    heroBadge: 'Pinterest Video Saver',
    iconName: 'pinterest',
    features: [
      'Download Pinterest video pins in original high-resolution MP4',
      'Supports pin.it short links and pinterest.com URLs',
      'Clean 1-tap download without watermarks',
    ],
    steps: [
      { title: 'Copy Pin Link', desc: 'Tap Share on any Pinterest video pin and copy the link.' },
      { title: 'Paste and Save', desc: 'Paste into MediaDrop and save the MP4 video.' },
    ],
    faqs: [
      { q: 'Does it support pin.it short links?', a: 'Yes, both full URLs and short pin.it links work seamlessly.' },
    ],
    exampleUrl: 'https://www.pinterest.com/pin/123456789/',
  },
  'vimeo-downloader': {
    slug: 'vimeo-downloader',
    platform: 'vimeo',
    title: 'Vimeo Video Downloader - Save Vimeo in 4K & 1080p Full HD MP4 | MediaDrop',
    metaDescription: 'Download public Vimeo videos in 4K, 1080p, 720p HD MP4 format for free online. Fast and no software required.',
    heading: 'Vimeo Video Downloader in Full HD',
    subheading: 'Save public Vimeo videos in 4K, 1080p, 720p, and 480p MP4 quality with synchronized audio.',
    heroBadge: 'Vimeo High-Res Downloader',
    iconName: 'vimeo',
    features: [
      'Download Vimeo videos in progressive 1080p and 720p HD',
      'Extract high-bitrate audio in MP3 format',
      'Direct MP4 stream downloads',
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
