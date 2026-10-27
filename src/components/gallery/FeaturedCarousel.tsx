import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PromptRecord } from '../../types/prompt';
import { PromptCard } from './PromptCard';

interface FeaturedCarouselProps {
  prompts: PromptRecord[];
  onOpenLightbox?: (prompt: PromptRecord) => void;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ prompts, onOpenLightbox }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (track) track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: 'smooth' });
  };

  if (!prompts.length) return null;

  return (
    <div className="relative">
      <div className="absolute -top-[4.25rem] right-0 hidden sm:flex gap-2">
        <button type="button" aria-label="Previous featured prompts" onClick={() => scroll(-1)} className="p-2 rounded-xl bg-obsidian-900 border border-obsidian-750 text-slate-300 hover:text-white hover:border-brand-500/50"><ArrowLeft className="w-4 h-4" /></button>
        <button type="button" aria-label="Next featured prompts" onClick={() => scroll(1)} className="p-2 rounded-xl bg-obsidian-900 border border-obsidian-750 text-slate-300 hover:text-white hover:border-brand-500/50"><ArrowRight className="w-4 h-4" /></button>
      </div>
      <div ref={trackRef} className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 [scrollbar-width:thin]">
        {prompts.map(prompt => (
          <div key={prompt.id} className="w-[min(84vw,20rem)] sm:w-[min(46vw,20rem)] lg:w-[min(30vw,18rem)] shrink-0 snap-start">
            <PromptCard prompt={prompt} onOpenLightbox={onOpenLightbox} />
          </div>
        ))}
      </div>
    </div>
  );
};
