// Tagged, removable bulk worksheet import.
// Run with: node --env-file=.env.local --import ./scripts/lib/register-typescript.mjs \
//   scripts/worksheet-batch.mjs <plan|register|unregister|apply|status|remove> --source <dir> --batch <id>
//
// Every worksheet in a batch is inserted as revision 1 with createdBy/updatedBy `batch:<id>`, and
// the batch manifest (<source>/batch-manifest.json) records each file's sha256. `remove` deletes only
// documents that still carry that tag at revision 1 with the uploaded hash, so admin re-uploads and
// pre-existing worksheets are never touched. Existing worksheets are skipped, never replaced.
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { isWorksheetKey, normalizeWorksheetLanguage } from '../src/data/worksheets/storageTypes.ts';
import { validateWorksheet } from '../src/data/worksheets/validateWorksheet.ts';

const [command, ...args] = process.argv.slice(2);
const option = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const sourceArg = option('--source');
const batchId = option('--batch');
const force = args.includes('--force');
if (!['plan', 'register', 'unregister', 'apply', 'status', 'remove'].includes(command))
  throw new Error('Usage: worksheet-batch.mjs <plan|register|unregister|apply|status|remove> ...');
if (!sourceArg || !batchId || !/^[a-z0-9][a-z0-9-]{2,63}$/.test(batchId))
  throw new Error(
    '--source <dir> and --batch <id> (lowercase letters, digits, dashes) are required.',
  );

const root = path.resolve(sourceArg);
const manifestPath = path.join(root, 'batch-manifest.json');
const registryPath = 'public/languageNames.tsv';
const tag = `batch:${batchId}`;
const hash = (content) => createHash('sha256').update(content, 'utf8').digest('hex');

async function readJSON(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw error;
  }
}
const manifest = await readJSON(manifestPath, { batchId, registryRows: [], files: [] });
if (manifest.batchId !== batchId)
  throw new Error(`Manifest belongs to batch ${manifest.batchId}, not ${batchId}.`);
const saveManifest = () => writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

async function readRegistry() {
  const text = await readFile(registryPath, 'utf8');
  return {
    text,
    codes: new Set(
      text
        .split(/\r?\n/)
        .slice(1)
        .map((line) => line.split('\t')[0].toLowerCase()),
    ),
  };
}

async function inventory() {
  const { codes } = await readRegistry();
  const bundled = new Set(await readdir('public/input_tsvs').catch(() => []));
  const items = [];
  for (const filename of (await readdir(root)).sort()) {
    const match = filename.match(/^(.+?)_(2_[123]|[134])\.(tsv|txt)$/);
    if (!match) continue;
    const targetLanguage = normalizeWorksheetLanguage(match[1]);
    const worksheetKey = match[2];
    if (
      !isWorksheetKey(worksheetKey) ||
      (['3', '4'].includes(worksheetKey) ? 'txt' : 'tsv') !== match[3]
    )
      throw new Error(`Unsupported source filename: ${filename}`);
    const content = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(
      await readFile(path.join(root, filename)),
    );
    items.push({
      filename,
      targetLanguage,
      worksheetKey,
      content,
      sha256: hash(content),
      validation: validateWorksheet(content, worksheetKey),
      registered: codes.has(targetLanguage.split('-')[0]),
      bundled: bundled.has(filename),
    });
  }
  return items;
}

async function database() {
  const { worksheetsCollection, publishWorksheet } =
    await import('../src/data/worksheets/server/repository.ts');
  const { default: getMongoClient, siliconDbName } = await import('../src/mongodb.ts');
  const client = await getMongoClient();
  return {
    worksheets: await worksheetsCollection(),
    drafts: client.db(siliconDbName()).collection('homescreen_review_edits'),
    publishWorksheet,
    close: () => client.close(),
  };
}

if (command === 'plan') {
  const items = await inventory();
  for (const item of items)
    console.log(
      `${item.validation.valid ? 'OK     ' : 'INVALID'} ${item.filename}: ${item.validation.parsedRowCount} rows` +
        `${item.registered ? '' : ' [unregistered]'}${item.bundled ? ' [bundled file exists: will skip]' : ''}` +
        `${item.validation.errors.length ? ' ' + item.validation.errors.join('; ') : ''}`,
    );
  const invalid = items.filter((item) => !item.validation.valid).length;
  const unregistered = items.filter((item) => !item.registered).length;
  console.log(
    `${items.length} worksheets, ${invalid} invalid, ${unregistered} need registry rows.`,
  );
}

if (command === 'register') {
  // Placeholder names (English in every column) come from the converter's report.
  const report = await readJSON(path.join(root, 'conversion-report.json'), []);
  const names = Object.fromEntries(report.map((row) => [row.code, row.language]));
  const { text, codes } = await readRegistry();
  const rows = [];
  for (const item of await inventory()) {
    const code = item.targetLanguage;
    if (codes.has(code) || rows.some((row) => row.startsWith(code + '\t'))) continue;
    const name = (names[code] ?? code).replace(/\t/g, ' ');
    rows.push([code, name, name, name, name, name, name].join('\t'));
  }
  if (rows.length) {
    manifest.registryEndedWithNewline ??= text.endsWith('\n');
    await writeFile(registryPath, text.replace(/\r?\n?$/, '\n') + rows.join('\n') + '\n');
    manifest.registryRows.push(...rows);
    await saveManifest();
  }
  console.log(`Added ${rows.length} registry rows to ${registryPath}.`);
}

