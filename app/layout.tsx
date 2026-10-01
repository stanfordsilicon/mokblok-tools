import { Inter } from 'next/font/google';

import { cn } from '@shared/shadcn/utils';

import { i18nConfig } from '../i18n.config';

import type { Metadata } from 'next';

import '../src/index.css';
import './styles.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

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
    <html
      lang={i18nConfig.fallbackLng}
      className={cn('h-full antialiased', 'font-sans', inter.variable)}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
