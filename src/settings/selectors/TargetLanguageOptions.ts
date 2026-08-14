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

export default TargetLanguageOptions;
