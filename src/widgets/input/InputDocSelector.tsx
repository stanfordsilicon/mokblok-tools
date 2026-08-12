import { useTargetDataContext } from '@data/TargetDataProvider';
import { Doc } from '@data/tsvdocs/Doc';

import Tab from '@shared/Tab';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

const InputDocSelector: React.FC<{
  curDoc: Doc;
  setDoc: (doc: Doc) => void;
}> = ({ curDoc, setDoc }) => {
  const { uitext } = useInterfaceTranslation();
  const { inputTSVs } = useTargetDataContext();

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
          label={uitext(`input.files.${doc}`)}
          option={doc}
          selected={curDoc}
          setSelected={setDoc}
          style={{
            backgroundColor:
              inputTSVs[doc]?.value.length === 0 ? 'var(--color-level-2)' : undefined,
          }}
        />
      ))}
    </div>
  );
};

export default InputDocSelector;
