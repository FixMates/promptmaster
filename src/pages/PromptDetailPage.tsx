import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Copy,
  Check,
  Share2,
  Download,
  Eye,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Shield,
  Layers,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import { TwitterXIcon, FacebookIcon } from '../components/common/SocialIcons';
import confetti from 'canvas-confetti';
import { SEOHead } from '../components/common/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { AdPlacement } from '../components/ads/AdPlacement';
import { ImageLightbox } from '../components/gallery/ImageLightbox';
import { PromptCard } from '../components/gallery/PromptCard';
import { getPromptById, getPublishedPrompts } from '../utils/storage';
import { PromptRecord } from '../types/prompt';
import { useToast } from '../components/common/Toast';
import { recordEvent } from '../utils/analytics';
import { getPromptUrl, siteConfig } from '../config/siteConfig';

export const PromptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [copied, setCopied] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const prompt = getPromptById(id || '');
  const allPublished = getPublishedPrompts();

  useEffect(() => {
    if (prompt) {
      recordEvent('pageview', { id: prompt.id, title: prompt.title });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id, prompt]);

  if (!prompt) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center max-w-md mx-auto px-4">
        <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-4">
          Error 404
        </span>
        <h1 className="text-3xl font-extrabold text-white mb-3">Prompt Not Found</h1>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          The requested prompt #{id} could not be found. It may have been unpublished or the link may be incorrect.
        </p>
        <Link
          to="/explore"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm transition-all shadow-glow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Gallery</span>
        </Link>
      </div>
    );
  }

  // Find Previous and Next Prompts
  const currentIndex = allPublished.findIndex(p => p.id === prompt.id);
  const prevPrompt = currentIndex > 0 ? allPublished[currentIndex - 1] : null;
  const nextPrompt = currentIndex < allPublished.length - 1 ? allPublished[currentIndex + 1] : null;

  // Find 3 to 4 Related Prompts by Category or Tag
  const relatedPrompts = allPublished
    .filter(p => p.id !== prompt.id)
    .sort((a, b) => {
      // Prioritize same category
      if (a.category === prompt.category && b.category !== prompt.category) return -1;
      if (b.category === prompt.category && a.category !== prompt.category) return 1;
      return 0;
    })
    .slice(0, 4);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      showToast('Prompt copied to clipboard!', 'success');
      recordEvent('copy_prompt', { id: prompt.id, title: prompt.title });

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366F1', '#8B5CF6', '#EC4899', '#10B981'],
        disableForReducedMotion: true,
      });

      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = prompt.prompt;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      setCopied(true);
      showToast('Prompt copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = prompt.image;
    a.download = `prompt-master-${prompt.id}-${prompt.slug}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Download started', 'info');
  };

  const currentUrl = getPromptUrl(prompt.id);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${prompt.title} Prompt #${prompt.id} | ${siteConfig.name}`,
          text: `Check out the AI generation prompt for "${prompt.title}":`,
          url: currentUrl,
        });
        recordEvent('share', { id: prompt.id });
        return;
      } catch {
        // Fallback to share modal
      }
    }
    setShareModalOpen(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      showToast('Share link copied to clipboard!', 'success');
      setShareModalOpen(false);
      recordEvent('share', { id: prompt.id, type: 'copy_link' });
    } catch {
      showToast('Could not copy link', 'error');
    }
  };

  return (
    <>
      <SEOHead
        title={`${prompt.title} Prompt #${prompt.id}`}
        description={`Explore the AI-generated ${prompt.category} artwork titled "${prompt.title}" and copy its complete generation prompt.`}
        path={`/p/${prompt.id}/`}
        image={prompt.image}
        type="article"
      />

      <div className="flex flex-col gap-6 max-w-6xl mx-auto">
        {/* Top Breadcrumb & Navigation Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-obsidian-800 pb-2">
          <Breadcrumbs
            items={[
              { label: 'Explore', path: '/explore' },
              { label: prompt.category.toUpperCase(), path: `/categories/${prompt.category}` },
              { label: `#${prompt.id} - ${prompt.title}` },
            ]}
          />

          {/* Previous / Next Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {prevPrompt ? (
              <Link
                to={`/p/${prevPrompt.id}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-obsidian-900 border border-obsidian-750 text-slate-300 hover:text-white text-xs transition-colors"
                title={`Previous: #${prevPrompt.id} ${prevPrompt.title}`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>#{prevPrompt.id}</span>
              </Link>
            ) : (
              <span className="px-3 py-1.5 rounded-xl bg-obsidian-950 text-slate-600 text-xs border border-obsidian-850 cursor-not-allowed">
                First
              </span>
            )}

            {nextPrompt ? (
              <Link
                to={`/p/${nextPrompt.id}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-obsidian-900 border border-obsidian-750 text-slate-300 hover:text-white text-xs transition-colors"
                title={`Next: #${nextPrompt.id} ${nextPrompt.title}`}
              >
                <span>#{nextPrompt.id}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <span className="px-3 py-1.5 rounded-xl bg-obsidian-950 text-slate-600 text-xs border border-obsidian-850 cursor-not-allowed">
                Latest
              </span>
            )}
          </div>
        </div>

        {/* Main Content Grid: Image + Prompt Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Responsive Large Image */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative rounded-3xl bg-obsidian-900 border border-obsidian-800 p-2 overflow-hidden shadow-2xl group">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-obsidian-950">
                <img
                  src={prompt.image}
                  alt={prompt.alt || prompt.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out cursor-pointer"
                  onClick={() => setLightboxOpen(true)}
                />

                {/* ID and Category Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider bg-obsidian-950/95 text-brand-300 border border-brand-500/40 backdrop-blur-md shadow-lg">
                    PROMPT #{prompt.id}
                  </span>
                  <Link
                    to={`/categories/${prompt.category}`}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-black/60 text-slate-200 border border-white/10 backdrop-blur-md hover:bg-black/80 transition-colors"
                  >
                    {prompt.category}
                  </Link>
                </div>

                {/* Lightbox Trigger */}
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-obsidian-900/90 text-white hover:text-brand-300 border border-white/10 backdrop-blur-md transition-all shadow-lg"
                  title="Expand to Fullscreen"
                  aria-label="Expand image"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Image Sub-actions */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-2 font-mono">
              <span>Aspect Ratio: {prompt.aspectRatio || '4:3'}</span>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-obsidian-850"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Image</span>
              </button>
            </div>
          </div>

          {/* Right Column: Prompt Details & Copy Section */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Title & Metadata */}
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                {prompt.title}
              </h1>

              {/* Attribution pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400 font-mono">
                {prompt.model && (
                  <span className="px-2.5 py-1 rounded-lg bg-obsidian-900 border border-obsidian-800">
                    Engine: <strong className="text-slate-200">{prompt.model}</strong>
                  </span>
                )}
                {prompt.creator && (
                  <span className="px-2.5 py-1 rounded-lg bg-obsidian-900 border border-obsidian-800">
                    Curator: <strong className="text-slate-200">{prompt.creator}</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Complete Prompt Code Box */}
            <div className="flex flex-col rounded-2xl bg-obsidian-900 border border-obsidian-750 overflow-hidden shadow-card">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-obsidian-800 bg-obsidian-950/70">
                <span className="text-xs font-mono font-medium text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                  Exact Generation Prompt
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {prompt.prompt.length} chars
                </span>
              </div>

              <div className="p-4 sm:p-5 text-sm font-mono text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-brand-500 selection:text-white bg-obsidian-900/60 max-h-72 overflow-y-auto">
                {prompt.prompt}
              </div>

              {/* Primary Copy Action Bar */}
              <div className="p-3 border-t border-obsidian-800 bg-obsidian-950/90 flex items-center gap-2.5">
                <button
                  onClick={handleCopyPrompt}
                  className={`flex-grow flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md ${
                    copied
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-emerald-950/40'
                      : 'bg-brand-600 hover:bg-brand-500 text-white shadow-glow'
                  }`}
                  aria-label="Copy Prompt"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Prompt Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleNativeShare}
                  className="p-3 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 hover:text-white border border-obsidian-700 transition-colors"
                  title="Share Prompt"
                  aria-label="Share prompt"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tags */}
            {prompt.tags && prompt.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-500 font-mono mr-1">Tags:</span>
                {prompt.tags.map(tag => (
                  <Link
                    key={tag}
                    to={`/explore?search=${encodeURIComponent(tag)}`}
                    className="px-2.5 py-1 rounded-lg text-xs bg-obsidian-900 hover:bg-obsidian-800 border border-obsidian-800 text-slate-400 hover:text-brand-300 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Trust and License Note */}
            <div className="p-3.5 rounded-xl bg-obsidian-900/60 border border-obsidian-800 text-xs text-slate-400 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span>{prompt.license || 'Free for personal and commercial AI image generations.'}</span>
                <span className="block text-[11px] text-slate-500 mt-1">
                  Permanent link: <code className="text-brand-400/80 font-mono">{currentUrl}</code>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Adsterra Advertisement Placement: Bottom of Prompt Section */}
        <section className="w-full my-4">
          <AdPlacement placementId="prompt-detail-bottom" format="display-728x90" />
        </section>

        {/* Related Prompts Section */}
        {relatedPrompts.length > 0 && (
          <section className="flex flex-col gap-5 pt-8 border-t border-obsidian-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Related Prompts</h2>
                <p className="text-xs text-slate-400 mt-0.5">Explore more {prompt.category} inspirations.</p>
              </div>
              <Link
                to={`/categories/${prompt.category}`}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                <span>View Category</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedPrompts.map(p => (
                <PromptCard key={p.id} prompt={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Share Modal Dialog */}
      {shareModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShareModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-obsidian-900 border border-obsidian-750 p-6 flex flex-col gap-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white">Share Prompt #{prompt.id}</h3>
            <p className="text-xs text-slate-400">
              Share the exact generation prompt for "{prompt.title}" across your favorite platforms.
            </p>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-obsidian-950 border border-obsidian-800">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-grow bg-transparent text-xs text-slate-200 font-mono px-2 focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium transition-colors"
              >
                Copy Link
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this AI prompt for "${prompt.title}":`)}&url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 hover:text-white text-xs font-medium transition-colors"
              >
                <TwitterXIcon className="w-4 h-4 text-white" />
                <span>X / Twitter</span>
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 hover:text-white text-xs font-medium transition-colors"
              >
                <FacebookIcon className="w-4 h-4 text-blue-500" />
                <span>Facebook</span>
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`AI Prompt for ${prompt.title}: ${currentUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 hover:text-white text-xs font-medium transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp</span>
              </a>
            </div>

            <button
              onClick={() => setShareModalOpen(false)}
              className="mt-2 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <ImageLightbox prompt={lightboxOpen ? prompt : null} onClose={() => setLightboxOpen(false)} />
    </>
  );
};
