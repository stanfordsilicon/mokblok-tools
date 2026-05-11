import i18n from 'i18next';
import { MF2PostProcessor, MF2ReactPreset } from 'mf2react';
import { initReactI18next } from 'react-i18next';

import eng from './locales/eng.json';
import eng_Latf from './locales/eng_Latf.json';
import fra from './locales/fra.json';
import ita from './locales/ita.json';
import spa from './locales/spa.json';

i18n
  .use(MF2PostProcessor) // Enable the post-processor
  .use(MF2ReactPreset) // Enable curly-tag -> JSX conversion
  .use(initReactI18next)
  .init({
    lng: 'en',
    postProcess: ['mf2'], // Apply MF2 to all translations
    resources: {
      // Reference the translation files
      eng_Latf: { translation: eng_Latf },
      eng: { translation: eng },
      fra: { translation: fra },
      ita: { translation: ita },
      spa: { translation: spa },
    },
  });

export default i18n;
