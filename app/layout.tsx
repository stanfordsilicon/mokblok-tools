import type { Metadata } from 'next';

import '../src/index.css';
import '../src/widgets/input/inputStyles.css';
import '../src/widgets/review/review_styles.css';
import './styles.css';

import { I18nProvider } from 'next-i18next/client';
import { getResources, getT, initServerI18next } from 'next-i18next/server';

import i18nConfig from '../i18n.config';

initServerI18next(i18nConfig);

export const metadata: Metadata = {
  title: 'homescreen-review',
  description: 'A web application that allows people to review translations for languages',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { i18n, lng } = await getT();
  const resources = getResources(i18n);

  return (
    <html lang={lng} className="h-full antialiased">
      <body className="min-h-full">
        <I18nProvider language={lng} resources={resources}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
