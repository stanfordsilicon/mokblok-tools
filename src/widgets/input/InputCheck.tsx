import { useDataContext } from '@data/DataContext';

import type React from 'react';

const InputCheck: React.FC<{ numRows: number }> = ({ numRows }) => {
  const {
    monthsData,
    daysOfWeekData,
    dateFieldsData,
    quartersData,
    relativeTimeData,
    hourMinuteData,
    coordinatesData,
    dateCombinationsData,
    directionExamples,
    erasData,
  } = useDataContext();
  return (
    <table>
      <tbody>
        <Row title="Total rows loaded" count={numRows} />
        <Row title="Months" count={countRowData(monthsData)} denominator={36}>
          12 months × 3 forms
        </Row>
        <Row title="Days of the week" count={countRowData(daysOfWeekData)} denominator={28}>
          7 days × 4 forms
        </Row>
        <Row title="Date fields" count={countRowData(dateFieldsData)} denominator={23}>
          10 fields × 1-3 forms each
        </Row>
        <Row title="Relative time" count={countRowData(relativeTimeData)} denominator={12}>
          4 date fields × 3 (past, present, future)
        </Row>
        <Row title="Hour and Minute" count={countRowData(hourMinuteData)} denominator={7}>
          4 formats × 2 variants - 1 missing
        </Row>
        <Row title="Date combinations" count={countRowData(dateCombinationsData)} denominator={99}>
          not yet quantified
        </Row>
        <Row title="Coordinates" count={countRowData(coordinatesData)} denominator={8}>
          4 cardinal directions × 2 forms
        </Row>
        <Row title="Direction examples" count={countRowData(directionExamples)} denominator={3}>
          3 requested
        </Row>
        <Row title="Quarters" count={countRowData(quartersData)} denominator={16}>
          4 quarters × 2 lengths × 2 (standalone, inSentence)
        </Row>
        <Row title="Eras" count={countRowData(erasData)} denominator={8}>
          2 eras × 2 variants × 2 lengths
        </Row>
      </tbody>
    </table>
  );
};

const Row: React.FC<
  React.PropsWithChildren<{ title: string; count: number; denominator?: number }>
> = ({ title, count, denominator, children }) => (
  <tr>
    <th>{title}</th>
    <td>
      {count}
      {denominator && ' / '}
      {denominator}
    </td>
    <td>{children}</td>
  </tr>
);

function countRowData<T>(data: T | undefined): number {
  if (!data) return 0;
  // if its RowData, return 1
  if (typeof data === 'object' && 'english' in data && 'french' in data) {
    return 1;
  }
  // If it's an array, count the items
  if (Array.isArray(data) || typeof data === 'object') {
    return Object.values(data).reduce((sum, item) => sum + countRowData(item), 0);
  }
  return 0;
}

export default InputCheck;
