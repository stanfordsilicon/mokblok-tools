import React from 'react';

import { CoverageLevel } from '@data/CoverageLevel';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { BackgroundStyle, parseBackgroundStyle } from '../BackgroundStyle';
import { useURLParams } from '../URLParams';

const BackgroundStyleSelector: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { bgStyle, updateURLParams } = useURLParams();

  return (
    <div style={{ display: 'flex', gap: '1em', alignItems: 'center', flexWrap: 'wrap' }}>
      <strong>{uitext('settings.backgroundStyle')}:</strong>
      <select
        className="settings-select"
        value={String(bgStyle)}
        onChange={(e) => updateURLParams({ bgStyle: parseBackgroundStyle(e.target.value) })}
      >
        {Object.entries(BackgroundStyle)
          .filter(([, value]) => typeof value !== 'string')
          .map(([key, value]) => (
            <option key={key} value={value}>
              {uitext(`backgroundStyleName.${key}`, key)}
            </option>
          ))}
      </select>
      <div style={{ display: 'flex', gap: '0.5em', flexWrap: 'wrap' }}>
        {bgStyle === BackgroundStyle.CoverageLevel &&
          Object.entries(CoverageLevel)
            .filter(([, value]) => typeof value !== 'string')
            .map(([key, value]) => (
              <div
                key={key}
                style={{
                  backgroundColor: `var(--color-level-${value})`,
                  padding: '.25em',
                  borderRadius: '.5em',
                }}
              >
                {uitext(`coverageLevelName.${key}`, key)}
              </div>
            ))}
      </div>
    </div>
  );
};

export default BackgroundStyleSelector;
