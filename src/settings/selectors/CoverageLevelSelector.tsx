import React from 'react';

import { CoverageLevel, parseCoverageLevel } from '@data/CoverageLevel';

import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

const CoverageLevelSelector: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { coverageLevel, updateURLParams } = useURLParams();

  return (
    <div className="flex items-center gap-2 justify-between">
      <strong>{uitext('settings.coverageLevel')}</strong>
      <select
        className="settings-select"
        value={String(coverageLevel)}
        onChange={(e) => updateURLParams({ coverageLevel: parseCoverageLevel(e.target.value) })}
      >
        {Object.entries(CoverageLevel)
          .filter(([, value]) => typeof value !== 'string')
          .map(([key, value]) => (
            <option key={key} value={value}>
              {uitext(`coverageLevelName.${key}`, key)}
            </option>
          ))}
      </select>
    </div>
  );
};

export default CoverageLevelSelector;
