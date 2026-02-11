import { useDataContext } from '@data/DataContext';
import { SourceLanguage } from '@data/DataTypes';

import Demo from './demos/Demo';
import DemoID from './demos/DemoID';
import { getSourceLanguageData } from './getSourceLanguageData';

function MonthsReviewTable({ sourceLanguage }: { sourceLanguage: SourceLanguage }) {
  const { monthsData } = useDataContext();
  return (
    <div>
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
                <td>{getSourceLanguageData(month.wide, sourceLanguage)}</td>
                <td>{getSourceLanguageData(month.abbreviated, sourceLanguage)}</td>
                <td>{getSourceLanguageData(month.narrow, sourceLanguage)}</td>
                <td>{month.wide?.translated}</td>
                <td>{month.abbreviated?.translated}</td>
                <td>{month.narrow?.translated}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Demo demoID={DemoID.MonthsGrid} title="Abbreviated Months in Grid" />
        <Demo demoID={DemoID.MonthsShort} title="Narrow Months in a Chart" />
      </div>
    </div>
  );
}

export default MonthsReviewTable;
