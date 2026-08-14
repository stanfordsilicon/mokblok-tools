import { useTargetDataContext } from '@data/TargetDataProvider';
import { Worksheet } from '@data/worksheets/Worksheet';
import { getAvailableWorksheets } from '@data/worksheets/Worksheets';

import { useURLParams } from '@settings/URLParams';

import Tab from '@shared/Tab';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

const ImportWorksheetSelector: React.FC<{
  curWorksheet: Worksheet;
  setWorksheet: (doc: Worksheet) => void;
}> = ({ curWorksheet, setWorksheet }) => {
  const { uitext } = useInterfaceTranslation();
  const { worksheets } = useURLParams();
  const { importedWorksheets } = useTargetDataContext();
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
              importedWorksheets[worksheet]?.value.length === 0
                ? 'var(--color-level-2)'
                : undefined,
          }}
        />
      ))}
    </div>
  );
};

export default ImportWorksheetSelector;
