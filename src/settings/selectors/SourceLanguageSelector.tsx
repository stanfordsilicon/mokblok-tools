import React from 'react';
import { useTranslation } from 'react-i18next';

import { SourceLanguage } from '@data/DataTypes';

import { useURLParams } from '@settings/URLParams';

const SourceLanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const { sourceLanguage, updateURLParams, admin } = useURLParams();
  return (
    <div style={{ display: 'flex', gap: '1em', alignItems: 'center', flexWrap: 'wrap' }}>
      <strong>{t('settings.sourceLanguage')}:</strong>
      {Object.values(SourceLanguage)
        .filter((lang) => admin || lang !== SourceLanguage.EnglishFraktur)
        .map((lang) => (
          <button
            key={lang}
            className={lang === sourceLanguage ? 'selected' : ''}
            onClick={() => updateURLParams({ sourceLanguage: lang })}
          >
            {t(`languageName.${lang}`, lang)}
          </button>
        ))}
    </div>
  );
};

export default SourceLanguageSelector;
