import { expect, Page, test } from '@playwright/test';

import { freezeDate, gotoApp } from './testUtils';

async function performTest(page: Page, urlParams: string, screenshotName: string) {
  await freezeDate(page);
  await gotoApp(page, `/?${urlParams}`);
  await expect(page).toHaveScreenshot(screenshotName, {
    fullPage: true,
  });
}

test('Home page', async ({ page }) => {
  await performTest(page, '', 'home.png');
});

test('Base page - admin mode', async ({ page }) => {
  await performTest(page, 'admin=true', 'home-admin.png');
});

test('Input Step', async ({ page }) => {
  await performTest(page, 'admin=true&step=Input', 'input.png');
});

test('Review Step', async ({ page }) => {
  await performTest(page, 'admin=true&step=Review', 'review.png');
});

test('Review Step -- dark mode', async ({ page }) => {
  page.emulateMedia({ colorScheme: 'dark' });
  await performTest(page, 'admin=true&step=Review', 'review-dark.png');
});

test('Export Step', async ({ page }) => {
  await performTest(page, 'admin=true&step=Export', 'export.png');
});

test('Settings', async ({ page }) => {
  await freezeDate(page);
  await gotoApp(page, '/?admin=true');

  // Click to open the settings
  await page.click('text=Settings');
  await expect(page).toHaveScreenshot('settings.png', {
    fullPage: true,
  });
});
