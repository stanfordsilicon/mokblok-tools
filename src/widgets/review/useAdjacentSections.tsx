import { useCallback, useMemo } from 'react';

import { DataSection, getPageForSection } from '@data/DataSection';

import { useURLParams } from '@settings/URLParams';

import { useFindDataEntriesInScope } from './getDataEntriesForSection';

type UseAdjacentSections = {
  previousSection: DataSection | null;
  nextSection: DataSection | null;
  goToNextSection: () => void;
  goToPreviousSection: () => void;
};

const useAdjacentSections = (): UseAdjacentSections => {
  const { section: currentSection, updateURLParams } = useURLParams();
  const findDataEntries = useFindDataEntriesInScope();
  const orderedSections = Object.values(DataSection);

  const entriesBySection = Object.values(DataSection).map((section) =>
    findDataEntries({ section }),
  );

  const previousSection = useMemo((): DataSection | null => {
    let index = orderedSections.indexOf(currentSection);
    while (index > 0 && entriesBySection[index - 1].length === 0) {
      index--;
    }
    return index > 0 ? orderedSections[index - 1] : null;
  }, [orderedSections, entriesBySection, currentSection]);

  const nextSection = useMemo((): DataSection | null => {
    let index = orderedSections.indexOf(currentSection);
    while (index < orderedSections.length - 1 && entriesBySection[index + 1].length === 0) {
      index++;
    }
    return index < orderedSections.length - 1 ? orderedSections[index + 1] : null;
  }, [orderedSections, entriesBySection, currentSection]);

  const goToNextSection = useCallback(() => {
    if (nextSection == undefined) return;
    updateURLParams({
      section: nextSection,
      page: getPageForSection(nextSection),
    });
  }, [updateURLParams, nextSection]);

  const goToPreviousSection = useCallback(() => {
    if (previousSection == undefined) return;
    updateURLParams({
      section: previousSection,
      page: getPageForSection(previousSection),
    });
  }, [updateURLParams, previousSection]);

  return { previousSection, nextSection, goToNextSection, goToPreviousSection };
};

export default useAdjacentSections;
