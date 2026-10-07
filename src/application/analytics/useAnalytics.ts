import { useState, useEffect, useCallback } from 'react';
import { EventMetrics, ContentInsights, AnalyticsEvent } from '../../domain/analytics/Analytics';
import { MockAnalyticsRepository } from '../../infrastructure/analytics/MockAnalyticsRepository';
import { ConsoleAnalyticsTracker } from '../../infrastructure/analytics/ConsoleAnalyticsTracker';

const analyticsRepo = new MockAnalyticsRepository();
const analyticsTracker = new ConsoleAnalyticsTracker();

export function useAnalytics(eventId?: string) {
  const [metrics, setMetrics] = useState<EventMetrics | null>(null);
  const [insights, setInsights] = useState<ContentInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadAnalytics = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const [metricsData, insightsData] = await Promise.all([
        analyticsRepo.getEventMetrics(id),
        analyticsRepo.getContentInsights(id)
      ]);
      setMetrics(metricsData);
      setInsights(insightsData);
    } catch (error) {
      console.error('Failed to load analytics', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (eventId) {
      loadAnalytics(eventId);
    }
  }, [eventId, loadAnalytics]);

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    analyticsTracker.track({ eventName, properties });
  };

  return {
    metrics,
    insights,
    isLoading,
    refresh: eventId ? () => loadAnalytics(eventId) : undefined,
    trackEvent
  };
}
