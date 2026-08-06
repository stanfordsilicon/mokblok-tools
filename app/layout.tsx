import { Geist, Geist_Mono } from 'next/font/google';

import type { Metadata } from 'next';

import '../src/index.css';
import '../src/widgets/input/inputStyles.css';
import '../src/widgets/review/review_styles.css';
import './styles.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
