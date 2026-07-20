import { expect, Page, test } from '@playwright/test';

import { DataPage, getSectionsForPage } from '../../src/data/DataSection';

async function testSectionsInADataPage(page: Page, pageName: DataPage) {
  await page.clock.install();
  await page.clock.setFixedTime(new Date('2026-01-15T12:00:00Z'));

  for (const section of getSectionsForPage(pageName)) {
    await page.goto(`/mokblok-tools/?step=Review&page=${pageName}&section=${section}`);
    await page.waitForLoadState('networkidle');

    const pageBody = page.getByTestId('PageBody');

    await expect(pageBody).toHaveScreenshot(`${pageName}-${section}.png`);
  }
}

// Testing specific pages, not the "All" page

test('Test Core', async ({ page }) => {
  await testSectionsInADataPage(page, DataPage.Core);
});

test('Test Date & Time', async ({ page }) => {
  await testSectionsInADataPage(page, DataPage.DateAndTime);
});

test('Test Quantities', async ({ page }) => {
  await testSectionsInADataPage(page, DataPage.Quantities);
});

test('Test Translations', async ({ page }) => {
  await testSectionsInADataPage(page, DataPage.Translations);
});

test('Test Full Table', async ({ page }) => {
  await testSectionsInADataPage(page, DataPage.FullTable);
});
