import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, Compass } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEOHead title="Page Not Found (404) — Prompt Master" path="/404" />
      <div className="py-24 px-4 text-center flex flex-col items-center justify-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center mb-6 shadow-glow">
          <Sparkles className="w-8 h-8 text-brand-400" />
        </div>

        <span className="text-xs font-mono font-semibold tracking-wider text-brand-400 uppercase mb-2">
          Error 404
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
          Lost in Latent Space
        </h1>

        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          The page or prompt you are looking for does not exist or may have been relocated.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-obsidian-900 hover:bg-obsidian-850 text-slate-200 border border-obsidian-750 text-xs font-semibold transition-all"
          >
            <Home className="w-4 h-4 text-brand-400" />
            <span>Return Home</span>
          </Link>

          <Link
            to="/explore"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all shadow-glow-sm"
          >
            <Compass className="w-4 h-4" />
            <span>Explore All Prompts</span>
          </Link>
        </div>
      </div>
    </>
  );
};
