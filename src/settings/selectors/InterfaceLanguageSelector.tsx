import React, { useCallback } from 'react';

import { InterfaceLanguage } from '@data/DataTypes';

import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import LanguageButtons from './LanguageButtons';
import LanguageDropdown from './LanguageDropdown';

type Props = {
  display: 'dropdown' | 'buttons';
};

const InterfaceLanguageSelector: React.FC<Props> = ({ display }) => {
  const { uitext } = useInterfaceTranslation();
  const { interfaceLanguage, updateURLParams, admin } = useURLParams();
  const options = Object.values(InterfaceLanguage).filter(
    (lang) => admin || lang !== InterfaceLanguage.EnglishFraktur,
  );
  const onChange = useCallback(
    (newLanguage: string) => {
      updateURLParams({ interfaceLanguage: newLanguage as InterfaceLanguage });
    },
    [updateURLParams],
  );

  if (display === 'buttons')
    return (
      <div className="flex items-center gap-2">
        <div>{uitext('settings.interfaceLanguage')}</div>
        <LanguageButtons current={interfaceLanguage} onChange={onChange} options={options} />
      </div>
    );
  return (
    <LanguageDropdown
      label={uitext('settings.interfaceLanguage')}
      current={interfaceLanguage}
      onChange={onChange}
      options={options}
    />
  );
};

export default InterfaceLanguageSelector;
