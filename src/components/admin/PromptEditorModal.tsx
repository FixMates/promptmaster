import React, { useState, useEffect } from 'react';
import { PromptRecord } from '../../types/prompt';
import { formatPromptId, generateSlug, getNextPromptId, validatePromptId } from '../../utils/idGenerator';
import { CATEGORIES } from '../../data/categories';
import { X, Upload, Sparkles, Image as ImageIcon, Check, AlertCircle, Eye } from 'lucide-react';
import { useToast } from '../common/Toast';

interface PromptEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: PromptRecord) => { success: boolean; error?: string };
  existingPrompt?: PromptRecord | null;
  allPrompts: PromptRecord[];
}

export const PromptEditorModal: React.FC<PromptEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingPrompt,
  allPrompts,
}) => {
  const { showToast } = useToast();

  const isEditing = Boolean(existingPrompt);

  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [promptText, setPromptText] = useState('');
  const [category, setCategory] = useState('fashion');
  const [customCategory, setCustomCategory] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [image, setImage] = useState('');
  const [altText, setAltText] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [featured, setFeatured] = useState(false);
  const [model, setModel] = useState('');
  const [creator, setCreator] = useState('');
  const [license, setLicense] = useState('');
  const [aspectRatio, setAspectRatio] = useState('4:3');

  const [imageFilePreview, setImageFilePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (existingPrompt) {
      setId(existingPrompt.id);
      setTitle(existingPrompt.title);
      setPromptText(existingPrompt.prompt);
      setCategory(existingPrompt.category);
      setTagsInput(existingPrompt.tags?.join(', ') || '');
      setImage(existingPrompt.image);
      setImageFilePreview(existingPrompt.image);
      setAltText(existingPrompt.alt || '');
      setStatus(existingPrompt.status);
      setFeatured(existingPrompt.featured);
      setModel(existingPrompt.model || '');
      setCreator(existingPrompt.creator || '');
      setLicense(existingPrompt.license || '');
      setAspectRatio(existingPrompt.aspectRatio || '4:3');
    } else {
      // Automatic next ID allocation
      const nextId = getNextPromptId(allPrompts);
      setId(nextId);
      setTitle('');
      setPromptText('');
      setCategory('fashion');
      setTagsInput('');
      setImage('/images/01.jpg');
      setImageFilePreview('/images/01.jpg');
      setAltText('');
      setStatus('published');
      setFeatured(false);
      setModel('Midjourney v6.1');
      setCreator('Prompt Master');
      setLicense('Free for personal & commercial generations');
      setAspectRatio('4:3');
    }
    setValidationError(null);
  }, [existingPrompt, allPrompts, isOpen]);

  if (!isOpen) return null;

  const handleImageFileChange = async (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setValidationError('Please upload a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setValidationError('Image file size exceeds 8MB limit.');
      return;
    }

    try {
      const objectUrl = URL.createObjectURL(file);
      const source = new Image();
      source.src = objectUrl;
      await new Promise<void>((resolve, reject) => {
        source.onload = () => resolve();
        source.onerror = () => reject(new Error('The selected image could not be read.'));
      });

      const scale = Math.min(1, 1600 / Math.max(source.naturalWidth, source.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(source.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(source.naturalHeight * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Image processing is unavailable in this browser.');
      context.drawImage(source, 0, 0, canvas.width, canvas.height);
      const result = canvas.toDataURL('image/webp', 0.82);
      URL.revokeObjectURL(objectUrl);
      setImageFilePreview(result);
      setImage(result);
      setValidationError(null);
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Image upload failed. Please try another file.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate ID
    const idCheck = validatePromptId(id, allPrompts, existingPrompt?.id);
    if (!idCheck.valid) {
      setValidationError(idCheck.error || 'Invalid Prompt ID');
      return;
    }

    // 2. Validate title & prompt
    if (!title.trim()) {
      setValidationError('Please enter a descriptive title.');
      return;
    }

    if (!promptText.trim()) {
      setValidationError('Please provide the full AI generation prompt.');
      return;
    }

    if (!image.trim()) {
      setValidationError('Please provide an image path or upload an image file.');
      return;
    }

    const finalCategory = category === 'custom' ? (customCategory.trim() || 'custom') : category;
    const finalTags = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    const now = new Date().toISOString();

    const recordToSave: PromptRecord = {
      id: id.trim(),
      title: title.trim(),
      slug: generateSlug(title),
      prompt: promptText.trim(),
      image: image.trim(),
      thumbnail: image.trim(),
      category: finalCategory,
      tags: finalTags.length > 0 ? finalTags : [finalCategory],
      alt: altText.trim() || `${title} AI generated art`,
      status,
      featured,
      createdAt: existingPrompt?.createdAt || now,
      updatedAt: now,
      model: model.trim() || undefined,
      creator: creator.trim() || undefined,
      license: license.trim() || undefined,
      aspectRatio,
    };

    const result = onSave(recordToSave);
    if (!result.success) {
      setValidationError(result.error || 'Could not save this prompt. Please export a backup and try again.');
      return;
    }
    showToast(isEditing ? `Prompt #${id} updated successfully!` : `Created Prompt #${id}!`, 'success');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div
        className="relative max-w-4xl w-full max-h-[92vh] flex flex-col rounded-3xl bg-obsidian-900 border border-obsidian-750 overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-obsidian-800 bg-obsidian-950/70">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              #{id || 'NEW'}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {isEditing ? `Edit Prompt #${id}` : 'Create New Prompt Entry'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-5 sm:p-6 space-y-6">
          {validationError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Col: Core Details */}
            <div className="md:col-span-7 space-y-4">
              {/* ID & Title Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                    Prompt ID
                  </label>
                  <input
                    type="text"
                    required
                    value={id}
                    disabled={isEditing} // Preserve ID on edit!
                    onChange={e => setId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-obsidian-750 font-mono text-sm text-brand-300 focus:border-brand-500 focus:outline-none disabled:opacity-75 disabled:cursor-not-allowed"
                    placeholder="01"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                    Prompt Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Cinematic Haute Couture Coat"
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-obsidian-750 text-sm text-white focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Exact Prompt Text */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono uppercase text-slate-400">
                    Exact Generation Prompt
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">
                    {promptText.length} characters
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  value={promptText}
                  onChange={e => setPromptText(e.target.value)}
                  placeholder="Paste the complete generative prompt with parameters (e.g. --ar 16:9 --v 6.1)..."
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-obsidian-750 text-xs font-mono text-slate-200 focus:border-brand-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Category & Aspect Ratio */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-obsidian-750 text-xs text-white focus:border-brand-500 focus:outline-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                    <option value="custom">Other / Custom...</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                    Aspect Ratio
                  </label>
                  <select
                    value={aspectRatio}
                    onChange={e => setAspectRatio(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-obsidian-750 text-xs text-white focus:border-brand-500 focus:outline-none"
                  >
                    <option value="4:3">4:3 (Standard)</option>
                    <option value="16:9">16:9 (Landscape / Wallpaper)</option>
                    <option value="1:1">1:1 (Square)</option>
                    <option value="9:16">9:16 (Story / Reel)</option>
                  </select>
                </div>
              </div>

              {category === 'custom' && (
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Custom Category Name
                  </label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                    placeholder="e.g. Retro Anime"
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-obsidian-750 text-xs text-white"
                  />
                </div>
              )}

              {/* Tags */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="fashion, editorial, portrait, neon"
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-obsidian-750 text-xs text-white focus:border-brand-500 focus:outline-none"
                />
              </div>

              {/* Alt Text */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono uppercase text-slate-400">
                    Image Alt Text (SEO & Accessibility)
                  </label>
                  <button
                    type="button"
                    onClick={() => setAltText(`${title} AI generated artwork in ${category} style`)}
                    className="text-[11px] text-brand-400 hover:underline"
                  >
                    Auto-generate
                  </button>
                </div>
                <input
                  type="text"
                  value={altText}
                  onChange={e => setAltText(e.target.value)}
                  placeholder="Detailed description of visual content..."
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-obsidian-750 text-xs text-white focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Right Col: Media & Attributions */}
            <div className="md:col-span-5 space-y-4">
              {/* Image Drag and Drop */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Image Upload (JPEG, PNG, WebP)
                </label>
                <div
                  onDragOver={e => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  className={`relative rounded-2xl border-2 border-dashed p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                    dragActive
                      ? 'border-brand-400 bg-brand-500/10'
                      : 'border-obsidian-750 hover:border-obsidian-600 bg-obsidian-950/70'
                  }`}
                  onClick={() => document.getElementById('image-file-input')?.click()}
                >
                  <input
                    id="image-file-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageFileChange(e.target.files[0]);
                      }
                    }}
                  />

                  {imageFilePreview ? (
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black mb-2">
                      <img
                        src={imageFilePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-xs font-medium text-white">
                        Click or drop to replace
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 flex flex-col items-center">
                      <Upload className="w-8 h-8 text-slate-500 mb-2" />
                      <span className="text-xs font-medium text-slate-300">
                        Drop image here or click to browse
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1">
                        JPEG, PNG, WebP up to 8MB
                      </span>
                    </div>
                  )}
                </div>

                {/* Or image URL input */}
                <div className="mt-2">
                  <input
                    type="text"
                    value={image}
                    onChange={e => {
                      setImage(e.target.value);
                      setImageFilePreview(e.target.value);
                    }}
                    placeholder="Or enter image URL / path (e.g. /images/01.jpg)"
                    className="w-full px-3 py-1.5 rounded-lg bg-obsidian-950 border border-obsidian-800 text-[11px] text-slate-400 font-mono focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Model & Creator */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    AI Model
                  </label>
                  <input
                    type="text"
                    value={model}
                    onChange={e => setModel(e.target.value)}
                    placeholder="e.g. Midjourney v6.1"
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-obsidian-750 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Creator / Curator
                  </label>
                  <input
                    type="text"
                    value={creator}
                    onChange={e => setCreator(e.target.value)}
                    placeholder="e.g. Studio Lumina"
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-obsidian-750 text-xs text-white"
                  />
                </div>
              </div>

              {/* Status and Featured Switches */}
              <div className="p-3.5 rounded-2xl bg-obsidian-950 border border-obsidian-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">Publication Status</span>
                  <div className="flex items-center gap-1 bg-obsidian-900 p-1 rounded-xl border border-obsidian-750">
                    <button
                      type="button"
                      onClick={() => setStatus('published')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        status === 'published'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'text-slate-400'
                      }`}
                    >
                      Published
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('draft')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        status === 'draft'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'text-slate-400'
                      }`}
                    >
                      Draft
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-obsidian-850">
                  <span className="text-xs font-medium text-slate-300">Featured Showcase</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={e => setFeatured(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-obsidian-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Save Row */}
          <div className="pt-4 border-t border-obsidian-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-glow-sm transition-all"
            >
              {isEditing ? 'Save Changes' : 'Publish Prompt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
