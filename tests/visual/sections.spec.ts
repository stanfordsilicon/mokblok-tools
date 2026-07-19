import { expect, test } from '@playwright/test';

import { DataSection } from '../../src/data/DataSection';

test('Test all sections', async ({ page }) => {
  for (const section of Object.values(DataSection)) {
    await page.clock.install();
    await page.clock.setFixedTime(new Date('2026-01-15T12:00:00Z'));
    await page.goto(`/mokblok-tools/?step=Review&page=All&section=${section}`);
    await page.waitForLoadState('networkidle');

    const pageBody = page.getByTestId('PageBody');

    await expect(pageBody).toHaveScreenshot(`${section}.png`);
  }
});
