import { PromptRecord } from '../types/prompt';

/**
 * Format a numeric ID into at least 2 digits (e.g. 1 -> "01", 9 -> "09", 10 -> "10", 105 -> "105")
 */
export function formatPromptId(num: number): string {
  if (num <= 0 || !Number.isInteger(num)) {
    throw new Error(`Invalid prompt ID number: ${num}. Must be a positive integer.`);
  }
  return num < 10 ? `0${num}` : `${num}`;
}

/**
 * Parse an ID string into its numeric value (e.g. "01" -> 1, "42" -> 42)
 */
export function parsePromptId(idStr: string): number | null {
  if (!idStr || typeof idStr !== 'string') return null;
  const cleaned = idStr.trim();
  if (!/^\d+$/.test(cleaned)) return null;
  const val = parseInt(cleaned, 10);
  return isNaN(val) || val <= 0 ? null : val;
}

/**
 * Determine the next unique ID that has never been used, based on existing records
 * and an optional deleted/reserved ID registry.
 */
export function getNextPromptId(
  existingRecords: PromptRecord[],
  deletedOrReservedIds: string[] = []
): string {
  const allUsedIds = new Set<string>();

  existingRecords.forEach(r => {
    if (r.id) allUsedIds.add(r.id.trim());
  });

  deletedOrReservedIds.forEach(id => {
    if (id) allUsedIds.add(id.trim());
  });

  let maxNumeric = 0;
  allUsedIds.forEach(id => {
    const parsed = parsePromptId(id);
    if (parsed !== null && parsed > maxNumeric) {
      maxNumeric = parsed;
    }
  });

  const nextNum = maxNumeric + 1;
  let candidate = formatPromptId(nextNum);

  // Safety loop in case candidate is somehow in reserved set
  let counter = nextNum;
  while (allUsedIds.has(candidate)) {
    counter++;
    candidate = formatPromptId(counter);
  }

  return candidate;
}

/**
 * Validate a prompt ID format
 */
export function validatePromptId(
  id: string,
  existingRecords: PromptRecord[] = [],
  currentRecordId?: string
): { valid: boolean; error?: string } {
  if (!id || typeof id !== 'string') {
    return { valid: false, error: 'Prompt ID is required.' };
  }

  const trimmed = id.trim();
  if (!/^\d+$/.test(trimmed)) {
    return { valid: false, error: 'Prompt ID must consist of numbers only (e.g., "01", "02").' };
  }

  if (trimmed.length < 2 && parseInt(trimmed, 10) < 10) {
    return { valid: false, error: 'Small prompt IDs must be formatted with at least two digits (e.g., "01" instead of "1").' };
  }

  // Check duplicate
  const duplicate = existingRecords.find(
    r => r.id.trim() === trimmed && (!currentRecordId || r.id.trim() !== currentRecordId.trim())
  );

  if (duplicate) {
    return { valid: false, error: `Prompt ID "${trimmed}" is already assigned to "${duplicate.title}".` };
  }

  return { valid: true };
}

/**
 * Generate a clean URL-friendly slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'prompt';
}
