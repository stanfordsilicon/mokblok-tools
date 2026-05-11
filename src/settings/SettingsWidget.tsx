import React from 'react';
import { useTranslation } from 'react-i18next';

import { CoverageLevel } from '@data/CoverageLevel';
import { SourceLanguage } from '@data/DataTypes';

import { useSettings } from './Settings';

const SettingsWidget: React.FC = () => {
  const { t } = useTranslation();
  const {
    coverageLevel,
    setCoverageLevel,
    setSourceLanguage,
    setTargetLanguage,
    sourceLanguage,
    targetLanguage,
  } = useSettings();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
      <div style={{ display: 'flex', gap: '1em', alignItems: 'center', flexWrap: 'wrap' }}>
        <strong>{t('settings.sourceLanguage')}:</strong>
        {Object.values(SourceLanguage).map((lang) => (
          <button
            key={lang}
            className={lang === sourceLanguage ? 'selected' : ''}
            onClick={() => setSourceLanguage(lang)}
          >
            {t(`languageName.${lang}`, lang)}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
        <strong>{t('settings.targetLanguageCode')}:</strong>{' '}
        <input value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: '1em', alignItems: 'center', flexWrap: 'wrap' }}>
        <strong>{t('settings.coverageLevel')}:</strong>
        {Object.values(CoverageLevel).map((lang) => (
          <button
            key={lang}
            className={lang === coverageLevel ? 'selected' : ''}
            onClick={() => setCoverageLevel(lang)}
          >
            {/* Convert ID to a readable name */}
            {Object.entries(CoverageLevel).find(([, value]) => value === lang)?.[0]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingsWidget;
