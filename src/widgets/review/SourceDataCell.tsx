import { SourceLanguage, type DataField } from '@data/DataTypes';

import { useSettings } from '@settings/Settings';

type Props = {
  data?: DataField;
  style?: React.CSSProperties;
};
function SourceDataCell({ data, style }: Props) {
  const { sourceLanguage } = useSettings();
  if (!data) return <td>-</td>;

  const sourceTranslation = sourceLanguage === SourceLanguage.English ? data.english : data.french;
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
