import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Sparkles, Compass, Layers, Flame } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Categories', path: '/categories/fashion', icon: Layers },
    { name: 'Latest', path: '/explore?sort=newest', icon: Sparkles },
    { name: 'Popular', path: '/explore?featured=true', icon: Flame },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-obsidian-800 bg-obsidian-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 p-0.5 shadow-glow-sm group-hover:shadow-glow transition-all">
            <div className="w-full h-full bg-obsidian-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-brand-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent">
              {siteConfig.shortName}
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-brand-400 font-semibold -mt-1">
              Gallery
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  active
                    ? 'text-brand-300 bg-brand-500/10 border border-brand-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-obsidian-850'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Action Items */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Button */}
          <Link
            to="/explore"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-900 border border-obsidian-750 text-slate-400 hover:text-slate-200 hover:border-obsidian-600 transition-all text-xs"
            title="Search prompts"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search...</span>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-obsidian-900 text-slate-400 hover:text-white border border-obsidian-800"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-obsidian-800 bg-obsidian-950/95 backdrop-blur-2xl px-4 pt-2 pb-6 space-y-2 animate-slide-up">
          {navLinks.map(link => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-obsidian-900 transition-colors"
              >
                <Icon className="w-4 h-4 text-brand-400" />
                <span>{link.name}</span>
              </Link>
            );
          })}

        </div>
      )}
    </header>
  );
};
