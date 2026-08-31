import React, { ReactNode } from 'react';

import useLanguageName from '@data/useLanguageName';

type Props = {
  label?: ReactNode;
  current: string;
  onChange: (newLanguage: string) => void;
  options: string[];
  disabled?: boolean;
  includeLocalizedName?: boolean;
};

const LanguageDropdown: React.FC<Props> = ({
  label,
  current,
  onChange,
  options,
  disabled = false,
  includeLocalizedName = true,
}) => {
  const { getLanguageName } = useLanguageName();
  const languageOptions = options
    .map(getLanguageName)
    .sort((a, b) => a.endonym.localeCompare(b.endonym));

  return (
    <div className="flex items-center gap-2 justify-between">
      {label && <strong>{label}</strong>}
      <select
        className="settings-select"
        disabled={disabled}
        value={current}
        onChange={(e) => onChange(e.target.value)}
      >
        {languageOptions.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.endonym}{' '}
            {includeLocalizedName && (
              <em>
                {lang.localized?.toLowerCase() != lang.endonym.toLowerCase() && lang.localized}
              </em>
            )}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageDropdown;
