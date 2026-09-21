'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

import { type WorksheetKey, type WorksheetMetadata } from '@data/worksheets/storageTypes';
import type { WorksheetValidation } from '@data/worksheets/validateWorksheet';
import { useWorksheetCatalog } from '@data/worksheets/WorksheetCatalog';

import WorksheetLoadFromFile from './WorksheetLoadFromFile';
import WorksheetPublishedList from './WorksheetPublishedList';

type AdminMetadata = WorksheetMetadata & { updatedBy: string };
type ValidationResult = { validation: WorksheetValidation; content: string };

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
        <WorksheetLoadFromFile
          onContentChange={onContentChange}
          changed={changed}
          setMessage={setMessage}
          setBusy={setBusy}
          setFileSource={setFileSource}
          active={active}
        />
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
        <WorksheetPublishedList
          worksheets={worksheets}
          catalogReady={catalogReady}
          busy={busy}
          setMessage={setMessage}
          refresh={refresh}
        />
      )}
    </div>
  );
}
