import React from 'react';

import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

const TargetLanguageSelector: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { targetLanguage, updateURLParams } = useURLParams();
  const [target, setTarget] = React.useState(targetLanguage);
  const targetTranslationKey = 'languageName.' + target;

  return (
    <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
      <strong>{uitext('settings.targetLanguageCode')}:</strong>{' '}
      <input
        value={target}
        onBlur={() => updateURLParams({ targetLanguage: target })}
        onChange={(e) => setTarget(e.target.value)}
      />
      {uitext(targetTranslationKey) === targetTranslationKey
        ? uitext('languageName.unknown')
        : uitext(targetTranslationKey)}
    </div>
  );
};

export default TargetLanguageSelector;
