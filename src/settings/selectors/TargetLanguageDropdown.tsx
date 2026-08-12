import React from 'react';

import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import TargetLanguageOptions from './TargetLanguageOptions';

const TargetLanguageDropdown: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { inputSource, targetLanguage, updateURLParams } = useURLParams();
  const languageOptions = TargetLanguageOptions[inputSource];

  return (
    <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
      <strong>{uitext('settings.targetLanguage')}:</strong>{' '}
      <select
        className="settings-select"
        value={targetLanguage}
        onChange={(e) => updateURLParams({ targetLanguage: e.target.value })}
      >
        {languageOptions.map((value) => (
          <option key={value} value={value}>
            {uitext(`languageName.${value}`, value)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TargetLanguageDropdown;
