import { PatternFormat } from '@data/PatternFormat';

import EnumDropdown from '@shared/EnumDropdown';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

function FilterFormatPatternCell({
  patternFormatFilter,
  setPatternFormatFilter,
}: {
  patternFormatFilter: PatternFormat | undefined;
  setPatternFormatFilter: (value: PatternFormat | undefined) => void;
}) {
  const { uitext } = useInterfaceTranslation();
  return (
    <td>
      <EnumDropdown
        value={patternFormatFilter}
        onChange={setPatternFormatFilter}
        options={Object.values(PatternFormat)}
        getLabel={(value) =>
          value !== undefined ? uitext(`patternFormat.${value}`) : uitext('patternFormat.any')
        }
      />
    </td>
  );
}

export default FilterFormatPatternCell;
