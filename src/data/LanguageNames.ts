export type LanguageNameData = {
  code: string;
  standardName: string;
  localizedName?: string;
  endonym: string;
};

export async function loadLanguageNames(): Promise<Record<string, LanguageNameData>> {
  return fetch('/languageNames.tsv')
    .then((response) => response.text())
    .then((text) => {
      const lines = text.trim().split('\n').slice(1); // Skip header lines
      const result: Record<string, LanguageNameData> = {};
      lines.forEach((line) => {
        const fields = line.split('\t');
        result[fields[0]] = {
          code: fields[0],
          standardName: fields[1],
          endonym: fields[2],
        } as LanguageNameData;
      });
      return result;
    });
}
