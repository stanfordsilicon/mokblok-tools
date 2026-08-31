import { useURLParams } from '@settings/URLParams';

import { getFraktur } from '@shared/stringUtils';

import { LanguageNameData } from './LanguageNames';
import { useLinguisticsContext } from './LinguisticsContext';

const useLanguageName = () => {
  const { interfaceLanguage } = useURLParams();
  const { languageNames } = useLinguisticsContext();

  const getLanguageName = (langCode: string): LanguageNameData => {
    // First, try to get the name in the interface language
    const entry = languageNames[langCode];
    if (!entry) {
      // console.log(`Language entry not found for code: ${langCode}`);
      return {
        code: langCode,
        localized: langCode,
        endonym: langCode,
        en: langCode,
        pt: langCode,
        fr: langCode,
        es: langCode,
        it: langCode,
      };
    }

    let localized = entry.en;
    if (interfaceLanguage === 'es') localized = entry.es;
    if (interfaceLanguage === 'pt') localized = entry.pt;
    if (interfaceLanguage === 'fr') localized = entry.fr;
    if (interfaceLanguage === 'it') localized = entry.it;
    if (interfaceLanguage === 'en-Latf') localized = getFraktur(entry.en);

    return { ...entry, localized };
  };

  return { getLanguageName };
};

export default useLanguageName;
