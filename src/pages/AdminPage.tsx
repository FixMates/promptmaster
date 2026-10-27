import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { AdminGuard } from '../components/admin/AdminGuard';
import { OverviewTab } from '../components/admin/OverviewTab';
import { PromptTable } from '../components/admin/PromptTable';
import { PromptEditorModal } from '../components/admin/PromptEditorModal';
import { BulkImportModal } from '../components/admin/BulkImportModal';
import { SocialPackModal } from '../components/admin/SocialPackModal';
import { AdSettingsTab } from '../components/admin/AdSettingsTab';
import { AnalyticsTab } from '../components/admin/AnalyticsTab';
import {
  getAllPrompts,
  savePrompt,
  deletePrompt,
  duplicatePrompt,
  bulkSavePrompts,
} from '../utils/storage';
import { PromptRecord } from '../types/prompt';
import { useToast } from '../components/common/Toast';
import {
  LayoutDashboard,
  FileText,
  DollarSign,
  BarChart3,
  Plus,
  Upload,
} from 'lucide-react';

type AdminTab = 'overview' | 'prompts' | 'ads' | 'analytics';

export const AdminPage: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [prompts, setPrompts] = useState<PromptRecord[]>(getAllPrompts());

  // Modal States
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<PromptRecord | null>(null);

  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [socialPackPrompt, setSocialPackPrompt] = useState<PromptRecord | null>(null);

  const refreshPrompts = () => {
    setPrompts(getAllPrompts());
  };

  const handleOpenCreate = () => {
    setEditingPrompt(null);
    setEditorOpen(true);
  };

  const handleOpenEdit = (prompt: PromptRecord) => {
    setEditingPrompt(prompt);
    setEditorOpen(true);
  };

  const handleSavePrompt = (record: PromptRecord) => {
    const result = savePrompt(record);
    if (result.success) refreshPrompts();
    else showToast(result.error || 'Could not save prompt', 'error');
    return result;
  };

  const handleDeletePrompt = (id: string) => {
    deletePrompt(id);
    refreshPrompts();
  };

  const handleDuplicatePrompt = (id: string) => {
    const res = duplicatePrompt(id);
    if (res.success && res.newRecord) {
      refreshPrompts();
      showToast(`Duplicated to #${res.newRecord.id} (${res.newRecord.title})`, 'success');
    } else {
      showToast(res.error || 'Duplicate failed', 'error');
    }
  };

  const handleToggleStatus = (p: PromptRecord) => {
    const newStatus = p.status === 'published' ? 'draft' : 'published';
    savePrompt({ ...p, status: newStatus });
    refreshPrompts();
    showToast(`Prompt #${p.id} is now ${newStatus.toUpperCase()}`, 'info');
  };

  const handleBulkPublish = (ids: string[]) => {
    ids.forEach(id => {
      const p = prompts.find(x => x.id === id);
      if (p) savePrompt({ ...p, status: 'published' });
    });
    refreshPrompts();
    showToast(`Published ${ids.length} prompts.`, 'success');
  };

  const handleBulkUnpublish = (ids: string[]) => {
    ids.forEach(id => {
      const p = prompts.find(x => x.id === id);
      if (p) savePrompt({ ...p, status: 'draft' });
    });
    refreshPrompts();
    showToast(`Unpublished ${ids.length} prompts to drafts.`, 'info');
  };

  const handleBulkDelete = (ids: string[]) => {
    ids.forEach(id => deletePrompt(id));
    refreshPrompts();
  };

  const handleCommitBulkImport = (records: PromptRecord[]) => {
    bulkSavePrompts(records);
    refreshPrompts();
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100">
      <SEOHead title="Publishing Dashboard — Prompt Master" path="/admin" />
      <header className="border-b border-obsidian-800 bg-obsidian-950/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div><p className="text-xs uppercase tracking-[0.2em] text-purple-300 font-mono">Prompt Master</p><h1 className="font-bold text-white">Admin Studio</h1></div>
          <Link to="/" className="text-xs text-slate-400 hover:text-white">← Back to public gallery</Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <AdminGuard>
        <div className="flex flex-col gap-6">
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-obsidian-800 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Publishing & Monetization Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Manage prompt catalogue, upload images, generate social packs, and configure Adsterra monetization.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={handleOpenCreate}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-glow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>New Prompt</span>
              </button>

              <button
                onClick={() => setBulkImportOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-slate-200 border border-obsidian-750 text-xs font-medium transition-colors"
              >
                <Upload className="w-4 h-4 text-purple-400" />
                <span>Bulk Import</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-obsidian-800 pb-px overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold tracking-wide border-b-2 transition-all shrink-0 ${
                activeTab === 'overview'
                  ? 'border-brand-500 text-white bg-obsidian-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-obsidian-900/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-brand-400" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('prompts')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold tracking-wide border-b-2 transition-all shrink-0 ${
                activeTab === 'prompts'
                  ? 'border-brand-500 text-white bg-obsidian-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-obsidian-900/50'
              }`}
            >
              <FileText className="w-4 h-4 text-purple-400" />
              <span>All Prompts ({prompts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ads')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold tracking-wide border-b-2 transition-all shrink-0 ${
                activeTab === 'ads'
                  ? 'border-brand-500 text-white bg-obsidian-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-obsidian-900/50'
              }`}
            >
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span>Adsterra Monetization</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold tracking-wide border-b-2 transition-all shrink-0 ${
                activeTab === 'analytics'
                  ? 'border-brand-500 text-white bg-obsidian-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-obsidian-900/50'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Interaction Telemetry</span>
            </button>
          </div>

          {/* Active Tab Content */}
          <div className="pt-2">
            {activeTab === 'overview' && (
              <OverviewTab
                prompts={prompts}
                onOpenCreate={handleOpenCreate}
                onOpenBulkImport={() => setBulkImportOpen(true)}
                onSelectPromptForPack={p => setSocialPackPrompt(p)}
              />
            )}

            {activeTab === 'prompts' && (
              <PromptTable
                prompts={prompts}
                onEdit={handleOpenEdit}
                onDuplicate={handleDuplicatePrompt}
                onDelete={handleDeletePrompt}
                onToggleStatus={handleToggleStatus}
                onSelectForSocialPack={p => setSocialPackPrompt(p)}
                onBulkPublish={handleBulkPublish}
                onBulkUnpublish={handleBulkUnpublish}
                onBulkDelete={handleBulkDelete}
              />
            )}

            {activeTab === 'ads' && <AdSettingsTab />}

            {activeTab === 'analytics' && <AnalyticsTab />}
          </div>
        </div>

        {/* Prompt Editor Modal */}
        <PromptEditorModal
          isOpen={editorOpen}
          onClose={() => setEditorOpen(false)}
          onSave={handleSavePrompt}
          existingPrompt={editingPrompt}
          allPrompts={prompts}
        />

        {/* Bulk Import Modal */}
        <BulkImportModal
          isOpen={bulkImportOpen}
          onClose={() => setBulkImportOpen(false)}
          onCommitImport={handleCommitBulkImport}
          existingPrompts={prompts}
        />

        {/* Social Pack Modal */}
        <SocialPackModal
          prompt={socialPackPrompt}
          onClose={() => setSocialPackPrompt(null)}
        />
      </AdminGuard>
      </main>
    </div>
  );
};
