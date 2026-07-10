import { useURLParams } from '@settings/URLParams';

import { useDataContext } from './DataContext';

import type { DataField } from './DataTypes';

function getSourcePattern(entry: DataField): string {
  const { sourceLanguage } = useURLParams();
  const { getSourceData } = useDataContext();

  // Attempt to get the source pattern from the CLDR XML
  if (entry.exampleNum !== '0') {
    const sourcePattern = getSourceData(entry);
    if (sourcePattern) return sourcePattern;
  }
  return sourceLanguage === 'en' ? entry.englishPattern : entry.frenchPattern;
}

export default getSourcePattern;
