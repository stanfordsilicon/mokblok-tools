import { SourceLanguage } from '@data/DataTypes';
import type { TSVRowData } from '@data/tsvdocs/TSVRowData';

import { useURLParams } from '@settings/URLParams';

export function getSourceLanguageData(row: TSVRowData | undefined): string {
  const { sourceLanguage } = useURLParams();
  if (!row) return '';
  return sourceLanguage === SourceLanguage.English ? row.english : (row.french ?? '');
}
