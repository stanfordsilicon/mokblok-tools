import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import { SourceLanguage, type DataEntry } from '@data/DataTypes';

import { useURLParams } from '@settings/URLParams';

import { getFraktur } from '@shared/stringUtils';

import { getDateString } from './DateString';

type Props = {
  entry?: DataEntry;
  style?: React.CSSProperties;
  convertPatternToExample?: boolean;
};
function SourceDataCell({ entry, style, convertPatternToExample = true }: Props) {
  const { t } = useTranslation();
  const { getSourceData, findDataEntry } = useDataContext();
  const { sourceLanguage } = useURLParams();
  const sourceData = getSourceData(entry);

  // Make a helper to get source strings so we can convert syntax like "MMM" to "January", etc.
  const getString = useCallback(
    (query: Partial<DataEntry>): string => {
      const dataEntry = findDataEntry(query);
      if (!dataEntry) return '!!!';
      return (
        getSourceData(dataEntry) ||
        (sourceLanguage === SourceLanguage.English ? dataEntry.english : dataEntry.french)
      );
    },
    [findDataEntry, getSourceData, sourceLanguage],
  );

  if (!entry) return <td>{t('common.emptyCell')}</td>;

  let sourceTranslation: string = entry.english;
  if (sourceData) {
    if (entry.exampleNum === '0' || !convertPatternToExample) {
      // It's a direct translation
      sourceTranslation = sourceData;
    } else {
      // It's a pattern, we need to parse it
      const sourcePattern = sourceData;
      sourceTranslation = getDateString({
        formatPattern: sourcePattern,
        getString,
        var1: entry.var1,
        var2: entry.var2,
      });
    }
  }
  // TODO only if sourceTranslation is empty
  if (sourceLanguage === SourceLanguage.French && entry.french) {
    sourceTranslation = entry.french;
  } else if (sourceLanguage === SourceLanguage.EnglishFraktur) {
    sourceTranslation = getFraktur(entry.english);
  }

  // Convert newline chars to new blocks
  if (sourceTranslation.includes('\\n')) {
    return (
      <td>
        <div style={style}>
          {sourceTranslation.split('\\n').map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      </td>
    );
  }

  return (
    <td>
      <div style={style}>{sourceTranslation}</div>
    </td>
  );
}

export default SourceDataCell;
