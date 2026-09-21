export const WORKSHEET_KEYS = ['1', '2_1', '2_2', '2_3', '3', '4'] as const;
export type WorksheetKey = (typeof WORKSHEET_KEYS)[number];
export const MAX_WORKSHEET_BYTES = 1024 * 1024;

export type WorksheetMetadata = {
  targetLanguage: string;
  worksheetKey: WorksheetKey;
  format: 'tsv' | 'txt';
  originalFilename: string | null;
  sha256: string;
  byteLength: number;
  parsedRowCount: number;
  validationVersion: number;
  revision: number;
  createdAt: string;
  updatedAt: string;
};

export type WorksheetBundle = Partial<Record<WorksheetKey, { content: string; revision: number }>>;

export function isWorksheetKey(value: unknown): value is WorksheetKey {
  return typeof value === 'string' && WORKSHEET_KEYS.includes(value as WorksheetKey);
}

export function normalizeWorksheetLanguage(value: string): string {
  const code = value.trim().toLowerCase();
  if (code.length > 32 || !/^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/.test(code) || code === 'und') {
    throw new Error('Choose a valid language code.');
  }
  return code;
}
