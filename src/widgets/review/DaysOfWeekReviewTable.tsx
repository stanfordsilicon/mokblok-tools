import { useDataContext } from '@data/DataContext';
import { SourceLanguage } from '@data/DataTypes';

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
              <td>{getSourceLanguageData(day.wide, sourceLanguage)}</td>
              <td>{getSourceLanguageData(day.abbreviated, sourceLanguage)}</td>
              <td>{getSourceLanguageData(day.short, sourceLanguage)}</td>
              <td>{getSourceLanguageData(day.narrow, sourceLanguage)}</td>
              <td>{day.wide?.translated}</td>
              <td>{day.abbreviated?.translated}</td>
              <td>{day.short?.translated}</td>
              <td>{day.narrow?.translated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DaysOfWeekReviewTable;
