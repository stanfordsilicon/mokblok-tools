export type NumberingSystem = {
  code: string;
  name: string;
  version: string;
  method: string;
  digits: string;
  rulesReference: string;
};

export function loadNumberingSystems(): Promise<Record<string, NumberingSystem>> {
  return fetch('/numberingSystems.tsv')
    .then((response) => response.text())
    .then((text) => {
      const lines = text.trim().split('\n').slice(2); // Skip header lines
      const result: Record<string, NumberingSystem> = {};
      lines.forEach((line) => {
        const fields = line.split('\t');
        result[fields[0]] = {
          code: fields[0],
          name: fields[1],
          version: fields[2],
          method: fields[3],
          digits: fields[4],
          rulesReference: fields[5],
        } as NumberingSystem;
      });
      return result;
    });
}
