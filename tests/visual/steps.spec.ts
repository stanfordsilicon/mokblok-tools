import { expect, Page, test } from '@playwright/test';

import { freezeDate, gotoApp, type ScreenshotViewer } from './testUtils';

async function performTest(
  page: Page,
  viewer: ScreenshotViewer,
  urlParams: string,
  screenshotName: string,
) {
  await freezeDate(page);
  await gotoApp(page, `/?${urlParams}`, viewer);
  const screenshotNameWithViewer =
    viewer != 'user' ? `${screenshotName}-${viewer}.png` : screenshotName + '.png';
  await expect(page).toHaveScreenshot(screenshotNameWithViewer, { fullPage: true });
}

['admin', 'user', 'signed-out'].forEach((viewer) => {
  test.describe(`Viewer: ${viewer}`, () => {
    test('Home', async ({ page }) => {
      await performTest(page, viewer as ScreenshotViewer, '', `home`);
    });

    test('Import Step', async ({ page }) => {
      await performTest(page, viewer as ScreenshotViewer, 'step=Import', `import`);
    });

    test('Edit Step', async ({ page }) => {
      await performTest(page, viewer as ScreenshotViewer, 'step=Edit', `edit`);
    });

    test('Vote Step', async ({ page }) => {
      await performTest(page, viewer as ScreenshotViewer, 'step=Vote', `vote`);
    });

    test('Export Step', async ({ page }) => {
      await performTest(page, viewer as ScreenshotViewer, 'step=Export', `export`);
    });

    test('Settings', async ({ page }) => {
      await freezeDate(page);
      await gotoApp(page, `/?${viewer === 'user' ? '' : 'admin=true'}`, viewer as ScreenshotViewer);
      await page.click('text=Settings');
      const screenshotNameWithViewer = viewer != 'user' ? `settings-${viewer}.png` : `settings.png`;
      await expect(page).toHaveScreenshot(screenshotNameWithViewer, { fullPage: true });
    });
  });
});
