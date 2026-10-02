import { type TranslationBaseline, type TranslationEdit, Vote } from './types';

export function getTranslationCompletion(
  entries: readonly { id: string }[],
  baselines: Record<string, TranslationBaseline>,
  edits: Record<string, TranslationEdit>,
) {
  let count = 0;
  let accepted = 0;
  let rejected = 0;
  let total = 0;
  for (const { id } of entries) {
    const baseline = baselines[id];
    if (!baseline) continue;
    const edit = edits[id];
    if (edit?.edit ?? baseline.translation) count++;
    if (edit?.vote === Vote.Accept) accepted++;
    else if (edit?.vote === Vote.Reject) rejected++;
    total++;
  }
  return { count, accepted, rejected, total };
}
