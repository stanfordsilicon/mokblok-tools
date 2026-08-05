import { expect, Page, test } from '@playwright/test';

import { DataPage, getSectionsForPage } from '../../src/data/DataSection';

import { freezeDate, gotoApp } from './testUtils';

async function testSectionsInADataPage(page: Page, pageName: DataPage) {
  await freezeDate(page);

  for (const section of getSectionsForPage(pageName)) {
    await gotoApp(page, `/?step=Review&page=${pageName}&section=${section}`);

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
