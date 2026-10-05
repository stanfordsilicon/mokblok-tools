import { useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { isEntryInCoverageLevel } from '@data/CoverageLevel';
import { DataPage, DataSection } from '@data/DataSection';
import type { DataEntry } from '@data/DataTypes';
import { FindDataEntries, useSourceDataContext } from '@data/source/SourceDataProvider';
import { useDemoDataContext } from '@data/target/DemoDataProvider';
import { getTranslationCompletion } from '@data/target/getTranslationCompletion';
import { useTargetDataStore } from '@data/target/TargetDataProvider';
import { Vote } from '@data/target/types';
import { isEntryInWorksheetScope } from '@data/worksheets/Worksheets';

import { useURLParams } from '@settings/URLParams';

import DemoID from './demo/DemoID';

type GetDataEntriesForSection = (page?: DataPage, section?: DataSection) => DataEntry[];

/**
 * Returns a function to find data entries that are within the current coverage level and worksheet scope.
 */
export function useFindDataEntriesInScope(): FindDataEntries {
  const { findDataEntries } = useSourceDataContext();
  const { coverageLevel, worksheets } = useURLParams();

  return useCallback(
    (filter: Partial<DataEntry>) => {
      return findDataEntries(filter).filter(
        (entry) =>
          isEntryInCoverageLevel(entry, coverageLevel) &&
          isEntryInWorksheetScope(entry, worksheets),
      );
    },
    [findDataEntries, coverageLevel, worksheets],
  );
}

/**
 * Returns a function to get all data entries for a given page and section, filtered by the current coverage level and worksheet scope.
 */
export function useDataEntriesForSection(): GetDataEntriesForSection {
  const findDataEntries = useFindDataEntriesInScope();
  return useCallback(
    (page?: DataPage, section?: DataSection) => {
      const filter: Partial<DataEntry> = {};
      if (
        section != null &&
        section !== DataSection.All &&
        section !== DataSection.FullTable &&
        section !== DataSection.Demos
      ) {
        filter.section = section;
      }
      if (page != null && page !== DataPage.Demos && page !== DataPage.FullTable) {
        filter.page = page;
      }
      return findDataEntries(filter);
    },
    [findDataEntries],
  );
}

type Completion = {
  overall: number;
  translations: { count: number; percent: number | undefined };
  votes: { accepted: number; rejected: number; total: number };
};

export function useCompletionForSection(page?: DataPage, section?: DataSection): Completion {
  const getDataEntriesForSection = useDataEntriesForSection();
  const demoCompletion = useDemoCompletion();

  const entries = useMemo(
    () => getDataEntriesForSection(page, section),
    [getDataEntriesForSection, page, section],
  );
  // Text and comments can change without changing progress. Select primitive
  // counts so these updates do not rerender every progress indicator and table.
  const { count, accepted, rejected, total } = useTargetDataStore(
    useShallow((store) =>
      getTranslationCompletion(entries, store.translationBaselines, store.translationEdits),
    ),
  );

  if (page === DataPage.Demos || section === DataSection.Demos) return demoCompletion;

  return {
    overall: entries.length,
    translations: {
      count,
      percent: !entries.length ? undefined : (count * 100.0) / entries.length,
    },
    votes: { accepted, rejected, total },
  };
}

function useDemoCompletion(): Completion {
  const { demoVotes } = useDemoDataContext();
  const demoIDs = Object.values(DemoID);
  return {
    overall: demoIDs.length,
    translations: {
      count: 0,
      percent: 0,
    },
    votes: {
      accepted: demoIDs.filter((id) => demoVotes[id] === Vote.Accept).length,
      rejected: demoIDs.filter((id) => demoVotes[id] === Vote.Reject).length,
      total: demoIDs.length,
    },
  };
}
