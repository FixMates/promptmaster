import React, { useState, useMemo } from 'react';
import { PromptRecord } from '../../types/prompt';
import {
  Search,
  SlidersHorizontal,
  Edit,
  Copy,
  Trash2,
  Share2,
  ExternalLink,
  CheckCircle,
  XCircle,
  Eye,
  Sparkles,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { useToast } from '../common/Toast';
import { Link } from 'react-router-dom';

interface PromptTableProps {
  prompts: PromptRecord[];
  onEdit: (prompt: PromptRecord) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (prompt: PromptRecord) => void;
  onSelectForSocialPack: (prompt: PromptRecord) => void;
  onBulkPublish: (ids: string[]) => void;
  onBulkUnpublish: (ids: string[]) => void;
  onBulkDelete: (ids: string[]) => void;
}

export const PromptTable: React.FC<PromptTableProps> = ({
  prompts,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleStatus,
  onSelectForSocialPack,
  onBulkPublish,
  onBulkUnpublish,
  onBulkDelete,
}) => {
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [promptPendingDelete, setPromptPendingDelete] = useState<PromptRecord | null>(null);

  const filteredPrompts = useMemo(() => {
    return prompts.filter(p => {
      const matchSearch =
        search.trim() === '' ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.prompt.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        categoryFilter === 'all' || p.category.toLowerCase() === categoryFilter.toLowerCase();

      const matchStatus = statusFilter === 'all' || p.status === statusFilter;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [prompts, search, categoryFilter, statusFilter]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredPrompts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleConfirmDelete = () => {
    if (promptPendingDelete) {
      onDelete(promptPendingDelete.id);
      showToast(`Deleted prompt #${promptPendingDelete.id}. (ID permanently retired)`, 'info');
      setPromptPendingDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search prompts by title, prompt, or #ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Bar (when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3 px-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between gap-3 text-xs">
          <span className="font-mono text-purple-300 font-medium">
            {selectedIds.length} {selectedIds.length === 1 ? 'record' : 'records'} selected
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onBulkPublish(selectedIds)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
            >
              Publish Selected
            </button>
            <button
              onClick={() => onBulkUnpublish(selectedIds)}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors"
            >
              Set Draft
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete ${selectedIds.length} prompt entries? Their IDs will be permanently retired.`)) {
                  onBulkDelete(selectedIds);
                  setSelectedIds([]);
                  showToast(`Deleted ${selectedIds.length} records.`, 'info');
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium transition-colors"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="rounded-2xl border border-obsidian-800 bg-obsidian-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-obsidian-800 bg-obsidian-950/80 text-slate-400 font-mono uppercase text-[11px]">
                <th className="p-3 pl-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredPrompts.length > 0 &&
                      selectedIds.length === filteredPrompts.length
                    }
                    onChange={e => handleSelectAll(e.target.checked)}
                    className="rounded bg-obsidian-900 border-obsidian-700 text-purple-600 focus:ring-0"
                  />
                </th>
                <th className="p-3 w-16">ID</th>
                <th className="p-3 w-16">Thumb</th>
                <th className="p-3">Title & Prompt</th>
                <th className="p-3 w-28">Category</th>
                <th className="p-3 w-24">Status</th>
                <th className="p-3 w-28">Engine</th>
                <th className="p-3 pr-4 text-right w-44">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800">
              {filteredPrompts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No prompt entries found matching filters.
                  </td>
                </tr>
              ) : (
                filteredPrompts.map(p => {
                  const isSelected = selectedIds.includes(p.id);
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-obsidian-850/60 transition-colors ${
                        isSelected ? 'bg-purple-950/20' : ''
                      }`}
                    >
                      <td className="p-3 pl-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOne(p.id)}
                          className="rounded bg-obsidian-900 border-obsidian-700 text-purple-600 focus:ring-0"
                        />
                      </td>

                      {/* Permanent ID */}
                      <td className="p-3 font-mono font-bold text-brand-300">
                        #{p.id}
                      </td>

                      {/* Thumbnail */}
                      <td className="p-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-black shrink-0 border border-obsidian-800">
                          <img
                            src={p.thumbnail || p.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* Title & Preview */}
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-200">
                            {p.title}
                          </span>
                          {p.featured && (
                            <span title="Featured">
                              <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 line-clamp-1 font-mono text-[11px] mt-0.5">
                          {p.prompt}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-obsidian-950 text-slate-300 font-mono text-[11px] border border-obsidian-800">
                          {p.category}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-3">
                        <button
                          onClick={() => onToggleStatus(p)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                            p.status === 'published'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                          title="Click to toggle publish status"
                        >
                          {p.status === 'published' ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-emerald-400" />
                              <span>Live</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-amber-400" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Engine */}
                      <td className="p-3 text-slate-400 font-mono text-[11px] truncate">
                        {p.model || '—'}
                      </td>

                      {/* Action buttons */}
                      <td className="p-3 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectForSocialPack(p)}
                            className="p-1.5 rounded-lg text-purple-400 hover:text-white hover:bg-obsidian-800 transition-colors"
                            title="Generate Social Publishing Pack"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                          <Link
                            to={`/p/${p.id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-800 transition-colors"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => onEdit(p)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-300 hover:bg-obsidian-800 transition-colors"
                            title="Edit Prompt"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onDuplicate(p.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-obsidian-800 transition-colors"
                            title="Duplicate as New Entry"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setPromptPendingDelete(p)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-obsidian-800 transition-colors"
                            title="Delete Prompt (Requires confirmation)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Delete */}
      {promptPendingDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
        >
          <div className="w-full max-w-md rounded-3xl bg-obsidian-900 border border-obsidian-750 p-6 flex flex-col gap-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white">Delete Prompt #{promptPendingDelete.id}?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete <strong>"{promptPendingDelete.title}"</strong>?
            </p>
            <p className="text-[11px] text-amber-400/90 font-mono bg-obsidian-950 p-3 rounded-xl border border-obsidian-800">
              Permanent Identifier #{promptPendingDelete.id} will be permanently retired and will never be reused, ensuring existing external links do not point to mismatched content.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPromptPendingDelete(null)}
                className="px-4 py-2 rounded-xl bg-obsidian-800 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
