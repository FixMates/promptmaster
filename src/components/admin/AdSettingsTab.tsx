import React, { useState } from 'react';
import { AdsterraConfig } from '../../types/ads';
import { getStoredAdsConfig, saveStoredAdsConfig, DEFAULT_ADS_CONFIG } from '../../config/adsConfig';
import {
  Sparkles,
  ShieldAlert,
  Save,
  RotateCcw,
  ExternalLink,
  Layers,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useToast } from '../common/Toast';

export const AdSettingsTab: React.FC = () => {
  const { showToast } = useToast();
  const [config, setConfig] = useState<AdsterraConfig>(getStoredAdsConfig());
  const [popunderConfirm, setPopunderConfirm] = useState(false);

  const handleToggleGlobal = (enabled: boolean) => {
    setConfig(prev => ({ ...prev, globalEnabled: enabled }));
  };

  const handleToggleTestMode = (testMode: boolean) => {
    setConfig(prev => ({ ...prev, testMode }));
  };

  const handleTogglePlacement = (placementId: string, enabled: boolean) => {
    setConfig(prev => ({
      ...prev,
      placements: {
        ...prev.placements,
        [placementId]: {
          ...prev.placements[placementId],
          enabled,
        },
      },
    }));
  };

  const handleUpdatePlacementField = (
    placementId: string,
    field: 'scriptUrl' | 'adKey' | 'label',
    value: string
  ) => {
    setConfig(prev => ({
      ...prev,
      placements: {
        ...prev.placements,
        [placementId]: {
          ...prev.placements[placementId],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = () => {
    saveStoredAdsConfig(config);
    showToast('Adsterra placement configuration saved!', 'success');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all advertising placements to factory safe defaults?')) {
      setConfig(DEFAULT_ADS_CONFIG);
      saveStoredAdsConfig(DEFAULT_ADS_CONFIG);
      showToast('Reset to default advertising configuration', 'info');
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Top Controls Card */}
      <div className="p-6 rounded-3xl bg-obsidian-900 border border-obsidian-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Adsterra Monetization Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">v1.0</span>
          </div>
          <h2 className="text-xl font-bold text-white">Advertising Placements & Control</h2>
          <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
            Configure real Adsterra script keys, toggle in-feed native slots, and manage display units without modifying source code.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-slate-300 text-xs font-medium border border-obsidian-750 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleSave}
            className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-glow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {/* Global Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Master Killswitch */}
        <div className="p-5 rounded-2xl bg-obsidian-950 border border-obsidian-800 flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-white block">Global Advertising Switch</span>
            <span className="text-xs text-slate-400 block mt-0.5">
              Instantly enable or suspend all ad slots across the entire site.
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer ml-4">
            <input
              type="checkbox"
              checked={config.globalEnabled}
              onChange={e => handleToggleGlobal(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-obsidian-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {/* Test Mode Simulator */}
        <div className="p-5 rounded-2xl bg-obsidian-950 border border-obsidian-800 flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-white block">Placeholder / Test Mode</span>
            <span className="text-xs text-slate-400 block mt-0.5">
              Shows reserved dimensions without firing external network scripts.
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer ml-4">
            <input
              type="checkbox"
              checked={config.testMode}
              onChange={e => handleToggleTestMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-obsidian-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
          </label>
        </div>
      </div>

      {/* Individual Placements Config */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-400" />
          <span>Configured Adsterra Ad Slots</span>
        </h3>

        <div className="space-y-4">
          {Object.entries(config.placements).map(([key, placement]) => (
            <div
              key={key}
              className="p-5 rounded-2xl bg-obsidian-900 border border-obsidian-800 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-obsidian-800">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg bg-obsidian-950 border border-obsidian-800 font-mono text-xs font-bold text-brand-300">
                    {key}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">{placement.label || key}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Format: {placement.format} • Pages: {placement.pageLocations.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono">
                    {placement.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={placement.enabled}
                      onChange={e => handleTogglePlacement(key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-obsidian-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>

              {/* Slot Settings Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                    Adsterra Script URL
                  </label>
                  <input
                    type="text"
                    value={placement.scriptUrl || ''}
                    onChange={e => handleUpdatePlacementField(key, 'scriptUrl', e.target.value)}
                    placeholder="https://pl...adsterra.../invoke.js"
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-obsidian-750 text-xs text-slate-200 font-mono focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                    Slot Key / Container ID
                  </label>
                  <input
                    type="text"
                    value={placement.adKey || ''}
                    onChange={e => handleUpdatePlacementField(key, 'adKey', e.target.value)}
                    placeholder="e.g. 7a3c89..."
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-obsidian-750 text-xs text-slate-200 font-mono focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popunder Safety Guard */}
      <div className="p-6 rounded-3xl bg-obsidian-950 border border-rose-500/30 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-bold text-white">Adsterra Popunder (Guarded)</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                Popunders open in background browser tabs upon first visitor interaction. While profitable, aggressive popunders may degrade user retention from Instagram visitors.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={config.popunderEnabled}
              onChange={e => {
                if (e.target.checked) {
                  if (window.confirm('Enable Adsterra Popunder? Ensure your publisher codes comply with your regional user experience standards.')) {
                    setConfig(prev => ({ ...prev, popunderEnabled: true }));
                  }
                } else {
                  setConfig(prev => ({ ...prev, popunderEnabled: false }));
                }
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-obsidian-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
          </label>
        </div>

        {config.popunderEnabled && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 font-mono">
            Popunder is currently ENABLED. Enter your approved Adsterra script tag in the root index.html or dynamic script injection handler.
          </div>
        )}
      </div>

      {/* Official Setup Guide Note */}
      <div className="p-5 rounded-2xl bg-obsidian-900 border border-obsidian-800 text-xs text-slate-400 flex items-start gap-3">
        <Info className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <span className="font-semibold text-slate-200">Where to get official Adsterra codes:</span>
          <p className="text-[11px] text-slate-400">
            1. Log in to your <a href="https://publishers.adsterra.com" target="_blank" rel="noreferrer" className="text-brand-400 underline">Adsterra Publisher Dashboard</a>.<br />
            2. Add your website domain (e.g. <code>promptmastergallery.pages.dev</code>).<br />
            3. Generate <strong>Native Banner</strong>, <strong>Social Bar</strong>, and <strong>728x90 Banner</strong> units.<br />
            4. Paste the respective script URL and container keys into this panel, then switch <em>Placeholder Mode</em> to OFF.
          </p>
        </div>
      </div>
    </div>
  );
};
