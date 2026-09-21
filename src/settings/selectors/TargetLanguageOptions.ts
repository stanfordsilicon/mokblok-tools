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
  const languages =
    importSource === ImportSource.TSV
      ? tsvLanguages
      : importSource === ImportSource.XML
        ? PreloadableXMLLanguages
        : [...tsvLanguages, ...PreloadableXMLLanguages];
  return [...new Set(['und', ...languages])];
}

export function getPreferredImportSourceForTargetLanguage(
  targetLanguage: string,
  tsvLanguages: readonly string[] = [],
): ImportSource {
  if (targetLanguage === 'und') return ImportSource.Blank;
  if (tsvLanguages.includes(targetLanguage.toLowerCase())) return ImportSource.TSV;
  if (PreloadableXMLLanguages.includes(targetLanguage)) return ImportSource.XML;
  return ImportSource.Blank;
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
