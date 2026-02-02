import type { InputLine } from './InputDataTypes';

export async function loadInputText(filePath: string): Promise<InputLine[] | void> {
  return await fetch(filePath)
    .then((res) => res.text())
    .catch((err) => console.error('Error loading TSV:', err));
}

export function parseInputTSV(tsv: string): InputLine[] {
  return tsv.split('\n').map((line) => {
    const [english, french, translated, example, notes, xpath, ext_id] = line.split('\t');
    return { english, french, translated, example, notes, xpath, ext_id };
  });
}

export function getInputDictionary(data: InputLine[]): Record<string, InputLine> {
  const dict: Record<string, InputLine> = {};
  data.forEach((item) => {
    dict[item.xpath || item.ext_id] = item;
  });
  return dict;
}
