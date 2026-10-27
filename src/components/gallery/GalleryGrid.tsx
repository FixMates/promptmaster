import React from 'react';
import { PromptRecord } from '../../types/prompt';
import { PromptCard } from './PromptCard';
import { AdPlacement } from '../ads/AdPlacement';
import { Sparkles, SearchX } from 'lucide-react';

interface GalleryGridProps {
  prompts: PromptRecord[];
  onOpenLightbox?: (prompt: PromptRecord) => void;
  showInFeedAd?: boolean;
  onResetFilters?: () => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  prompts,
  onOpenLightbox,
  showInFeedAd = true,
  onResetFilters,
}) => {
  if (prompts.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4 rounded-3xl bg-obsidian-900/40 border border-obsidian-800 my-8">
        <div className="w-14 h-14 rounded-2xl bg-obsidian-800 flex items-center justify-center text-slate-400 mb-4 border border-obsidian-700">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-semibold text-slate-100 mb-2">No Prompts Found</h3>
        <p className="text-sm text-slate-400 max-w-md mb-6">
          We couldn't find any prompts matching your query or selected category. Try searching for different keywords or clear your filters.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm transition-all shadow-glow-sm"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  // Insert native ad between cards if enabled
  const adInsertIndex = 3;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
        {prompts.map((prompt, index) => (
          <React.Fragment key={prompt.id}>
            <PromptCard prompt={prompt} onOpenLightbox={onOpenLightbox} />

            {/* In-feed native advertisement after 3rd item on large screens */}
            {showInFeedAd && index === adInsertIndex && (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 my-2">
                <AdPlacement placementId="gallery-infeed" format="native-banner" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
