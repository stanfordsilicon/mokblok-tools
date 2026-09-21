import { useSession } from 'next-auth/react';

import { useWorksheetCatalog } from '@data/worksheets/WorksheetCatalog';

import { getPotentialTargetLanguageOptions } from './selectors/TargetLanguageOptions';
import { useURLParams } from './URLParams';

export function normalizeLanguageCodes(languages: readonly string[] | null | undefined): string[] {
  if (!languages) return [];
  return [...new Set(languages.map((code) => code.trim().toLowerCase()).filter(Boolean))];
}

export function useAllowedTargetLanguages(): string[] {
  const { admin, importSource } = useURLParams();
  const { languages: worksheetLanguages } = useWorksheetCatalog();
  const { data: session } = useSession();
  const role = session?.user?.role ?? null;
  const userLanguages = normalizeLanguageCodes(session?.user?.languages ?? []);

  // TEMPORARY
  if (userLanguages.length === 0) userLanguages.push('mg', 'nd');

  if (!userLanguages.includes('und')) userLanguages.unshift('und'); // Ensure empty string (no target language) is always allowed
  const potentialLanguages = getPotentialTargetLanguageOptions(importSource, worksheetLanguages);

  if (!role) return ['und'];
  if (admin) return potentialLanguages;

  return potentialLanguages.filter((code) => userLanguages.includes(code));
}

export default useAllowedTargetLanguages;
