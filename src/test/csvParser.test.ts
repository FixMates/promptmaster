import { describe, it, expect } from 'vitest';
import {
  parseCSV,
  serializeCSV,
  validateAndPrepareImport,
} from '../utils/csvParser';
import { PromptRecord } from '../types/prompt';

describe('RFC 4180 CSV Parser & Serializer', () => {
  it('correctly handles quoted fields containing commas', () => {
    const csv = `id,title,prompt\n01,"Fashion, Style and Glamour","Studio lighting, 8k, photorealistic"`;
    const rows = parseCSV(csv);
    expect(rows.length).toBe(2);
    expect(rows[1][1]).toBe('Fashion, Style and Glamour');
    expect(rows[1][2]).toBe('Studio lighting, 8k, photorealistic');
  });

  it('correctly handles multiline text inside double quotes', () => {
    const csv = `id,title,prompt\n01,"Test Title","Line 1 of prompt\nLine 2 of prompt\nLine 3"`;
    const rows = parseCSV(csv);
    expect(rows.length).toBe(2);
    expect(rows[1][2]).toBe('Line 1 of prompt\nLine 2 of prompt\nLine 3');
  });

  it('correctly unescapes double quotes ("" -> ")', () => {
    const csv = `id,title,prompt\n01,"He said ""Hello"" to AI","Prompt text"`;
    const rows = parseCSV(csv);
    expect(rows[1][1]).toBe('He said "Hello" to AI');
  });

  it('serializes prompt records into standard CSV with quote protection', () => {
    const records: PromptRecord[] = [
      {
        id: '01',
        title: 'Haute Couture, Glass Coat',
        slug: 'haute-couture-glass-coat',
        prompt: 'Prompt with commas, and "quotes"',
        image: '/images/01.jpg',
        thumbnail: '/images/thumbnails/01.jpg',
        category: 'fashion',
        tags: ['fashion', 'haute-couture'],
        alt: 'Alt description',
        status: 'published',
        featured: true,
        createdAt: '2026-10-20T10:00:00.000Z',
        updatedAt: '2026-10-20T10:00:00.000Z',
      },
    ];

    const csvOutput = serializeCSV(records);
    expect(csvOutput).toContain('"Haute Couture, Glass Coat"');
    expect(csvOutput).toContain('"Prompt with commas, and ""quotes"""');
  });

  it('validates imported rows, reports invalid items and prevents duplicate IDs', () => {
    const existing = [
      { id: '01', title: 'Existing One' },
    ] as PromptRecord[];

    const importCSV = `id,title,prompt,image
01,"Duplicate ID Entry","Valid Prompt Text","/images/01.jpg"
,"Valid Row Without ID","Another Great Prompt","/images/02.jpg"
03,"","Missing Prompt and Title",""`;

    const report = validateAndPrepareImport(importCSV, existing, true);
    expect(report.totalRows).toBe(3);

    // Row 1: has duplicate ID '01'
    expect(report.parsedRows[0].status).toBe('invalid');
    expect(report.parsedRows[0].issues.some(i => i.message.includes('already assigned'))).toBe(true);

    // Row 2: valid, should get auto-assigned next ID (#02)
    expect(report.parsedRows[1].status).toBe('has_warnings'); // Warning about auto-assigned ID
    expect(report.parsedRows[1].data.id).toBe('02');

    // Row 3: missing title and image
    expect(report.parsedRows[2].status).toBe('invalid');
    expect(report.parsedRows[2].issues.some(i => i.field === 'title')).toBe(true);
    expect(report.parsedRows[2].issues.some(i => i.field === 'image')).toBe(true);
  });
});
