import { Suspense } from 'react';

import AuthErrorPageClient from './AuthErrorPageClient';

export default function AuthErrorPage() {
  return (
    <Suspense fallback={null}>
      <AuthErrorPageClient />
    </Suspense>
  );
}
