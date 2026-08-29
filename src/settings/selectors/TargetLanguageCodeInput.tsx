import React from 'react';

import useLanguageName from '@data/useLanguageName';

import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

type Props = {
  size: 'wide' | 'short';
};

const TargetLanguageCodeInput: React.FC<Props> = ({ size }) => {
  const { uitext } = useInterfaceTranslation();
  const { admin, targetLanguage, updateURLParams } = useURLParams();
  const { getLanguageName } = useLanguageName();

  if (!admin) return null;

  const langName = getLanguageName(targetLanguage);

  return (
    <div className="flex gap-4 items-center w-fit">
      <span>
        {size === 'wide' ? (
          uitext('import.language.manual')
        ) : (
          <strong>{uitext('settings.targetLanguageCode')}</strong>
        )}
        :
      </span>
      <input
        className="border rounded-lg p-1 text-center w-12"
        title={!admin ? uitext('settings.assignedLanguagesOnly') : undefined}
        value={targetLanguage}
        onChange={(e) => updateURLParams({ targetLanguage: e.target.value })}
      />
      {langName.localized}
    </div>
  );
};

export default TargetLanguageCodeInput;
