import React from 'react';

import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

type Props = {
  size: 'wide' | 'short';
};

const TargetLanguageCodeInput: React.FC<Props> = ({ size }) => {
  const { uitext } = useInterfaceTranslation();
  const { targetLanguage, updateURLParams } = useURLParams();
  const targetTranslationKey = 'languageName.' + targetLanguage;

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
        value={targetLanguage}
        onChange={(e) => updateURLParams({ targetLanguage: e.target.value })}
        style={{
          background: targetLanguage.length < 2 ? 'lightcoral' : 'var(--color-background)',
        }}
      />
      {uitext(targetTranslationKey) === targetTranslationKey
        ? uitext('languageName.unknown')
        : uitext(targetTranslationKey)}
      <button
        aria-label={uitext('import.language.ctaClear')}
        title={uitext('import.language.ctaClear')}
        onClick={() => updateURLParams({ targetLanguage: '' })}
      >
        {size === 'wide' ? uitext('import.language.ctaClear') : '✘'}
      </button>
    </div>
  );
};

export default TargetLanguageCodeInput;
