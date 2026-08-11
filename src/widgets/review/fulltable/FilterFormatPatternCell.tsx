import { parsePatternFormat, PatternFormat } from '@data/PatternFormat';

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
      <select
        value={patternFormatFilter}
        onChange={(e) =>
          setPatternFormatFilter(e.target.value ? parsePatternFormat(e.target.value) : undefined)
        }
        style={{ width: '5em' }}
      >
        <option value="">{uitext('patternFormat.any')}</option>
        {Object.values(PatternFormat).map((format) => (
          <option key={format} value={format}>
            {uitext(`patternFormat.${format}`)}
          </option>
        ))}
      </select>
    </td>
  );
}

export default FilterFormatPatternCell;
