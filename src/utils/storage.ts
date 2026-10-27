import { PromptRecord } from '../types/prompt';
import initialPrompts from '../data/prompts.json';
import { getNextPromptId, formatPromptId, generateSlug } from './idGenerator';

const STORAGE_KEY = 'pm_prompts_records_v1';
const DELETED_IDS_KEY = 'pm_deleted_reserved_ids_v1';

/**
 * Load deleted or reserved IDs from storage
 */
export function getDeletedOrReservedIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DELETED_IDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read deleted IDs:', err);
    return [];
  }
}

/**
 * Record an ID as permanently deleted so it will never be reused
 */
export function recordDeletedId(id: string): void {
  if (typeof window === 'undefined' || !id) return;
  try {
    const current = getDeletedOrReservedIds();
    const cleanId = id.trim();
    if (!current.includes(cleanId)) {
      current.push(cleanId);
      localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(current));
    }
  } catch (err) {
    console.error('Failed to record deleted ID:', err);
  }
}

/**
 * Get all prompts from persistent storage (or fallback to static JSON)
 */
export function getAllPrompts(): PromptRecord[] {
  if (typeof window === 'undefined') {
    return initialPrompts as PromptRecord[];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize storage with static prompts
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPrompts));
      return initialPrompts as PromptRecord[];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : (initialPrompts as PromptRecord[]);
  } catch (err) {
    console.error('Failed to parse prompts from localStorage:', err);
    return initialPrompts as PromptRecord[];
  }
}

/**
 * Get only published prompts for public visitors
 */
export function getPublishedPrompts(): PromptRecord[] {
  return getAllPrompts().filter(p => p.status === 'published');
}

/**
 * Find a prompt by its exact ID (e.g. "01", "02")
 */
export function getPromptById(id: string, includeDrafts: boolean = false): PromptRecord | undefined {
  if (!id) return undefined;
  const targetId = id.trim().toLowerCase();
  
  // Format numeric strings if needed: "1" -> "01"
  const formattedId = /^\d+$/.test(targetId) && targetId.length === 1 ? `0${targetId}` : targetId;

  const records = includeDrafts ? getAllPrompts() : getPublishedPrompts();
  return records.find(p => p.id.toLowerCase() === targetId || p.id.toLowerCase() === formattedId);
}

/**
 * Save or update a single prompt record
 */
export function savePrompt(record: PromptRecord): { success: boolean; error?: string } {
  if (typeof window === 'undefined') return { success: false, error: 'Cannot save outside browser' };
  try {
    const records = getAllPrompts();
    const cleanId = record.id.trim();

    const existingIndex = records.findIndex(r => r.id.trim() === cleanId);
    const now = new Date().toISOString();

    const updatedRecord: PromptRecord = {
      ...record,
      id: cleanId,
      slug: record.slug || generateSlug(record.title),
      updatedAt: now,
      createdAt: record.createdAt || now,
    };

    if (existingIndex >= 0) {
      // Update existing, preserve ID and created timestamp
      records[existingIndex] = {
        ...updatedRecord,
        createdAt: records[existingIndex].createdAt || updatedRecord.createdAt,
      };
    } else {
      // Create new
      records.push(updatedRecord);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return { success: true };
  } catch (err: any) {
    console.error('Failed to save prompt:', err);
    return { success: false, error: err?.message || 'Failed to save prompt' };
  }
}

/**
 * Delete a prompt by ID. Records the deleted ID in the reserved registry
 * so it will never be reused by automatic ID generation.
 */
export function deletePrompt(id: string): { success: boolean; error?: string } {
  if (typeof window === 'undefined') return { success: false, error: 'Cannot delete outside browser' };
  try {
    const records = getAllPrompts();
    const cleanId = id.trim();
    const filtered = records.filter(r => r.id.trim() !== cleanId);

    if (filtered.length === records.length) {
      return { success: false, error: `Prompt #${cleanId} not found.` };
    }

    // Permanently reserve ID so it is never reallocated
    recordDeletedId(cleanId);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return { success: true };
  } catch (err: any) {
    console.error('Failed to delete prompt:', err);
    return { success: false, error: err?.message || 'Failed to delete' };
  }
}

/**
 * Duplicate a prompt into a new record with the next unused ID
 */
export function duplicatePrompt(sourceId: string): { success: boolean; newRecord?: PromptRecord; error?: string } {
  const source = getPromptById(sourceId, true);
  if (!source) {
    return { success: false, error: `Source prompt #${sourceId} not found.` };
  }

  const allRecords = getAllPrompts();
  const deletedIds = getDeletedOrReservedIds();
  const newId = getNextPromptId(allRecords, deletedIds);

  const now = new Date().toISOString();
  const newRecord: PromptRecord = {
    ...source,
    id: newId,
    title: `${source.title} (Copy)`,
    slug: generateSlug(`${source.title} Copy`),
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  };

  const res = savePrompt(newRecord);
  if (res.success) {
    return { success: true, newRecord };
  } else {
    return { success: false, error: res.error };
  }
}

/**
 * Bulk insert or update records
 */
export function bulkSavePrompts(newRecords: PromptRecord[]): { success: boolean; count: number; error?: string } {
  if (typeof window === 'undefined') return { success: false, count: 0, error: 'Browser storage required' };
  try {
    const existing = getAllPrompts();
    const map = new Map<string, PromptRecord>();
    existing.forEach(r => map.set(r.id.trim(), r));

    newRecords.forEach(r => {
      map.set(r.id.trim(), r);
    });

    const combined = Array.from(map.values());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
    return { success: true, count: newRecords.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || 'Bulk save failed' };
  }
}

/**
 * Reset storage back to factory default prompts
 */
export function resetToDefaultPrompts(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPrompts));
  localStorage.removeItem(DELETED_IDS_KEY);
}
