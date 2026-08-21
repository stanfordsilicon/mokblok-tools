import { useDeferredValue } from 'react';

import { isEntryInCoverageLevel } from '@data/CoverageLevel';
import { DataPage, DataSection } from '@data/DataSection';
import type { DataEntry } from '@data/DataTypes';
import { useSourceDataContext } from '@data/SourceDataProvider';
import { useTargetDataContext, Vote } from '@data/TargetDataProvider';
import { isEntryInWorksheetScope } from '@data/worksheets/Worksheets';

import { useURLParams } from '@settings/URLParams';

type GetDataEntriesForSection = (page?: DataPage, section?: DataSection) => DataEntry[];
/**
 * Returns the data entry partial for filtering out a section
 */
export function useDataEntriesForSection(): GetDataEntriesForSection {
  const { findDataEntries } = useSourceDataContext();

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

export function useCompletionForSection(
  page?: DataPage,
  section?: DataSection,
): { percent: number | undefined; overall: number; inCoverage: number; completed: number } {
  const { coverageLevel, worksheets } = useURLParams();
  const { translations } = useTargetDataContext();
  const deferredTranslations = useDeferredValue(translations);
  const getDataEntriesForSection = useDataEntriesForSection();

  const entries = getDataEntriesForSection(page, section);
  const entriesInCoverage = entries.filter(
    (entry) =>
      isEntryInCoverageLevel(entry, coverageLevel) && isEntryInWorksheetScope(entry, worksheets),
  );
  const completedEntries = entriesInCoverage.filter((entry) => {
    const info = deferredTranslations[entry.index];
    return Boolean(info?.edit ?? info?.translation);
  });

  return {
    overall: entries.length,
    inCoverage: entriesInCoverage.length,
    completed: completedEntries.length,
    percent: !entriesInCoverage.length
      ? undefined
      : (completedEntries.length * 100.0) / entriesInCoverage.length,
  };
}

export function useVotingCompletionForSection(
  page?: DataPage,
  section?: DataSection,
): { accepted: number; rejected: number; total: number } {
  const { getTranslationInfo } = useTargetDataContext();
  const entries = useDataEntriesForSection()(page, section);
  return entries.reduce(
    (acc, entry) => {
      const vote = getTranslationInfo(entry)?.vote;
      if (vote === Vote.Accept) acc.accepted++;
      else if (vote === Vote.Reject) acc.rejected++;
      acc.total++;
      return acc;
    },
    { accepted: 0, rejected: 0, total: 0 },
  );
}
