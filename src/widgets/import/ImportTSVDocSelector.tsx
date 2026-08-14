import { useTargetDataContext } from '@data/TargetDataProvider';
import { Doc } from '@data/tsvdocs/Doc';
import { getAvailableWorksheets } from '@data/tsvdocs/Worksheets';

import { useURLParams } from '@settings/URLParams';

import Tab from '@shared/Tab';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

const ImportTSVDocSelector: React.FC<{
  curWorksheet: Doc;
  setWorksheet: (doc: Doc) => void;
}> = ({ curWorksheet, setWorksheet }) => {
  const { uitext } = useInterfaceTranslation();
  const { worksheets } = useURLParams();
  const { inputTSVs } = useTargetDataContext();
  const availableWorksheets = getAvailableWorksheets(worksheets);

  return (
    <div className="flex gap-1 flex-wrap">
      {availableWorksheets.map((worksheet) => (
        <Tab
          key={worksheet}
          label={uitext(`import.files.${worksheet}`)}
          option={worksheet}
          selected={curWorksheet}
          setSelected={setWorksheet}
          style={{
            backgroundColor:
              inputTSVs[worksheet]?.value.length === 0 ? 'var(--color-level-2)' : undefined,
          }}
        />
      ))}
    </div>
  );
};

export default ImportTSVDocSelector;
