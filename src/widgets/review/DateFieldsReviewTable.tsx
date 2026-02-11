import { useDataContext } from '@data/DataContext';
import { DateField, FormatLength, SourceLanguage } from '@data/DataTypes';

import { useSettings } from '@settings/Settings';

import { getSourceLanguageData } from './getSourceLanguageData';

const DateFieldsReviewTable: React.FC = () => {
  const { sourceLanguage } = useSettings();
  const { dateFieldsData } = useDataContext();
  return (
    <div>
      <h3>Date Fields</h3>
      <table>
        <thead>
          <tr>
            <th colSpan={3} style={{ textAlign: 'center' }}>
              {Object.entries(SourceLanguage).find(([, value]) => value === sourceLanguage)?.[0]}
            </th>
            <th colSpan={3} style={{ textAlign: 'center' }}>
              Translated
            </th>
          </tr>
          <tr>
            <th>Wide</th>
            <th>Short</th>
            <th>Narrow</th>
            <th>Wide</th>
            <th>Short</th>
            <th>Narrow</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(dateFieldsData).map(([fieldKey, fieldData]) => (
            <tr key={fieldKey}>
              {/* Source Language */}
              <td>{getSourceLanguageData(fieldData.wide, sourceLanguage)}</td>
              <td>{getSourceLanguageData(fieldData.short, sourceLanguage)}</td>
              <td>{getSourceLanguageData(fieldData.narrow, sourceLanguage)}</td>
              {/* Target Language (editable) */}
              <InputCell field={fieldKey as DateField} format={FormatLength.Wide} />
              <InputCell field={fieldKey as DateField} format={FormatLength.Short} />
              <InputCell field={fieldKey as DateField} format={FormatLength.Narrow} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

type InputCellProps = { field: DateField; format: FormatLength };
function InputCell({ field, format }: InputCellProps) {
  const { dateFieldsData, setDateFieldTranslation } = useDataContext();
  return (
    <td>
      <input
        value={dateFieldsData[field]?.[format]?.translated || ''}
        onChange={(e) => setDateFieldTranslation(field, format, e.target.value)}
        style={{ width: '3em' }}
        disabled={!dateFieldsData[field]?.[format]} // Disable if this format doesn't exist for the field
      />
    </td>
  );
}

export default DateFieldsReviewTable;
