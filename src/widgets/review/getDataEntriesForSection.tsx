import { useMemo } from 'react';

import { DataPage, DataSection } from '@data/DataSection';
import type { DataEntry } from '@data/DataTypes';
import { useSourceDataContext } from '@data/SourceDataProvider';
import { useTargetDataContext, Vote } from '@data/TargetDataProvider';

/**
 * Returns the data entry partial for filtering out a section
 */
export function useDataEntriesForSection(page?: DataPage, section?: DataSection): DataEntry[] {
  const { findDataEntries } = useSourceDataContext();
  const filter: Partial<DataEntry> = {};
  if (section != null && section !== DataSection.All && section !== DataSection.FullTable) {
    filter.section = section;
  }
  if (page != null && page !== DataPage.All && page !== DataPage.FullTable) {
    filter.page = page;
  }
  return findDataEntries(filter);
}

export function useCompletionForSection(
  page?: DataPage,
  section?: DataSection,
): number | undefined {
  const { getTranslation } = useTargetDataContext();
  const entries = useDataEntriesForSection(page, section);
  const completedEntries = useMemo(
    () => entries.filter((entry) => getTranslation(entry, false)),
    [entries, getTranslation],
  );
  if (entries.length === 0) return undefined;
  return (completedEntries.length * 100.0) / entries.length;
}

export function useVotingCompletionForSection(
  page?: DataPage,
  section?: DataSection,
): { accepted: number; rejected: number; total: number } {
  const { getTranslationInfo } = useTargetDataContext();
  const entries = useDataEntriesForSection(page, section);
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
