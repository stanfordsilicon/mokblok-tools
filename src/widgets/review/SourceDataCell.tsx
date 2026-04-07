import { SourceLanguage, type DataField } from '@data/DataTypes';

import { useSettings } from '@settings/Settings';

type Props = {
  data: DataField;
};
function SourceDataCell({ data }: Props) {
  const { sourceLanguage } = useSettings();
  return <td>{sourceLanguage === SourceLanguage.English ? data.english : data.french}</td>;
}

export default SourceDataCell;
