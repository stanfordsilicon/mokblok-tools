// Convert to 2-letter code if possible
// TODO get these from a more comprehensive source
export function getLanguageBCP(targetLanguage: string): string {
  if (targetLanguage === 'eng') return 'en';
  if (targetLanguage === 'fra') return 'fr';
  if (targetLanguage === 'mlg') return 'mg';
  if (targetLanguage === 'tsn') return 'tn';
  if (targetLanguage === 'tgk') return 'tg';
  if (targetLanguage === 'tso') return 'ts';
  if (targetLanguage === 'ven') return 've';
  if (targetLanguage === 'wol') return 'wo';
  if (targetLanguage === 'ful') return 'ff';
  if (targetLanguage === 'sna') return 'sn';
  if (targetLanguage === 'nde') return 'nd';
  if (targetLanguage === 'kin') return 'rw';
  if (targetLanguage === 'aar') return 'aa';
  if (targetLanguage === 'hau') return 'ha';
  if (targetLanguage === 'ltz') return 'lb';
  if (targetLanguage === 'fao') return 'fo';
  if (targetLanguage === 'mon') return 'mn';
  if (targetLanguage === 'sag') return 'sg';
  if (targetLanguage === 'ssw') return 'ss';
  if (targetLanguage === 'bos') return 'bs';
  if (targetLanguage === 'aka') return 'ak';
  if (targetLanguage === 'uzb') return 'uz';
  if (targetLanguage === 'mlt') return 'mt';
  if (targetLanguage === 'aze') return 'az';
  return targetLanguage;
}
