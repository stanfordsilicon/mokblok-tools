import { WorksheetMetadata } from '@data/worksheets/storageTypes';

type AdminMetadata = WorksheetMetadata & { updatedBy: string };

type Props = {
  worksheets: AdminMetadata[];
  catalogReady: boolean;
  busy: boolean;
  setMessage: (message: string) => void;
  refresh: () => Promise<void>;
};

const WorksheetPublishedList = ({ worksheets, catalogReady, busy, setMessage, refresh }: Props) => {
  return (
    <details className="rounded-lg border border-(--silicon-line-strong) p-4">
      <summary className="cursor-pointer ">
        Published worksheets{catalogReady ? ` (${worksheets.length})` : ''}
      </summary>
      <div className="my-3 flex flex-wrap items-center gap-4">
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
  );
};

export default WorksheetPublishedList;
