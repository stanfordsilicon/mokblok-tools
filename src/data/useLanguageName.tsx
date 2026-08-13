import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { LanguageNameData } from './LanguageNames';
import { useLinguisticsContext } from './LinguisticsContext';

const useLanguageName = () => {
  const { uitext } = useInterfaceTranslation();
  const { languageNames } = useLinguisticsContext();

  const getLanguageName = (langCode: string): LanguageNameData => {
    // First, try to get the name in the interface language
    const localizedName = uitext(`languageName.${langCode}`, langCode);
    const standardName = languageNames[langCode]?.standardName || localizedName || langCode;

    // If neither is available, return the language code as a fallback
    return {
      code: langCode,
      standardName,
      localizedName: localizedName,
      endonym: languageNames[langCode]?.endonym || standardName,
    };
  };

  return { getLanguageName };
};

export default useLanguageName;
