import React from 'react';

import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

type Props = {
  size: 'wide' | 'short';
};

const TargetLanguageCodeInput: React.FC<Props> = ({ size }) => {
  const { uitext } = useInterfaceTranslation();
  const { admin, targetLanguage, updateURLParams } = useURLParams();
  const targetTranslationKey = 'languageName.' + targetLanguage;

  if (!admin) return null;

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
      {uitext(targetTranslationKey) === targetTranslationKey
        ? uitext('languageName.unknown')
        : uitext(targetTranslationKey)}
    </div>
  );
};

export default TargetLanguageCodeInput;
