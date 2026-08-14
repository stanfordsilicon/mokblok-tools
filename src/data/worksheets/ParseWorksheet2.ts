import type { WorksheetRowData } from './WorksheetRowData';

// id	ENGLISH	FRENCH	TRANSLATION IN YOUR LANGUAGE	NOTES BY TRANSLATOR (IF NECESSARY)
export function parseWorksheet2Part1(tsv: string): WorksheetRowData[] {
  // Remove lines in comments by finding new lines in "" blocks
  const text = tsv.replace(/"([^"\t]|"")*"/g, (match) => match.replace(/\n/g, ' '));
  const lines = text.split('\n').slice(1); // Remove header

  const rows: WorksheetRowData[] = [];

  lines.forEach((line) => {
    const fields = line.split('\t');
    rows.push({
      english: fields[1],
      french: fields[2],
      translated: fields[3],
      notes: fields[4],
      key: fields[0],
    });
  });
  return rows;
}

// id	ENGLISH	TRANSLATION IN YOUR LANGUAGE	NOTES BY TRANSLATOR (IF NECESSARY)
export function parseWorksheet2Part2(tsv: string): WorksheetRowData[] {
  // Remove lines in comments by finding new lines in "" blocks
  const text = tsv.replace(/"([^"\t]|"")*"/g, (match) => match.replace(/\n/g, ' '));
  const lines = text.split('\n').slice(1); // Remove header

  const rows: WorksheetRowData[] = [];

  // Since these are long-form entries, sometimes they have newlines within them, which get split into multiple lines.
  let currentRow: WorksheetRowData | null = null;
  // let currentField = ''; // Track the current field (english, translated, notes)

  lines.forEach((line) => {
    const fields = line.split('\t');

    // Regular case
    // currentField = 'notes';
    currentRow = {
      english: fields[1],
      translated: fields[2],
      notes: fields[3],
      key: fields[0],
    };
    rows.push(currentRow);
  });
  return rows;
}

enum Section2_3 {
  LargeNumbers = 'LARGE NUMBERS',
  NumberAbbreviations = 'NUMBER ABBREVIATIONS',
  Timezones = 'TIMEZONES and GEOGRAPHIC NAMES (Africa)',
  GeographicNames = 'GEOGRAPHIC NAMES',
  Currencies = 'CURRENCIES (African + Major Global Currencies)',
  Emoji = 'EMOJI',
}

export function parseWorksheet2Part3(tsv: string): WorksheetRowData[] {
  // Remove lines in comments by finding new lines in "" blocks
  const text = tsv.replace(/"([^"\t]|"")*"/g, (match) => match.replace(/\n/g, ' '));
  const lines = text.split('\n');

  let section: Section2_3 | '' = '';
  const rows: WorksheetRowData[] = [];

  lines.forEach((line) => {
    const fields = line.split('\t');
    if (Object.values(Section2_3).includes(fields[0] as Section2_3)) {
      section = fields[0] as Section2_3;
      return;
    }
    if (
      section === Section2_3.LargeNumbers &&
      fields[0].startsWith('In English, the SHORTEST abbreviation')
    ) {
      section = Section2_3.NumberAbbreviations;
      return;
    }
    switch (section) {
      case Section2_3.Emoji:
        rows.push({
          english: fields[1],
          french: fields[2],
          translated: fields[3],
          notes: fields[4],
          key: fields[0],
        });
        break;
      case Section2_3.Timezones:
      case Section2_3.GeographicNames:
      case Section2_3.Currencies:
        rows.push({
          english: fields[0],
          french: fields[1],
          translated: fields[2],
          notes: fields[3],
          xpath: fields[4],
          key: fields[4],
        });
        break;
      default:
        break;
    }
  });
  return rows;
}
