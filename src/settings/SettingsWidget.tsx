import React from 'react';
import { useTranslation } from 'react-i18next';

import { CoverageLevel, parseCoverageLevel } from '@data/CoverageLevel';
import { SourceLanguage } from '@data/DataTypes';

import { useURLParams } from './URLParams';

const SettingsWidget: React.FC = () => {
  const { t } = useTranslation();
  const { coverageLevel, sourceLanguage, targetLanguage, updateURLParams } = useURLParams();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
      <div style={{ display: 'flex', gap: '1em', alignItems: 'center', flexWrap: 'wrap' }}>
        <strong>{t('settings.sourceLanguage')}:</strong>
        {Object.values(SourceLanguage).map((lang) => (
          <button
            key={lang}
            className={lang === sourceLanguage ? 'selected' : ''}
            onClick={() => updateURLParams({ sourceLanguage: lang })}
          >
            {t(`languageName.${lang}`, lang)}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
        <strong>{t('settings.targetLanguageCode')}:</strong>{' '}
        <input
          value={targetLanguage}
          onChange={(e) => updateURLParams({ targetLanguage: e.target.value })}
        />
      </div>
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
    </div>
  );
};

export default SettingsWidget;
