import { SourceLanguage, type DataField } from '@data/DataTypes';

import { useSettings } from '@settings/Settings';

import { getFraktur } from '@shared/stringUtils';

type Props = {
  data?: DataField;
  style?: React.CSSProperties;
};
function SourceDataCell({ data, style }: Props) {
  const { sourceLanguage } = useSettings();
  if (!data) return <td>-</td>;

  let sourceTranslation = data.english;
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
