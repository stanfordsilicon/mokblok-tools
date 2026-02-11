import { useDataContext } from '@data/DataContext';
import { FormatLength, SourceLanguage } from '@data/DataTypes';

import { useSettings } from '@settings/Settings';

import { getSourceLanguageData } from './getSourceLanguageData';

function DaysOfWeekReviewTable() {
  const { sourceLanguage } = useSettings();
  const { daysOfWeekData } = useDataContext();
  return (
    <div>
      <h3>Days of the Week</h3>
      <table>
        <thead>
          <tr>
            <th colSpan={4} style={{ textAlign: 'center' }}>
              {Object.entries(SourceLanguage).find(([, value]) => value === sourceLanguage)?.[0]}
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
          {daysOfWeekData.map((day, index) => (
            <tr key={index}>
              {/* Source Language */}
              <td>{getSourceLanguageData(day[FormatLength.Wide], sourceLanguage)}</td>
              <td>{getSourceLanguageData(day[FormatLength.Abbreviated], sourceLanguage)}</td>
              <td>{getSourceLanguageData(day[FormatLength.Short], sourceLanguage)}</td>
              <td>{getSourceLanguageData(day[FormatLength.Narrow], sourceLanguage)}</td>
              {/* Target Language (editable) */}
              <InputCell index={index} format={FormatLength.Wide} />
              <InputCell index={index} format={FormatLength.Abbreviated} />
              <InputCell index={index} format={FormatLength.Short} />
              <InputCell index={index} format={FormatLength.Narrow} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type InputCellProps = { index: number; format: FormatLength };
function InputCell({ index, format }: InputCellProps) {
  const { daysOfWeekData, setDayOfWeekTranslation } = useDataContext();
  return (
    <td>
      <input
        value={daysOfWeekData[index]?.[format]?.translated || ''}
        onChange={(e) => setDayOfWeekTranslation(index, format, e.target.value)}
        style={{ width: '3em' }}
      />
    </td>
  );
}

export default DaysOfWeekReviewTable;
