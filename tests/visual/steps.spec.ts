import { expect, Page, test } from '@playwright/test';

async function performTest(page: Page, urlParams: string, screenshotName: string) {
  await page.clock.install();
  await page.clock.setFixedTime(new Date('2026-01-15T12:00:00Z'));
  await page.goto(`/mokblok-tools/?${urlParams}`);
  await page.waitForLoadState('networkidle');
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

test('Export Step', async ({ page }) => {
  await performTest(page, 'admin=true&step=Export', 'export.png');
});
