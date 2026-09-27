export type EventStatus = 'live' | 'upcoming' | 'draft' | 'completed';
export type EventFormat = 'in-person' | 'hybrid' | 'virtual';
export type PostTone = 'professional' | 'grateful' | 'takeaways' | 'thought-leader';
export type PostLength = 'concise' | 'standard' | 'detailed';
export type EmojiStyle = 'none' | 'minimal' | 'natural';

export interface FeedPost {
  id: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  eventTitle: string;
  timeAgo: string;
  quote: string;
  fullContent: string;
  reactions: number;
  comments: number;
  reposts: number;
  photos: string[];
}

export interface ActivityTimelineItem {
  id: string;
  author: string;
  authorRole?: string;
  action: string;
  timeAgo: string;
  type: 'post' | 'photo' | 'checkin' | 'open' | 'milestone';
  badgeSnippet?: string;
}

export interface ContentTheme {
  id: string;
  title: string;
  positivePercent: number;
  sentimentLabel: string;
  mentions: number;
  progressPercent: number;
  colorClass: string;
}

export interface TakeawayPromptPerformance {
  rank: number;
  prompt: string;
  context: string;
  responses: number;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  organizer: string;
  organizerBadge: boolean;
  series: string;
  date: string;
  isoDate: string;
  time: string;
  location: string;
  cityCountry: string;
  status: EventStatus;
  format: EventFormat;
  description: string;
  coverImage: string;
  logoUrl?: string;
  organizerLogoText?: string;
  brandAccent: string;
  hashtags: string[];
  socialChannels: {
    linkedin?: string;
    twitter?: string;
    website?: string;
    instagram?: string;
  };
  attendeeInputsConfig: {
    photos: boolean;
    takeaways: boolean;
    personalReflection: boolean;
    speakerMentions: boolean;
    customMessage: boolean;
  };
  prompts: string[];
  stats: {
    attendees: number;
    checkedIn: number;
    postsGenerated: number;
    photosUploaded: number;
    linkedinOpens: number;
    impressions: string;
    conversionRate: number;
    socialVelocity: number;
    lastActiveText: string;
  };
  setupProgress?: number;
  setupStep?: number;
  nextSetupTask?: string;
  attendeeFeed?: FeedPost[];
  photographyStream?: { id: string; url: string; label: string }[];
  timelineItems?: ActivityTimelineItem[];
  contentThemes?: ContentTheme[];
  promptPerformance?: TakeawayPromptPerformance[];
}

export interface GeneratedPostVersion {
  id: string;
  versionNumber: number;
  tone: PostTone;
  toneLabel: string;
  content: string;
  createdAt: string;
}
