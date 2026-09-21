import ImportSource from '@data/ImportSource';

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

/** TSV availability comes from the authorized backend catalog. */
export function getPotentialTargetLanguageOptions(
  importSource: ImportSource,
  tsvLanguages: readonly string[] = [],
): string[] {
  if (importSource === ImportSource.TSV) return ['und', ...tsvLanguages];
  const languages =
    importSource === ImportSource.XML
      ? PreloadableXMLLanguages
      : [...tsvLanguages, ...PreloadableXMLLanguages];
  return [...new Set(['und', ...languages])];
}

export function supportsTargetLanguage(
  importSource: ImportSource,
  targetLanguage: string | null | undefined,
  tsvLanguages: readonly string[] = [],
): boolean {
  if (targetLanguage == null) return false;
  if (importSource === ImportSource.Blank) return true;
  return getPotentialTargetLanguageOptions(importSource, tsvLanguages).includes(targetLanguage);
}
