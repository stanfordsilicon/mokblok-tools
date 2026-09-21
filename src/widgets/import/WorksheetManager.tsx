'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

import {
  MAX_WORKSHEET_BYTES,
  type WorksheetKey,
  type WorksheetMetadata,
} from '@data/worksheets/storageTypes';
import type { WorksheetValidation } from '@data/worksheets/validateWorksheet';
import { useWorksheetCatalog } from '@data/worksheets/WorksheetCatalog';

type AdminMetadata = WorksheetMetadata & { updatedBy: string };
type ValidationResult = { validation: WorksheetValidation; content: string };

const buttonClassName =
  'cursor-pointer rounded-lg border border-(--silicon-purple) bg-white px-4 py-2 font-semibold text-(--silicon-purple) shadow-sm hover:bg-(--silicon-panel) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--silicon-purple) disabled:cursor-not-allowed disabled:opacity-50';

export default function WorksheetManager({
  targetLanguage,
  worksheetKey,
  worksheetLabel,
  content,
  onContentChange,
  loading,
  children,
  canSave,
}: {
  targetLanguage: string;
  worksheetKey: WorksheetKey;
  worksheetLabel: string;
  content: string;
  onContentChange: (content: string) => void;
  loading?: boolean;
  children: ReactNode;
  canSave: boolean;
}) {
  const { refresh: refreshCatalog } = useWorksheetCatalog();
  const [worksheets, setWorksheets] = useState<AdminMetadata[]>([]);
  const active = useRef(true);
  const [fileSource, setFileSource] = useState<{ name: string; content: string } | null>(null);
  const filename = fileSource?.content === content ? fileSource.name : null;
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [catalogReady, setCatalogReady] = useState(false);
  const [message, setMessage] = useState('');
  const fileRead = useRef(0);

  async function refresh() {
    setValidationResult(null);
    setCatalogReady(false);
    const response = await fetch('/api/admin/worksheets', { cache: 'no-store' });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error);
    setWorksheets(body.worksheets);
    setCatalogReady(true);
  }
  useEffect(() => {
    active.current = true;
    if (canSave) refresh().catch((error) => setMessage(error.message));
    return () => {
      active.current = false;
    };
  }, [canSave]);

  function changed() {
    setValidationResult(null);
    setMessage('');
  }
  const current = worksheets.find(
    (item) =>
      item.targetLanguage === targetLanguage.trim().toLowerCase() &&
      item.worksheetKey === worksheetKey,
  );

  async function save() {
    if (!canSave || !catalogReady || busy || loading) return;
    setBusy(true);
    setMessage('');
    setValidationResult(null);
    try {
      const response = await fetch(
        `/api/admin/worksheets/${encodeURIComponent(targetLanguage.trim())}/${worksheetKey}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content,
            originalFilename: filename,
            expectedRevision: current?.revision ?? 0,
          }),
        },
      );
      const body = await response.json();
      if (body.validation) setValidationResult({ validation: body.validation, content });
      if (!response.ok) throw new Error(body.error ?? 'Unable to save worksheet.');
      setMessage(
        body.unchanged
          ? `Already saved at revision ${body.revision}.`
          : `Saved revision ${body.revision}. Reviewers receive it on their next load.`,
      );
      refreshCatalog();
      await refresh();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <fieldset disabled={busy || loading} className="min-w-0 space-y-4">
        {children}
        <details className="rounded-lg border border-(--silicon-line-strong) p-3">
          <summary className="cursor-pointer font-medium">Load from a file instead</summary>
          <p className="my-2 text-sm">
            This fills the text area for the selected worksheet. It does not save to the database.
          </p>
          <label className="block space-y-2 font-medium">
            Choose UTF-8 file (up to 1 MiB)
            <input
              type="file"
              className="block w-full min-w-0 rounded-lg text-sm text-(--silicon-ink-soft) file:mr-3 file:cursor-pointer file:rounded-lg file:border file:border-solid file:border-(--silicon-purple) file:bg-white file:px-4 file:py-2 file:font-semibold file:text-(--silicon-purple) file:shadow-sm hover:file:bg-(--silicon-panel) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--silicon-purple) disabled:opacity-60 disabled:file:cursor-not-allowed"
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
                  if (!active.current || readId !== fileRead.current) return;
                  onContentChange(text);
                  setFileSource({ name: file.name, content: text });
                } catch {
                  setMessage('File must contain valid UTF-8 text.');
                } finally {
                  if (readId === fileRead.current) setBusy(false);
                }
              }}
            />
          </label>
        </details>
        {canSave && (
          <div className="space-y-3">
            <p className="text-sm">
              Save the text above as the shared worksheet for{' '}
              <strong>
                {targetLanguage} · {worksheetLabel}
              </strong>
              . Saved reviewer edits stay separate.
            </p>
            <button
              className={buttonClassName}
              disabled={
                !catalogReady || !content.trim() || !targetLanguage || targetLanguage === 'und'
              }
              onClick={save}
            >
              Save to database
            </button>
            {validationResult?.content === content &&
              validationResult.validation.errors.map((error) => (
                <p role="alert" key={error}>
                  {error}
                </p>
              ))}
          </div>
        )}
      </fieldset>
      <p role="status" aria-live="polite">
        {busy ? 'Working…' : message}
      </p>
      {canSave && (
        <details className="rounded-xl border border-(--silicon-line-strong) bg-(--silicon-panel) p-4">
          <summary className="cursor-pointer font-semibold">
            Published worksheets{catalogReady ? ` (${worksheets.length})` : ''}
          </summary>
          <div className="my-3 flex flex-wrap items-center gap-4">
            <button
              className={buttonClassName}
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
            <table className="w-full text-left [&_td]:px-3 [&_td]:py-2 [&_th]:px-3 [&_th]:py-2">
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
        </details>
      )}
    </div>
  );
}
