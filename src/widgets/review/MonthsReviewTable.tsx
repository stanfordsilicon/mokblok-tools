import { useDataContext } from '@data/DataContext';
import { FormatLength, SourceLanguage } from '@data/DataTypes';

import { useSettings } from '@settings/Settings';

import Demo from './demos/Demo';
import DemoID from './demos/DemoID';
import FormatWidth from './FormatWidth';
import { getSourceLanguageData } from './getSourceLanguageData';

function MonthsReviewTable() {
  const { sourceLanguage } = useSettings();
  const { monthsData } = useDataContext();
  const { today, setToday } = useSettings();

  return (
    <div>
      <div>
        Set today (using browser date picker):{' '}
        <input
          type="date"
          value={today.toISOString().split('T')[0]}
          onChange={(e) => {
            if (e.target.value === '') return;
            const date = new Date(e.target.value);
            setToday(date);
          }}
        />
      </div>
      <h3>Months</h3>
      <div style={{ display: 'flex', gap: '1em', flexDirection: 'row' }}>
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
              <th title="Abbreviated">Abbr.</th>
              <th>Narrow</th>
              <th>Wide</th>
              <th title="Abbreviated">Abbr.</th>
              <th>Narrow</th>
            </tr>
          </thead>
          <tbody>
            {monthsData.map((month, index) => (
              <tr key={index}>
                {/* Source Language */}
                <td>{getSourceLanguageData(month[FormatLength.Wide], sourceLanguage)}</td>
                <td>{getSourceLanguageData(month[FormatLength.Abbreviated], sourceLanguage)}</td>
                <td>{getSourceLanguageData(month[FormatLength.Narrow], sourceLanguage)}</td>
                {/* Target Language (editable) */}
                <InputCell index={index} format={FormatLength.Wide} />
                <InputCell index={index} format={FormatLength.Abbreviated} />
                <InputCell index={index} format={FormatLength.Narrow} />
              </tr>
            ))}
          </tbody>
        </table>

        <Demo demoID={DemoID.MonthsGrid} title="Months in a Grid" />
        <Demo demoID={DemoID.MonthsTemp} title="Monthly Temperature" />
      </div>
    </div>
  );
}

type InputCellProps = { index: number; format: FormatLength };
function InputCell({ index, format }: InputCellProps) {
  const { monthsData, setMonthTranslation } = useDataContext();
  return (
    <td>
      <input
        value={monthsData[index]?.[format]?.translated || ''}
        onChange={(e) => setMonthTranslation(index, format, e.target.value)}
        style={{ width: FormatWidth[format] }}
      />
    </td>
  );
}

export default MonthsReviewTable;
