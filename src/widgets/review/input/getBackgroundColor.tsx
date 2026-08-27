import type { DataEntry } from '@data/DataTypes';
import useTranslationFromSourceLanguage from '@data/sourcedata/useTranslationFromSourceLanguage';
import { useTargetDataContext, Vote } from '@data/target-data/TargetDataProvider';
import { Worksheet } from '@data/worksheets/Worksheet';

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
    case BackgroundStyle.Worksheet:
      return (data: DataEntry) => {
        switch (data.worksheet) {
          case Worksheet.W1:
            return 'var(--color-level-6)';
          case Worksheet.W2_1:
            return 'var(--color-level-5)';
          case Worksheet.W2_2:
            return 'var(--color-level-4)';
          case Worksheet.W2_3:
            return 'var(--color-level-3)';
          case Worksheet.W3:
            return 'var(--color-level-2)';
          case Worksheet.W4:
            return 'var(--color-level-1)';
          default:
            return 'var(--color-input-background)';
        }
      };
    default: // BackgroundStyle.None
      return () => 'var(--color-input-background)';
  }
}

export default useBackgroundColor;
