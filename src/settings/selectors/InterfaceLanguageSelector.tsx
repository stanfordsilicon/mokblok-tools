import React from 'react';

import { InterfaceLanguage } from '@data/DataTypes';

import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

const InterfaceLanguageSelector: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { interfaceLanguage, updateURLParams, admin } = useURLParams();
  return (
    <div style={{ display: 'flex', gap: '1em', alignItems: 'center', flexWrap: 'wrap' }}>
      <strong>{uitext('settings.interfaceLanguage')}:</strong>
      {Object.values(InterfaceLanguage)
        .filter((lang) => admin || lang !== InterfaceLanguage.EnglishFraktur)
        .map((lang) => (
          <button
            key={lang}
            className={lang === interfaceLanguage ? 'selected' : ''}
            onClick={() => updateURLParams({ interfaceLanguage: lang })}
          >
            {uitext(`languageName.${lang}`, lang)}
          </button>
        ))}
    </div>
  );
};

export default InterfaceLanguageSelector;
