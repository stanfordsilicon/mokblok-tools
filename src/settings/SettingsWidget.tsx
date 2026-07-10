import React from 'react';
import { useTranslation } from 'react-i18next';

import { CoverageLevel, parseCoverageLevel } from '@data/CoverageLevel';
import { SourceLanguage } from '@data/DataTypes';

import { BackgroundStyle, parseBackgroundStyle } from './BackgroundStyle';
import { useURLParams } from './URLParams';

const SettingsWidget: React.FC = () => {
  const { t } = useTranslation();
  const { bgStyle, coverageLevel, sourceLanguage, targetLanguage, updateURLParams } =
    useURLParams();
  const [target, setTarget] = React.useState(targetLanguage);

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
          value={target}
          onBlur={() => updateURLParams({ targetLanguage: target })}
          onChange={(e) => setTarget(e.target.value)}
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
      <div style={{ display: 'flex', gap: '1em', alignItems: 'center', flexWrap: 'wrap' }}>
        <strong>{t('settings.backgroundStyle')}:</strong>
        <select
          className="settings-select"
          value={String(bgStyle)}
          onChange={(e) => updateURLParams({ bgStyle: parseBackgroundStyle(e.target.value) })}
        >
          {Object.entries(BackgroundStyle)
            .filter(([, value]) => typeof value !== 'string')
            .map(([key, value]) => (
              <option key={key} value={value}>
                {t(`backgroundStyleName.${key}`, key)}
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
                  {t(`coverageLevelName.${key}`, key)}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsWidget;