if (command === 'unregister') {
  const added = new Set(manifest.registryRows);
  const { text } = await readRegistry();
  const lines = text.split('\n');
  const kept = lines.filter((line) => !added.has(line.replace(/\r$/, '')));
  let restored = kept.join('\n');
  if (manifest.registryEndedWithNewline === false) restored = restored.replace(/\n$/, '');
  await writeFile(registryPath, restored);
  console.log(`Removed ${lines.length - kept.length} registry rows added by ${tag}.`);
  manifest.registryRows = [];
  delete manifest.registryEndedWithNewline;
  await saveManifest();
}

if (command === 'apply') {
  const items = await inventory();
  const blocked = items.filter((item) => !item.validation.valid || !item.registered);
  if (blocked.length)
    throw new Error(
      `Invalid or unregistered: ${blocked.map((item) => item.filename).join(', ')}. No writes started.`,
    );
  const db = await database();
  try {
    for (const item of items) {
      const recorded = manifest.files.find((file) => file.filename === item.filename);
      const existing = await db.worksheets.findOne(
        { targetLanguage: item.targetLanguage, worksheetKey: item.worksheetKey },
        { projection: { content: 0 } },
      );
      if (existing?.createdBy === tag && existing.sha256 === item.sha256) {
        console.log(`Already uploaded ${item.filename}`);
        continue;
      }
      if (existing || item.bundled) {
        console.log(
          `SKIP ${item.filename}: a worksheet already exists for ${item.targetLanguage}/${item.worksheetKey}`,
        );
        if (!recorded) manifest.files.push({ filename: item.filename, status: 'skipped-existing' });
        continue;
      }
      const result = await db.publishWorksheet(
        {
          targetLanguage: item.targetLanguage,
          worksheetKey: item.worksheetKey,
          content: item.content,
          originalFilename: `${batchId}/${item.filename}`,
          expectedRevision: 0,
          parsedRowCount: item.validation.parsedRowCount,
        },
        tag,
      );
      if (!result) {
        console.log(`SKIP ${item.filename}: created concurrently by someone else`);
        continue;
      }
      const stored = await db.worksheets.findOne({
        targetLanguage: item.targetLanguage,
        worksheetKey: item.worksheetKey,
      });
      if (stored?.sha256 !== item.sha256 || hash(stored.content) !== item.sha256)
        throw new Error(`Verification failed: ${item.filename}`);
      manifest.files = manifest.files.filter((file) => file.filename !== item.filename);
      manifest.files.push({
        filename: item.filename,
        targetLanguage: item.targetLanguage,
        worksheetKey: item.worksheetKey,
        sha256: item.sha256,
        status: 'uploaded',
        uploadedAt: new Date().toISOString(),
      });
      await saveManifest(); // Record each write as it lands so a partial run stays removable.
      console.log(`Uploaded ${item.filename} (${item.validation.parsedRowCount} rows)`);
    }
  } finally {
    await saveManifest();
    await db.close();
  }
  const uploaded = manifest.files.filter((file) => file.status === 'uploaded').length;
  console.log(
    `${tag}: ${uploaded} worksheets uploaded. Remove with: remove --source ${sourceArg} --batch ${batchId}`,
  );
}

if (command === 'status' || command === 'remove') {
  const db = await database();
  try {
    const docs = await db.worksheets
      .find({ createdBy: tag }, { projection: { content: 0 } })
      .sort({ targetLanguage: 1, worksheetKey: 1 })
      .toArray();
    const languages = [...new Set(docs.map((doc) => doc.targetLanguage))];
    const drafts = await db.drafts.countDocuments({ targetLanguage: { $in: languages } });
    let removed = 0;
    for (const doc of docs) {
      const recorded = manifest.files.find(
        (file) =>
          file.targetLanguage === doc.targetLanguage && file.worksheetKey === doc.worksheetKey,
      );
      const pristine =
        doc.revision === 1 && doc.updatedBy === tag && recorded?.sha256 === doc.sha256;
      const label = `${doc.targetLanguage}/${doc.worksheetKey} rev ${doc.revision}`;
      if (command === 'status') {
        console.log(`${pristine ? 'batch  ' : 'CHANGED'} ${label} (updated by ${doc.updatedBy})`);
        continue;
      }
      if (!pristine && !force) {
        console.log(
          `KEEP ${label}: changed since upload by ${doc.updatedBy}; rerun with --force to delete`,
        );
        continue;
      }
      // Match on the full identity so a concurrent re-upload is never deleted.
      const result = await db.worksheets.deleteOne({
        _id: doc._id,
        createdBy: tag,
        revision: doc.revision,
        sha256: doc.sha256,
      });
      removed += result.deletedCount;
      if (result.deletedCount) {
        manifest.files = manifest.files.filter((file) => file !== recorded);
        console.log(`Removed ${label}`);
      }
    }
    console.log(
      `${tag}: ${docs.length} worksheets tagged${command === 'remove' ? `, ${removed} removed` : ''}. ` +
        `${drafts} reviewer draft(s) exist for these languages (left untouched).`,
    );
  } finally {
    if (command === 'remove') await saveManifest();
    await db.close();
  }
}
