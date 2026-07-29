import { useDataContext } from '@data/DataContext';
import type { DataEntry } from '@data/DataTypes';
import useTranslationFromSourceLanguage from '@data/sourcedata/useTranslationFromSourceLanguage';

import { BackgroundStyle } from '@settings/BackgroundStyle';
import { useURLParams } from '@settings/URLParams';

function useBackgroundColor(): (data: DataEntry) => string {
  const { bgStyle } = useURLParams();
  const getSourceTranslation = useTranslationFromSourceLanguage();
  const { getTranslation } = useDataContext();

  switch (bgStyle) {
    case BackgroundStyle.Missing:
      return (data: DataEntry) =>
        getTranslation(data, false)
          ? 'var(--color-input-background)'
          : 'var(--color-input-unfilled)';
    case BackgroundStyle.CoverageLevel:
      return (data: DataEntry) => 'var(--color-level-' + data.level + ')';
    case BackgroundStyle.DifferentThanSource:
      return (data: DataEntry) =>
        getSourceTranslation(data) === getTranslation(data, true)
          ? 'var(--color-input-unfilled)'
          : 'var(--color-input-background)';
    default: // BackgroundStyle.None
      return () => 'var(--color-input-background)';
  }
}

export default useBackgroundColor;
