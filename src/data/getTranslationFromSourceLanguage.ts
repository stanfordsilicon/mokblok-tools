import { getFraktur } from '@shared/stringUtils';

import { SourceLanguage, type DataEntry } from './DataTypes';
import { getDateString } from './DateString';

type getTranslationFromSourceLanguageParams = {
  entry: DataEntry;
  getSourceData: (entry: DataEntry | undefined) => string | undefined;
  getInnerString: (query: Partial<DataEntry>) => string;
  sourceLanguage: SourceLanguage;
};

// Returns a string or a tuple if it comes from a pattern
function getTranslationFromSourceLanguage({
  entry,
  getSourceData,
  getInnerString,
  sourceLanguage,
}: getTranslationFromSourceLanguageParams): string | [string, string] {
  const sourceData = getSourceData(entry);

  if (sourceData) {
    if (!entry.exampleNum || entry.exampleNum === '0') {
      // It's a direct translation
      if (sourceLanguage === SourceLanguage.EnglishFraktur) return getFraktur(sourceData);
      return sourceData;
    } else {
      // It's a pattern, we need to parse it
      const sourcePattern = sourceData;
      if (sourcePattern.includes('{0}')) {
        // substitute tokens
        let value = sourcePattern.replace('{0}', entry.var1?.toLocaleString(sourceLanguage) || '');
        if (sourcePattern.includes('{1}'))
          value = value.replace('{1}', entry.var2?.toLocaleString(sourceLanguage) || '');
        return [value, sourcePattern];
      } else {
        // Attempt to parse a date format
        const formattedDateTime = getDateString({
          formatPattern: sourcePattern,
          getInnerString,
          var1: entry.var1,
          var2: entry.var2,
        });
        return [formattedDateTime, sourcePattern];
      }
    }
  }

  // Fallback to the old values checking the entry
  if (sourceLanguage === SourceLanguage.French && entry.french) {
    return entry.french;
  } else if (sourceLanguage === SourceLanguage.EnglishFraktur) {
    return getFraktur(entry.english);
  }
  return entry.english;
}

export default getTranslationFromSourceLanguage;
