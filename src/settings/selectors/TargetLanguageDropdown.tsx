import React from 'react';

import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import LanguageDropdown from './LanguageDropdown';
import TargetLanguageOptions from './TargetLanguageOptions';

const TargetLanguageDropdown: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { importSource, targetLanguage, updateURLParams } = useURLParams();

  return (
    <LanguageDropdown
      label={uitext('settings.targetLanguage')}
      current={targetLanguage}
      onChange={(newLanguage) => updateURLParams({ targetLanguage: newLanguage })}
      options={TargetLanguageOptions[importSource]}
    />
  );
};

export default TargetLanguageDropdown;
