import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { FilterBar, SortOption } from '../components/gallery/FilterBar';
import { GalleryGrid } from '../components/gallery/GalleryGrid';
import { ImageLightbox } from '../components/gallery/ImageLightbox';
import { getPublishedPrompts } from '../utils/storage';
import { PromptRecord } from '../types/prompt';
import { recordEvent } from '../utils/analytics';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [lightboxPrompt, setLightboxPrompt] = useState<PromptRecord | null>(null);

  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialSort = (searchParams.get('sort') as SortOption) || 'newest';
  const onlyFeatured = searchParams.get('featured') === 'true';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);

  // Sync state if query params change
  useEffect(() => {
    if (searchParams.get('search')) setSearchQuery(searchParams.get('search') || '');
    if (searchParams.get('category')) setSelectedCategory(searchParams.get('category') || 'all');
    if (searchParams.get('sort')) setSortBy(searchParams.get('sort') as SortOption);
  }, [searchParams]);

  const allPrompts = getPublishedPrompts();

  // Filter and sort prompts
  const filteredPrompts = useMemo(() => {
    let result = [...allPrompts];

    // Filter by featured if requested
    if (onlyFeatured) {
      result = result.filter(p => p.featured);
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const cleanQ = q.startsWith('#') ? q.slice(1) : q;

      result = result.filter(p => {
        const idMatch = p.id.toLowerCase() === cleanQ;
        const titleMatch = p.title.toLowerCase().includes(q);
        const promptMatch = p.prompt.toLowerCase().includes(q);
        const modelMatch = p.model?.toLowerCase().includes(q);
        const tagMatch = p.tags?.some(t => t.toLowerCase().includes(q));
        return idMatch || titleMatch || promptMatch || modelMatch || tagMatch;
      });
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'id':
          return parseInt(a.id, 10) - parseInt(b.id, 10);
        default:
          return 0;
      }
    });

    return result;
  }, [allPrompts, searchQuery, selectedCategory, sortBy, onlyFeatured]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    const newParams = new URLSearchParams(searchParams);
    if (query) {
      newParams.set('search', query);
      recordEvent('gallery_search', { query });
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat && cat !== 'all') {
      newParams.set('category', cat);
      recordEvent('category_filter', { category: cat });
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', sort);
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <>
      <SEOHead
        title="Explore AI Art Prompts — Prompt Master Gallery"
        description="Browse the complete catalog of curated AI image generation prompts for Midjourney, Flux, SDXL, and DALL-E."
        path="/explore"
      />

      <div className="flex flex-col gap-6">
        {/* Page Title & Breadcrumb Header */}
        <div className="flex flex-col gap-2 pt-2 pb-4 border-b border-obsidian-800">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {onlyFeatured ? 'Featured Masterpieces' : 'Explore All Prompts'}
          </h1>
          <p className="text-sm text-slate-400">
            {onlyFeatured
              ? 'Our premier selection of high-fidelity generative prompts.'
              : 'Discover and copy generation prompts across fashion, anime, fantasy, cyberpunk, and 4K wallpapers.'}
          </p>
        </div>

        {/* Filter & Search Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          totalResults={filteredPrompts.length}
        />

        {/* Gallery Grid */}
        <GalleryGrid
          prompts={filteredPrompts}
          onOpenLightbox={setLightboxPrompt}
          showInFeedAd={true}
          onResetFilters={handleResetFilters}
        />
      </div>

      <ImageLightbox prompt={lightboxPrompt} onClose={() => setLightboxPrompt(null)} />
    </>
  );
};
