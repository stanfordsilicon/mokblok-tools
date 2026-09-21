import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { NextResponse } from 'next/server';

import { getUserLanguageCodes } from '../../../settings/auth/languages';
import { requireRole, roleDenied, hasLevel } from '../../../settings/auth/roles';
import { isWorksheetKey, MAX_WORKSHEET_BYTES, normalizeWorksheetLanguage } from '../storageTypes';
import { validateWorksheet } from '../validateWorksheet';

export class WorksheetHttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function worksheetJSON(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } });
}

export async function worksheetHandler(action: () => Promise<Response>): Promise<Response> {
  try {
    return await action();
  } catch (error) {
    if (error instanceof WorksheetHttpError)
      return worksheetJSON({ error: error.message }, error.status);
    console.error('Worksheet request failed:', error);
    return worksheetJSON({ error: 'Unable to access worksheets. Please retry.' }, 500);
  }
}

export async function worksheetAccess(adminOnly = false) {
  const check = await requireRole(adminOnly ? 'admin' : 'user');
  if (!check.ok) return { response: roleDenied(check) };
  const admin = hasLevel(check.role, 'admin');
  const languages = admin ? null : await getUserLanguageCodes(check.userId);
  return { userId: check.userId, languages };
}

export function languageParam(raw: string) {
  try {
    return normalizeWorksheetLanguage(raw);
  } catch {
    throw new WorksheetHttpError(400, 'Invalid language code.');
  }
}

export function assertWriteOrigin(request: Request) {
  const expected = new URL(process.env.AUTH_URL ?? request.url).origin;
  if (request.headers.get('origin') !== expected) {
    throw new WorksheetHttpError(403, 'Worksheet publishing requires a same-origin request.');
  }
}

/** Bound actual streamed bytes, not merely an untrusted Content-Length. */
export async function readWorksheetBody(request: Request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    throw new WorksheetHttpError(400, 'Expected JSON worksheet data.');
  }
  const limit = MAX_WORKSHEET_BYTES * 6 + 4096; // JSON may escape each ASCII byte.
  const reader = request.body?.getReader();
  if (!reader) throw new WorksheetHttpError(400, 'Missing request body.');
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      throw new WorksheetHttpError(413, 'Request is too large.');
    }
    chunks.push(value);
  }
  try {
    const body = JSON.parse(
      new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks)),
    );
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error();
    return body as Record<string, unknown>;
  } catch {
    throw new WorksheetHttpError(400, 'Invalid UTF-8 JSON request.');
  }
}

let languageRegistry: Promise<Set<string>> | undefined;
async function registeredLanguages() {
  languageRegistry ??= readFile(path.join(process.cwd(), 'public/languageNames.tsv'), 'utf8')
    .then(
      (text) =>
        new Set(
          text
            .split(/\r?\n/)
            .slice(1)
            .map((line) => line.split('\t')[0].toLowerCase()),
        ),
    )
    .catch((error) => {
      languageRegistry = undefined;
      throw error;
    });
  return languageRegistry;
}

export async function candidateWorksheet(
  language: string,
  key: string,
  body: Record<string, unknown>,
) {
  const targetLanguage = languageParam(language);
  if (!(await registeredLanguages()).has(targetLanguage.split('-')[0])) {
    throw new WorksheetHttpError(400, 'Language is not in the language registry.');
  }
  if (!isWorksheetKey(key)) throw new WorksheetHttpError(400, 'Unsupported worksheet type.');
  if (typeof body.content !== 'string')
    throw new WorksheetHttpError(400, 'Worksheet text is required.');
  if (Buffer.byteLength(body.content, 'utf8') > MAX_WORKSHEET_BYTES) {
    throw new WorksheetHttpError(413, 'Worksheet exceeds the 1 MiB limit.');
  }
  if (!Number.isSafeInteger(body.expectedRevision) || (body.expectedRevision as number) < 0) {
    throw new WorksheetHttpError(400, 'A nonnegative expected revision is required.');
  }
  if (
    body.originalFilename != null &&
    (typeof body.originalFilename !== 'string' || body.originalFilename.length > 255)
  ) {
    throw new WorksheetHttpError(400, 'Filename must be at most 255 characters.');
  }
  const validation = validateWorksheet(body.content, key);
  return {
    input: {
      targetLanguage,
      worksheetKey: key,
      content: body.content,
      expectedRevision: body.expectedRevision as number,
      originalFilename:
        typeof body.originalFilename === 'string'
          ? body.originalFilename.split(/[\\/]/).pop()!
          : null,
      parsedRowCount: validation.parsedRowCount,
    },
    validation,
  };
}
