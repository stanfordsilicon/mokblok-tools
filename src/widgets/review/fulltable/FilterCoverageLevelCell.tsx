import { CoverageLevel, getCoverageLevelKey } from '@data/CoverageLevel';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

function FilterCoverageLevelCell({
  coverageLevelFilter,
  setCoverageLevelFilter,
}: {
  coverageLevelFilter: CoverageLevel | undefined;
  setCoverageLevelFilter: (value: CoverageLevel | undefined) => void;
}) {
  const { uitext } = useInterfaceTranslation();
  return (
    <td>
      <select
        value={coverageLevelFilter}
        onChange={(e) =>
          setCoverageLevelFilter(e.target.value ? Number(e.target.value) : undefined)
        }
        style={{ width: '5em' }}
      >
        <option value="">{uitext('coverageLevelName.Any')}</option>
        {Object.values(CoverageLevel)
          .filter((level) => typeof level === 'number')
          .map((level) => (
            <option key={level} value={level}>
              {uitext(`coverageLevelName.${getCoverageLevelKey(level)}`)}
            </option>
          ))}
      </select>
    </td>
  );
}

export default FilterCoverageLevelCell;
