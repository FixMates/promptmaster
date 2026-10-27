import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export type SortOption = 'newest' | 'oldest' | 'title' | 'id';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  totalResults,
}) => {
  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'all';

  return (
    <div className="w-full flex flex-col gap-4 mb-8">
      {/* Top Search & Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search bar */}
        <div className="relative flex-grow max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search prompt keywords, titles, models, or #ID..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-obsidian-900/90 border border-obsidian-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm text-slate-100 placeholder:text-slate-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <span className="text-xs text-slate-400 font-mono">
            {totalResults} {totalResults === 1 ? 'prompt' : 'prompts'}
          </span>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden xs:block" />
            <select
              value={sortBy}
              onChange={e => onSortChange(e.target.value as SortOption)}
              className="bg-obsidian-900 border border-obsidian-750 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:border-brand-500 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
              <option value="id">Prompt ID</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Slider / Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        <button
          onClick={() => onCategoryChange('all')}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            selectedCategory === 'all'
              ? 'bg-brand-600 text-white shadow-glow-sm border border-brand-500'
              : 'bg-obsidian-900 text-slate-400 hover:text-slate-200 hover:bg-obsidian-850 border border-obsidian-800'
          }`}
        >
          All Prompts
        </button>

        {CATEGORIES.map(cat => {
          const isActive = selectedCategory.toLowerCase() === cat.id.toLowerCase();
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-medium tracking-wide transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-glow-sm border border-brand-500'
                  : 'bg-obsidian-900 text-slate-400 hover:text-slate-200 hover:bg-obsidian-850 border border-obsidian-800'
              }`}
            >
              {cat.name}
            </button>
          );
        })}

        {hasActiveFilters && (
          <button
            onClick={() => {
              onSearchChange('');
              onCategoryChange('all');
            }}
            className="shrink-0 text-xs text-rose-400 hover:text-rose-300 ml-2 px-2 py-1 underline font-medium"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};
