import React from 'react';
import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import type { DataEntry } from '@data/DataTypes';

import CheckRow from './CheckRow';

const Doc1Analysis: React.FC = () => {
  const { t } = useTranslation();
  const { findDataEntries, getTranslation } = useDataContext();
  return (
    <>
      <CheckRow
        title={t('dataSection.Months')}
        count={countTranslations(findDataEntries({ group: 'Months' }), getTranslation)}
        denominator={36}
      >
        12 months × 3 forms
      </CheckRow>
      <CheckRow
        title={t('dataSection.DaysOfWeek')}
        count={countTranslations(findDataEntries({ group: 'DaysOfWeek' }), getTranslation)}
        denominator={28}
      >
        7 days × 4 forms
      </CheckRow>
      <CheckRow
        title={t('dataSection.DateFields')}
        count={countTranslations(findDataEntries({ group: 'DateFields' }), getTranslation)}
        denominator={24}
      >
        11 fields × 1-3 forms each
      </CheckRow>
      <CheckRow
        title={t('dataSection.RelativeTime')}
        count={countTranslations(findDataEntries({ group: 'RelativeTime' }), getTranslation)}
        denominator={12}
      >
        4 date fields × 3 (past, present, future)
      </CheckRow>
      <CheckRow
        title={t('dataSection.Times')}
        count={countTranslations(findDataEntries({ group: 'Times' }), getTranslation)}
        denominator={8}
      >
        4 formats × 2 variants
      </CheckRow>
      <CheckRow
        title={t('dataSection.TimeIntervals')}
        count={countTranslations(findDataEntries({ group: 'TimeIntervals' }), getTranslation)}
        denominator={32}
      ></CheckRow>
      <CheckRow
        title={t('dataSection.Dates')}
        count={countTranslations(findDataEntries({ group: 'Dates' }), getTranslation)}
        denominator={23}
      ></CheckRow>
      <CheckRow
        title={t('dataSection.DateTimes')}
        count={countTranslations(findDataEntries({ group: 'DateTimes' }), getTranslation)}
        denominator={16}
      ></CheckRow>
      <CheckRow
        title={t('dataSection.DateIntervals')}
        count={countTranslations(findDataEntries({ group: 'DateIntervals' }), getTranslation)}
        denominator={37}
      ></CheckRow>
      <CheckRow
        title={t('dataSection.Coordinates')}
        count={countTranslations(findDataEntries({ group: 'Coordinates' }), getTranslation)}
        denominator={13}
      >
        4 cardinal directions × 2 forms + 1 "Cardinal Direction" + 4 direction examples
      </CheckRow>
      <CheckRow
        title={t('dataSection.Quarters')}
        count={countTranslations(findDataEntries({ group: 'Quarters' }), getTranslation)}
        denominator={16}
      >
        4 quarters × 2 lengths × 2 (standalone, inSentence)
      </CheckRow>
      <CheckRow
        title={t('dataSection.Eras')}
        count={countTranslations(findDataEntries({ group: 'Eras' }), getTranslation)}
        denominator={8}
      >
        2 eras × 2 variants × 2 lengths
      </CheckRow>
    </>
  );
};

function countTranslations(
  dataEntries: DataEntry[],
  getTranslation: (entry: DataEntry) => string,
): number {
  return dataEntries.reduce((count, entry) => {
    const translation = getTranslation(entry).trim();
    return count + (translation ? 1 : 0);
  }, 0);
}

export default Doc1Analysis;
