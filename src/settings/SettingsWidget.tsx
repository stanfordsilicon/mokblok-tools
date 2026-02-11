import React from 'react';

import { SourceLanguage } from '@data/DataTypes';

import { useSettings } from './Settings';

const SettingsWidget: React.FC = () => {
  const { sourceLanguage, setSourceLanguage, targetLanguage, setTargetLanguage } = useSettings();

  return (
    <>
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
      <div style={{ display: 'flex', gap: '1em', alignItems: 'center', marginTop: '1em' }}>
        Target language code:{' '}
        <input value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)} />
      </div>
    </>
  );
};

export default SettingsWidget;
