import { createHash } from 'node:crypto';

import getMongoClient, { siliconDbName } from '../../../mongodb';

import type { WorksheetKey } from '../storageTypes';

export const WORKSHEETS_COLLECTION = 'homescreen_review_worksheets';
export type StoredWorksheet = {
  targetLanguage: string;
  worksheetKey: WorksheetKey;
  format: 'tsv' | 'txt';
  content: string;
  originalFilename: string | null;
  sha256: string;
  byteLength: number;
  parsedRowCount: number;
  validationVersion: number;
  revision: number;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
};

export async function worksheetsCollection() {
  const client = await getMongoClient();
  return client.db(siliconDbName()).collection<StoredWorksheet>(WORKSHEETS_COLLECTION);
}

// Await index setup before any write, including the first simultaneous uploads.
let indexReady: Promise<string> | undefined;
export async function ensureWorksheetIndex() {
  indexReady ??= worksheetsCollection()
    .then((collection) =>
      collection.createIndex({ targetLanguage: 1, worksheetKey: 1 }, { unique: true }),
    )
    .catch((error) => {
      indexReady = undefined;
      throw error;
    });
  await indexReady;
}

export function worksheetHash(content: string) {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

export async function publishWorksheet(
  input: {
    targetLanguage: string;
    worksheetKey: WorksheetKey;
    content: string;
    originalFilename: string | null;
    expectedRevision: number;
    parsedRowCount: number;
  },
  userId: string,
): Promise<{ revision: number; unchanged: boolean } | null> {
  await ensureWorksheetIndex();
  const collection = await worksheetsCollection();
  const {
    targetLanguage,
    worksheetKey,
    content,
    originalFilename,
    expectedRevision,
    parsedRowCount,
  } = input;
  const identity = { targetLanguage, worksheetKey };
  const now = new Date();
  const values = {
    content,
    originalFilename,
    sha256: worksheetHash(content),
    byteLength: Buffer.byteLength(content, 'utf8'),
    parsedRowCount,
    validationVersion: 1,
    updatedAt: now,
    updatedBy: userId,
    format: worksheetKey === '3' || worksheetKey === '4' ? ('txt' as const) : ('tsv' as const),
  };
  if (expectedRevision === 0) {
    try {
      await collection.insertOne({
        ...identity,
        ...values,
        revision: 1,
        createdAt: now,
        createdBy: userId,
      });
      return { revision: 1, unchanged: false };
    } catch (error) {
      if ((error as { code?: number }).code === 11000) return null;
      throw error;
    }
  }
  const current = await collection.findOne({ ...identity, revision: expectedRevision });
  if (!current) return null;
  if (current.sha256 === values.sha256) return { revision: expectedRevision, unchanged: true };
  const result = await collection.updateOne(
    { ...identity, revision: expectedRevision },
    {
      $set: values,
      $inc: { revision: 1 },
    },
  );
  return result.matchedCount ? { revision: expectedRevision + 1, unchanged: false } : null;
}
