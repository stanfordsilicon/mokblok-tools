import { ObjectId, type Document, type Filter } from 'mongodb';

import getMongoClient, { siliconDbName } from '../../mongodb';

import { userFilter } from './roles';

export const USER_LANGUAGE_GRANTS_COLLECTION = 'homescreen_review_languages';
const MAX_ACTIVE_LANGUAGE_ROWS = 10;
const MAX_PENDING_LANGUAGE_REQUESTS = 3;

function cleanLanguageCode(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase().slice(0, 32) : '';
}

function cleanRequestedName(value: unknown): string {
  return typeof value === 'string' ? value.trim().slice(0, 120) : '';
}

function normalizeRequestedName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 120);
}

function readLanguageArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(cleanLanguageCode)
    .filter(Boolean)
    .filter((code, index, all) => all.indexOf(code) === index);
}

function mergeLanguageLists(...lists: string[][]): string[] {
  return [...new Set(lists.flat().map(cleanLanguageCode).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

async function readUserLanguageDoc(filter: Filter<Document>) {
  const client = await getMongoClient();
  return client
    .db(siliconDbName())
    .collection('users')
    .findOne(filter, {
      projection: {
        _id: 1,
        languages: 1,
        languageCodes: 1,
        targetLanguages: 1,
      },
    });
}

async function languageCollection() {
  const client = await getMongoClient();
  return client.db(siliconDbName()).collection(USER_LANGUAGE_GRANTS_COLLECTION);
}

export type UserLanguageStatus = 'approved' | 'pending' | 'denied';

export type UserLanguageRequest = {
  id: string;
  status: UserLanguageStatus;
  requestedName: string;
  displayName: string;
  deniedReason: string | null;
  code: string | null;
};

function asStatus(value: unknown): UserLanguageStatus {
  if (value === 'denied') return 'denied';
  if (value === 'pending') return 'pending';
  return 'approved';
}

function toUserLanguageRequest(
  doc: Document & { _id: { toString(): string } },
): UserLanguageRequest {
  const requestedName = cleanRequestedName(doc.requestedName);
  const nameNative = cleanRequestedName(doc.nameNative);
  const nameEnglish = cleanRequestedName(doc.nameEnglish);
  const code =
    cleanLanguageCode(doc.code) ||
    cleanLanguageCode(doc.languageCode) ||
    cleanLanguageCode(doc.targetLanguage) ||
    cleanLanguageCode(doc.language) ||
    null;

  return {
    id: doc._id.toString(),
    status: asStatus(doc.status),
    requestedName,
    displayName: nameNative || nameEnglish || requestedName || code || 'Unnamed language',
    deniedReason:
      typeof doc.deniedReason === 'string' && doc.deniedReason.trim()
        ? doc.deniedReason.trim()
        : null,
    code,
  };
}

export async function getUserLanguageCodes(
  identifier: string | null | undefined,
): Promise<string[]> {
  const filter = userFilter(identifier);
  if (!filter) return [];

  const userDoc = await readUserLanguageDoc(filter);
  if (!userDoc) return [];

  const userId = userDoc._id?.toString?.();
  const fromUserDoc = mergeLanguageLists(
    readLanguageArray(userDoc.languages),
    readLanguageArray(userDoc.languageCodes),
    readLanguageArray(userDoc.targetLanguages),
  );

  if (!userId) return fromUserDoc;

  const grants = await (
    await languageCollection()
  )
    .find(
      {
        userId,
        archivedAt: null,
        $or: [{ status: 'approved' }, { status: { $exists: false } }],
      },
      {
        projection: {
          code: 1,
          languageCode: 1,
          targetLanguage: 1,
          language: 1,
        },
      },
    )
    .toArray();

  const fromGrants = grants.flatMap((grant) =>
    [grant.code, grant.languageCode, grant.targetLanguage, grant.language]
      .map(cleanLanguageCode)
      .filter(Boolean),
  );

  return mergeLanguageLists(fromUserDoc, fromGrants);
}

export async function listUserLanguageRequests(userId: string): Promise<UserLanguageRequest[]> {
  const docs = await (
    await languageCollection()
  )
    .find(
      { userId, archivedAt: null },
      {
        projection: {
          status: 1,
          requestedName: 1,
          nameNative: 1,
          nameEnglish: 1,
          deniedReason: 1,
          code: 1,
          languageCode: 1,
          targetLanguage: 1,
          language: 1,
          requestedAt: 1,
          createdAt: 1,
        },
      },
    )
    .sort({ requestedAt: -1, createdAt: -1, _id: -1 })
    .toArray();

  return docs.map((doc) =>
    toUserLanguageRequest(doc as Document & { _id: { toString(): string } }),
  );
}

export async function requestUserLanguage(
  userId: string,
  requestedNameInput: string,
): Promise<
  | { ok: true; language: UserLanguageRequest }
  | { ok: false; status: 400 | 409 | 422; error: string }
> {
  const requestedName = cleanRequestedName(requestedNameInput);
  if (!requestedName) {
    return { ok: false, status: 422, error: 'Enter the language you want to request.' };
  }

  const existing = await listUserLanguageRequests(userId);
  if (existing.length >= MAX_ACTIVE_LANGUAGE_ROWS) {
    return {
      ok: false,
      status: 409,
      error: `You can hold at most ${MAX_ACTIVE_LANGUAGE_ROWS} languages and requests at once.`,
    };
  }

  const pending = existing.filter((language) => language.status === 'pending');
  if (pending.length >= MAX_PENDING_LANGUAGE_REQUESTS) {
    return {
      ok: false,
      status: 409,
      error: `You already have ${MAX_PENDING_LANGUAGE_REQUESTS} language requests waiting.`,
    };
  }

  const requestedKey = normalizeRequestedName(requestedName);
  const requestedCode = cleanLanguageCode(requestedName);
  const duplicate = existing.some((language) => {
    const byName = normalizeRequestedName(language.requestedName) === requestedKey;
    const byDisplayName = normalizeRequestedName(language.displayName) === requestedKey;
    const byCode = language.code != null && language.code === requestedCode;
    return byName || byDisplayName || byCode;
  });
  if (duplicate) {
    return {
      ok: false,
      status: 409,
      error: "You've already got that language or an equivalent request on file.",
    };
  }

  const now = new Date();
  const doc = {
    userId,
    status: 'pending' as const,
    requestedName,
    requestedKey,
    requestedAt: now,
    nameEnglish: '',
    nameNative: '',
    code: null,
    deniedReason: null,
    createdAt: now,
    updatedAt: now,
    archivedAt: null,
  };

  const result = await (await languageCollection()).insertOne(doc);
  return {
    ok: true,
    language: toUserLanguageRequest({
      ...doc,
      _id: result.insertedId,
    } as Document & { _id: { toString(): string } }),
  };
}

export async function withdrawUserLanguageRequest(
  userId: string,
  languageId: string,
): Promise<{ ok: true } | { ok: false; status: 400 | 404 | 409; error: string }> {
  const rawId = languageId.trim();
  if (!rawId || rawId.length !== 24 || !ObjectId.isValid(rawId)) {
    return { ok: false, status: 400, error: 'Unknown language request.' };
  }

  const collection = await languageCollection();
  const _id = new ObjectId(rawId);
  const doc = await collection.findOne({ _id, userId, archivedAt: null });
  if (!doc) {
    return { ok: false, status: 404, error: 'Unknown language request.' };
  }

  if (asStatus(doc.status) === 'approved') {
    return {
      ok: false,
      status: 409,
      error: 'That language was approved for you. Ask a SILICON administrator to remove it.',
    };
  }

  await collection.updateOne(
    { _id, userId, archivedAt: null },
    { $set: { archivedAt: new Date(), updatedAt: new Date() } },
  );
  return { ok: true };
}
