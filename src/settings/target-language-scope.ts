export function normalizeLanguageCodes(languages: readonly string[] | null | undefined): string[] {
  if (!languages) return [];
  return [...new Set(languages.map((code) => code.trim().toLowerCase()).filter(Boolean))];
}

export function getScopedTargetLanguages(
  role: string | null | undefined,
  languages: readonly string[] | null | undefined,
): string[] {
  if (!role || role === 'admin') return [];
  return normalizeLanguageCodes(languages);
}
