import type { RowData } from './DataTypes';

export async function loadInputText(filePath: string): Promise<string | void> {
  return await fetch(filePath)
    .then((res) => res.text())
    .catch((err) => console.error('Error loading TSV:', err));
}

export function parseInputTSV(tsv: string): RowData[] {
  return tsv.split('\n').map((line) => {
    const [english, french, translated, example, notes, xpath, ext_id] = line
      .split('\t')
      .map((cell) => cell.trim());
    return { english, french, translated, example, notes, xpath, ext_id };
  });
}

export function getInputDictionary(data: RowData[]): Record<string, RowData> {
  const dict: Record<string, RowData> = {};
  data.forEach((item) => {
    dict[item.xpath || item.ext_id] = item;
  });
  return dict;
}
