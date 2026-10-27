import { AdsterraConfig } from '../types/ads';

export const DEFAULT_ADS_CONFIG: AdsterraConfig = {
  globalEnabled: true,
  testMode: true, // Placeholder mode until official Adsterra keys are supplied
  popunderEnabled: false, // Strictly disabled by default
  popunderKey: '',
  disclosureText: 'Advertisement',
  placements: {
    'home-native': {
      id: 'home-native',
      enabled: true,
      format: 'native-banner',
      label: 'Featured Sponsor / Recommended',
      pageLocations: ['home'],
      height: 140,
    },
    'gallery-infeed': {
      id: 'gallery-infeed',
      enabled: true,
      format: 'native-banner',
      label: 'Sponsored Inspiration',
      pageLocations: ['gallery'],
      height: 280,
    },
    'prompt-detail-bottom': {
      id: 'prompt-detail-bottom',
      enabled: true,
      format: 'display-728x90',
      label: 'Partner Advertisement',
      pageLocations: ['prompt-detail'],
      width: 728,
      height: 90,
    },
    'social-bar': {
      id: 'social-bar',
      enabled: false, // Default false until enabled by admin
      format: 'social-bar',
      label: 'Recommended Updates',
      pageLocations: ['home', 'gallery', 'prompt-detail'],
    },
  },
};

const ADS_STORAGE_KEY = 'pm_adsterra_config_v1';

export function getStoredAdsConfig(): AdsterraConfig {
  if (typeof window === 'undefined') return DEFAULT_ADS_CONFIG;
  try {
    const raw = localStorage.getItem(ADS_STORAGE_KEY);
    if (!raw) return DEFAULT_ADS_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_ADS_CONFIG,
      ...parsed,
      placements: {
        ...DEFAULT_ADS_CONFIG.placements,
        ...(parsed.placements || {}),
      },
      // Ensure popunder cannot be silently enabled without explicit boolean
      popunderEnabled: Boolean(parsed.popunderEnabled),
    };
  } catch (err) {
    console.error('Failed to parse ads config from localStorage:', err);
    return DEFAULT_ADS_CONFIG;
  }
}

export function saveStoredAdsConfig(config: AdsterraConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save ads config:', err);
  }
}
