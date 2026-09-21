'use client';

import { useEffect, useRef, useState } from 'react';

import {
  isWorksheetKey,
  MAX_WORKSHEET_BYTES,
  WORKSHEET_KEYS,
  type WorksheetKey,
  type WorksheetMetadata,
} from '../../../src/data/worksheets/storageTypes';

import type { WorksheetValidation } from '../../../src/data/worksheets/validateWorksheet';

type AdminMetadata = WorksheetMetadata & { updatedBy: string };
type Preview = { validation: WorksheetValidation; expectedRevision: number };

export default function WorksheetManager() {
  const [worksheets, setWorksheets] = useState<AdminMetadata[]>([]);
  const [targetLanguage, setLanguage] = useState('');
  const [worksheetKey, setKey] = useState<WorksheetKey>('1');
  const [content, setContent] = useState('');
  const [filename, setFilename] = useState<string | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [busy, setBusy] = useState(false);
  const [catalogReady, setCatalogReady] = useState(false);
  const [message, setMessage] = useState('');
  const fileRead = useRef(0);

  async function refresh() {
    setPreview(null);
    setCatalogReady(false);
    const response = await fetch('/api/admin/worksheets', { cache: 'no-store' });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error);
    setWorksheets(body.worksheets);
    setCatalogReady(true);
  }
  useEffect(() => {
    refresh().catch((error) => setMessage(error.message));
  }, []);

  function changed() {
    setPreview(null);
    setMessage('');
  }
  const current = worksheets.find(
    (item) =>
      item.targetLanguage === targetLanguage.trim().toLowerCase() &&
      item.worksheetKey === worksheetKey,
  );

  async function validate() {
    setBusy(true);
    setMessage('');
    setPreview(null);
    const expectedRevision = current?.revision ?? 0;
    try {
      const response = await fetch('/api/admin/worksheets/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetLanguage,
          worksheetKey,
          content,
          originalFilename: filename,
          expectedRevision,
        }),
      });
      const body = await response.json();
      if (body.validation) setPreview({ validation: body.validation, expectedRevision });
      else throw new Error(body.error ?? 'Unable to validate worksheet.');
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (!preview?.validation.valid) return;
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch(
        `/api/admin/worksheets/${encodeURIComponent(targetLanguage.trim())}/${worksheetKey}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content,
            originalFilename: filename,
            expectedRevision: preview.expectedRevision,
          }),
        },
      );
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? 'Unable to publish worksheet.');
      setPreview(null);
      setMessage(
        body.unchanged
          ? `Already published at revision ${body.revision}.`
          : `Published revision ${body.revision}. Reviewers receive it on their next load.`,
      );
      await refresh();
    } catch (error) {
      setMessage((error as Error).message);
      setPreview(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <p>
        Upload a worksheet or paste cells copied from a spreadsheet. Publishing replaces the shared
        starting data for that worksheet. Saved reviewer edits remain separate.
      </p>
      <fieldset disabled={busy} className="space-y-4 rounded-xl border p-4">
        <legend className="font-bold">Upload worksheet</legend>
        <div className="flex flex-wrap gap-4">
          <label>
            Language code{' '}
            <input
              aria-label="Language code"
              value={targetLanguage}
              placeholder="kri"
              maxLength={32}
              onChange={(event) => {
                changed();
                setLanguage(event.target.value);
              }}
            />
          </label>
          <label>
            Worksheet{' '}
            <select
              value={worksheetKey}
              onChange={(event) => {
                changed();
                setKey(event.target.value as WorksheetKey);
              }}
            >
              {WORKSHEET_KEYS.map((key) => (
                <option key={key} value={key}>
                  {key.replace('_', ' part ')}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          Choose UTF-8 file (up to 1 MiB)
          <input
            type="file"
            accept=".tsv,.txt"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              const readId = ++fileRead.current;
              changed();
              if (!file) return;
              if (file.size > MAX_WORKSHEET_BYTES) {
                setMessage('File exceeds the 1 MiB limit.');
                return;
              }
              setBusy(true);
              try {
                const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(
                  await file.arrayBuffer(),
                );
                if (readId !== fileRead.current) return;
                setContent(text);
                setFilename(file.name);
                const match = file.name.match(/^(.+?)_(2_[123]|[134])\.(tsv|txt)$/i);
                if (match && isWorksheetKey(match[2])) {
                  setLanguage(match[1]);
                  setKey(match[2]);
                }
              } catch {
                setMessage('File must contain valid UTF-8 text.');
              } finally {
                if (readId === fileRead.current) setBusy(false);
              }
            }}
          />
        </label>
        <label className="block">
          Worksheet text
          <textarea
            className="block min-h-64 w-full font-mono text-sm border rounded-md bg-input"
            value={content}
            onChange={(event) => {
              changed();
              setFilename(null);
              setContent(event.target.value);
            }}
          />
        </label>
        <p>
          {current
            ? `Replaces revision ${current.revision} (updated ${new Date(current.updatedAt).toLocaleString()}).`
            : 'Creates a new worksheet.'}
        </p>
        <button disabled={!catalogReady || !content || !targetLanguage} onClick={validate}>
          Validate and preview
        </button>
        {preview && (
          <div className="space-y-2 rounded border p-3">
            <p>
              {preview.validation.parsedRowCount} usable rows ·{' '}
              {preview.validation.translatedRowCount} translated rows
            </p>
            {preview.validation.errors.map((error) => (
              <p role="alert" key={error}>
                {error}
              </p>
            ))}
            {preview.validation.warnings.map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
            {preview.validation.valid && (
              <button onClick={publish}>
                {preview.expectedRevision
                  ? `Publish replacement for revision ${preview.expectedRevision}`
                  : 'Publish new worksheet'}
              </button>
            )}
          </div>
        )}
      </fieldset>
      <p role="status" aria-live="polite">
        {busy ? 'Working…' : message}
      </p>
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold">Published worksheets</h2>
        <button
          disabled={busy}
          onClick={() => {
            setMessage('');
            refresh().catch((error) => setMessage(error.message));
          }}
        >
          Refresh list and revisions
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Language</th>
              <th>Worksheet</th>
              <th>Revision</th>
              <th>Rows</th>
              <th>Uploaded</th>
              <th>Uploader ID</th>
            </tr>
          </thead>
          <tbody>
            {worksheets.map((item) => (
              <tr key={`${item.targetLanguage}/${item.worksheetKey}`}>
                <td>{item.targetLanguage}</td>
                <td>{item.worksheetKey}</td>
                <td>{item.revision}</td>
                <td>{item.parsedRowCount}</td>
                <td>{new Date(item.updatedAt).toLocaleString()}</td>
                <td>{item.updatedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {catalogReady && !worksheets.length && <p>No worksheets published yet.</p>}
    </div>
  );
}
