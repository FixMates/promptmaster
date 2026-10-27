import React, { useState } from 'react';
import { PromptRecord } from '../../types/prompt';
import { generateSocialPack, SocialPublishingPack } from '../../utils/socialPackGenerator';
import { X, Copy, Check, Sparkles, Share2, MessageSquare, ShieldCheck } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '../common/SocialIcons';
import { useToast } from '../common/Toast';

interface SocialPackModalProps {
  prompt: PromptRecord | null;
  onClose: () => void;
}

export const SocialPackModal: React.FC<SocialPackModalProps> = ({ prompt, onClose }) => {
  const { showToast } = useToast();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!prompt) return null;

  const pack: SocialPublishingPack = generateSocialPack(prompt);

  const copyField = async (text: string, key: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      showToast(`${label} copied!`, 'success');
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      showToast('Copy failed', 'error');
    }
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(pack.fullPackText);
      setCopiedKey('all');
      showToast('Complete Publishing Pack copied to clipboard!', 'success');
      setTimeout(() => setCopiedKey(null), 2400);
    } catch {
      showToast('Copy failed', 'error');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full max-h-[92vh] flex flex-col rounded-3xl bg-obsidian-900 border border-obsidian-750 overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-obsidian-800 bg-obsidian-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <InstagramIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Instagram & Social Publishing Pack</span>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-brand-500/20 text-brand-300">
                  #{prompt.id}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Optimized captions, hashtags, Reel cover hooks, and ManyChat / DM trigger phrases for "{prompt.title}".
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                copiedKey === 'all'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-glow-sm'
              }`}
            >
              {copiedKey === 'all' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'all' ? 'Pack Copied!' : 'Copy Full Pack'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-obsidian-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Permanent Prompt URL */}
          <div className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">
                Permanent Shareable URL
              </span>
              <span className="text-xs font-mono text-brand-300 truncate block">
                {pack.promptUrl}
              </span>
            </div>
            <button
              onClick={() => copyField(pack.promptUrl, 'url', 'Permanent URL')}
              className="px-3 py-1.5 rounded-lg bg-obsidian-850 hover:bg-obsidian-800 text-slate-300 hover:text-white border border-obsidian-750 text-xs font-mono shrink-0 flex items-center gap-1"
            >
              {copiedKey === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy</span>
            </button>
          </div>

          {/* Reel Title / Video Cover Text */}
          <div className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-pink-400 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Reel Cover Hook / On-Screen Text</span>
              </span>
              <button
                onClick={() => copyField(pack.reelCoverText, 'cover', 'Reel Cover Text')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedKey === 'cover' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-obsidian-900 border border-obsidian-800 text-xs text-slate-200 font-mono whitespace-pre-wrap">
              {pack.reelCoverText}
            </div>
          </div>

          {/* Instagram Caption & Hashtags */}
          <div className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-purple-400 uppercase flex items-center gap-1.5">
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Instagram Caption & Category Hashtags</span>
              </span>
              <button
                onClick={() => copyField(pack.instagramCaption, 'ig_caption', 'Instagram Caption')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedKey === 'ig_caption' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-obsidian-900 border border-obsidian-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
              {pack.instagramCaption}
            </div>
          </div>

          {/* Automation Pair: Comment Trigger & DM Auto-Response */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Comment Trigger */}
            <div className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-emerald-400 uppercase flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Comment Trigger Word</span>
                </span>
                <button
                  onClick={() => copyField(pack.commentTrigger, 'trigger', 'Trigger Word')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedKey === 'trigger' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-obsidian-900 border border-obsidian-800 text-sm font-mono font-bold text-brand-300">
                {pack.commentTrigger}
              </div>
              <p className="text-[11px] text-slate-500">
                Ask users in the Reel to comment "{pack.commentTrigger}" to receive the prompt link.
              </p>
            </div>

            {/* DM Response */}
            <div className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-brand-400 uppercase flex items-center gap-1.5">
                  <span>Suggested DM Response</span>
                </span>
                <button
                  onClick={() => copyField(pack.dmResponse, 'dm', 'DM Template')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedKey === 'dm' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-obsidian-900 border border-obsidian-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {pack.dmResponse}
              </div>
            </div>
          </div>

          {/* Facebook Caption */}
          <div className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-blue-400 uppercase flex items-center gap-1.5">
                <FacebookIcon className="w-3.5 h-3.5" />
                <span>Facebook Post Copy</span>
              </span>
              <button
                onClick={() => copyField(pack.facebookCaption, 'fb', 'Facebook Caption')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedKey === 'fb' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-obsidian-900 border border-obsidian-800 text-xs text-slate-200 whitespace-pre-wrap">
              {pack.facebookCaption}
            </div>
          </div>

          {/* Automation Safety & Compliance Note */}
          <div className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 text-xs text-slate-400 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-slate-200">Meta / Instagram Automation Compliance:</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                These templates are designed for manual copy-paste or official Meta Messaging API partners (such as ManyChat). Never use unauthorized scrapers or third-party bots that violate Instagram terms of service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
