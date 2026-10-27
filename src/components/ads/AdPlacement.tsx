import React, { useEffect, useRef, useState } from 'react';
import { getStoredAdsConfig } from '../../config/adsConfig';
import { AdFormat } from '../../types/ads';
import { recordEvent } from '../../utils/analytics';
import { ExternalLink, Sparkles } from 'lucide-react';

interface AdPlacementProps {
  placementId: string;
  className?: string;
  format?: AdFormat;
}

export const AdPlacement: React.FC<AdPlacementProps> = ({
  placementId,
  className = '',
  format,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [adBlocked, setAdBlocked] = useState(false);
  const adsConfig = getStoredAdsConfig();

  const placement = adsConfig.placements[placementId];

  // If globally disabled or this specific slot is disabled, render nothing
  if (!adsConfig.globalEnabled || (placement && !placement.enabled)) {
    return null;
  }

  const effectiveFormat = format || placement?.format || 'display-300x250';
  const label = placement?.label || adsConfig.disclosureText || 'Advertisement';

  useEffect(() => {
    // Record impression for local telemetry
    recordEvent('ad_impression', { placementId, format: effectiveFormat });

    // Script injection guard to prevent duplicate tags
    if (!adsConfig.testMode && placement?.scriptUrl && containerRef.current) {
      const existingScript = containerRef.current.querySelector(`script[src="${placement.scriptUrl}"]`);
      if (!existingScript) {
        try {
          const script = document.createElement('script');
          script.src = placement.scriptUrl;
          script.async = true;
          script.onerror = () => {
            setAdBlocked(true);
          };
          containerRef.current.appendChild(script);
        } catch (e) {
          setAdBlocked(true);
        }
      }
    }
  }, [placementId, effectiveFormat, adsConfig.testMode, placement?.scriptUrl]);

  // Height and dimensions per format to prevent Cumulative Layout Shift (CLS)
  const getContainerDimensions = () => {
    switch (effectiveFormat) {
      case 'display-728x90':
        return 'min-h-[90px] max-w-[728px]';
      case 'display-300x250':
        return 'min-h-[250px] max-w-[300px]';
      case 'native-banner':
        return 'min-h-[140px] max-w-full';
      case 'social-bar':
        return 'min-h-[60px] max-w-md';
      default:
        return 'min-h-[100px] max-w-full';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative my-6 mx-auto w-full flex flex-col items-center justify-center ${className}`}
    >
      {/* Strict Advertisement Label */}
      <div className="w-full flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1.5 px-2">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-brand-400/60" />
          {label}
        </span>
        <span className="text-[10px] text-slate-600">Adsterra Verified Slot</span>
      </div>

      {/* Reserved container to eliminate layout shift */}
      <div
        className={`w-full rounded-2xl border border-obsidian-700/60 bg-obsidian-900/60 backdrop-blur-sm overflow-hidden flex flex-col items-center justify-center p-4 transition-all ${getContainerDimensions()}`}
      >
        {adsConfig.testMode ? (
          // Professional test placeholder
          <div className="text-center p-3 flex flex-col items-center justify-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-mono font-medium mb-2">
              <span>Slot: {placementId}</span>
              <span>•</span>
              <span>{effectiveFormat}</span>
            </div>
            <p className="text-xs text-slate-400 max-w-md font-sans">
              Configured Adsterra placeholder. Real script will render here when official keys are entered in the Admin Settings.
            </p>
          </div>
        ) : adBlocked ? (
          <div className="text-center p-2 text-xs text-slate-500 font-mono">
            Advertisement space reserved (Ad-blocker active)
          </div>
        ) : (
          <div id={`adsterra-container-${placementId}`} className="w-full flex justify-center" />
        )}
      </div>
    </div>
  );
};
