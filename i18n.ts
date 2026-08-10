import i18n from 'i18next';
import { MF2PostProcessor, MF2ReactPreset } from 'mf2react';
import { initReactI18next } from 'react-i18next';

import eng from './public/locales/en/common.json';
import engLatf from './public/locales/en-Latf/common.json';
import spa from './public/locales/es/common.json';
import fra from './public/locales/fr/common.json';
import ita from './public/locales/it/common.json';

i18n
  .use(MF2PostProcessor)
  .use(MF2ReactPreset)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    postProcess: ['mf2'],
    resources: {
      en: { translation: eng },
      'en-Latf': { translation: engLatf },
      es: { translation: spa },
      fr: { translation: fra },
      it: { translation: ita },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
