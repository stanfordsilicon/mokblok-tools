import { parseWorksheet1 } from './loadWorksheets';
import {
  parseWorksheet2Part1,
  parseWorksheet2Part2,
  parseWorksheet2Part3,
} from './ParseWorksheet2';
import { MAX_WORKSHEET_BYTES, type WorksheetKey } from './storageTypes';

export type WorksheetValidation = {
  valid: boolean;
  errors: string[];
  warnings: string[];
  parsedRowCount: number;
  translatedRowCount: number;
};

/** Parsing view only: the uploaded source is stored unchanged. */
export function worksheetParsingText(content: string): string {
  return content.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
}

export function validateWorksheet(content: string, key: WorksheetKey): WorksheetValidation {
  const result: WorksheetValidation = {
    valid: false,
    errors: [],
    warnings: [],
    parsedRowCount: 0,
    translatedRowCount: 0,
  };
  if (new TextEncoder().encode(content).length > MAX_WORKSHEET_BYTES) {
    result.errors.push('Worksheet exceeds the 1 MiB limit.');
  }
  if (!content.trim()) result.errors.push('Worksheet is empty.');
  if (content.includes('\0') || /[\uD800-\uDFFF]/u.test(content)) {
    result.errors.push('Worksheet contains invalid text characters.');
  }
  if (result.errors.length) return result;
  if (key === '3' || key === '4') return { ...result, valid: true };

  const text = worksheetParsingText(content);
  let quoted = false;
  let fieldStart = true;
  for (let index = 0; index < text.length; index++) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') index++;
      else if (character === '"') quoted = false;
    } else if (fieldStart && character === '"') {
      quoted = true;
      fieldStart = false;
    } else {
      fieldStart = character === '\t' || character === '\n';
    }
  }
  if (quoted) {
    result.errors.push('Unclosed quoted field.');
    return result;
  }
  if (!text.includes('\t')) result.errors.push('Expected tab-separated worksheet columns.');
  // Worksheet 1 discovers named columns; worksheet 2 uses positional layouts.
  if (key === '2_1' || key === '2_2') {
    const header = text.split('\n')[0].toLowerCase().split('\t');
    const minimum = key === '2_1' ? 4 : 3; // Notes are optional in existing exports.
    if (
      header.length < minimum ||
      header[0]?.trim() !== 'id' ||
      !header[1]?.includes('english') ||
      !header[key === '2_1' ? 3 : 2]?.includes('translation') ||
      (key === '2_1' && !header[2]?.includes('french'))
    ) {
      result.errors.push(`Headers do not match worksheet ${key}.`);
    }
  }
  if (key === '2_3' && !/^(?:TIMEZONES|GEOGRAPHIC NAMES|CURRENCIES|EMOJI)/m.test(text)) {
    result.errors.push('Missing worksheet 2 part 3 section headings.');
  }
  const parsers = {
    '1': parseWorksheet1,
    '2_1': parseWorksheet2Part1,
    '2_2': parseWorksheet2Part2,
    '2_3': parseWorksheet2Part3,
  };
  const rows = parsers[key](text).filter(
    (row) => row.key?.trim() && !['id', 'ext_id', 'xpath'].includes(row.key.trim().toLowerCase()),
  );
  result.parsedRowCount = rows.length;
  result.translatedRowCount = rows.filter((row) => row.translated?.trim()).length;
  if (!rows.length)
    result.errors.push('No usable rows found; check the worksheet type and required columns.');
  if (rows.some((row) => row.translated === undefined))
    result.errors.push('Some rows are missing translation columns.');
  const duplicates = rows.length - new Set(rows.map((row) => row.key)).size;
  if (duplicates)
    result.warnings.push(
      `${duplicates} duplicate row keys; later translated rows take precedence.`,
    );
  const untranslated = rows.length - result.translatedRowCount;
  if (untranslated) result.warnings.push(`${untranslated} rows have no translation.`);
  result.valid = result.errors.length === 0;
  return result;
}
