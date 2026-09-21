import assert from 'node:assert/strict';
import { afterEach, mock, test } from 'node:test';
import { loadWorksheetBundle, loadWorksheetLanguages } from '../../src/data/worksheets/loadWorksheetBundle.ts';

const signal = () => new AbortController().signal;
const json = (body, status = 200) => Response.json(body, { status });
afterEach(() => mock.restoreAll());

test('database entries win, including empty content; only missing worksheets use public files', async () => {
  const requests = [];
  mock.method(globalThis, 'fetch', async (url) => {
    requests.push(url);
    if (url.startsWith('/api/')) return json({ worksheets: { '1': { content: 'database', revision: 4 }, '3': { content: '', revision: 2 } } });
    if (url.endsWith('_2_1.tsv')) return new Response('bundled');
    return new Response('not found', { status: 404 });
  });
  const result = await loadWorksheetBundle('mg', signal());
  assert.deepEqual(result, { '1': { content: 'database', revision: 4 }, '3': { content: '', revision: 2 }, '2_1': { content: 'bundled', revision: 0 } });
  assert(!requests.some((url) => url.endsWith('/mg_1.tsv') || url.endsWith('/mg_3.txt')));
});

test('empty database and failed database both use available TSV and text files', async () => {
  for (const status of [200, 401, 503]) {
    mock.method(globalThis, 'fetch', async (url) => {
      if (url.startsWith('/api/')) return json({ worksheets: {}, error: 'offline' }, status);
      if (url.endsWith('/mg_1.tsv') || url.endsWith('/mg_4.txt')) return new Response('source');
      return new Response('<html>not found</html>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    });
    const result = await loadWorksheetBundle('mg', signal());
    assert.deepEqual(Object.keys(result).sort(), ['1', '4']);
    mock.restoreAll();
  }
});

test('failure remains visible when neither database nor public files provide data', async () => {
  mock.method(globalThis, 'fetch', async (url) => url.startsWith('/api/') ? json({ error: 'Database unavailable' }, 503) : new Response('', { status: 404 }));
  await assert.rejects(loadWorksheetBundle('kri', signal()), /Database unavailable/);
});

test('catalog merges database languages with bundled languages and works offline', async () => {
  let offline = false;
  mock.method(globalThis, 'fetch', async (url) => url === '/api/worksheet-files' ? json({ languages: ['mg'] }) : offline ? json({ error: 'offline' }, 503) : json({ worksheets: [{ targetLanguage: 'kri' }, { targetLanguage: 'mg' }] }));
  assert.deepEqual(await loadWorksheetLanguages(signal()), ['kri', 'mg']);
  offline = true;
  assert.deepEqual(await loadWorksheetLanguages(signal()), ['mg']);
});

test('aborted loads do not launch fallback requests', async () => {
  const controller = new AbortController();
  let requests = 0;
  mock.method(globalThis, 'fetch', async () => { requests++; controller.abort(); throw new DOMException('Aborted', 'AbortError'); });
  await assert.rejects(loadWorksheetBundle('mg', controller.signal), { name: 'AbortError' });
  assert.equal(requests, 1);
});
