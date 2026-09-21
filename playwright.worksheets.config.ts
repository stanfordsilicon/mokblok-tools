import { defineConfig } from '@playwright/test';

import base from './playwright.config';

export default defineConfig({
  ...base,
  testMatch: 'worksheets.spec.ts',
  webServer: {
    ...base.webServer,
    command: 'npx next build --webpack && npm run start -- -H 127.0.0.1 -p 3002',
    url: 'http://127.0.0.1:3002',
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
