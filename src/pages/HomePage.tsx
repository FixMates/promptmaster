import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Search, Copy, Check, Layers, Eye, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SEOHead } from '../components/common/SEOHead';
import { GalleryGrid } from '../components/gallery/GalleryGrid';
import { FeaturedCarousel } from '../components/gallery/FeaturedCarousel';
import { ImageLightbox } from '../components/gallery/ImageLightbox';
import { AdPlacement } from '../components/ads/AdPlacement';
import { getPublishedPrompts } from '../utils/storage';
import { CATEGORIES } from '../data/categories';
import { PromptRecord } from '../types/prompt';
import { useToast } from '../components/common/Toast';
import { recordEvent } from '../utils/analytics';
import { getAssetUrl } from '../config/siteConfig';

export const HomePage: React.FC = () => {
  const [heroSearch, setHeroSearch] = useState('');
  const [lightboxPrompt, setLightboxPrompt] = useState<PromptRecord | null>(null);
  const [copiedHero, setCopiedHero] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const prompts = getPublishedPrompts();
  const featuredPrompts = prompts.filter(p => p.featured);
  const heroPrompt = featuredPrompts[0] || prompts[0];
  const latestPrompts = [...prompts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 8);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      recordEvent('gallery_search', { query: heroSearch });
      navigate(`/explore?search=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  const handleCopyHero = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!heroPrompt) return;

    try {
      await navigator.clipboard.writeText(heroPrompt.prompt);
      setCopiedHero(true);
      showToast('Prompt copied to clipboard!', 'success');
      recordEvent('copy_prompt', { id: heroPrompt.id, title: heroPrompt.title });

      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366F1', '#8B5CF6', '#EC4899', '#10B981'],
        disableForReducedMotion: true,
      });

      setTimeout(() => setCopiedHero(false), 2200);
    } catch {
      showToast('Could not copy prompt', 'error');
    }
  };

  return (
    <>
      <SEOHead
        title="Prompt Master Gallery — Discover the Prompt Behind the Image"
        description="Explore AI-generated art, cinematic portraits, anime, fantasy worlds, and copy the exact image-generation prompts."
        path="/"
      />

      <div className="flex flex-col gap-14 sm:gap-20">
        {/* Hero Section */}
        <section className="relative pt-6 sm:pt-12 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold tracking-wide w-fit">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>Verified AI Image Prompts Directory</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                Discover the <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Prompt Behind</span> the Image.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Explore AI-generated art, cinematic portraits, anime, fantasy worlds, and the exact prompts that bring them to life. Built for creators, designers, and prompt engineers.
              </p>

              {/* Hero Search Field */}
              <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={e => setHeroSearch(e.target.value)}
                  placeholder="Search prompts (e.g., 'haute couture', 'cyberpunk', '#01')..."
                  className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-obsidian-900 border border-obsidian-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm text-white placeholder:text-slate-500 shadow-xl transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs transition-colors shadow-sm"
                >
                  Search
                </button>
              </form>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/explore"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-glow transition-all"
                >
                  <span>Explore Prompts</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/categories/fashion"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-obsidian-900 hover:bg-obsidian-850 text-slate-200 border border-obsidian-750 font-semibold text-sm transition-all"
                >
                  <Layers className="w-4 h-4 text-brand-400" />
                  <span>Browse Categories</span>
                </Link>
              </div>
            </div>

            {/* Right Hero Visual Showcase */}
            {heroPrompt && (
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl p-1 bg-gradient-to-b from-brand-500/30 via-obsidian-800 to-obsidian-900 shadow-2xl">
                  <div className="relative rounded-[22px] overflow-hidden bg-obsidian-950 flex flex-col">
                    {/* Hero Image */}
                    <div className="relative aspect-[4/3] w-full group overflow-hidden">
                      <img
                        src={getAssetUrl(heroPrompt.image)}
                        alt={heroPrompt.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-black/30" />

                      {/* ID Badge */}
                      <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-obsidian-950/90 text-brand-300 border border-brand-500/40 backdrop-blur-md shadow-md">
                        FEATURED #{heroPrompt.id}
                      </span>

                      {/* Quick preview */}
                      <button
                        onClick={() => setLightboxPrompt(heroPrompt)}
                        className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-obsidian-900/90 text-white hover:text-brand-300 border border-white/10 backdrop-blur-md transition-all shadow-lg"
                        title="View Full Resolution"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Hero Prompt Card Details */}
                    <div className="p-5 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <Link to={`/p/${heroPrompt.id}`} className="hover:text-brand-400 transition-colors">
                          <h3 className="font-bold text-slate-100 text-base line-clamp-1">
                            {heroPrompt.title}
                          </h3>
                        </Link>
                        <span className="text-[11px] font-mono text-slate-400 uppercase">
                          {heroPrompt.category}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-obsidian-900/90 border border-obsidian-800 text-xs font-mono text-slate-300 leading-relaxed max-h-20 overflow-y-auto">
                        {heroPrompt.prompt}
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-1">
                        <button
                          onClick={handleCopyHero}
                          className={`flex-grow flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
                            copiedHero
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-brand-600 hover:bg-brand-500 text-white shadow-glow-sm'
                          }`}
                        >
                          {copiedHero ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          <span>{copiedHero ? 'Copied to Clipboard!' : 'Copy Exact Prompt'}</span>
                        </button>

                        <Link
                          to={`/p/${heroPrompt.id}`}
                          className="px-4 py-2.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 text-xs font-medium border border-obsidian-700 transition-colors"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Category Showcase Section */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Curated Categories</h2>
              <p className="text-sm text-slate-400 mt-1">Browse AI prompts filtered by specialized artistic disciplines.</p>
            </div>
            <Link
              to="/explore"
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map(cat => {
              const catPromptsCount = prompts.filter(p => p.category.toLowerCase() === cat.id.toLowerCase()).length;
              return (
                <Link
                  key={cat.id}
                  to={`/categories/${cat.slug}`}
                  className="group relative flex flex-col p-5 rounded-2xl bg-obsidian-900 border border-obsidian-800 hover:border-brand-500/40 hover:bg-obsidian-850 transition-all shadow-sm"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${cat.gradient} blur-2xl opacity-40 group-hover:opacity-75 transition-opacity`} />
                  <span className="font-semibold text-slate-100 text-sm group-hover:text-brand-300 transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-xs text-slate-400 mt-1 font-mono">
                    {catPromptsCount} {catPromptsCount === 1 ? 'prompt' : 'prompts'}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Optional Native Ad Placement on Homepage */}
        <section className="w-full">
          <AdPlacement placementId="home-native" format="native-banner" />
        </section>

        {/* Featured Masterworks Grid */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Featured Masterpieces</h2>
                <p className="text-sm text-slate-400 mt-0.5">Top-voted prompts with verified output fidelity.</p>
              </div>
            </div>
            <Link
              to="/explore?featured=true"
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              <span>See More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <FeaturedCarousel
            prompts={featuredPrompts.length > 0 ? featuredPrompts : latestPrompts}
            onOpenLightbox={setLightboxPrompt}
          />
        </section>

        {/* Latest Gallery Stream */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-400" />
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Latest Additions</h2>
                <p className="text-sm text-slate-400 mt-0.5">Fresh prompts added by our curation team.</p>
              </div>
            </div>
            <Link
              to="/explore?sort=newest"
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              <span>Explore Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <GalleryGrid
            prompts={latestPrompts}
            onOpenLightbox={setLightboxPrompt}
            showInFeedAd={true}
          />
        </section>
      </div>

      {/* Lightbox */}
      <ImageLightbox prompt={lightboxPrompt} onClose={() => setLightboxPrompt(null)} />
    </>
  );
};
