import { SubmissionField, type RowData } from './DataTypes';

export async function loadInputText(filePath: string): Promise<string | void> {
  return await fetch(filePath)
    .then((res) => res.text())
    .catch((err) => console.error('Error loading TSV:', err));
}

export function parseInputTSV(tsv: string): RowData[] {
  // Remove lines in comments by finding new lines in "" blocks
  const text = tsv.replace(/"([^"\t]|"")*"/g, (match) => match.replace(/\n/g, ' '));
  const lines = text.split('\n');

  // Find the columns with the ext_ID and xpath data
  const indices = getColumnIndices(lines);
  if (!indices) return [];
  const maxIndex = Math.max(...Object.values(indices))!;

  return lines
    .map((line) => {
      if (line.trim() === '') return null; // Skip empty lines
      const cells = line.split('\t').map((cell) => cell.trim());
      if (cells.length <= maxIndex) {
        // console.warn('Skipping line with insufficient columns:', line);
        return null; // Skip lines that don't have enough columns
      }
      const english = cells[indices[SubmissionField.English]];
      const french = cells[indices[SubmissionField.French]];
      const translated = cells[indices[SubmissionField.Translated]];
      const notes = cells[indices[SubmissionField.Notes]];
      const ext_id = cells[indices[SubmissionField.ExtId]];
      const xpath = cells[indices[SubmissionField.XPath]];
      const key = ext_id || xpath;
      if (!key) {
        console.warn('Skipping line with missing key (ext_id/xpath):', line);
        return null; // Skip lines that don't match known keys
      }
      return { english, french, translated, notes, key };
    })
    .filter((row) => row != null); // Filter out nulls
}

function getColumnIndices(lines: string[]): Record<SubmissionField, number> | null {
  const indices: Partial<Record<SubmissionField, number>> = {};
  lines.forEach((line) => {
    const cells = line.split('\t').map((cell) => cell.trim().toLowerCase());
    cells.forEach((cell, index) => {
      if (cell.startsWith('english')) indices[SubmissionField.English] = index;
      else if (cell.startsWith('ext_id')) indices[SubmissionField.ExtId] = index;
      else if (cell.startsWith('xpath')) indices[SubmissionField.XPath] = index;
      else if (cell.startsWith('translated') || cell.startsWith('translation'))
        indices[SubmissionField.Translated] = index;
      else if (cell.startsWith('french')) indices[SubmissionField.French] = index;
      else if (cell.startsWith('notes')) indices[SubmissionField.Notes] = index;
    });
  });
  const undefinedFields = Object.values(SubmissionField).filter(
    (field) => indices[field] === undefined,
  );
  if (undefinedFields.length > 0) {
    console.warn('Could not find necessary columns in TSV data:', undefinedFields);
    return null;
  }
  return indices as Record<SubmissionField, number>;
}
