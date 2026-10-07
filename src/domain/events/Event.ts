export interface SocialChannels {
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface AttendeeInputsConfig {
  photos: boolean;
  takeaways: boolean;
  personalReflection: boolean;
  speakerMentions: boolean;
  customMessage: boolean;
}

export interface EventStats {
  attendees: number;
  checkedIn: number;
  postsGenerated: number;
  photosUploaded: number;
  linkedinOpens: number;
  impressions: string;
  conversionRate: number;
  socialVelocity: number;
  lastActiveText: string;
}

export interface EventEntity {
  id: string;
  slug: string;
  title: string;
  organizer: string;
  organizerBadge: boolean;
  series?: string;
  date: string;
  isoDate: string;
  time: string;
  location: string;
  cityCountry: string;
  status: 'draft' | 'live' | 'archived';
  format: 'in-person' | 'hybrid' | 'virtual';
  description: string;
  coverImage: string;
  organizerLogoText: string;
  brandAccent: string;
  hashtags: string[];
  socialChannels: SocialChannels;
  attendeeInputsConfig: AttendeeInputsConfig;
  prompts: string[];
  stats: EventStats;
  setupProgress: number;
  setupStep: number;
}
