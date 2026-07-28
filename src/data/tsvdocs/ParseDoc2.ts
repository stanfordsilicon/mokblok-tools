import type { TSVRowData } from './TSVRowData';

// id	ENGLISH	FRENCH	TRANSLATION IN YOUR LANGUAGE	NOTES BY TRANSLATOR (IF NECESSARY)
export function parseDoc2Part1(tsv: string): TSVRowData[] {
  // Remove lines in comments by finding new lines in "" blocks
  const text = tsv.replace(/"([^"\t]|"")*"/g, (match) => match.replace(/\n/g, ' '));
  const lines = text.split('\n').slice(1); // Remove header

  const rows: TSVRowData[] = [];

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
export function parseDoc2Part2(tsv: string): TSVRowData[] {
  // Remove lines in comments by finding new lines in "" blocks
  const text = tsv.replace(/"([^"\t]|"")*"/g, (match) => match.replace(/\n/g, ' '));
  const lines = text.split('\n').slice(1); // Remove header

  const rows: TSVRowData[] = [];

  // Since these are long-form entries, sometimes they have newlines within them, which get split into multiple lines.
  let currentRow: TSVRowData | null = null;
  // let currentField = ''; // Track the current field (english, translated, notes)

  lines.forEach((line) => {
    const fields = line.split('\t');

    // Is this necessary?
    // // if a line doesn't have enough tabs, it's probably a continuation of the previous line's translation or notes
    // if (fields.length < 4) {
    //   if (currentRow) {
    //     if (currentField === 'english') {
    //       currentRow.english += '&#10;' + fields[0].trim();

    //       if (fields.length > 2) {
    //         currentRow.translated += '&#10;' + fields[1].trim();
    //         currentField = 'notes';
    //       } else if (fields.length === 2) {
    //         currentRow.translated += '&#10;' + fields[1].trim();
    //         currentField = 'translated';
    //       }
    //     } else if (currentField === 'translated') {
    //       currentRow.translated += '&#10;' + fields[0].trim();
    //       if (fields.length > 1) {
    //         currentRow.notes += '&#10;' + fields[1].trim();
    //         currentField = 'notes';
    //       }
    //     } else if (currentField === 'notes') {
    //       currentRow.notes += '&#10;' + fields[0].trim();
    //     }
    //   } else if (fields.length === 2) {
    //     // If the line has only one field, it might be a continuation of the previous notes
    //     currentRow = {
    //       english: fields[1],
    //       translated: '',
    //       notes: '',
    //       key: fields[0],
    //     };
    //     currentField = 'english';
    //   } else if (fields.length === 3) {
    //     // If the line has two fields, it might be a continuation of the previous translation
    //     currentRow = {
    //       english: fields[1],
    //       translated: fields[2],
    //       notes: '',
    //       key: fields[0],
    //     };
    //     currentField = 'translated';
    //   } else {
    //     // If the line has only one field and its not a continuation of the previous row, something is wrong
    //     console.warn(
    //       'Skipping line with insufficient columns and no current row to attach to:',
    //       line,
    //     );
    //   }
    //   return;
    // }

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

export function parseDoc2Part3(tsv: string): TSVRowData[] {
  // Remove lines in comments by finding new lines in "" blocks
  const text = tsv.replace(/"([^"\t]|"")*"/g, (match) => match.replace(/\n/g, ' '));
  const lines = text.split('\n');

  let section: Section2_3 | '' = '';
  const rows: TSVRowData[] = [];

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
