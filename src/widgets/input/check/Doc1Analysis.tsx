import React from 'react';

import { useDataContext } from '@data/DataContext';

import CheckRow from './CheckRow';

const Doc1Analysis: React.FC = () => {
  const {
    months,
    daysOfWeek,
    dateFields,
    quarters,
    relativeTime,
    timeCombinations,
    timeIntervals,
    coordinates,
    dateCombinations,
    directionExamples,
    eras,
  } = useDataContext().data;
  return (
    <>
      <CheckRow title="Months" count={countRowData(months)} denominator={36}>
        12 months × 3 forms
      </CheckRow>
      <CheckRow title="Days of the week" count={countRowData(daysOfWeek)} denominator={28}>
        7 days × 4 forms
      </CheckRow>
      <CheckRow title="Date fields" count={countRowData(dateFields)} denominator={23}>
        10 fields × 1-3 forms each
      </CheckRow>
      <CheckRow title="Relative time" count={countRowData(relativeTime)} denominator={12}>
        4 date fields × 3 (past, present, future)
      </CheckRow>
      <CheckRow title="Time combinations" count={countRowData(timeCombinations)} denominator={7}>
        4 formats × 2 variants - 1 missing
      </CheckRow>
      <CheckRow title="Time intervals" count={countRowData(timeIntervals)} denominator={18}>
        not yet quantified
      </CheckRow>
      <CheckRow title="Date combinations" count={countRowData(dateCombinations)} denominator={99}>
        not yet quantified
      </CheckRow>
      <CheckRow title="Coordinates" count={countRowData(coordinates)} denominator={8}>
        4 cardinal directions × 2 forms
      </CheckRow>
      <CheckRow title="Direction examples" count={countRowData(directionExamples)} denominator={3}>
        3 requested
      </CheckRow>
      <CheckRow title="Quarters" count={countRowData(quarters)} denominator={16}>
        4 quarters × 2 lengths × 2 (standalone, inSentence)
      </CheckRow>
      <CheckRow title="Eras" count={countRowData(eras)} denominator={8}>
        2 eras × 2 variants × 2 lengths
      </CheckRow>
    </>
  );
};

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

export default Doc1Analysis;
