import ImportSource from '@data/ImportSource';

// These languages have starting data that can be loaded with a click.
const TSVLanguages = [
  'abr',
  'ann',
  'bho',
  'dag',
  'en',
  'fr',
  'gaa',
  'ha',
  'mfe',
  'mg',
  'mos',
  'nd',
  'om',
  'sn',
  'wo',
];
const XMLLanguages = [
  'ann',
  'en',
  'es',
  'fr',
  'ha',
  'it',
  'mfe',
  'mg',
  'mos',
  'nd',
  'om',
  'or',
  'sn',
  'wo',
];

const TargetLanguageOptions: Record<ImportSource, string[]> = {
  [ImportSource.TSV]: TSVLanguages,
  [ImportSource.XML]: XMLLanguages,
  [ImportSource.Blank]: [...new Set([...TSVLanguages, ...XMLLanguages])],
};

export function getTargetLanguageOptions(
  importSource: ImportSource,
  scopedLanguages?: readonly string[] | null,
): string[] {
  if (!scopedLanguages || scopedLanguages.length === 0) return TargetLanguageOptions[importSource];
  return TargetLanguageOptions[importSource].filter((code) => scopedLanguages.includes(code));
}

export function preferredImportSourceForTargetLanguage(targetLanguage: string): ImportSource {
  if (TSVLanguages.includes(targetLanguage)) return ImportSource.TSV;
  if (XMLLanguages.includes(targetLanguage)) return ImportSource.XML;
  return ImportSource.Blank;
}

export function supportsTargetLanguage(
  importSource: ImportSource,
  targetLanguage: string | null | undefined,
): boolean {
  if (!targetLanguage) return false;
  if (importSource === ImportSource.Blank) return true;
  return TargetLanguageOptions[importSource].includes(targetLanguage);
}

export default TargetLanguageOptions;
