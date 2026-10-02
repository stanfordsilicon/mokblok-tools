import { useCallback, useDeferredValue, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import type { DataEntry } from '@data/DataTypes';

import { useTargetDataStore } from './TargetDataProvider';
import {
  type TranslationBaseline,
  type TranslationEdit,
  type TranslationInfo,
  Vote,
} from './types';

export type TargetTranslationLookup = (entry: DataEntry | undefined, fallback?: boolean) => string;

export const useTargetTranslationInfo = (entry: DataEntry | undefined): TranslationInfo => {
  const { baseline, edit } = useTargetDataStore(
    useShallow((store) => ({
      baseline: store.translationBaselines[entry?.id ?? ''],
      edit: store.translationEdits[entry?.id ?? ''],
    })),
  );

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
  const translationBaselines = useDeferredValue(
    useTargetDataStore((store) => store.translationBaselines),
  );
  const translationEdits = useDeferredValue(useTargetDataStore((store) => store.translationEdits));

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

export const useTargetTranslations = (entries: DataEntry[]): TranslationInfo[] => {
  const selectedTranslations = useDeferredValue(
    useTargetDataStore(
      useShallow((store) => {
        const selected: Record<string, TranslationBaseline | TranslationEdit | undefined> = {};
        for (const entry of entries) {
          selected[`baseline:${entry.id}`] = store.translationBaselines[entry.id];
          selected[`edit:${entry.id}`] = store.translationEdits[entry.id];
        }
        return selected;
      }),
    ),
  );

  return useMemo(
    () =>
      entries.flatMap((entry) => {
        const baseline = selectedTranslations[`baseline:${entry.id}`] as
          TranslationBaseline | undefined;
        if (!baseline) return [];
        const edit = selectedTranslations[`edit:${entry.id}`] as TranslationEdit | undefined;
        return [{ ...baseline, ...edit }];
      }),
    [entries, selectedTranslations],
  );
};

export const useAllTargetTranslations = (scope: 'edited' | 'all' = 'edited'): TranslationInfo[] => {
  const translationBaselines = useDeferredValue(
    useTargetDataStore((store) => store.translationBaselines),
  );
  const translationEdits = useDeferredValue(useTargetDataStore((store) => store.translationEdits));
  if (scope === 'edited') {
    return Object.values(translationEdits).map((edit) => ({
      ...translationBaselines[edit.id],
      ...edit,
    }));
  }
  return Object.values(translationBaselines).map((baseline) => ({
    ...baseline,
    ...translationEdits[baseline.id],
  }));
};

export default useTargetTranslation;
