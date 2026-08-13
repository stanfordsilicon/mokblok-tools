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
};

export default SourceLanguageSelector;
