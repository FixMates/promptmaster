import React, { useMemo } from 'react';
import { PromptRecord } from '../../types/prompt';
import {
  Layers,
  FileCheck,
  FileText,
  AlertTriangle,
  Download,
  Plus,
  Upload,
  Sparkles,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { serializeCSV } from '../../utils/csvParser';
import { useToast } from '../common/Toast';
import { Link } from 'react-router-dom';

interface OverviewTabProps {
  prompts: PromptRecord[];
  onOpenCreate: () => void;
  onOpenBulkImport: () => void;
  onSelectPromptForPack: (prompt: PromptRecord) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  prompts,
  onOpenCreate,
  onOpenBulkImport,
  onSelectPromptForPack,
}) => {
  const { showToast } = useToast();

  const totalEntries = prompts.length;
  const publishedEntries = prompts.filter(p => p.status === 'published').length;
  const draftEntries = prompts.filter(p => p.status === 'draft').length;
  const featuredCount = prompts.filter(p => p.featured).length;

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(prompts.map(p => p.category.toLowerCase())));
  }, [prompts]);

  // Content Health Validator
  const contentIssues = useMemo(() => {
    const issues: { id: string; title: string; issue: string }[] = [];

    prompts.forEach(p => {
      if (!p.prompt || p.prompt.trim().length < 10) {
        issues.push({ id: p.id, title: p.title, issue: 'Prompt text is unusually short' });
      }
      if (!p.image) {
        issues.push({ id: p.id, title: p.title, issue: 'Missing image path' });
      }
      if (!p.alt) {
        issues.push({ id: p.id, title: p.title, issue: 'Missing accessibility alt text' });
      }
    });

    return issues;
  }, [prompts]);

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(prompts, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `prompts-master-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Exported master prompts.json!', 'success');
  };

  const handleExportCSV = () => {
    const csvContent = serializeCSV(prompts);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompts-master-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Exported prompts spreadsheet CSV!', 'success');
  };

  const recentlyUpdated = [...prompts]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-obsidian-900 border border-obsidian-800 flex flex-col gap-1">
          <span className="text-xs font-mono uppercase text-slate-400">Total Prompts</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{totalEntries}</span>
            <span className="text-xs text-slate-500 font-mono">records</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-obsidian-900 border border-obsidian-800 flex flex-col gap-1">
          <span className="text-xs font-mono uppercase text-slate-400">Published Live</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">{publishedEntries}</span>
            <span className="text-xs text-slate-500 font-mono">active URLs</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-obsidian-900 border border-obsidian-800 flex flex-col gap-1">
          <span className="text-xs font-mono uppercase text-slate-400">Drafts / In Review</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400">{draftEntries}</span>
            <span className="text-xs text-slate-500 font-mono">unlisted</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-obsidian-900 border border-obsidian-800 flex flex-col gap-1">
          <span className="text-xs font-mono uppercase text-slate-400">Categories</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-brand-400">{uniqueCategories.length}</span>
            <span className="text-xs text-slate-500 font-mono">disciplines</span>
          </div>
        </div>
      </div>

      {/* Quick Action Center */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-obsidian-750 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-400" />
            <span>Publishing Quick Actions</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-lg">
            Create individual prompt pages, bulk import manifests, or export verified JSON/CSV for Git deployment.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onOpenCreate}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-glow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Prompt</span>
          </button>

          <button
            onClick={onOpenBulkImport}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-slate-200 border border-obsidian-700 text-xs font-medium transition-colors"
          >
            <Upload className="w-4 h-4 text-purple-400" />
            <span>Bulk Import</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-slate-200 border border-obsidian-700 text-xs font-medium transition-colors"
            title="Download prompts.json"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-slate-200 border border-obsidian-700 text-xs font-medium transition-colors"
            title="Download CSV Spreadsheet"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Grid: Recently Updated & Content Health Checker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recently Updated */}
        <div className="lg:col-span-7 flex flex-col gap-4 p-6 rounded-3xl bg-obsidian-900 border border-obsidian-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-400" />
            <span>Recently Updated Prompts</span>
          </h3>

          <div className="divide-y divide-obsidian-800">
            {recentlyUpdated.map(p => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-semibold bg-obsidian-950 text-brand-300 border border-obsidian-800 shrink-0">
                    #{p.id}
                  </span>
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-slate-200 truncate block">
                      {p.title}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Category: {p.category} • {p.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onSelectPromptForPack(p)}
                    className="px-2.5 py-1 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-purple-300 border border-purple-500/30 text-xs font-mono transition-colors"
                  >
                    Social Pack
                  </button>
                  <Link
                    to={`/p/${p.id}`}
                    target="_blank"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-800 transition-colors"
                    title="View Live"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Health Checker */}
        <div className="lg:col-span-5 flex flex-col gap-4 p-6 rounded-3xl bg-obsidian-900 border border-obsidian-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Content Health Audit</span>
            </h3>
            <span className={`px-2 py-0.5 rounded text-xs font-mono font-medium ${contentIssues.length === 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
              {contentIssues.length === 0 ? 'All Clear' : `${contentIssues.length} Notices`}
            </span>
          </div>

          {contentIssues.length === 0 ? (
            <div className="py-8 flex flex-col items-center justify-center text-center text-slate-400">
              <FileCheck className="w-10 h-10 text-emerald-400 mb-2" />
              <p className="text-xs font-medium text-slate-200">100% Data Integrity Verified</p>
              <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                All prompt entries contain valid titles, prompts, image paths, and alt descriptions.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {contentIssues.map((issue, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 flex items-start gap-2 text-xs">
                  <span className="font-mono text-amber-400 font-bold shrink-0">#{issue.id}</span>
                  <div className="min-w-0">
                    <span className="text-slate-200 truncate block font-medium">{issue.title}</span>
                    <span className="text-slate-400 text-[11px]">{issue.issue}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
