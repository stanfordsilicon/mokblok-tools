import { useDataContext } from '@data/DataContext';
import { FormatLength } from '@data/DataTypes';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import FormatWidth from '../FormatWidth';
import { getSourceLanguageData } from '../getSourceLanguageData';

function MonthsReviewTable() {
  const { months } = useDataContext().data;

  return (
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
          <th title="Abbreviated">Abbr.</th>
          <th>Narrow</th>
          <th>Wide</th>
          <th title="Abbreviated">Abbr.</th>
          <th>Narrow</th>
        </tr>
      </thead>
      <tbody>
        {months?.map((month, index) => (
          <tr key={index}>
            {/* Source Language */}
            <td>{getSourceLanguageData(month[FormatLength.Wide])}</td>
            <td>{getSourceLanguageData(month[FormatLength.Abbreviated])}</td>
            <td>{getSourceLanguageData(month[FormatLength.Narrow])}</td>
            {/* Target Language (editable) */}
            <InputCell index={index} format={FormatLength.Wide} />
            <InputCell index={index} format={FormatLength.Abbreviated} />
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
    data: { months },
    set,
  } = useDataContext();
  return (
    <td>
      <input
        value={months?.[index]?.[format]?.translated || ''}
        onChange={(e) => set.months(index, format, e.target.value)}
        style={{ width: FormatWidth[format] }}
      />
    </td>
  );
}

export default MonthsReviewTable;
