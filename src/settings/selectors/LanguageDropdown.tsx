import React, { ReactNode } from 'react';

import useLanguageName from '@data/useLanguageName';

type Props = {
  label: ReactNode;
  current: string;
  onChange: (newLanguage: string) => void;
  options: string[];
};

const LanguageDropdown: React.FC<Props> = ({ label, current, onChange, options }) => {
  const { getLanguageName } = useLanguageName();
  const languageOptions = options
    .map(getLanguageName)
    .sort((a, b) => a.endonym.localeCompare(b.endonym));

  return (
    <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
      <strong>{label}:</strong>{' '}
      <select
        className="settings-select"
        value={current}
        onChange={(e) => onChange(e.target.value)}
      >
        {languageOptions.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.endonym} <em>{lang.localizedName}</em>
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageDropdown;
