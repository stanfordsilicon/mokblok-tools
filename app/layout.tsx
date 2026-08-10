import { i18nConfig } from '../i18n.config';

import type { Metadata } from 'next';

import '../src/index.css';
import '../src/widgets/input/inputStyles.css';
import '../src/widgets/review/review_styles.css';
import './styles.css';

export const metadata: Metadata = {
  title: 'homescreen-review',
  description: 'A web application that allows people to review translations for languages',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={i18nConfig.fallbackLng} className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
