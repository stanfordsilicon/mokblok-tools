import { SourceLanguage, type RowData } from '../data/DataTypes';

export function getSourceLanguageData(
  row: RowData | undefined,
  sourceLanguage: SourceLanguage,
): string {
  if (!row) return '';
  return sourceLanguage === SourceLanguage.English ? row.english : row.french;
}
