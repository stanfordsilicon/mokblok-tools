import type { Metadata } from 'next';

import '../src/index.css';
import '../src/widgets/input/inputStyles.css';
import '../src/widgets/review/review_styles.css';

export const metadata: Metadata = {
  title: 'mokblok-tools',
  description: 'A web application that allows people to submit translations for languages',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
