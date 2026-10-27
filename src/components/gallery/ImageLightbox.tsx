import React, { useEffect } from 'react';
import { X, Download, Copy, ExternalLink, Sparkles } from 'lucide-react';
import { PromptRecord } from '../../types/prompt';
import { useToast } from '../common/Toast';
import { Link } from 'react-router-dom';

interface ImageLightboxProps {
  prompt: PromptRecord | null;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ prompt, onClose }) => {
  const { showToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (prompt) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [prompt, onClose]);

  if (!prompt) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      showToast('Prompt copied!', 'success');
    } catch {
      showToast('Could not copy prompt', 'error');
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image preview lightbox"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[92vh] flex flex-col rounded-3xl bg-obsidian-900 border border-obsidian-750 overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-obsidian-800 bg-obsidian-950/70">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/40">
              #{prompt.id}
            </span>
            <h2 className="text-sm sm:text-base font-semibold text-slate-100 truncate max-w-sm sm:max-w-md">
              {prompt.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/p/${prompt.id}`}
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-obsidian-800 transition-colors"
              title="Open Detail Page"
            >
              <ExternalLink className="w-5 h-5" />
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-obsidian-800 transition-colors"
              title="Close (Esc)"
              aria-label="Close image viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Display */}
        <div className="relative flex-grow flex items-center justify-center bg-obsidian-950 p-2 sm:p-6 overflow-hidden min-h-[300px]">
          <img
            src={prompt.image}
            alt={prompt.alt || prompt.title}
            className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
          />
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-4 px-6 border-t border-obsidian-800 bg-obsidian-950/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>Category: {prompt.category.toUpperCase()}</span>
            {prompt.model && <span>• Engine: {prompt.model}</span>}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-glow-sm"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Prompt</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-obsidian-800 hover:bg-obsidian-700 text-slate-200 border border-obsidian-700 transition-colors"
              title="Download image"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
