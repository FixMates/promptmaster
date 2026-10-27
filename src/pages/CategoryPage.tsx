import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { GalleryGrid } from '../components/gallery/GalleryGrid';
import { ImageLightbox } from '../components/gallery/ImageLightbox';
import { CATEGORIES, getCategoryById } from '../data/categories';
import { getPublishedPrompts } from '../utils/storage';
import { PromptRecord } from '../types/prompt';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [lightboxPrompt, setLightboxPrompt] = useState<PromptRecord | null>(null);

  const category = getCategoryById(categorySlug || '');
  const allPrompts = getPublishedPrompts();

  const categoryPrompts = allPrompts.filter(
    p => p.category.toLowerCase() === (categorySlug || '').toLowerCase()
  );

  if (!category) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-white mb-3">Category Not Found</h1>
        <p className="text-slate-400 mb-6">The category you requested does not exist or has been moved.</p>
        <Link
          to="/explore"
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm transition-colors"
        >
          Return to Gallery
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${category.name} AI Image Prompts — Prompt Master`}
        description={category.description}
        path={`/categories/${category.slug}`}
      />

      <div className="flex flex-col gap-6">
        <Breadcrumbs
          items={[
            { label: 'Categories', path: '/categories/fashion' },
            { label: category.name },
          ]}
        />

        {/* Category Hero Banner */}
        <div className="relative rounded-3xl p-6 sm:p-10 bg-obsidian-900 border border-obsidian-800 overflow-hidden shadow-card">
          <div className={`absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-br ${category.gradient} blur-3xl opacity-50`} />

          <div className="relative z-10 flex flex-col gap-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-mono font-medium w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Category Showcase</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {category.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {category.description}
            </p>

            <span className="text-xs text-slate-400 font-mono mt-1">
              {categoryPrompts.length} {categoryPrompts.length === 1 ? 'verified prompt' : 'verified prompts'} available
            </span>
          </div>
        </div>

        {/* Quick Category Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => {
            const isCurrent = cat.slug === category.slug;
            return (
              <Link
                key={cat.id}
                to={`/categories/${cat.slug}`}
                className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-medium tracking-wide transition-all ${
                  isCurrent
                    ? 'bg-brand-600 text-white shadow-glow-sm border border-brand-500'
                    : 'bg-obsidian-900 text-slate-400 hover:text-slate-200 hover:bg-obsidian-850 border border-obsidian-800'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>

        {/* Category Prompts Grid */}
        <div className="pt-2">
          <GalleryGrid
            prompts={categoryPrompts}
            onOpenLightbox={setLightboxPrompt}
            showInFeedAd={true}
          />
        </div>
      </div>

      <ImageLightbox prompt={lightboxPrompt} onClose={() => setLightboxPrompt(null)} />
    </>
  );
};
