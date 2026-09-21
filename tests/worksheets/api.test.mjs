import assert from 'node:assert/strict';
import { mock, test } from 'node:test';
import { NextResponse } from 'next/server.js';

let role = 'admin';
let published;
let calls = 0;
mock.module('../../src/settings/auth/roles.ts', {
  namedExports: {
    requireRole: async (required) =>
      role === 'signed-out'
        ? { ok: false, status: 401, error: 'Not signed in' }
        : required === 'admin' && role !== 'admin'
          ? { ok: false, status: 403, error: 'Requires admin' }
          : { ok: true, role, userId: 'actor' },
    roleDenied: (check) => NextResponse.json({ error: check.error }, { status: check.status }),
    hasLevel: (actual, expected) => actual === expected || actual === 'admin',
  },
});
mock.module('../../src/settings/auth/languages.ts', {
  namedExports: { getUserLanguageCodes: async () => ['kri'] },
});
mock.module('../../src/data/worksheets/server/repository.ts', {
  namedExports: {
    publishWorksheet: async (input, actor) => {
      calls++;
      published = { input, actor };
      return input.expectedRevision === 99 ? null : { revision: 1, unchanged: false };
    },
    worksheetsCollection: async () => ({ find: () => ({ toArray: async () => [] }) }),
  },
});
const { PUT } = await import('../../app/api/admin/worksheets/[language]/[worksheetKey]/route.ts');
const { GET } = await import('../../app/api/worksheets/[language]/route.ts');
const { readWorksheetBody, assertWriteOrigin } =
  await import('../../src/data/worksheets/server/http.ts');
const origin = new URL(process.env.AUTH_URL ?? 'http://localhost:3000').origin;
const body = {
  content: 'id\tENGLISH\tTRANSLATION IN YOUR LANGUAGE\nkey\tHello\tBonjour\n',
  expectedRevision: 0,
};
const context = { params: Promise.resolve({ language: 'kri', worksheetKey: '2_2' }) };
const request = (payload = body, originHeader = origin) =>
  new Request(origin + '/api/admin/worksheets/kri/2_2', {
    method: 'PUT',
    headers: { origin: originHeader, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

test('upload checks auth each time, including admin demotion, before reading content', async () => {
  role = 'signed-out';
  assert.equal((await PUT(request(), context)).status, 401);
  role = 'user';
  assert.equal((await PUT(request(), context)).status, 403);
  role = 'admin';
  assert.equal((await PUT(request(), context)).status, 201);
  assert.equal(published.actor, 'actor');
  assert.equal(published.input.content, body.content);
  role = 'user';
  assert.equal((await PUT(request(), context)).status, 403);
  assert.equal(calls, 1);
});
test('invalid, cross-origin, oversized, and stale uploads never silently publish', async () => {
  role = 'admin';
  assert.equal((await PUT(request(body, 'https://wrong.example'), context)).status, 403);
  assert.equal((await PUT(request({ ...body, content: 'not TSV' }), context)).status, 422);
  assert.equal((await PUT(request({ ...body, expectedRevision: -1 }), context)).status, 400);
  assert.equal(
    (await PUT(request({ ...body, content: 'x'.repeat(1048577) }), context)).status,
    413,
  );
  assert.equal((await PUT(request({ ...body, expectedRevision: 99 }), context)).status, 409);
});
test('language reads require assignment unless administrator', async () => {
  role = 'user';
  assert.equal(
    (await GET(new Request(origin), { params: Promise.resolve({ language: 'mg' }) })).status,
    403,
  );
  const response = await GET(new Request(origin), { params: Promise.resolve({ language: 'kri' }) });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { worksheets: {} });
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  role = 'admin';
  assert.equal(
    (await GET(new Request(origin), { params: Promise.resolve({ language: 'mg' }) })).status,
    200,
  );
});
test('bounded JSON reader rejects bad UTF-8 and checks streamed bytes without Content-Length', async () => {
  assert.throws(() => assertWriteOrigin(new Request(origin)), /same-origin/);
  await assert.rejects(
    readWorksheetBody(
      new Request(origin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: new Uint8Array([0xff]),
      }),
    ),
    /UTF-8/,
  );
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(7 * 1024 * 1024));
      controller.close();
    },
  });
  await assert.rejects(
    readWorksheetBody(
      new Request(origin, {
        method: 'POST',
        duplex: 'half',
        headers: { 'Content-Type': 'application/json' },
        body: stream,
      }),
    ),
    /too large/,
  );
});
