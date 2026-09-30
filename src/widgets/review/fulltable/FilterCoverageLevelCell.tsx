import { CoverageLevel, getCoverageLevelKey } from '@data/CoverageLevel';

import EnumDropdown from '@shared/EnumDropdown';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

function FilterCoverageLevelCell({
  coverageLevelFilter,
  setCoverageLevelFilter,
}: {
  coverageLevelFilter: CoverageLevel | undefined;
  setCoverageLevelFilter: (value: CoverageLevel | undefined) => void;
}) {
  const { uitext } = useInterfaceTranslation();
  const options: (CoverageLevel | undefined)[] = Object.values(CoverageLevel).filter(
    (level) => typeof level === 'number',
  );
  options.unshift(undefined);

  return (
    <td>
      <EnumDropdown
        value={coverageLevelFilter}
        onChange={setCoverageLevelFilter}
        options={options}
        getLabel={(value) =>
          value !== undefined
            ? uitext(`coverageLevelName.${getCoverageLevelKey(value)}`)
            : uitext('coverageLevelName.Any')
        }
      />
    </td>
  );
}

export default FilterCoverageLevelCell;
