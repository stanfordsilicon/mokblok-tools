import React from 'react';
import { useTranslation } from 'react-i18next';

import { CoverageLevel, parseCoverageLevel } from '@data/CoverageLevel';

import { useURLParams } from '@settings/URLParams';

const CoverageLevelSelector: React.FC = () => {
  const { t } = useTranslation();
  const { coverageLevel, updateURLParams } = useURLParams();

  return (
    <div style={{ display: 'flex', gap: '1em', alignItems: 'center', flexWrap: 'wrap' }}>
      <strong>{t('settings.coverageLevel')}:</strong>
      <select
        className="settings-select"
        value={String(coverageLevel)}
        onChange={(e) => updateURLParams({ coverageLevel: parseCoverageLevel(e.target.value) })}
      >
        {Object.entries(CoverageLevel)
          .filter(([, value]) => typeof value !== 'string')
          .map(([key, value]) => (
            <option key={key} value={value}>
              {t(`coverageLevelName.${key}`, key)}
            </option>
          ))}
      </select>
    </div>
  );
};

export default CoverageLevelSelector;
