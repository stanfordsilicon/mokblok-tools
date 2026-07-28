import React from 'react';
import { useTranslation } from 'react-i18next';

import { useURLParams } from '@settings/URLParams';

import InputSource from '@widgets/input/InputSource';

const InputSourceSelector: React.FC = () => {
  const { t } = useTranslation();
  const { inputSource, updateURLParams, admin } = useURLParams();
  if (!admin) return null;

  return (
    <div style={{ display: 'flex', gap: '1em', alignItems: 'center', flexWrap: 'wrap' }}>
      <strong>{t('input.inputSource.label')}:</strong>

      <select
        className="settings-select"
        value={String(inputSource)}
        onChange={(e) => updateURLParams({ inputSource: e.target.value as InputSource })}
      >
        {Object.values(InputSource).map((value) => (
          <option key={value} value={value}>
            {t(`input.inputSource.${value}`, value)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default InputSourceSelector;
