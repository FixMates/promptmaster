import { PromptRecord, ValidationIssue, ValidationResult } from '../types/prompt';
import { formatPromptId, generateSlug, getNextPromptId, validatePromptId } from './idGenerator';

/**
 * Robust RFC 4180 CSV Parser supporting:
 * - Escaped double quotes ("")
 * - Fields containing commas
 * - Multiline fields (fields containing newlines inside quotes)
 */
export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  // Normalize line endings
  const str = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  while (i < str.length) {
    const char = str[i];
    const nextChar = str[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote: "" -> "
          currentField += '"';
          i += 2;
          continue;
        } else {
          // Closing quote
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        currentField += char;
        i++;
        continue;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
        i++;
        continue;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
        i++;
        continue;
      } else if (char === '\n') {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
        i++;
        continue;
      } else {
        currentField += char;
        i++;
        continue;
      }
    }
  }

  // Push last field and row if any remains
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

/**
 * Convert an array of objects to RFC 4180 compliant CSV string
 */
export function serializeCSV(records: PromptRecord[]): string {
  const headers = [
    'id',
    'title',
    'prompt',
    'category',
    'tags',
    'image',
    'thumbnail',
    'alt',
    'status',
    'featured',
    'model',
    'creator',
    'license',
    'createdAt',
  ];

  const escapeField = (val: any): string => {
    if (val === null || val === undefined) return '';
    const str = Array.isArray(val) ? val.join('; ') : String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.join(',');
  const rowLines = records.map(r => {
    const values = [
      r.id,
      r.title,
      r.prompt,
      r.category,
      r.tags,
      r.image,
      r.thumbnail || r.image,
      r.alt || r.title,
      r.status,
      r.featured ? 'true' : 'false',
      r.model || '',
      r.creator || '',
      r.license || '',
      r.createdAt,
    ];
    return values.map(escapeField).join(',');
  });

  return [headerLine, ...rowLines].join('\r\n');
}

export interface ParsedImportRow {
  rowIndex: number;
  data: Partial<PromptRecord>;
  rawRow: Record<string, string>;
  issues: ValidationIssue[];
  status: 'valid' | 'has_warnings' | 'invalid';
}

export interface ImportValidationReport {
  totalRows: number;
  validRowsCount: number;
  invalidRowsCount: number;
  warningsCount: number;
  parsedRows: ParsedImportRow[];
  readyRecords: PromptRecord[];
}

/**
 * Validate imported CSV records against existing database records
 */
export function validateAndPrepareImport(
  rawCSV: string,
  existingRecords: PromptRecord[],
  autoAssignMissingIds: boolean = true
): ImportValidationReport {
  const parsedGrid = parseCSV(rawCSV);
  if (parsedGrid.length === 0) {
    return {
      totalRows: 0,
      validRowsCount: 0,
      invalidRowsCount: 0,
      warningsCount: 0,
      parsedRows: [],
      readyRecords: [],
    };
  }

  // Header matching
  const rawHeaders = parsedGrid[0].map(h => h.trim().toLowerCase());
  const headerMap: Record<string, number> = {};
  rawHeaders.forEach((h, idx) => {
    headerMap[h] = idx;
  });

  const getCol = (row: string[], colName: string): string => {
    const idx = headerMap[colName];
    return idx !== undefined && row[idx] ? row[idx].trim() : '';
  };

  const rows = parsedGrid.slice(1).filter(r => r.some(cell => cell.trim().length > 0));

  const seenIdsInBatch = new Set<string>();
  const parsedRows: ParsedImportRow[] = [];
  const readyRecords: PromptRecord[] = [];

  let nextIdCounter = 1;
  const getBatchNextId = (): string => {
    let candidate = getNextPromptId(
      [...existingRecords, ...readyRecords],
      Array.from(seenIdsInBatch)
    );
    while (seenIdsInBatch.has(candidate)) {
      nextIdCounter++;
      candidate = formatPromptId(nextIdCounter);
    }
    seenIdsInBatch.add(candidate);
    return candidate;
  };

  rows.forEach((row, idx) => {
    const rowNum = idx + 2; // 1-indexed including header
    const issues: ValidationIssue[] = [];

    const idVal = getCol(row, 'id') || getCol(row, 'prompt_id');
    const titleVal = getCol(row, 'title') || getCol(row, 'name');
    const promptVal = getCol(row, 'prompt') || getCol(row, 'prompt_text');
    const categoryVal = getCol(row, 'category') || 'fashion';
    const tagsVal = getCol(row, 'tags');
    const imageVal = getCol(row, 'image') || getCol(row, 'image_url') || getCol(row, 'image_path');
    const thumbVal = getCol(row, 'thumbnail') || getCol(row, 'thumb') || imageVal;
    const altVal = getCol(row, 'alt') || getCol(row, 'alt_text') || titleVal;
    const statusVal = (getCol(row, 'status').toLowerCase() === 'draft' ? 'draft' : 'published') as 'draft' | 'published';
    const featuredVal = getCol(row, 'featured').toLowerCase() === 'true';
    const modelVal = getCol(row, 'model') || getCol(row, 'ai_model');
    const creatorVal = getCol(row, 'creator') || getCol(row, 'author');
    const licenseVal = getCol(row, 'license');

    // Validation rules
    if (!titleVal) {
      issues.push({ row: rowNum, field: 'title', message: 'Title is required.', severity: 'error' });
    }

    if (!promptVal) {
      issues.push({ row: rowNum, field: 'prompt', message: 'Prompt text is required.', severity: 'error' });
    }

    if (!imageVal) {
      issues.push({ row: rowNum, field: 'image', message: 'Image path or reference is required.', severity: 'error' });
    }

    let finalId = idVal;
    if (finalId) {
      const idValidation = validatePromptId(finalId, existingRecords);
      if (!idValidation.valid) {
        issues.push({ row: rowNum, field: 'id', message: idValidation.error!, severity: 'error' });
      }
      if (seenIdsInBatch.has(finalId)) {
        issues.push({ row: rowNum, field: 'id', message: `Duplicate ID "${finalId}" within import file.`, severity: 'error' });
      } else {
        seenIdsInBatch.add(finalId);
      }
    } else {
      if (autoAssignMissingIds) {
        finalId = getBatchNextId();
        issues.push({ row: rowNum, field: 'id', message: `Assigned new ID #${finalId}.`, severity: 'warning' });
      } else {
        issues.push({ row: rowNum, field: 'id', message: 'ID is missing and auto-assignment is disabled.', severity: 'error' });
      }
    }

    // Split tags by comma, semicolon, or space
    const tagsArray = tagsVal
      ? tagsVal.split(/[,;]/).map(t => t.trim().toLowerCase()).filter(Boolean)
      : [categoryVal.toLowerCase()];

    const hasErrors = issues.some(i => i.severity === 'error');
    const hasWarnings = issues.some(i => i.severity === 'warning');

    const parsedRow: ParsedImportRow = {
      rowIndex: rowNum,
      rawRow: {
        id: idVal,
        title: titleVal,
        prompt: promptVal,
        category: categoryVal,
        image: imageVal,
      },
      issues,
      status: hasErrors ? 'invalid' : hasWarnings ? 'has_warnings' : 'valid',
      data: {
        id: finalId,
        title: titleVal,
        slug: generateSlug(titleVal || 'prompt'),
        prompt: promptVal,
        category: categoryVal,
        tags: tagsArray,
        image: imageVal,
        thumbnail: thumbVal || imageVal,
        alt: altVal || titleVal,
        status: statusVal,
        featured: featuredVal,
        model: modelVal,
        creator: creatorVal,
        license: licenseVal,
      },
    };

    parsedRows.push(parsedRow);

    if (!hasErrors && finalId) {
      const now = new Date().toISOString();
      readyRecords.push({
        id: finalId,
        title: titleVal,
        slug: generateSlug(titleVal),
        prompt: promptVal,
        category: categoryVal,
        tags: tagsArray,
        image: imageVal,
        thumbnail: thumbVal || imageVal,
        alt: altVal || titleVal,
        status: statusVal,
        featured: featuredVal,
        createdAt: now,
        updatedAt: now,
        model: modelVal,
        creator: creatorVal,
        license: licenseVal,
      });
    }
  });

  const invalidRowsCount = parsedRows.filter(r => r.status === 'invalid').length;
  const validRowsCount = parsedRows.filter(r => r.status !== 'invalid').length;
  const warningsCount = parsedRows.reduce((acc, r) => acc + r.issues.filter(i => i.severity === 'warning').length, 0);

  return {
    totalRows: rows.length,
    validRowsCount,
    invalidRowsCount,
    warningsCount,
    parsedRows,
    readyRecords,
  };
}
