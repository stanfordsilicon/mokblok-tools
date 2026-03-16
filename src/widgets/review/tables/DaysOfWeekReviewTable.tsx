import { useDataContext } from '@data/DataContext';
import { FormatLength } from '@data/DataTypes';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import Demo from '../demos/Demo';
import DemoID from '../demos/DemoID';
import FormatWidth from '../FormatWidth';
import { getSourceLanguageData } from '../getSourceLanguageData';

function DaysOfWeekReviewTable() {
  const { daysOfWeekData } = useDataContext();
  return (
    <div>
      <h3>Days of the Week</h3>
      <div style={{ display: 'flex', gap: '1em', flexDirection: 'row' }}>
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
            {daysOfWeekData.map((day, index) => (
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
        <Demo demoID={DemoID.DaysOfWeekInWeek} title="Days of Week in Week" />
        <Demo demoID={DemoID.DaysOfWeekInMonth} title="Days of Week in Month" />
      </div>
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
        style={{ width: FormatWidth[format] }}
      />
    </td>
  );
}

export default DaysOfWeekReviewTable;
