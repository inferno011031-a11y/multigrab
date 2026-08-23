export type SupportedPlatform =
  | 'youtube'
  | 'instagram'
  | 'facebook'
  | 'pinterest'
  | 'tiktok'
  | 'twitter'
  | 'reddit'
  | 'vimeo'
  | 'generic';

export type MediaType = 'video' | 'audio' | 'image' | 'mixed';

export interface MediaFormat {
  formatId: string;
  ext: string;
  resolution?: string;
  qualityLabel: string;
  width?: number;
  height?: number;
  fps?: number;
  vcodec?: string;
  acodec?: string;
  filesize?: number;
  filesizeApprox?: number;
  isAudioOnly: boolean;
  isVideoOnly: boolean;
  hasVideo: boolean;
  hasAudio: boolean;
  url?: string;
  formatNote?: string;
  tbr?: number; // Total bitrate
}

export interface MediaMetadata {
  id: string;
  originalUrl: string;
  canonicalUrl: string;
  platform: SupportedPlatform;
  platformName: string;
  title: string;
  description?: string;
  author?: string;
  authorUrl?: string;
  authorAvatar?: string;
  duration?: number; // In seconds
  durationFormatted?: string;
  thumbnail?: string;
  thumbnails?: Array<{ url: string; width?: number; height?: number }>;
  viewCount?: number;
  likeCount?: number;
  uploadDate?: string;
  formats: MediaFormat[];
  availableQualities: {
    video: MediaFormat[];
    audio: MediaFormat[];
  };
  isLive?: boolean;
}

export type JobStatus =
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'expired';

export interface DownloadJob {
  id: string;
  url: string;
  formatId: string;
  platform: SupportedPlatform;
  title: string;
  status: JobStatus;
  progress: number; // 0 to 100
  speed?: string;
  eta?: string;
  error?: string;
  downloadToken?: string;
  downloadUrl?: string;
  filePath?: string;
  fileSize?: number;
  mimeType?: string;
  filename?: string;
  createdAt: number;
  completedAt?: number;
  expiresAt?: number;
}

export interface PlatformInfo {
  id: SupportedPlatform;
  name: string;
  domainPattern: string;
  description: string;
  iconName: string;
  badgeColor: string;
  supportedFeatures: {
    video: boolean;
    audio: boolean;
    hd: boolean;
    subtitles: boolean;
  };
  examples: string[];
}
