import type { DataEntry } from '@data/DataTypes';
import useTranslationFromSourceLanguage from '@data/source/useTranslationFromSourceLanguage';
import { Vote } from '@data/target/types';
import { useTargetTranslation, useTargetTranslationInfo } from '@data/target/useTargetTranslation';
import { Worksheet } from '@data/worksheets/Worksheet';

import { BackgroundStyle } from '@settings/BackgroundStyle';
import { useURLParams } from '@settings/URLParams';

function useBackgroundColor(entry?: DataEntry): string {
  const { bgStyle } = useURLParams();
  const getSourceTranslation = useTranslationFromSourceLanguage();
  const translation = useTargetTranslation(entry, false);
  const translationFallback = useTargetTranslation(entry, true);
  const { vote } = useTargetTranslationInfo(entry) ?? {};

  if (!entry) return 'var(--color-input-background)';

  switch (bgStyle) {
    case BackgroundStyle.Missing:
      return translation ? 'var(--color-input-background)' : 'var(--color-input-unfilled)';
    case BackgroundStyle.CoverageLevel:
      return 'var(--color-level-' + entry.level + ')';
    case BackgroundStyle.DifferentThanSource:
      return getSourceTranslation(entry).translation === translationFallback
        ? 'var(--color-input-unfilled)'
        : 'var(--color-input-background)';
    case BackgroundStyle.Vote:
      if (vote === Vote.Accept) return 'var(--color-level-4)';
      if (vote === Vote.Reject) return 'var(--color-level-1)';
      return 'var(--color-input-background)';
    case BackgroundStyle.Worksheet:
      switch (entry.worksheet) {
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
    default: // BackgroundStyle.None
      return 'var(--color-input-background)';
  }
}

export default useBackgroundColor;
