import { describe, it, expect, beforeEach } from 'vitest';
import {
  getAllPrompts,
  getPublishedPrompts,
  getPromptById,
  savePrompt,
  deletePrompt,
  duplicatePrompt,
  getDeletedOrReservedIds,
} from '../utils/storage';
import { getStoredAdsConfig, saveStoredAdsConfig, DEFAULT_ADS_CONFIG } from '../config/adsConfig';
import { PromptRecord } from '../types/prompt';

describe('Storage & Monetization Configuration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('filters drafts out of public getPublishedPrompts() query', () => {
    const draftPrompt: PromptRecord = {
      id: '99',
      title: 'Secret Draft Artwork',
      slug: 'secret-draft-artwork',
      prompt: 'Unpublished test prompt',
      image: '/images/01.jpg',
      thumbnail: '/images/01.jpg',
      category: 'fashion',
      tags: ['draft'],
      alt: 'Draft',
      status: 'draft',
      featured: false,
      createdAt: '2026-10-20T10:00:00.000Z',
      updatedAt: '2026-10-20T10:00:00.000Z',
    };

    savePrompt(draftPrompt);

    // All prompts should contain the draft
    const all = getAllPrompts();
    expect(all.some(p => p.id === '99')).toBe(true);

    // Public published prompts must NOT contain the draft!
    const published = getPublishedPrompts();
    expect(published.some(p => p.id === '99')).toBe(false);

    // getPromptById with includeDrafts=false must return undefined for drafts
    expect(getPromptById('99', false)).toBeUndefined();
    // getPromptById with includeDrafts=true returns the draft for admin
    expect(getPromptById('99', true)).toBeDefined();
  });

  it('permanently reserves deleted prompt IDs so they are never reused', () => {
    const promptToDelete: PromptRecord = {
      id: '50',
      title: 'Will be deleted',
      slug: 'will-be-deleted',
      prompt: 'Testing permanent ID retirement',
      image: '/images/01.jpg',
      thumbnail: '/images/01.jpg',
      category: 'fashion',
      tags: ['test'],
      alt: 'Test',
      status: 'published',
      featured: false,
      createdAt: '2026-10-20T10:00:00.000Z',
      updatedAt: '2026-10-20T10:00:00.000Z',
    };

    savePrompt(promptToDelete);
    expect(getAllPrompts().some(p => p.id === '50')).toBe(true);

    // Delete prompt
    const delRes = deletePrompt('50');
    expect(delRes.success).toBe(true);

    // Check prompt is removed
    expect(getAllPrompts().some(p => p.id === '50')).toBe(false);

    // Check ID '50' is now recorded in reserved registry
    const reserved = getDeletedOrReservedIds();
    expect(reserved).toContain('50');
  });

  it('allocates a new unique ID when duplicating an existing entry', () => {
    const original: PromptRecord = {
      id: '01',
      title: 'Original Artwork',
      slug: 'original-artwork',
      prompt: 'Original prompt text',
      image: '/images/01.jpg',
      thumbnail: '/images/01.jpg',
      category: 'fashion',
      tags: ['fashion'],
      alt: 'Original',
      status: 'published',
      featured: true,
      createdAt: '2026-10-20T10:00:00.000Z',
      updatedAt: '2026-10-20T10:00:00.000Z',
    };
    savePrompt(original);

    const dupRes = duplicatePrompt('01');
    expect(dupRes.success).toBe(true);
    expect(dupRes.newRecord).toBeDefined();
    expect(dupRes.newRecord?.id).not.toBe('01');
    expect(dupRes.newRecord?.title).toContain('(Copy)');
    expect(dupRes.newRecord?.status).toBe('draft');
  });

  it('enforces safe Adsterra default settings: Popunder strictly disabled', () => {
    const initialConfig = getStoredAdsConfig();
    expect(initialConfig.globalEnabled).toBe(true);
    expect(initialConfig.testMode).toBe(true);
    // Popunder MUST be disabled by default
    expect(initialConfig.popunderEnabled).toBe(false);

    // Update config
    const updated = {
      ...initialConfig,
      testMode: false,
    };
    saveStoredAdsConfig(updated);

    const reloaded = getStoredAdsConfig();
    expect(reloaded.testMode).toBe(false);
  });
});
