export type AdFormat = 
  | 'native-banner'
  | 'social-bar'
  | 'display-728x90'
  | 'display-300x250'
  | 'display-160x600'
  | 'popunder';

export interface PlacementConfig {
  id: string;
  enabled: boolean;
  format: AdFormat;
  scriptUrl?: string;
  adKey?: string;
  width?: number;
  height?: number;
  label?: string;
  pageLocations: ('home' | 'gallery' | 'prompt-detail')[];
}

export interface AdsterraConfig {
  globalEnabled: boolean;
  testMode: boolean; // Safe placeholder mode when real keys are not entered
  popunderEnabled: boolean; // Strictly default: false
  popunderKey?: string;
  placements: Record<string, PlacementConfig>;
  disclosureText: string;
}

export interface AnalyticsEvent {
  id: string;
  timestamp: string;
  type: 'pageview' | 'copy_prompt' | 'share' | 'gallery_search' | 'category_filter' | 'ad_impression';
  details?: Record<string, any>;
}
