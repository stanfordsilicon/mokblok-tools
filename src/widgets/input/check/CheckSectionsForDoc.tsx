import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import { DataSection } from '@data/DataSection';
import { Doc } from '@data/tsvdocs/Doc';

import { getDataSectionsForTSV } from '../getDataSectionsForTSV';

import CheckRow from './CheckRow';

const CheckSectionsForDoc: React.FC<{ doc: Doc }> = ({ doc }) => {
  const { t } = useTranslation();
  const { findDataEntries, getTranslation } = useDataContext();
  const countTranslations = useCallback(
    (section: DataSection) => {
      const dataEntries = findDataEntries({ section });
      return dataEntries.reduce((count, entry) => {
        const translation = getTranslation(entry, false).trim();
        return count + (translation ? 1 : 0);
      }, 0);
    },
    [getTranslation, findDataEntries],
  );

  return getDataSectionsForTSV(doc).map((section) => (
    <CheckRow
      key={section}
      title={t(`dataSection.${section}`)}
      count={countTranslations(section)}
      denominator={SECTION_ROWS[section]}
    >
      {getExplanation(section)}
    </CheckRow>
  ));
};

const SECTION_ROWS: Record<DataSection, number> = {
  [DataSection.Months]: 36,
  [DataSection.DaysOfWeek]: 28,
  [DataSection.DateFields]: 24,
  [DataSection.RelativeTime]: 12,
  [DataSection.Times]: 8,
  [DataSection.TimeIntervals]: 32,
  [DataSection.Dates]: 23,
  [DataSection.DateTimes]: 16,
  [DataSection.DateIntervals]: 37,
  [DataSection.Coordinates]: 9,
  [DataSection.DirectionExamples]: 4,
  [DataSection.Quarters]: 16,
  [DataSection.Eras]: 12,
  [DataSection.Regions]: 39,
  [DataSection.Timezones]: 719,
  [DataSection.Emoji]: 298,
  [DataSection.DayPeriods]: 16,
  [DataSection.EraDates]: 25,
  [DataSection.Symbols]: 25,
  [DataSection.Quotes]: 7,
  [DataSection.Plurals]: 52,
  [DataSection.LanguageNames]: 76,
  [DataSection.TechWords]: 31,
  [DataSection.Maths]: 14,
  [DataSection.Paragraphs]: 33,
  [DataSection.CLDRTicket]: 11,

  [DataSection.Alphabet]: 0, // not collected in specific TSV
  [DataSection.All]: 0, // n/a
  [DataSection.FullTable]: 0, // n/a
};

function getExplanation(section: DataSection): string | undefined {
  switch (section) {
    case DataSection.Months:
      return '12 months × 3 lengths';
    case DataSection.DaysOfWeek:
      return '7 days × 2 lengths × 2 (standalone, inSentence)';
    case DataSection.DateFields:
      return '11 fields × 1-3 forms each';
    case DataSection.RelativeTime:
      return '4 date fields × 3 (past, present, future)';
    case DataSection.Times:
      return '4 formats × 2 variants';
    case DataSection.Coordinates:
      return '4 cardinal directions × 2 forms + 1 "Cardinal Direction"';
    case DataSection.DirectionExamples:
      return '4 direction examples';
    case DataSection.Quarters:
      return '4 quarters × 2 lengths × 2 (standalone, inSentence)';
    case DataSection.Eras:
      return '2 eras × 2 variants × 3 lengths';
    case DataSection.Dates:
    case DataSection.TimeIntervals:
    case DataSection.DateIntervals:
    case DataSection.DateTimes:
    default:
      return undefined;
  }
}

export default CheckSectionsForDoc;
