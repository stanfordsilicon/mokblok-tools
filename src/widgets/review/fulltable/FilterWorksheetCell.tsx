import { Worksheet } from '@data/worksheets/Worksheet';

import EnumDropdown from '@shared/EnumDropdown';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

function FilterWorksheetCell({
  worksheetFilter,
  setWorksheetFilter,
}: {
  worksheetFilter: Worksheet | undefined;
  setWorksheetFilter: (value: Worksheet | undefined) => void;
}) {
  const { uitext } = useInterfaceTranslation();
  return (
    <td>
      <EnumDropdown
        value={worksheetFilter}
        onChange={setWorksheetFilter}
        options={Object.values(Worksheet)}
        getLabel={(value) =>
          value !== undefined ? uitext(`import.files.${value}`) : uitext('patternFormat.any')
        }
      />
    </td>
  );
}

export default FilterWorksheetCell;
