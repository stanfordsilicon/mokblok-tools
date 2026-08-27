import { PatternFormat } from '@data/PatternFormat';

import { getFraktur } from '@shared/stringUtils';

import { type DataEntry } from '../DataTypes';
import { getDateString } from '../DateString';

type getTranslationFromSourceLanguageParams = {
  entry: DataEntry;
  getSourceData: (entry: DataEntry | undefined) => string | undefined;
  getInnerString: (query: Partial<DataEntry>) => string;
  sourceLanguage: string;
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
      if (sourceLanguage === 'en-Latf') return getFraktur(sourceData);
      return sourceData;
    } else {
      // It's a pattern, we need to parse it
      const sourcePattern = sourceData;
      if (entry.patternFormat === PatternFormat.Substitution) {
        // substitute tokens
        let value = sourcePattern.replace('{0}', entry.var1?.toLocaleString(sourceLanguage) || '');
        if (sourcePattern.includes('{1}'))
          value = value.replace('{1}', entry.var2?.toLocaleString(sourceLanguage) || '');
        return [value, sourcePattern];
      } else if (entry.patternFormat === PatternFormat.DateTime) {
        // Attempt to parse a date format
        const formattedDateTime = getDateString({
          formatPattern: sourcePattern,
          getInnerString,
          var1: entry.var1,
          var2: entry.var2,
        });
        return [formattedDateTime, sourcePattern];
      }
      return [sourcePattern, sourcePattern];
    }
  }

  // Fallback to the old values checking the entry
  if (sourceLanguage === 'fr' && entry.french) {
    return entry.french;
  } else if (sourceLanguage === 'en-Latf') {
    return getFraktur(entry.english);
  }
  return entry.english;
}

export default getTranslationFromSourceLanguage;
