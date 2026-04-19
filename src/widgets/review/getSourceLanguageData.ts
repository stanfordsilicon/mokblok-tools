import { SourceLanguage, type RowData } from '@data/DataTypes';

import { useSettings } from '@settings/Settings';

export function getSourceLanguageData(row: RowData | undefined): string {
  const { sourceLanguage } = useSettings();
  if (!row) return '';
  return sourceLanguage === SourceLanguage.English ? row.english : (row.french ?? '');
}
