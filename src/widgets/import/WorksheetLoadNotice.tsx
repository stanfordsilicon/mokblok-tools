import { useTargetDataContext } from '@data/target/TargetDataProvider';
import { useWorksheetCatalog } from '@data/worksheets/WorksheetCatalog';

export default function WorksheetLoadNotice() {
  const { worksheetError, worksheetsLoading, worksheetRevisions, reloadWorksheets } =
    useTargetDataContext();
  const catalog = useWorksheetCatalog();
  return (
    <div className="mb-3 text-sm" aria-live="polite">
      {catalog.error && <p role="alert">{catalog.error} Reload the page to retry.</p>}
      {worksheetsLoading && <p>Loading worksheets…</p>}
      {worksheetError && (
        <p role="alert">
          {worksheetError} <button onClick={reloadWorksheets}>Retry</button>
        </p>
      )}
      {!!Object.keys(worksheetRevisions ?? {}).length && (
        <details>
          <summary>Worksheet revisions</summary>
          <p>
            {Object.entries(worksheetRevisions ?? {})
              .map(([key, revision]) => `${key}: revision ${revision}`)
              .join(' · ')}
          </p>
          <p>
            Reload the page to use newly published worksheets. Unsaved import text will be lost.
          </p>
        </details>
      )}
    </div>
  );
}
