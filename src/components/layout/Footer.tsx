import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Heart, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { CATEGORIES } from '../../data/categories';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-obsidian-800 bg-obsidian-950 mt-20 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 p-0.5">
                <div className="w-full h-full bg-obsidian-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-brand-400" />
                </div>
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                {siteConfig.name}
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              "{siteConfig.tagline}" Discover premier curated AI art prompts for Midjourney, Flux, Stable Diffusion, and DALL-E. Copy exact prompts with one click.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-2">
              <Shield className="w-3.5 h-3.5 text-brand-400" />
              <span>Independent AI Art Directory • Free Access</span>
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4 font-mono">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              {CATEGORIES.slice(0, 6).map(c => (
                <li key={c.id}>
                  <Link
                    to={`/categories/${c.slug}`}
                    className="hover:text-brand-300 transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Col */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4 font-mono">
              Directory
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/explore" className="hover:text-brand-300 transition-colors">
                  Explore All Prompts
                </Link>
              </li>
              <li>
                <Link to="/explore?sort=newest" className="hover:text-brand-300 transition-colors">
                  Latest Additions
                </Link>
              </li>
              <li>
                <Link to="/explore?featured=true" className="hover:text-brand-300 transition-colors">
                  Featured Masterworks
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-purple-300 transition-colors flex items-center gap-1">
                  <span>Publishing Dashboard</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Col */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4 font-mono">
              Legal & Trust
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-brand-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-300 transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-brand-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-brand-300 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/copyright" className="hover:text-brand-300 transition-colors">
                  Copyright & DMCA
                </Link>
              </li>
              <li>
                <Link to="/advertising" className="hover:text-brand-300 transition-colors">
                  Advertising Disclosure
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Disclaimer */}
        <div className="pt-8 mt-10 border-t border-obsidian-850 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All AI images and prompts are curated for educational and generative art inspiration.
          </p>

          <p className="flex items-center gap-1">
            <span>Built for AI Creators</span>
            <span>•</span>
            <span className="text-slate-400">Adsterra Monetization Engine v1.0</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
