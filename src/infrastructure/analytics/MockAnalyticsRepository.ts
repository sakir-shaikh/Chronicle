import { AnalyticsRepository, EventMetrics, ContentInsights } from '../../domain/analytics/Analytics';

export class MockAnalyticsRepository implements AnalyticsRepository {
  async getEventMetrics(eventId: string): Promise<EventMetrics> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      attendees: 120,
      checkedIn: 115,
      postsGenerated: 42,
      photosUploaded: 89,
      linkedinOpens: 95,
      impressions: '12.4k',
      conversionRate: 36,
      socialVelocity: 14,
      lastActiveText: 'Live Now'
    };
  }

  async getContentInsights(eventId: string): Promise<ContentInsights> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      topHashtags: [
        { tag: '#FutureOfAI', count: 124 },
        { tag: '#Chronicle', count: 98 },
        { tag: '#Tech2026', count: 45 }
      ],
      popularTones: [
        { tone: 'Executive & Visionary', percentage: 45 },
        { tone: 'Technical & Deep Dive', percentage: 30 },
        { tone: 'Community & Connection', percentage: 25 }
      ]
    };
  }
}
