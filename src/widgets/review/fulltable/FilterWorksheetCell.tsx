import { Worksheet } from '@data/worksheets/Worksheet';

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
      <select
        value={worksheetFilter ?? ''}
        onChange={(e) =>
          setWorksheetFilter(e.target.value ? (e.target.value as Worksheet) : undefined)
        }
        style={{ width: '5em' }}
      >
        <option value="">{uitext('patternFormat.any')}</option>
        {Object.values(Worksheet).map((ws) => (
          <option key={ws} value={ws}>
            {uitext(`import.files.${ws}`)}
          </option>
        ))}
      </select>
    </td>
  );
}

export default FilterWorksheetCell;
