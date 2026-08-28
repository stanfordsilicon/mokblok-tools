import ImportSource from '@data/ImportSource';

// These languages have starting data that can be loaded with a click.
export const PreloadableTSVLanguages = [
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
export const PreloadableXMLLanguages = [
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
  'pt',
  'sn',
  'wo',
  'hr',
  'sr-Latn',
  'sr',
  'bs',
];

const TargetLanguageOptions: Record<ImportSource, string[]> = {
  [ImportSource.TSV]: PreloadableTSVLanguages,
  [ImportSource.XML]: PreloadableXMLLanguages,
  [ImportSource.Blank]: [...new Set([...PreloadableTSVLanguages, ...PreloadableXMLLanguages])],
};

/** Only use this for the full list, really we should follow user settings */
export function getPotentialTargetLanguageOptions(importSource: ImportSource): string[] {
  return [...TargetLanguageOptions[importSource], ''];
}

export function getPreferredImportSourceForTargetLanguage(targetLanguage: string): ImportSource {
  if (!targetLanguage) return ImportSource.Blank;
  if (PreloadableTSVLanguages.includes(targetLanguage)) return ImportSource.TSV;
  if (PreloadableXMLLanguages.includes(targetLanguage)) return ImportSource.XML;
  return ImportSource.Blank;
}

export function supportsTargetLanguage(
  importSource: ImportSource,
  targetLanguage: string | null | undefined,
): boolean {
  if (targetLanguage == null) return false;
  if (importSource === ImportSource.Blank) return true;
  return TargetLanguageOptions[importSource].includes(targetLanguage);
}

export default TargetLanguageOptions;
