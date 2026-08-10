import i18n from 'i18next';
import { MF2PostProcessor, MF2ReactPreset } from 'mf2react';
import { initReactI18next } from 'react-i18next';

import eng_Latf from '../public//locales/en-Latf/common.json';
import spa from '../public//locales/es/common.json';
import fra from '../public//locales/fr/common.json';
import ita from '../public//locales/it/common.json';
import eng from '../public/locales/en/common.json';

i18n
  .use(MF2PostProcessor) // Enable the post-processor
  .use(MF2ReactPreset) // Enable curly-tag -> JSX conversion
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    postProcess: ['mf2'], // Apply MF2 to all translations
    resources: {
      // Reference the translation files
      en: { translation: eng },
      'en-Latf': { translation: eng_Latf },
      es: { translation: spa },
      fr: { translation: fra },
      it: { translation: ita },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
