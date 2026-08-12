import React from 'react';

import useLanguageName from '@data/useLanguageName';

import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import TargetLanguageOptions from './TargetLanguageOptions';

const TargetLanguageDropdown: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { inputSource, targetLanguage, updateURLParams } = useURLParams();
  const { getLanguageName } = useLanguageName();
  const languageOptions = TargetLanguageOptions[inputSource]
    .map(getLanguageName)
    .sort((a, b) => a.endonym.localeCompare(b.endonym));

  return (
    <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
      <strong>{uitext('settings.targetLanguage')}:</strong>{' '}
      <select
        className="settings-select"
        value={targetLanguage}
        onChange={(e) => updateURLParams({ targetLanguage: e.target.value })}
      >
        {languageOptions.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.endonym}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TargetLanguageDropdown;
