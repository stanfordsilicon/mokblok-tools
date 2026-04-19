import type { RowData } from './DataTypes';

enum Section2_3 {
  LargeNumbers = 'LARGE NUMBERS',
  Timezones = 'TIMEZONES and GEOGRAPHIC NAMES (Africa)',
  GeographicNames = 'GEOGRAPHIC NAMES',
  Currencies = 'CURRENCIES (African + Major Global Currencies)',
  Emoji = 'EMOJI',
}
// id	ENGLISH	FRENCH	TRANSLATION IN YOUR LANGUAGE	NOTES BY TRANSLATOR (IF NECESSARY)

export function parseDoc2Part1(tsv: string): RowData[] {
  // Remove lines in comments by finding new lines in "" blocks
  const text = tsv.replace(/"([^"\t]|"")*"/g, (match) => match.replace(/\n/g, ' '));
  const lines = text.split('\n').slice(1); // Remove header

  const rows: RowData[] = [];

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

export function parseDoc2Part3(tsv: string): RowData[] {
  // Remove lines in comments by finding new lines in "" blocks
  const text = tsv.replace(/"([^"\t]|"")*"/g, (match) => match.replace(/\n/g, ' '));
  const lines = text.split('\n');

  let section: Section2_3 | '' = '';
  const rows: RowData[] = [];

  lines.forEach((line) => {
    const fields = line.split('\t');
    if (Object.values(Section2_3).includes(fields[0] as Section2_3)) {
      section = fields[0] as Section2_3;
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
      default:
        break;
    }
  });
  return rows;
}
