import type { DayOfWeekData, MonthData } from 'src/data/ExtractData';
import { useDataContext } from '../data/DataContext';
import { SourceLanguage, type RowData } from '../data/DataTypes';
import useStoredParams from '../page/useStoredParams';

const ReviewWidget: React.FC = () => {
  const { monthsData, daysOfWeekData } = useDataContext();
  const { value: sourceLanguage, setValue: setSourceLanguage } = useStoredParams<SourceLanguage>(
    'sourceLanguage',
    SourceLanguage.English,
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
        Source language:
        {Object.values(SourceLanguage).map((lang) => (
          <button
            key={lang}
            onClick={() => setSourceLanguage(lang)}
            style={{ fontWeight: lang === sourceLanguage ? 'bold' : 'normal' }}
          >
            {/* Convert ID to a readable name */}
            {Object.entries(SourceLanguage).find(([, value]) => value === lang)?.[0]}
          </button>
        ))}
      </div>
      <MonthsReviewTable sourceLanguage={sourceLanguage} monthsData={monthsData} />
      <DaysOfWeekReviewTable sourceLanguage={sourceLanguage} daysOfWeekData={daysOfWeekData} />
    </div>
  );
};

function getSourceLanguageData(row: RowData | undefined, sourceLanguage: SourceLanguage): string {
  if (!row) return '';
  return sourceLanguage === SourceLanguage.English ? row.english : row.french;
}

function MonthsReviewTable({
  sourceLanguage,
  monthsData,
}: {
  sourceLanguage: SourceLanguage;
  monthsData: MonthData[];
}) {
  return (
    <div>
      <h3>Months</h3>
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
            <th>Long</th>
            <th>Short</th>
            <th>Narrow</th>
            <th>Long</th>
            <th>Short</th>
            <th>Narrow</th>
          </tr>
        </thead>
        <tbody>
          {monthsData.map((month, index) => (
            <tr key={index}>
              <td>{getSourceLanguageData(month.long, sourceLanguage)}</td>
              <td>{getSourceLanguageData(month.short, sourceLanguage)}</td>
              <td>{getSourceLanguageData(month.narrow, sourceLanguage)}</td>
              <td>{month.long?.translated}</td>
              <td>{month.short?.translated}</td>
              <td>{month.narrow?.translated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DaysOfWeekReviewTable({
  sourceLanguage,
  daysOfWeekData,
}: {
  sourceLanguage: SourceLanguage;
  daysOfWeekData: DayOfWeekData[];
}) {
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

export default ReviewWidget;
