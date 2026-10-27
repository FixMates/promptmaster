import { describe, it, expect } from 'vitest';
import {
  formatPromptId,
  parsePromptId,
  getNextPromptId,
  validatePromptId,
  generateSlug,
} from '../utils/idGenerator';
import { PromptRecord } from '../types/prompt';

describe('Prompt ID Generator & Validator', () => {
  it('formats small IDs with minimum two digits (01, 02, 09, 10, 100)', () => {
    expect(formatPromptId(1)).toBe('01');
    expect(formatPromptId(2)).toBe('02');
    expect(formatPromptId(9)).toBe('09');
    expect(formatPromptId(10)).toBe('10');
    expect(formatPromptId(42)).toBe('42');
    expect(formatPromptId(105)).toBe('105');
  });

  it('correctly parses ID strings to numeric values', () => {
    expect(parsePromptId('01')).toBe(1);
    expect(parsePromptId('09')).toBe(9);
    expect(parsePromptId('42')).toBe(42);
    expect(parsePromptId('abc')).toBeNull();
    expect(parsePromptId('')).toBeNull();
  });

  it('calculates the next unused ID starting at 01', () => {
    const records: PromptRecord[] = [];
    expect(getNextPromptId(records)).toBe('01');
  });

  it('increments highest ID correctly', () => {
    const records = [
      { id: '01' },
      { id: '02' },
      { id: '08' },
    ] as PromptRecord[];
    expect(getNextPromptId(records)).toBe('09');
  });

  it('never reuses deleted or reserved IDs', () => {
    const records = [
      { id: '01' },
      { id: '02' },
    ] as PromptRecord[];
    // Suppose '03' and '04' were deleted and are in reserved list
    const deleted = ['03', '04'];
    expect(getNextPromptId(records, deleted)).toBe('05');
  });

  it('validates IDs and prevents duplicates', () => {
    const records = [
      { id: '01', title: 'First' },
      { id: '02', title: 'Second' },
    ] as PromptRecord[];

    // Valid unique ID
    expect(validatePromptId('03', records).valid).toBe(true);

    // Duplicate ID
    const dupCheck = validatePromptId('01', records);
    expect(dupCheck.valid).toBe(false);
    expect(dupCheck.error).toContain('already assigned');

    // Editing same record allows keeping its own ID
    expect(validatePromptId('01', records, '01').valid).toBe(true);

    // Single digit without leading zero
    const singleDigitCheck = validatePromptId('3', records);
    expect(singleDigitCheck.valid).toBe(false);
    expect(singleDigitCheck.error).toContain('at least two digits');
  });

  it('generates clean URL slugs', () => {
    expect(generateSlug('Cinematic Fashion Portrait')).toBe('cinematic-fashion-portrait');
    expect(generateSlug('Makoto Shinkai: Rooftop (4K)')).toBe('makoto-shinkai-rooftop-4k');
    expect(generateSlug('   ')).toBe('prompt');
  });
});
