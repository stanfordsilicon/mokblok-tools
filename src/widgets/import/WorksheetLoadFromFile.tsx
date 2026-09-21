import { useCallback, useRef } from 'react';

import { MAX_WORKSHEET_BYTES } from '@data/worksheets/storageTypes';

const WorksheetLoadFromFile = ({
  onContentChange,
  changed,
  setMessage,
  setBusy,
  setFileSource,
  active,
}: {
  onContentChange: (content: string) => void;
  changed: () => void;
  setMessage: (message: string) => void;
  setBusy: (busy: boolean) => void;
  setFileSource: (fileSource: { name: string; content: string }) => void;
  active: React.RefObject<boolean>;
}) => {
  const fileRead = useRef(0);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [onContentChange, changed, setMessage, setBusy, setFileSource, fileRead, active],
  );

  return (
    <details className="rounded-lg border border-(--silicon-line-strong) p-3">
      <summary className="cursor-pointer">Load from a file instead</summary>
      <p className="my-2 text-sm">
        This fills the text area for the selected worksheet. It does not save to the database.
      </p>
      <label className="block space-y-2 font-medium">
        Choose UTF-8 file (up to 1 MiB)
        <input
          type="file"
          className="block w-full min-w-0 file:mr-3 file:cursor-pointer file:rounded-lg file:border file:border-solid file:border-(--silicon-purple) file:bg-white file:px-2 file:py-2 hover:file:bg-(--color-button-selected) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--silicon-purple) disabled:opacity-60 disabled:file:cursor-not-allowed"
          accept=".tsv,.txt"
          onChange={handleFileChange}
        />
      </label>
    </details>
  );
};

export default WorksheetLoadFromFile;
