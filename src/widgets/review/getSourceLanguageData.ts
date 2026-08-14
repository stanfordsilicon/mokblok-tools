import { SourceLanguage } from '@data/DataTypes';
import type { WorksheetRowData } from '@data/worksheets/WorksheetRowData';

import { useURLParams } from '@settings/URLParams';

export function useSourceLanguageData(row: WorksheetRowData | undefined): string {
  const { sourceLanguage } = useURLParams();
  if (!row) return '';
  return sourceLanguage === SourceLanguage.English ? row.english : (row.french ?? '');
}
