import React from 'react';

import LanguageRequestPanel from '@settings/auth/LanguageRequestPanel';
import { useURLParams } from '@settings/URLParams';
import useAllowedTargetLanguages from '@settings/useAllowedTargetLanguages';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import LanguageDropdown from './LanguageDropdown';

const TargetLanguageDropdown: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { targetLanguage, updateURLParams } = useURLParams();
  const allowedLanguages = useAllowedTargetLanguages();

  return (
    <>
      <LanguageDropdown
        label={uitext('settings.targetLanguage')}
        current={targetLanguage}
        onChange={(newLanguage) => updateURLParams({ targetLanguage: newLanguage })}
        options={allowedLanguages}
      />
      <LanguageRequestPanel />
    </>
  );
};

export default TargetLanguageDropdown;
