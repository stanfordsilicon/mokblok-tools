import React from 'react';

import { SOURCE_LANGUAGES, SOURCE_LANGUAGES_ADMIN } from '@data/source/SourceLanguages';

import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import LanguageDropdown from './LanguageDropdown';

const SourceLanguageSelector: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { sourceLanguage, updateURLParams, admin } = useURLParams();
  let options = SOURCE_LANGUAGES;

  if (!admin) return null;
  options = [...options, ...SOURCE_LANGUAGES_ADMIN];

  return (
    <LanguageDropdown
      label={uitext('settings.sourceLanguage')}
      current={String(sourceLanguage)}
      onChange={(newLanguage) => updateURLParams({ sourceLanguage: newLanguage })}
      options={options.filter((value) => admin || value !== 'en-Latf')}
    />
  );
};

export default SourceLanguageSelector;
