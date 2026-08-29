export type LanguageNameData = {
  code: string;
  endonym: string;
  en: string;
  fr: string;
  it: string;
  es: string;
  pt: string;
  localized: string;
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
          endonym: fields[1],
          en: fields[2],
          fr: fields[3],
          it: fields[4],
          es: fields[5],
          pt: fields[6],
          localized: fields[2], // starts as English but will be matched to the UI later
        } as LanguageNameData;
      });
      return result;
    });
}
