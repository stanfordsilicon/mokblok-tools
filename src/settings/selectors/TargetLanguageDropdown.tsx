import { useSession } from 'next-auth/react';
import React from 'react';

import { getScopedTargetLanguages } from '@settings/target-language-scope';
import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import LanguageDropdown from './LanguageDropdown';
import { getTargetLanguageOptions } from './TargetLanguageOptions';

const TargetLanguageDropdown: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { importSource, targetLanguage, updateURLParams } = useURLParams();
  const { data: session } = useSession();
  const scopedLanguages = getScopedTargetLanguages(session?.user?.role, session?.user?.languages);

  return (
    <LanguageDropdown
      label={uitext('settings.targetLanguage')}
      current={targetLanguage}
      onChange={(newLanguage) => updateURLParams({ targetLanguage: newLanguage })}
      options={getTargetLanguageOptions(importSource, scopedLanguages)}
    />
  );
};

export default TargetLanguageDropdown;
