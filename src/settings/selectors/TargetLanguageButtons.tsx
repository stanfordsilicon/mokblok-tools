import useLanguageName from '@data/useLanguageName';

import { useURLParams } from '@settings/URLParams';

import TargetLanguageOptions from './TargetLanguageOptions';

const TargetLanguageButtons = () => {
  const { targetLanguage, updateURLParams, inputSource } = useURLParams();
  const { getLanguageName } = useLanguageName();
  const languageOptions = TargetLanguageOptions[inputSource]
    .map(getLanguageName)
    .sort((a, b) => a.endonym.localeCompare(b.endonym));

  return (
    <div className="flex flex-wrap gap-1 items-center mt-1">
      {languageOptions.map((lang) => (
        <button
          key={lang.code}
          className={lang.code === targetLanguage ? 'selected' : ''}
          onClick={() => updateURLParams({ targetLanguage: lang.code })}
        >
          {lang.endonym}
          <br />
          <span className="font-light">{lang.localizedName}</span>
        </button>
      ))}
    </div>
  );
};

export default TargetLanguageButtons;
