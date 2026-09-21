import { normalizeWorksheetLanguage, WORKSHEET_KEYS, type WorksheetBundle } from './storageTypes';

async function readJSON(url: string, signal: AbortSignal) {
  const response = await fetch(url, {
    signal: AbortSignal.any([signal, AbortSignal.timeout(3000)]),
    cache: 'no-store',
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error ?? 'Unable to load worksheets.');
  return body;
}

export async function loadWorksheetLanguages(signal: AbortSignal): Promise<string[]> {
  const [database, bundled] = await Promise.allSettled([
    readJSON('/api/worksheets', signal).then(
      (body) =>
        body.worksheets.map((item: { targetLanguage: string }) => item.targetLanguage) as string[],
    ),
    readJSON('/api/worksheet-files', signal).then((body) => body.languages as string[]),
  ]);
  signal.throwIfAborted();
  const languages = [
    ...new Set([
      ...(database.status === 'fulfilled' ? database.value : []),
      ...(bundled.status === 'fulfilled' ? bundled.value : []),
    ]),
  ].sort();
  if (!languages.length && database.status === 'rejected') throw database.reason;
  return languages;
}

/** Keep every database worksheet; fill only missing keys from the public files. */
export async function loadWorksheetBundle(
  language: string,
  signal: AbortSignal,
): Promise<WorksheetBundle> {
  const code = normalizeWorksheetLanguage(language);
  let databaseError: unknown;
  let worksheets: WorksheetBundle = {};
  try {
    const body = await readJSON(`/api/worksheets/${encodeURIComponent(code)}`, signal);
    if (!body.worksheets || typeof body.worksheets !== 'object' || Array.isArray(body.worksheets)) {
      throw new Error('Invalid worksheet response.');
    }
    worksheets = { ...body.worksheets };
  } catch (error) {
    signal.throwIfAborted();
    databaseError = error;
  }
  await Promise.all(
    WORKSHEET_KEYS.filter((key) => !Object.hasOwn(worksheets, key)).map(async (key) => {
      const extension = key === '3' || key === '4' ? 'txt' : 'tsv';
      try {
        const response = await fetch(`/input_tsvs/${code}_${key}.${extension}`, {
          signal: AbortSignal.any([signal, AbortSignal.timeout(3000)]),
        });
        if (!response.ok || response.headers.get('content-type')?.includes('text/html')) return;
        worksheets[key] = { content: await response.text(), revision: 0 };
      } catch {
        signal.throwIfAborted();
      }
    }),
  );
  signal.throwIfAborted();
  if (databaseError && !Object.keys(worksheets).length) throw databaseError;
  return worksheets;
}
