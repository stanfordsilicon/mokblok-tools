import type { DataEntry } from '@data/DataTypes';

import { useTargetDataStore } from './TargetDataProvider';
import { type TranslationInfo, Vote } from './types';

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
