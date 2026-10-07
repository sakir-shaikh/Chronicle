export interface EventMetrics {
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

export interface ContentInsights {
  topHashtags: { tag: string; count: number }[];
  popularTones: { tone: string; percentage: number }[];
}

export interface AnalyticsEvent {
  eventName: string;
  properties?: Record<string, any>;
  timestamp?: string;
}

export interface AnalyticsRepository {
  getEventMetrics(eventId: string): Promise<EventMetrics>;
  getContentInsights(eventId: string): Promise<ContentInsights>;
}

export interface AnalyticsTracker {
  track(event: AnalyticsEvent): Promise<void>;
}
