import { useMemo } from 'react';

import { isEntryInCoverageLevel } from '@data/CoverageLevel';
import { DataPage, DataSection } from '@data/DataSection';
import type { DataEntry } from '@data/DataTypes';
import { FindDataEntries, useSourceDataContext } from '@data/source/SourceDataProvider';
import { useTargetDataContext, Vote } from '@data/target/TargetDataProvider';
import { isEntryInWorksheetScope } from '@data/worksheets/Worksheets';

import { useURLParams } from '@settings/URLParams';

type GetDataEntriesForSection = (page?: DataPage, section?: DataSection) => DataEntry[];

/**
 * Returns a function to find data entries that are within the current coverage level and worksheet scope.
 */
export function useFindDataEntriesInScope(): FindDataEntries {
  const { findDataEntries } = useSourceDataContext();
  const { coverageLevel, worksheets } = useURLParams();

  return (filter: Partial<DataEntry>) => {
    return findDataEntries(filter).filter(
      (entry) =>
        isEntryInCoverageLevel(entry, coverageLevel) && isEntryInWorksheetScope(entry, worksheets),
    );
  };
}

/**
 * Returns a function to get all data entries for a given page and section, filtered by the current coverage level and worksheet scope.
 */
export function useDataEntriesForSection(): GetDataEntriesForSection {
  const findDataEntries = useFindDataEntriesInScope();
  return (page?: DataPage, section?: DataSection) => {
    const filter: Partial<DataEntry> = {};
    if (section != null && section !== DataSection.All && section !== DataSection.FullTable) {
      filter.section = section;
    }
    if (page != null && page !== DataPage.All && page !== DataPage.FullTable) {
      filter.page = page;
    }
    return findDataEntries(filter);
  };
}

type Completion = {
  overall: number;
  translations: { count: number; percent: number | undefined };
  votes: { accepted: number; rejected: number; total: number };
};

export function useCompletionForSection(page?: DataPage, section?: DataSection): Completion {
  const { getTranslations } = useTargetDataContext();
  const getDataEntriesForSection = useDataEntriesForSection();

  const entries = getDataEntriesForSection(page, section);
  const completedEntries = useMemo(
    () =>
      getTranslations(entries, 'all').filter((info) => Boolean(info?.edit ?? info?.translation)),
    [entries, getTranslations],
  );
  const votes = useMemo(
    () =>
      getTranslations(entries, 'all').reduce(
        (acc, { vote }) => {
          if (vote === Vote.Accept) acc.accepted++;
          else if (vote === Vote.Reject) acc.rejected++;
          acc.total++;
          return acc;
        },
        { accepted: 0, rejected: 0, total: 0 },
      ),
    [entries, getTranslations],
  );

  return {
    overall: entries.length,
    translations: {
      count: completedEntries.length,
      percent: !entries.length ? undefined : (completedEntries.length * 100.0) / entries.length,
    },
    votes,
  };
}
