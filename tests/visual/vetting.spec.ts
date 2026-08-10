import { expect, test } from '@playwright/test';

import { freezeDate, gotoApp } from './testUtils';

test('Vetting', async ({ page }) => {
  await freezeDate(page);
  await gotoApp(page, `/?step=Review&admin=true`);
  const pageBody = page.getByTestId('PageBody');
  await expect(pageBody).toHaveScreenshot(`1-start-vetting.png`);

  // Click accept button for first entry
  await page.getByTestId('accept-button').first().click();
  await expect(pageBody).toHaveScreenshot(`2-accept.png`);

  // Click reject button for second entry
  await page.getByTestId('reject-button').nth(1).click();
  await expect(pageBody).toHaveScreenshot(`3-reject.png`);

  // Edit second entry
  await page.getByTestId('highlight-input').first().fill('New');
  await expect(pageBody).toHaveScreenshot(`4-edit.png`);

  // Click comment button for third entry
  const commentButton = page.getByTestId('comment-button').nth(2);
  await commentButton.click();
  await expect(pageBody).toHaveScreenshot(`5-open-comment.png`);

  // Enter comment
  await page.getByTestId('comment-input').first().fill('This is a test comment.');
  await expect(pageBody).toHaveScreenshot(`6-write-comment.png`);

  // Close comment
  await commentButton.click();
  await expect(pageBody).toHaveScreenshot(`7-close-comment.png`);
});
