import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, Share2, Sparkles, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PromptRecord } from '../../types/prompt';
import { useToast } from '../common/Toast';
import { recordEvent } from '../../utils/analytics';
import { getShareUrl } from '../../config/siteConfig';

interface PromptCardProps {
  prompt: PromptRecord;
  onOpenLightbox?: (prompt: PromptRecord) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, onOpenLightbox }) => {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { showToast } = useToast();

  const handleCopyPrompt = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      showToast('Prompt copied to clipboard!', 'success');
      recordEvent('copy_prompt', { id: prompt.id, title: prompt.title });

      // Celebration confetti
      confetti({
        particleCount: 28,
        spread: 45,
        origin: { y: 0.8 },
        colors: ['#6366F1', '#8B5CF6', '#EC4899', '#10B981'],
        disableForReducedMotion: true,
      });

      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = prompt.prompt;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      setCopied(true);
      showToast('Prompt copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = getShareUrl(`/p/${prompt.id}`);

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${prompt.title} | Prompt Master`,
          text: `Check out this AI image prompt: "${prompt.title}"`,
          url: shareUrl,
        });
        recordEvent('share', { id: prompt.id });
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to copy URL
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Link copied to clipboard!', 'info');
      recordEvent('share', { id: prompt.id });
    } catch (err) {
      showToast('Could not copy link', 'error');
    }
  };

  return (
    <div
      className="group relative flex flex-col rounded-2xl bg-obsidian-900/80 border border-obsidian-750 hover:border-brand-500/50 hover:shadow-card-hover transition-all duration-300 overflow-hidden"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full bg-obsidian-950 overflow-hidden">
        <Link to={`/p/${prompt.id}`} className="block w-full h-full">
          {imageError ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-obsidian-900 text-slate-500 text-center">
              <Sparkles className="w-8 h-8 text-brand-400/40 mb-2" />
              <span className="text-xs font-mono">{prompt.title}</span>
            </div>
          ) : (
            <img
              src={prompt.thumbnail || prompt.image}
              alt={prompt.alt || prompt.title}
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          )}
        </Link>

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/90 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Unique Permanent Prompt ID Badge */}
          <span className="pointer-events-auto px-2.5 py-1 rounded-full text-xs font-mono font-semibold tracking-wider bg-obsidian-950/90 backdrop-blur-md text-brand-300 border border-brand-500/40 shadow-sm">
            #{prompt.id}
          </span>

          {/* Category Pill */}
          <span className="pointer-events-auto px-2.5 py-1 rounded-full text-xs font-medium tracking-wide uppercase bg-black/60 backdrop-blur-md text-slate-300 border border-white/10">
            {prompt.category}
          </span>
        </div>

        {/* Quick View Button on Hover */}
        {onOpenLightbox && (
          <button
            onClick={() => onOpenLightbox(prompt)}
            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-xl bg-obsidian-900/90 backdrop-blur-md text-white hover:text-brand-300 border border-white/10 hover:border-brand-500/50 shadow-lg"
            title="Expand Preview"
            aria-label="Expand preview"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content info */}
      <div className="flex flex-col flex-grow p-4">
        <Link to={`/p/${prompt.id}`} className="group-hover:text-brand-400 transition-colors">
          <h3 className="font-semibold text-slate-100 text-base leading-snug line-clamp-1 mb-1.5">
            {prompt.title}
          </h3>
        </Link>

        <p className="text-xs text-slate-400 font-mono line-clamp-2 mb-3 flex-grow leading-relaxed">
          {prompt.prompt}
        </p>

        {/* Footer actions */}
        <div className="pt-2 border-t border-obsidian-800 flex items-center justify-between gap-2">
          <button
            onClick={handleCopyPrompt}
            className={`flex-grow flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-brand-600/90 hover:bg-brand-500 text-white shadow-sm hover:shadow-glow-sm'
            }`}
            aria-label="Copy exact generation prompt"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Prompt</span>
              </>
            )}
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-slate-300 hover:text-white border border-obsidian-700 transition-colors"
            title="Share Prompt Link"
            aria-label="Share prompt link"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
