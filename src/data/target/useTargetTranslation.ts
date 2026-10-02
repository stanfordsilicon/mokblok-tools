import { useCallback } from 'react';

import type { DataEntry } from '@data/DataTypes';

import { useTargetDataStore } from './TargetDataProvider';
import { type TranslationInfo, Vote } from './types';

export type TargetTranslationLookup = (entry: DataEntry | undefined, fallback?: boolean) => string;

export const useTargetTranslationInfo = (entry: DataEntry | undefined): TranslationInfo => {
  const baseline = useTargetDataStore((store) => store.translationBaselines[entry?.id ?? '']);
  const edit = useTargetDataStore((store) => store.translationEdits[entry?.id ?? '']);

  if (!entry) return { id: '', source: '', vote: Vote.Unknown };
  if (!baseline) return { id: entry.id, source: '', vote: Vote.Unknown };
  if (!edit) return { ...baseline, vote: Vote.Unknown };
  return { ...baseline, ...edit };
};

export const useTargetTranslation = (entry: DataEntry | undefined, fallback = true): string => {
  const info = useTargetTranslationInfo(entry);
  return info.edit ?? info.translation ?? (fallback ? info.source : '');
};

export const useTargetTranslationLookup = (): TargetTranslationLookup => {
  const translationBaselines = useTargetDataStore((store) => store.translationBaselines);
  const translationEdits = useTargetDataStore((store) => store.translationEdits);

  return useCallback(
    (entry, fallback = true) => {
      if (!entry) return '';
      const baseline = translationBaselines[entry.id];
      if (!baseline) return '';
      const edit = translationEdits[entry.id];
      return edit?.edit ?? baseline.translation ?? (fallback ? baseline.source : '');
    },
    [translationBaselines, translationEdits],
  );
};

export const useTargetTranslations = (
  entries: DataEntry[] | undefined,
  scope = 'edited',
): TranslationInfo[] => {
  // TODO can probably be more performant
  const translationBaselines = useTargetDataStore((store) => store.translationBaselines);
  const translationEdits = useTargetDataStore((store) => store.translationEdits);
  const idSet = new Set(entries?.map((entry) => entry.id));
  if (scope === 'edited') {
    return Object.values(translationEdits)
      .filter((edit) => !entries || idSet.has(edit.id))
      .map((edit) => ({ ...translationBaselines[edit.id], ...edit }));
  }
  return Object.values(translationBaselines)
    .filter((baseline) => !entries || idSet.has(baseline.id))
    .map((baseline) => ({ ...baseline, ...translationEdits[baseline.id] }));
};

export default useTargetTranslation;
