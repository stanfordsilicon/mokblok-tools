import React from 'react';

import { useDataContext } from '@data/DataContext';
import type { DataField } from '@data/DataTypes';

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
  const { findDataFields, getTranslation } = useDataContext();
  return (
    <>
      <CheckRow
        title="Months"
        count={countTranslations(findDataFields({ group: 'Months' }), getTranslation)}
        denominator={36}
      >
        12 months × 3 forms
      </CheckRow>
      <CheckRow
        title="Days of the week"
        count={countTranslations(findDataFields({ group: 'DaysOfWeek' }), getTranslation)}
        denominator={28}
      >
        7 days × 4 forms
      </CheckRow>
      <CheckRow
        title="Date fields"
        count={countTranslations(findDataFields({ group: 'DateFields' }), getTranslation)}
        denominator={24}
      >
        11 fields × 1-3 forms each
      </CheckRow>
      <CheckRow
        title="Relative time"
        count={countTranslations(findDataFields({ group: 'RelativeTime' }), getTranslation)}
        denominator={12}
      >
        4 date fields × 3 (past, present, future)
      </CheckRow>
      <CheckRow
        title="Time combinations"
        count={countTranslations(findDataFields({ group: 'Times' }), getTranslation)}
        denominator={7}
      >
        4 formats × 2 variants - 1 missing
      </CheckRow>
      <CheckRow
        title="Time intervals"
        count={countTranslations(findDataFields({ group: 'TimeIntervals' }), getTranslation)}
        denominator={32}
      ></CheckRow>
      <CheckRow
        title="Dates"
        count={countTranslations(findDataFields({ group: 'Dates' }), getTranslation)}
        denominator={23}
      ></CheckRow>
      <CheckRow
        title="Date times"
        count={countTranslations(findDataFields({ group: 'DateTimes' }), getTranslation)}
        denominator={16}
      ></CheckRow>
      <CheckRow
        title="Date intervals"
        count={countTranslations(findDataFields({ group: 'DateIntervals' }), getTranslation)}
        denominator={37}
      ></CheckRow>
      <CheckRow
        title="Coordinates"
        count={countTranslations(findDataFields({ group: 'Coordinates' }), getTranslation)}
        denominator={12}
      >
        4 cardinal directions × 2 forms + 1 "Cardinal Direction" + 3 direction examples
      </CheckRow>
      <CheckRow
        title="Quarters"
        count={countTranslations(findDataFields({ group: 'Quarters' }), getTranslation)}
        denominator={16}
      >
        4 quarters × 2 lengths × 2 (standalone, inSentence)
      </CheckRow>
      <CheckRow
        title="Eras"
        count={countTranslations(findDataFields({ group: 'Eras' }), getTranslation)}
        denominator={8}
      >
        2 eras × 2 variants × 2 lengths
      </CheckRow>
    </>
  );
};

function countTranslations(
  dataFields: DataField[],
  getTranslation: (field: DataField) => string,
): number {
  return dataFields.reduce((count, field) => {
    const translation = getTranslation(field).trim();
    return count + (translation ? 1 : 0);
  }, 0);
}

export default Doc1Analysis;
