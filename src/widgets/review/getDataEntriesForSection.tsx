import { useMemo } from 'react';

import { useDataContext } from '@data/DataContext';
import { DataPage, DataSection } from '@data/DataSection';
import type { DataEntry } from '@data/DataTypes';

/**
 * Returns the data entry partial for filtering out a section
 */
export function getDataEntriesForSection(page?: DataPage, section?: DataSection): DataEntry[] {
  const { findDataEntries } = useDataContext();
  const filter: Partial<DataEntry> = {};
  if (section != null && section !== DataSection.All && section !== DataSection.FullTable) {
    filter.section = section;
  }
  if (page != null && page !== DataPage.All && page !== DataPage.FullTable) {
    filter.page = page;
  }
  return findDataEntries(filter);
}

export function getCompletionForSection(
  page?: DataPage,
  section?: DataSection,
): number | undefined {
  const { getTranslation } = useDataContext();
  const entries = getDataEntriesForSection(page, section);
  const completedEntries = useMemo(
    () => entries.filter((entry) => getTranslation(entry, false)),
    [entries, getTranslation],
  );
  if (entries.length === 0) return undefined;
  return (completedEntries.length * 100.0) / entries.length;
}
