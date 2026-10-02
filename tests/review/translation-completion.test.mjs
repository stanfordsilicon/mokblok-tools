import assert from 'node:assert/strict';
import test from 'node:test';
import { shallow } from 'zustand/vanilla/shallow';

import { getTranslationCompletion } from '../../src/data/target/getTranslationCompletion.ts';
import { Vote } from '../../src/data/target/types.ts';

const entries = [{ id: 'a' }, { id: 'b' }, { id: 'unloaded' }];
const baselines = {
  a: { id: 'a', source: 'Source A', translation: 'Translation A' },
  b: { id: 'b', source: 'Source B' },
};

test('completion ignores source fallbacks and entries without baselines', () => {
  assert.deepEqual(
    getTranslationCompletion(entries, baselines, {
      unloaded: { id: 'unloaded', edit: 'Not loaded', vote: Vote.Accept },
    }),
    { count: 1, accepted: 0, rejected: 0, total: 2 },
  );
});

test('explicit empty edits override baseline translations and votes remain counted', () => {
  assert.deepEqual(
    getTranslationCompletion(entries, baselines, {
      a: { id: 'a', edit: '', vote: Vote.Reject },
      b: { id: 'b', edit: 'New translation', vote: Vote.Accept },
    }),
    { count: 1, accepted: 1, rejected: 1, total: 2 },
  );
});

test('typing and commenting keep the progress subscription shallow-equal', () => {
  const before = getTranslationCompletion(entries, baselines, {});
  for (const edit of ['T', 'Ty', 'Typing', 'Typing more']) {
    const after = getTranslationCompletion(entries, baselines, {
      a: { id: 'a', edit, comment: edit },
      unrelated: { id: 'unrelated', edit },
    });
    assert.ok(shallow(before, after));
  }
  assert.ok(
    !shallow(
      before,
      getTranslationCompletion(entries, baselines, {
        a: { id: 'a', edit: '' },
      }),
    ),
  );
  assert.ok(
    !shallow(
      before,
      getTranslationCompletion(entries, baselines, {
        b: { id: 'b', vote: Vote.Accept },
      }),
    ),
  );
});
