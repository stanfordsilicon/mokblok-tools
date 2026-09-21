// Run with: node --import ./scripts/lib/register-typescript.mjs scripts/migrate-worksheets.mjs
import { createHash } from 'node:crypto';
import { readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { isWorksheetKey, normalizeWorksheetLanguage } from '../src/data/worksheets/storageTypes.ts';
import { validateWorksheet } from '../src/data/worksheets/validateWorksheet.ts';

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const direct = args.includes('--direct-db');
const prune = args.includes('--prune-source');
const originIndex = args.indexOf('--origin');
const origin = originIndex >= 0 ? new URL(args[originIndex + 1]).origin : null;
const cookie = process.env.WORKSHEET_ADMIN_COOKIE;
if (apply && !direct && (!origin || !cookie))
  throw new Error(
    '--apply needs --origin and WORKSHEET_ADMIN_COOKIE from an authenticated admin session.',
  );
if (prune && !apply)
  throw new Error('--prune-source requires --apply and successful remote verification.');
const sourceIndex = args.indexOf('--source');
const root = path.resolve(sourceIndex >= 0 ? args[sourceIndex + 1] : 'public/input_tsvs');
const hash = (content) => createHash('sha256').update(content).digest('hex');
const inventory = [];
const registered = new Set(
  (await readFile('public/languageNames.tsv', 'utf8'))
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.split('\t')[0].toLowerCase()),
);
const sourceFiles = await readdir(root).catch((error) => {
  if (error.code !== 'ENOENT') throw error;
  throw new Error(
    'Source directory is absent after migration. Use --source <directory> for an external worksheet backup.',
  );
});
if (!sourceFiles.some((filename) => !filename.startsWith('.'))) {
  console.log('No worksheet source files to migrate; existing manifest retained.');
  process.exit(0);
}
for (const filename of sourceFiles.sort()) {
  if (filename.startsWith('.')) continue;
  const match = filename.match(/^(.+?)_(2_[123]|[134])\.(tsv|txt)$/);
  if (!match || !isWorksheetKey(match[2]))
    throw new Error(`Unsupported source filename: ${filename}`);
  const targetLanguage = normalizeWorksheetLanguage(match[1]);
  if (!registered.has(targetLanguage.split('-')[0]))
    throw new Error(`Unregistered language: ${targetLanguage}`);
  const worksheetKey = match[2];
  if ((['3', '4'].includes(worksheetKey) ? 'txt' : 'tsv') !== match[3])
    throw new Error(`Wrong file extension: ${filename}`);
  const content = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(
    await readFile(path.join(root, filename)),
  );
  const validation = validateWorksheet(content, worksheetKey);
  inventory.push({
    filename,
    targetLanguage,
    worksheetKey,
    content,
    sha256: hash(content),
    validation,
  });
  console.log(
    `${validation.valid ? 'OK' : 'INVALID'} ${filename}: ${validation.parsedRowCount} rows${validation.errors.length ? ': ' + validation.errors.join('; ') : ''}`,
  );
}
if (inventory.some((item) => !item.validation.valid))
  throw new Error('Resolve validation errors before migrating. No data was written.');

async function api(route, method = 'GET', body) {
  // Explicit operator bootstrap uses existing database credentials, never a forged user session.
  if (direct) {
    const { worksheetsCollection, publishWorksheet } =
      await import('../src/data/worksheets/server/repository.ts');
    const collection = await worksheetsCollection();
    if (route === '/api/admin/worksheets')
      return { worksheets: await collection.find({}, { projection: { content: 0 } }).toArray() };
    if (method === 'PUT') {
      const parts = route.split('/');
      const worksheetKey = parts.pop();
      const targetLanguage = parts.pop();
      const validation = validateWorksheet(body.content, worksheetKey);
      if (!validation.valid) throw new Error(validation.errors.join('; '));
      const result = await publishWorksheet(
        { ...body, targetLanguage, worksheetKey, parsedRowCount: validation.parsedRowCount },
        'migration:repository',
      );
      if (!result) throw new Error(`Concurrent change: ${targetLanguage}/${worksheetKey}`);
      return result;
    }
    const targetLanguage = route.split('/').pop();
    const docs = await collection.find({ targetLanguage }).toArray();
    return {
      worksheets: Object.fromEntries(
        docs.map((doc) => [doc.worksheetKey, { content: doc.content }]),
      ),
    };
  }
  const response = await fetch(origin + route, {
    method,
    redirect: 'error',
    headers: {
      Cookie: cookie,
      Origin: origin,
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(`${response.status} ${result.error ?? JSON.stringify(result.validation)}`);
  return result;
}

if (apply) {
  const { worksheets } = await api('/api/admin/worksheets');
  // Preflight every conflict before starting writes. Replacements are a separate admin action.
  for (const item of inventory) {
    const existing = worksheets.find(
      (doc) => doc.targetLanguage === item.targetLanguage && doc.worksheetKey === item.worksheetKey,
    );
    if (existing && existing.sha256 !== item.sha256)
      throw new Error(
        `Conflict: ${item.filename} differs from published revision ${existing.revision}. No writes started.`,
      );
  }
  for (const item of inventory) {
    const existing = worksheets.find(
      (doc) => doc.targetLanguage === item.targetLanguage && doc.worksheetKey === item.worksheetKey,
    );
    if (!existing)
      await api(`/api/admin/worksheets/${item.targetLanguage}/${item.worksheetKey}`, 'PUT', {
        content: item.content,
        originalFilename: item.filename,
        expectedRevision: 0,
      });
    const bundle = await api(`/api/worksheets/${item.targetLanguage}`);
    if (hash(bundle.worksheets[item.worksheetKey]?.content ?? '') !== item.sha256)
      throw new Error(`Verification failed: ${item.filename}. Sources retained.`);
    console.log(`Verified ${item.filename}`);
  }
  await writeFile(
    'worksheet-migration-manifest.json',
    JSON.stringify(
      {
        verifiedAt: new Date().toISOString(),
        destination: direct ? 'configured MongoDB database' : origin,
        files: inventory.map(({ filename, sha256, targetLanguage, worksheetKey }) => ({
          filename,
          sha256,
          targetLanguage,
          worksheetKey,
        })),
      },
      null,
      2,
    ) + '\n',
  );
  // Delete only after all uploads and reads succeeded, and after a durable manifest exists.
  if (prune) for (const item of inventory) await unlink(path.join(root, item.filename));
}
console.log(
  `${apply ? 'Verified migration of' : 'Dry run validated'} ${inventory.length} worksheets. ${prune ? 'Migrated source files removed.' : 'Source files retained.'}`,
);

if (direct && apply) {
  const { default: getMongoClient } = await import('../src/mongodb.ts');
  await (await getMongoClient()).close();
}
