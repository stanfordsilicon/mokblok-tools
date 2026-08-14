import { CoverageLevel } from '@data/CoverageLevel';
import { DataPage, DataSection } from '@data/DataSection';
import type { DataEntry } from '@data/DataTypes';
import { useSourceDataContext } from '@data/SourceDataProvider';
import { useTargetDataContext, Vote } from '@data/TargetDataProvider';

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
  coverageLevel?: CoverageLevel,
): { percent: number | undefined; overall: number; inCoverage: number; completed: number } {
  const { getTranslation } = useTargetDataContext();
  const getDataEntriesForSection = useDataEntriesForSection();
  const entries = getDataEntriesForSection(page, section);
  const entriesInCoverage = entries.filter(
    (entry) => coverageLevel == null || (entry.level && entry.level <= coverageLevel),
  );
  const completedEntries = entriesInCoverage.filter((entry) => getTranslation(entry, false));

  return {
    overall: entries.length,
    inCoverage: entriesInCoverage.length,
    completed: completedEntries.length,
    percent: !entries.length
      ? undefined
      : (completedEntries.length * 100.0) / (entriesInCoverage.length || 1),
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
