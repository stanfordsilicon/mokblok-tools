import React from 'react';

import { CoverageLevel } from '@data/CoverageLevel';

import { useURLParams } from '@settings/URLParams';

import EnumDropdown from '@shared/EnumDropdown';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

const CoverageLevelSelector: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { coverageLevel, updateURLParams } = useURLParams();

  return (
    <div className="flex items-center gap-2 justify-between">
      <strong>{uitext('settings.coverageLevel')}</strong>

      <EnumDropdown
        value={coverageLevel}
        onChange={(value) => updateURLParams({ coverageLevel: value })}
        options={Object.values(CoverageLevel).filter((v) => typeof v !== 'string')}
        getLabel={(value) =>
          uitext(`coverageLevelName.${CoverageLevel[value]}`, CoverageLevel[value])
        }
      />
    </div>
  );
};

export default CoverageLevelSelector;
