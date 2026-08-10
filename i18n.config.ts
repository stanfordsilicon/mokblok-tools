// i18n.config.ts
import type { I18nConfig } from 'next-i18next';

const i18nConfig: I18nConfig = {
  supportedLngs: ['en', 'en-Latf', 'es', 'fr', 'it'],
  fallbackLng: 'en',
  localePath: './public/locales',

  // resourceLoader: async (language, namespace) =>
  //   import(`./public/locales/${language}/${namespace}.json`),
};

export default i18nConfig;
