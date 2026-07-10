import React from 'react';
import { useTranslation } from 'react-i18next';

import { useURLParams } from '@settings/URLParams';

const TargetLanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const { targetLanguage, updateURLParams } = useURLParams();
  const [target, setTarget] = React.useState(targetLanguage);

  return (
    <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
      <strong>{t('settings.targetLanguageCode')}:</strong>{' '}
      <input
        value={target}
        onBlur={() => updateURLParams({ targetLanguage: target })}
        onChange={(e) => setTarget(e.target.value)}
      />
    </div>
  );
};

export default TargetLanguageSelector;
