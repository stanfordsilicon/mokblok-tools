import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import { SourceLanguage, type DataField } from '@data/DataTypes';

import { useURLParams } from '@settings/URLParams';

import { getFraktur } from '@shared/stringUtils';

type Props = {
  data?: DataField;
  style?: React.CSSProperties;
};
function SourceDataCell({ data, style }: Props) {
  const { t } = useTranslation();
  const { getSourceData } = useDataContext();
  const { sourceLanguage } = useURLParams();
  if (!data) return <td>{t('common.emptyCell')}</td>;

  let sourceTranslation = data.english;
  if (data.exampleNum === '0') {
    // Can only get Direct translations (exampleNum=0) for now
    const sourceData = getSourceData(data);
    if (sourceData) sourceTranslation = sourceData;
  }
  if (sourceLanguage === SourceLanguage.French && data.french) {
    sourceTranslation = data.french;
  } else if (sourceLanguage === SourceLanguage.EnglishFraktur) {
    sourceTranslation = getFraktur(data.english);
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
