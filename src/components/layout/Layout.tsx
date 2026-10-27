import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { AdPlacement } from '../ads/AdPlacement';
import { getStoredAdsConfig } from '../../config/adsConfig';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const adsConfig = getStoredAdsConfig();
  const socialBarPlacement = adsConfig.placements['social-bar'];

  return (
    <div className="min-h-screen flex flex-col bg-obsidian-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Optional Adsterra Social Bar if enabled */}
      {adsConfig.globalEnabled && socialBarPlacement && socialBarPlacement.enabled && (
        <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-auto bg-obsidian-950/90 backdrop-blur-md border-t border-obsidian-800 p-2 shadow-2xl">
          <AdPlacement placementId="social-bar" format="social-bar" />
        </div>
      )}

      <Footer />
    </div>
  );
};
