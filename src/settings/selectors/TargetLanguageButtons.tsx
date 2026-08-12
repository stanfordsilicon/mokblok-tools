import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import TargetLanguageOptions from './TargetLanguageOptions';

const TargetLanguageButtons = () => {
  const { uitext } = useInterfaceTranslation();
  const { targetLanguage, updateURLParams, inputSource } = useURLParams();
  const languageOptions = TargetLanguageOptions[inputSource];

  return (
    <div className="flex flex-wrap gap-1 items-center mt-1">
      {languageOptions.map((lang) => (
        <button
          key={lang}
          className={lang === targetLanguage ? 'selected' : ''}
          onClick={() => updateURLParams({ targetLanguage: lang })}
        >
          {/* Convert ID to a readable name */}
          {uitext(`languageName.${lang}`, lang)}
        </button>
      ))}
    </div>
  );
};

export default TargetLanguageButtons;
