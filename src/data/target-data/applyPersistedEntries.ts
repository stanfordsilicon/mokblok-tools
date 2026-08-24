import type { PersistedTranslationInfo, TranslationEdit } from './types';

export function applyPersistedEntries(
  baseEdits: Record<number, TranslationEdit>,
  draftEntries: PersistedTranslationInfo[],
): Record<number, TranslationEdit> {
  if (draftEntries.length === 0) return baseEdits;

  const nextEdits = { ...baseEdits };
  for (const entry of draftEntries) {
    nextEdits[entry.index] = {
      index: entry.index,
      ...nextEdits[entry.index],
      ...(entry.edit !== undefined ? { edit: entry.edit } : {}),
      ...(entry.vote !== undefined ? { vote: entry.vote } : {}),
      ...(entry.comment !== undefined ? { comment: entry.comment } : {}),
    };
  }
  return nextEdits;
}
