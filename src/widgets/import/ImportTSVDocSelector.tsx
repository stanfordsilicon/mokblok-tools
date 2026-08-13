import { useTargetDataContext } from '@data/TargetDataProvider';
import { Doc } from '@data/tsvdocs/Doc';

import Tab from '@shared/Tab';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

const ImportTSVDocSelector: React.FC<{
  curDoc: Doc;
  setDoc: (doc: Doc) => void;
}> = ({ curDoc, setDoc }) => {
  const { uitext } = useInterfaceTranslation();
  const { inputTSVs } = useTargetDataContext();

  return (
    <div className="flex gap-1 flex-wrap border-b-2 border-gray-200 mb-2">
      {Object.values(Doc).map((doc) => (
        <Tab
          key={doc}
          label={uitext(`import.files.${doc}`)}
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

export default ImportTSVDocSelector;
