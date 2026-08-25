import type { PersistedTranslationInfo, TranslationEdit } from './types';

export function applyPersistedEntries(
  baseEdits: Record<string, TranslationEdit>,
  draftEntries: PersistedTranslationInfo[],
): Record<string, TranslationEdit> {
  if (draftEntries.length === 0) return baseEdits;

  const nextEdits = { ...baseEdits };
  for (const entry of draftEntries) {
    nextEdits[entry.id] = {
      ...nextEdits[entry.id],
      id: entry.id,
      ...(entry.edit !== undefined ? { edit: entry.edit } : {}),
      ...(entry.vote !== undefined ? { vote: entry.vote } : {}),
      ...(entry.comment !== undefined ? { comment: entry.comment } : {}),
    };
  }
  return nextEdits;
}
