import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import { SourceLanguage, type DataEntry } from '@data/DataTypes';
import getTranslationFromSourceLanguage from '@data/getTranslationFromSourceLanguage';

import { useURLParams } from '@settings/URLParams';

import { getFraktur } from '@shared/stringUtils';

import DebugHovercard from './DebugHovercard';

type Props = {
  entry?: DataEntry;
  style?: React.CSSProperties;
  convertPatternToExample?: boolean;
};
function SourceDataCell({ entry, style, convertPatternToExample = true }: Props) {
  const { t } = useTranslation();
  const { getSourceData, findDataEntry } = useDataContext();
  const { sourceLanguage } = useURLParams();

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

  if (!entry) return <td>{t('common.emptyCell')}</td>;

  const sourceTranslation = getTranslationFromSourceLanguage({
    entry,
    getSourceData,
    getInnerString,
    sourceLanguage,
  });

  return (
    <td className="Cell" tabIndex={0}>
      <div className="Cell__content" style={style}>
        <NewLineAwareRenderer>
          {typeof sourceTranslation === 'string'
            ? sourceTranslation
            : sourceTranslation[convertPatternToExample ? '0' : '1']}
        </NewLineAwareRenderer>
      </div>

      <DebugHovercard entry={entry} sourceTranslation={sourceTranslation} />
    </td>
  );
}

// Convert newline chars to new blocks
const NewLineAwareRenderer: React.FC<React.PropsWithChildren> = ({ children }) => {
  if (typeof children === 'string' && children.includes('\\n')) {
    return (
      <>
        {children.split('\\n').map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </>
    );
  }
  return <>{children}</>;
};

export default SourceDataCell;
