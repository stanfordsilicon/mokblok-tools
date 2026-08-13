import React from 'react';

import { useURLParams } from '@settings/URLParams';

import InputSource from '@widgets/input/InputSource';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

const InputSourceSelector: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { inputSource, updateURLParams, admin } = useURLParams();
  if (!admin) return null;

  return (
    <div style={{ display: 'flex', gap: '1em', alignItems: 'center', flexWrap: 'wrap' }}>
      <strong>{uitext('import.inputSource.label')}:</strong>

      <select
        className="settings-select"
        value={String(inputSource)}
        onChange={(e) => updateURLParams({ inputSource: e.target.value as InputSource })}
      >
        {Object.values(InputSource).map((value) => (
          <option key={value} value={value}>
            {uitext(`import.inputSource.${value}`, value)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default InputSourceSelector;
