import { useDataContext } from '@data/DataContext';
import { FormatLength } from '@data/DataTypes';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import FormatWidth from '../FormatWidth';
import { getSourceLanguageData } from '../getSourceLanguageData';

function DaysOfWeekReviewTable() {
  const { daysOfWeek } = useDataContext().data;
  return (
    <table style={{ height: 'fit-content' }}>
      <thead>
        <tr>
          <th colSpan={4} style={{ textAlign: 'center' }}>
            <SourceLanguageLabel />
          </th>
          <th colSpan={4} style={{ textAlign: 'center' }}>
            Translated
          </th>
        </tr>
        <tr>
          <th>Wide</th>
          <th title="Abbreviated">Abbr.</th>
          <th>Short</th>
          <th>Narrow</th>
          <th>Wide</th>
          <th title="Abbreviated">Abbr.</th>
          <th>Short</th>
          <th>Narrow</th>
        </tr>
      </thead>
      <tbody>
        {daysOfWeek?.map((day, index) => (
          <tr key={index}>
            {/* Source Language */}
            <td>{getSourceLanguageData(day[FormatLength.Wide])}</td>
            <td>{getSourceLanguageData(day[FormatLength.Abbreviated])}</td>
            <td>{getSourceLanguageData(day[FormatLength.Short])}</td>
            <td>{getSourceLanguageData(day[FormatLength.Narrow])}</td>
            {/* Target Language (editable) */}
            <InputCell index={index} format={FormatLength.Wide} />
            <InputCell index={index} format={FormatLength.Abbreviated} />
            <InputCell index={index} format={FormatLength.Short} />
            <InputCell index={index} format={FormatLength.Narrow} />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

type InputCellProps = { index: number; format: FormatLength };
function InputCell({ index, format }: InputCellProps) {
  const {
    data: { daysOfWeek },
    set,
  } = useDataContext();
  return (
    <td>
      <input
        value={daysOfWeek?.[index]?.[format]?.translated || ''}
        onChange={(e) => set.daysOfWeek(index, format, e.target.value)}
        style={{ width: FormatWidth[format] }}
      />
    </td>
  );
}

export default DaysOfWeekReviewTable;
