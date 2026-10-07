import { AnalyticsTracker, AnalyticsEvent } from '../../domain/analytics/Analytics';

export class ConsoleAnalyticsTracker implements AnalyticsTracker {
  async track(event: AnalyticsEvent): Promise<void> {
    const timestamp = event.timestamp || new Date().toISOString();
    console.log(\[Analytics Track] \ - \\, event.properties || {});
  }
}
