import { Doc } from '@data/Doc';

import type { UseStoredParamsReturn } from '@settings/useStoredParams';

const InputDocSelector: React.FC<{
  curDoc: Doc;
  setDoc: (doc: Doc) => void;
  texts: Record<Doc, UseStoredParamsReturn<string>>;
}> = ({ curDoc, setDoc, texts }) => {
  return (
    <div style={{ display: 'flex', gap: '0.25em 1em', flexWrap: 'wrap' }}>
      {Object.values(Doc).map((doc) => (
        <DocButton
          key={doc}
          label={doc}
          targetDoc={doc}
          currentDoc={curDoc}
          setDoc={setDoc}
          hasText={texts[doc].value.length > 0}
        />
      ))}
    </div>
  );
};

const DocButton: React.FC<{
  label: React.ReactNode;
  targetDoc: Doc;
  currentDoc: Doc;
  setDoc: (doc: Doc) => void;
  hasText: boolean;
}> = ({ label, targetDoc, currentDoc, setDoc, hasText }) => {
  const isCurrent = currentDoc === targetDoc;
  const border = isCurrent ? 'solid #ccc' : 'none';
  return (
    <button
      onClick={() => setDoc(targetDoc)}
      className={isCurrent ? 'selected' : ''}
      style={{
        borderRadius: '.5em .5em 0 0',
        borderTop: border,
        borderLeft: border,
        borderRight: border,
        padding: '.5em 1em',
        color: !hasText ? 'var(--color-text-highlighted)' : undefined,
      }}
    >
      {label}
    </button>
  );
};

export default InputDocSelector;
