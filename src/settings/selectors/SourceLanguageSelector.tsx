import React from 'react';

import { SourceLanguage } from '@data/DataTypes';

import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import LanguageDropdown from './LanguageDropdown';

const SourceLanguageSelector: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { sourceLanguage, updateURLParams, admin } = useURLParams();

  return (
    <LanguageDropdown
      label={uitext('settings.sourceLanguage')}
      current={String(sourceLanguage)}
      onChange={(newLanguage) => updateURLParams({ sourceLanguage: newLanguage as SourceLanguage })}
      options={Object.values(SourceLanguage).filter(
        (value) => admin || value !== SourceLanguage.EnglishFraktur,
      )}
    />
  );

  return (
    <div style={{ display: 'flex', gap: '1em', alignItems: 'center', flexWrap: 'wrap' }}>
      <strong>{uitext('settings.sourceLanguage')}:</strong>

      <select
        className="settings-select"
        value={String(sourceLanguage)}
        onChange={(e) => updateURLParams({ sourceLanguage: e.target.value as SourceLanguage })}
      >
        {Object.values(SourceLanguage)
          .filter((value) => admin || value !== SourceLanguage.EnglishFraktur)
          .map((value) => (
            <option key={value} value={value}>
              {uitext(`languageName.${value}`, value)}
            </option>
          ))}
      </select>
    </div>
  );
};

export default SourceLanguageSelector;
