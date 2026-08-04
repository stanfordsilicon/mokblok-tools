import { Suspense } from 'react';

import App from '../src/page_layout/App';

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <App />
    </Suspense>
  );
}
