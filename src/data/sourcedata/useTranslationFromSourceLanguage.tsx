import { useCallback } from 'react';

import { useSourceDataContext } from '@data/SourceDataProvider';

import { useURLParams } from '@settings/URLParams';

import { getFraktur } from '@shared/stringUtils';

import { SourceLanguage, type DataEntry } from '../DataTypes';

import getTranslationFromSourceLanguage from './getTranslationFromSourceLanguage';

function useTranslationFromSourceLanguage() {
  const { sourceLanguage } = useURLParams();
  const { findDataEntry, getSourceData } = useSourceDataContext();

  // Make a helper to get source strings so we can convert syntax like "MMM" to "January", etc.
  const getInnerString = useCallback(
    (query: Partial<DataEntry>): string => {
      const dataEntry = findDataEntry(query);
      if (!dataEntry) return '!!!';
      const sourceData = getSourceData(dataEntry);
      if (sourceLanguage === SourceLanguage.EnglishFraktur && sourceData)
        return getFraktur(sourceData);
      if (sourceData) return sourceData;
      if (sourceLanguage === SourceLanguage.EnglishFraktur) return getFraktur(dataEntry.english);
      if (sourceLanguage === SourceLanguage.French) return dataEntry.french;
      return dataEntry.english;
    },
    [findDataEntry, getSourceData, sourceLanguage],
  );

  return useCallback(
    (entry: DataEntry) =>
      getTranslationFromSourceLanguage({
        entry,
        getSourceData,
        getInnerString,
        sourceLanguage,
      }),
    [getSourceData, getInnerString, sourceLanguage],
  );
}
export default useTranslationFromSourceLanguage;
