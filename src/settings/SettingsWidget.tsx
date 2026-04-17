import React from 'react';

import { CoverageLevel } from '@data/CoverageLevel';
import { SourceLanguage } from '@data/DataTypes';

import { useSettings } from './Settings';

const SettingsWidget: React.FC = () => {
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
      <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
        Source language:
        {Object.values(SourceLanguage).map((lang) => (
          <button
            key={lang}
            className={lang === sourceLanguage ? 'selected' : ''}
            onClick={() => setSourceLanguage(lang)}
          >
            {/* Convert ID to a readable name */}
            {Object.entries(SourceLanguage).find(([, value]) => value === lang)?.[0]}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
        Target language code:{' '}
        <input value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
        Coverage Level:
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
