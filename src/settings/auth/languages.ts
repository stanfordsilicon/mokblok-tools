import getMongoClient, { siliconDbName } from '../../mongodb';

import { userFilter } from './roles';

import type { Document, Filter } from 'mongodb';

export const USER_LANGUAGE_GRANTS_COLLECTION = 'homescreen_review_languages';

function cleanLanguageCode(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase().slice(0, 32) : '';
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

  const client = await getMongoClient();
  const grants = await client
    .db(siliconDbName())
    .collection(USER_LANGUAGE_GRANTS_COLLECTION)
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
