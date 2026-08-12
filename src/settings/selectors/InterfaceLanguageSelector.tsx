import React from 'react';

import { InterfaceLanguage } from '@data/DataTypes';

import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import LanguageDropdown from './LanguageDropdown';

const InterfaceLanguageSelector: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { interfaceLanguage, updateURLParams, admin } = useURLParams();
  return (
    <LanguageDropdown
      label={uitext('settings.interfaceLanguage')}
      current={interfaceLanguage}
      onChange={(newLanguage) =>
        updateURLParams({ interfaceLanguage: newLanguage as InterfaceLanguage })
      }
      options={Object.values(InterfaceLanguage).filter(
        (lang) => admin || lang !== InterfaceLanguage.EnglishFraktur,
      )}
    />
  );
};

export default InterfaceLanguageSelector;
