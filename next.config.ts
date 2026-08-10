import type { NextConfig } from 'next';

import i18nConfig from './i18n.config';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: i18nConfig.supportedLngs,
    defaultLocale:
      typeof i18nConfig.fallbackLng === 'string'
        ? i18nConfig.fallbackLng
        : i18nConfig.fallbackLng.default,
  },
};

export default nextConfig;
