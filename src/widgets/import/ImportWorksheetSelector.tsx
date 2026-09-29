import { useTargetDataContext } from '@data/target/TargetDataProvider';
import { Worksheet } from '@data/worksheets/Worksheet';
import { getAvailableWorksheets } from '@data/worksheets/Worksheets';

import { useURLParams } from '@settings/URLParams';

import { Button } from '@shared/shadcn/ui/button';
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
        <Button
          key={worksheet}
          onClick={() => setWorksheet(worksheet)}
          variant={curWorksheet === worksheet ? 'selected' : 'outline'}
          style={{
            opacity: importedWorksheets[worksheet]?.value.length === 0 ? '.6' : undefined,
          }}
        >
          {uitext(`import.files.${worksheet}`)}
        </Button>
      ))}
    </div>
  );
};

export default ImportWorksheetSelector;
