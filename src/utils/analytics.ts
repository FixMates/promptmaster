import { AnalyticsEvent } from '../types/ads';

const EVENTS_STORAGE_KEY = 'pm_analytics_events_v1';
const MAX_STORED_EVENTS = 200;

export function recordEvent(
  type: AnalyticsEvent['type'],
  details?: Record<string, any>
): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    const events: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];

    const newEvent: AnalyticsEvent = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      type,
      details,
    };

    events.unshift(newEvent);

    // Keep recent events to respect privacy and storage boundaries
    if (events.length > MAX_STORED_EVENTS) {
      events.length = MAX_STORED_EVENTS;
    }

    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    // Fail silently in private/incognito browsing
  }
}

export interface AnalyticsSummary {
  totalEvents: number;
  pageViews: number;
  promptCopies: number;
  shares: number;
  searches: number;
  categoryViews: number;
  adImpressions: number;
  recentEvents: AnalyticsEvent[];
}

export function getAnalyticsSummary(): AnalyticsSummary {
  if (typeof window === 'undefined') {
    return {
      totalEvents: 0,
      pageViews: 0,
      promptCopies: 0,
      shares: 0,
      searches: 0,
      categoryViews: 0,
      adImpressions: 0,
      recentEvents: [],
    };
  }

  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    const events: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];

    let pageViews = 0;
    let promptCopies = 0;
    let shares = 0;
    let searches = 0;
    let categoryViews = 0;
    let adImpressions = 0;

    events.forEach(e => {
      switch (e.type) {
        case 'pageview':
          pageViews++;
          break;
        case 'copy_prompt':
          promptCopies++;
          break;
        case 'share':
          shares++;
          break;
        case 'gallery_search':
          searches++;
          break;
        case 'category_filter':
          categoryViews++;
          break;
        case 'ad_impression':
          adImpressions++;
          break;
      }
    });

    return {
      totalEvents: events.length,
      pageViews,
      promptCopies,
      shares,
      searches,
      categoryViews,
      adImpressions,
      recentEvents: events.slice(0, 30),
    };
  } catch (err) {
    return {
      totalEvents: 0,
      pageViews: 0,
      promptCopies: 0,
      shares: 0,
      searches: 0,
      categoryViews: 0,
      adImpressions: 0,
      recentEvents: [],
    };
  }
}

export function clearAnalyticsData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(EVENTS_STORAGE_KEY);
}
