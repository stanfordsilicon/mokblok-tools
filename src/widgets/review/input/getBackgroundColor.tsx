import type { DataEntry } from '@data/DataTypes';
import useTranslationFromSourceLanguage from '@data/sourcedata/useTranslationFromSourceLanguage';
import { useTargetDataContext, Vote } from '@data/target-data/TargetDataProvider';

import { BackgroundStyle } from '@settings/BackgroundStyle';
import { useURLParams } from '@settings/URLParams';

function useBackgroundColor(): (data: DataEntry) => string {
  const { bgStyle } = useURLParams();
  const getSourceTranslation = useTranslationFromSourceLanguage();
  const { getTranslation, getTranslationInfo } = useTargetDataContext();

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
    case BackgroundStyle.Vote:
      return (data: DataEntry) => {
        const { vote } = getTranslationInfo(data);
        if (vote === Vote.Accept) return 'var(--color-level-4)';
        if (vote === Vote.Reject) return 'var(--color-level-1)';
        return 'var(--color-input-background)';
      };
    default: // BackgroundStyle.None
      return () => 'var(--color-input-background)';
  }
}

export default useBackgroundColor;
