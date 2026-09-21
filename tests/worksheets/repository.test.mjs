import assert from 'node:assert/strict';
import { mock, test } from 'node:test';

let stored = null;
let indexes = 0;
const collection = {
  async createIndex(keys, options) {
    assert.deepEqual(keys, { targetLanguage: 1, worksheetKey: 1 });
    assert.equal(options.unique, true);
    indexes++;
    return 'unique_worksheet';
  },
  async insertOne(document) {
    if (stored) throw Object.assign(new Error('duplicate'), { code: 11000 });
    stored = structuredClone(document);
  },
  async findOne(filter) {
    return stored?.revision === filter.revision ? structuredClone(stored) : null;
  },
  async updateOne(filter, operation) {
    if (stored?.revision !== filter.revision) return { matchedCount: 0 };
    stored = { ...stored, ...operation.$set, revision: stored.revision + operation.$inc.revision };
    return { matchedCount: 1 };
  },
};
mock.module('../../src/mongodb.ts', {
  defaultExport: async () => ({
    db: () => ({
      collection: (name) => {
        assert.equal(name, 'homescreen_review_worksheets');
        return collection;
      },
    }),
  }),
  namedExports: { siliconDbName: () => 'test' },
});
const { publishWorksheet } = await import('../../src/data/worksheets/server/repository.ts');
const input = {
  targetLanguage: 'kri',
  worksheetKey: '1',
  content: 'original\r\ntext\t😀',
  originalFilename: 'kri_1.tsv',
  parsedRowCount: 1,
  expectedRevision: 0,
};

test('simultaneous creates and replacements have one winner; original content and attribution survive', async () => {
  const creates = await Promise.all([
    publishWorksheet(input, 'admin-a'),
    publishWorksheet(input, 'admin-b'),
  ]);
  assert.equal(creates.filter(Boolean).length, 1);
  assert.equal(indexes, 1);
  assert.equal(stored.content, input.content);
  assert.equal(stored.byteLength, Buffer.byteLength(input.content));
  assert.equal(stored.createdBy, 'admin-a');
  const replacements = await Promise.all([
    publishWorksheet({ ...input, expectedRevision: 1, content: 'replacement-a' }, 'admin-c'),
    publishWorksheet({ ...input, expectedRevision: 1, content: 'replacement-b' }, 'admin-d'),
  ]);
  assert.equal(replacements.filter(Boolean).length, 1);
  assert.equal(stored.revision, 2);
  assert.equal(stored.createdBy, 'admin-a');
  assert.equal(stored.updatedBy, 'admin-c');
  assert.equal(await publishWorksheet({ ...input, expectedRevision: 1 }, 'admin-b'), null);
  const unchanged = await publishWorksheet(
    { ...input, content: stored.content, expectedRevision: 2 },
    'admin-b',
  );
  assert.deepEqual(unchanged, { revision: 2, unchanged: true });
  assert.equal(stored.updatedBy, 'admin-c');
});
