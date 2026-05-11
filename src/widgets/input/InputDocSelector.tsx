import { useTranslation } from 'react-i18next';

import { Doc } from '@data/Doc';

import type { UseStoredParamsReturn } from '@settings/useStoredParams';

import Tab from '@shared/Tab';

const InputDocSelector: React.FC<{
  curDoc: Doc;
  setDoc: (doc: Doc) => void;
  texts: Record<Doc, UseStoredParamsReturn<string>>;
}> = ({ curDoc, setDoc, texts }) => {
  const { t } = useTranslation();
  return (
    <div
      style={{
        display: 'flex',
        gap: '0.25em 1em',
        flexWrap: 'wrap',
        borderBottom: '2px solid #eee',
        marginBottom: '0.5em',
      }}
    >
      {Object.values(Doc).map((doc) => (
        <Tab
          key={doc}
          label={t(`input.files.${doc}`)}
          option={doc}
          selected={curDoc}
          setSelected={setDoc}
          style={{
            color: texts[doc].value.length === 0 ? 'var(--color-text-highlighted)' : undefined,
          }}
        />
      ))}
    </div>
  );
};

export default InputDocSelector;
