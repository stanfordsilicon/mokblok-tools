import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import { SourceLanguage, type DataEntry } from '@data/DataTypes';

import { useURLParams } from '@settings/URLParams';

import { getFraktur } from '@shared/stringUtils';

type Props = {
  entry?: DataEntry;
  style?: React.CSSProperties;
};
function SourceDataCell({ entry, style }: Props) {
  const { t } = useTranslation();
  const { getSourceData } = useDataContext();
  const { sourceLanguage } = useURLParams();
  if (!entry) return <td>{t('common.emptyCell')}</td>;

  let sourceTranslation = entry.english;
  if (entry.exampleNum === '0') {
    // Can only get Direct translations (exampleNum=0) for now
    const sourceData = getSourceData(entry);
    if (sourceData) sourceTranslation = sourceData;
  }
  if (sourceLanguage === SourceLanguage.French && entry.french) {
    sourceTranslation = entry.french;
  } else if (sourceLanguage === SourceLanguage.EnglishFraktur) {
    sourceTranslation = getFraktur(entry.english);
  }

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
