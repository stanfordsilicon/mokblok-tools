import { useDataContext } from '@data/DataContext';
import { DateField, FormatLength } from '@data/DataTypes';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import Demo from '../demos/Demo';
import DemoID from '../demos/DemoID';
import FormatWidth from '../FormatWidth';
import { getSourceLanguageData } from '../getSourceLanguageData';

const DateFieldsReviewTable: React.FC = () => {
  const { dateFields } = useDataContext().data;
  return (
    <div>
      <h3>Date Fields</h3>
      <div style={{ display: 'flex', gap: '1em', flexDirection: 'row' }}>
        <table>
          <thead>
            <tr>
              <th colSpan={3} style={{ textAlign: 'center' }}>
                <SourceLanguageLabel />
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
            {Object.entries(dateFields ?? {}).map(([fieldKey, fieldData]) => (
              <tr key={fieldKey}>
                {/* Source Language */}
                <td>{getSourceLanguageData(fieldData.wide)}</td>
                <td>{getSourceLanguageData(fieldData.short)}</td>
                <td>{getSourceLanguageData(fieldData.narrow)}</td>
                {/* Target Language (editable) */}
                <InputCell field={fieldKey as DateField} format={FormatLength.Wide} />
                <InputCell field={fieldKey as DateField} format={FormatLength.Short} />
                <InputCell field={fieldKey as DateField} format={FormatLength.Narrow} />
              </tr>
            ))}
          </tbody>
        </table>
        <Demo demoID={DemoID.DateFieldBreakdown} title="Date Field Breakdown" />
      </div>
    </div>
  );
};

type InputCellProps = { field: DateField; format: FormatLength };
function InputCell({ field, format }: InputCellProps) {
  const {
    data: { dateFields },
    set,
  } = useDataContext();
  return (
    <td>
      <input
        value={dateFields?.[field]?.[format]?.translated || ''}
        onChange={(e) => set.dateFields(field, format, e.target.value)}
        style={{ width: FormatWidth[format] }}
        disabled={!dateFields?.[field]?.[format]} // Disable if this format doesn't exist for the field
      />
    </td>
  );
}

export default DateFieldsReviewTable;
