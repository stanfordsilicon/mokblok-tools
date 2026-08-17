import { expect, test } from '@playwright/test';

import { freezeDate, gotoApp } from './testUtils';

test('Vetting', async ({ page }) => {
  await freezeDate(page);
  await gotoApp(page, `/?step=Vote&admin=true`);
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

test('Drag voting', async ({ page }) => {
  await freezeDate(page);
  await gotoApp(page, `/?step=Vote&admin=true`);

  const firstAccept = page.getByTestId('accept-button').first();
  const thirdAccept = page.getByTestId('accept-button').nth(2);
  const thirdReject = page.getByTestId('reject-button').nth(2);

  const start = await firstAccept.boundingBox();
  const middle = await thirdAccept.boundingBox();
  const end = await thirdReject.boundingBox();

  if (!start || !middle || !end) throw new Error('Could not locate vote buttons for drag test');

  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
  await page.mouse.down();
  await page.mouse.move(middle.x + middle.width / 2, middle.y + middle.height / 2, { steps: 8 });
  await page.mouse.up();

  await expect(firstAccept).toHaveCSS('background-color', 'rgb(197, 244, 184)');
  await expect(thirdAccept).toHaveCSS('background-color', 'rgb(197, 244, 184)');

  await page.mouse.move(middle.x + middle.width / 2, middle.y + middle.height / 2);
  await page.mouse.down();
  await page.mouse.move(end.x + end.width / 2, end.y + end.height / 2, { steps: 4 });
  await page.mouse.up();

  await expect(thirdReject).toHaveCSS('background-color', 'rgb(248, 196, 186)');
});
