import React from 'react';
import { useTranslation } from 'react-i18next';

import { InterfaceLanguage } from '@data/DataTypes';

import { useURLParams } from '@settings/URLParams';

const InterfaceLanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const { interfaceLanguage, updateURLParams, admin } = useURLParams();
  return (
    <div style={{ display: 'flex', gap: '1em', alignItems: 'center', flexWrap: 'wrap' }}>
      <strong>{t('settings.interfaceLanguage')}:</strong>
      {Object.values(InterfaceLanguage)
        .filter((lang) => admin || lang !== InterfaceLanguage.EnglishFraktur)
        .map((lang) => (
          <button
            key={lang}
            className={lang === interfaceLanguage ? 'selected' : ''}
            onClick={() => updateURLParams({ interfaceLanguage: lang })}
          >
            {t(`languageName.${lang}`, lang)}
          </button>
        ))}
    </div>
  );
};

export default InterfaceLanguageSelector;
