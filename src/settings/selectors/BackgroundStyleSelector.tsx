import React from 'react';

import { CoverageLevel } from '@data/CoverageLevel';

import EnumDropdown from '@shared/EnumDropdown';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { BackgroundStyle } from '../BackgroundStyle';
import { useURLParams } from '../URLParams';

const BackgroundStyleSelector: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { bgStyle, updateURLParams, admin } = useURLParams();

  let options = Object.values(BackgroundStyle).filter((val) => typeof val === 'number');
  if (!admin) options = options.filter((val) => val !== BackgroundStyle.Worksheet);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 justify-between">
        <strong>{uitext('settings.backgroundStyle')}</strong>
        <EnumDropdown
          value={bgStyle}
          onChange={(value) => updateURLParams({ bgStyle: value })}
          options={options}
          getLabel={(value) =>
            uitext(`backgroundStyleName.${BackgroundStyle[value]}`, BackgroundStyle[value])
          }
        />
      </div>
      {bgStyle === BackgroundStyle.CoverageLevel && (
        <div className="flex gap-1 flex-wrap">
          {Object.entries(CoverageLevel)
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
      )}
    </div>
  );
};

export default BackgroundStyleSelector;
