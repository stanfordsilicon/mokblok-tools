import { useState } from 'react';
import { useDataContext } from '../data/DataContext';
import { SourceLanguage, type RowData } from '../data/DataTypes';

const ReviewWidget: React.FC = () => {
  const { rowsByExtID } = useDataContext();
  const [sourceLanguage, setSourceLanguage] = useState<SourceLanguage>(SourceLanguage.English);
  const monthsData = getMonthsData(rowsByExtID);

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
          {Array.from({ length: 12 }).map((_, index) => (
            <tr key={index}>
              <td>{getSourceLanguageData(monthsData.long[index], sourceLanguage)}</td>
              <td>{getSourceLanguageData(monthsData.short[index], sourceLanguage)}</td>
              <td>{getSourceLanguageData(monthsData.narrow[index], sourceLanguage)}</td>
              <td>{monthsData.long[index]?.translated}</td>
              <td>{monthsData.short[index]?.translated}</td>
              <td>{monthsData.narrow[index]?.translated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function getSourceLanguageData(row: RowData | undefined, sourceLanguage: SourceLanguage): string {
  if (!row) return '';
  return sourceLanguage === SourceLanguage.English ? row.english : row.french;
}

function getMonthsData(rowsByExtID: Record<string, RowData>): {
  long: RowData[];
  short: RowData[];
  narrow: RowData[];
} {
  return {
    long: [
      rowsByExtID['mw-1_XXX'],
      rowsByExtID['mw-2_XXX'],
      rowsByExtID['mw-3_XXX'],
      rowsByExtID['mw-4_XXX'],
      rowsByExtID['mw-5_XXX'],
      rowsByExtID['mw-6_XXX'],
      rowsByExtID['mw-7_XXX'],
      rowsByExtID['mw-8_XXX'],
      rowsByExtID['mw-9_XXX'],
      rowsByExtID['mw-10_XXX'],
      rowsByExtID['mw-11_XXX'],
      rowsByExtID['mw-12_XXX'],
    ],
    short: [
      rowsByExtID['mw-13_XXX'],
      rowsByExtID['mw-14_XXX'],
      rowsByExtID['mw-15_XXX'],
      rowsByExtID['mw-16_XXX'],
      rowsByExtID['mw-17_XXX'],
      rowsByExtID['mw-18_XXX'],
      rowsByExtID['mw-19_XXX'],
      rowsByExtID['mw-20_XXX'],
      rowsByExtID['mw-21_XXX'],
      rowsByExtID['mw-22_XXX'],
      rowsByExtID['mw-23_XXX'],
      rowsByExtID['mw-24_XXX'],
    ],
    narrow: [
      rowsByExtID['mw-25_XXX'],
      rowsByExtID['mw-26_XXX'],
      rowsByExtID['mw-27_XXX'],
      rowsByExtID['mw-28_XXX'],
      rowsByExtID['mw-29_XXX'],
      rowsByExtID['mw-30_XXX'],
      rowsByExtID['mw-31_XXX'],
      rowsByExtID['mw-32_XXX'],
      rowsByExtID['mw-33_XXX'],
      rowsByExtID['mw-34_XXX'],
      rowsByExtID['mw-35_XXX'],
      rowsByExtID['mw-36_XXX'],
    ],
  };
}

export default ReviewWidget;
