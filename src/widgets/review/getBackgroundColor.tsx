import { useDataContext } from '@data/DataContext';
import type { DataEntry } from '@data/DataTypes';
import useTranslationFromSourceLanguage from '@data/sourcedata/useTranslationFromSourceLanguage';

import { BackgroundStyle } from '@settings/BackgroundStyle';
import { useURLParams } from '@settings/URLParams';

function getBackgroundColor(data?: DataEntry) {
  const { bgStyle } = useURLParams();
  const getSourceTranslation = useTranslationFromSourceLanguage();
  const { getTranslation } = useDataContext();
  if (!data) return 'var(--color-input-background)';

  switch (bgStyle) {
    case BackgroundStyle.Missing:
      return getTranslation(data, false)
        ? 'var(--color-input-background)'
        : 'var(--color-input-unfilled)';
    case BackgroundStyle.CoverageLevel:
      return 'var(--color-level-' + data.level + ')';
    case BackgroundStyle.DifferentThanSource:
      return getSourceTranslation(data) === getTranslation(data, true)
        ? 'var(--color-input-unfilled)'
        : 'var(--color-input-background)';
    default:
      return 'var(--color-input-background)';
  }
}

export default getBackgroundColor;
