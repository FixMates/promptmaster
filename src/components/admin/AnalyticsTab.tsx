import React, { useState, useEffect } from 'react';
import {
  getAnalyticsSummary,
  clearAnalyticsData,
  AnalyticsSummary,
} from '../../utils/analytics';
import {
  BarChart3,
  MousePointerClick,
  Eye,
  Share2,
  Search,
  Sparkles,
  Layers,
  Trash2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useToast } from '../common/Toast';

export const AnalyticsTab: React.FC = () => {
  const { showToast } = useToast();
  const [summary, setSummary] = useState<AnalyticsSummary>(getAnalyticsSummary());

  useEffect(() => {
    setSummary(getAnalyticsSummary());
  }, []);

  const handleClear = () => {
    if (window.confirm('Clear local telemetry and event logs?')) {
      clearAnalyticsData();
      setSummary(getAnalyticsSummary());
      showToast('Event logs cleared', 'info');
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-obsidian-900 border border-obsidian-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-brand-400" />
            <h2 className="text-xl font-bold text-white">Engagement Telemetry</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Privacy-first client events recorded locally in browser memory. Tracks prompt copies, page views, and search activity without cookies.
          </p>
        </div>

        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-rose-300 border border-rose-500/30 text-xs font-mono transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Logs</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 flex flex-col gap-1">
          <span className="text-[11px] font-mono uppercase text-slate-500">Page Views</span>
          <span className="text-2xl font-extrabold text-white">{summary.pageViews}</span>
        </div>

        <div className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 flex flex-col gap-1">
          <span className="text-[11px] font-mono uppercase text-slate-500">Prompt Copies</span>
          <span className="text-2xl font-extrabold text-emerald-400">{summary.promptCopies}</span>
        </div>

        <div className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 flex flex-col gap-1">
          <span className="text-[11px] font-mono uppercase text-slate-500">Shares</span>
          <span className="text-2xl font-extrabold text-purple-400">{summary.shares}</span>
        </div>

        <div className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 flex flex-col gap-1">
          <span className="text-[11px] font-mono uppercase text-slate-500">Searches</span>
          <span className="text-2xl font-extrabold text-blue-400">{summary.searches}</span>
        </div>

        <div className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 flex flex-col gap-1">
          <span className="text-[11px] font-mono uppercase text-slate-500">Category Views</span>
          <span className="text-2xl font-extrabold text-brand-400">{summary.categoryViews}</span>
        </div>

        <div className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 flex flex-col gap-1">
          <span className="text-[11px] font-mono uppercase text-slate-500">Ad Impressions</span>
          <span className="text-2xl font-extrabold text-amber-400">{summary.adImpressions}</span>
        </div>
      </div>

      {/* Transparent Revenue Disclaimer */}
      <div className="p-4 rounded-2xl bg-obsidian-950 border border-amber-500/30 flex items-start gap-3 text-xs">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <span className="font-semibold text-slate-200">Zero Simulated Revenue Disclaimer:</span>
          <p className="text-[11px] text-slate-400">
            In compliance with our integrity standards, this application never fabricates fake CPM or revenue figures. Actual advertising income must be verified exclusively through your official <a href="https://publishers.adsterra.com" target="_blank" rel="noreferrer" className="text-amber-400 underline">Adsterra Publisher Portal</a>.
          </p>
        </div>
      </div>

      {/* Recent Event Stream */}
      <div className="p-6 rounded-3xl bg-obsidian-900 border border-obsidian-800 flex flex-col gap-4">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
          Realtime Interaction Log (Last 30 Events)
        </h3>

        {summary.recentEvents.length === 0 ? (
          <div className="py-8 text-center text-slate-500 font-mono text-xs">
            No telemetry events recorded in current browser session yet.
          </div>
        ) : (
          <div className="divide-y divide-obsidian-800 max-h-72 overflow-y-auto pr-1">
            {summary.recentEvents.map(event => (
              <div key={event.id} className="py-2.5 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-obsidian-950 border border-obsidian-800 text-brand-300">
                    {event.type}
                  </span>
                  <span className="text-slate-300 truncate max-w-md">
                    {event.details ? JSON.stringify(event.details) : '—'}
                  </span>
                </div>
                <span className="text-slate-500 text-[11px]">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
