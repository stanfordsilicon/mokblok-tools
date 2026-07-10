import { SourceLanguage, type RowData } from '@data/DataTypes';

import { useURLParams } from '@settings/URLParams';

export function getSourceLanguageData(row: RowData | undefined): string {
  const { sourceLanguage } = useURLParams();
  if (!row) return '';
  return sourceLanguage === SourceLanguage.English ? row.english : (row.french ?? '');
}
