import { SourceLanguage, type DataField } from '@data/DataTypes';

import { useSettings } from '@settings/Settings';

type Props = {
  data?: DataField;
  style?: React.CSSProperties;
};
function SourceDataCell({ data, style }: Props) {
  const { sourceLanguage } = useSettings();
  if (!data) return <td>-</td>;
  return (
    <td>
      <div style={style}>
        {sourceLanguage === SourceLanguage.English ? data.english : data.french}
      </div>
    </td>
  );
}

export default SourceDataCell;
