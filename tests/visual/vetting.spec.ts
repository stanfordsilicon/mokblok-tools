import { expect, test } from '@playwright/test';

import { freezeDate, gotoApp } from './testUtils';

test('Vetting', async ({ page }) => {
  await freezeDate(page);
  await gotoApp(page, `/?step=Vote&admin=true&targetLanguage=mg`);
  const pageBody = page.getByTestId('PageBody');
  await expect(pageBody).toHaveScreenshot(`1-start-vetting.png`);

  // Hover over the first item to show the voting interface
  await page.getByTestId('voting-surface').first().hover();
  await expect(pageBody).toHaveScreenshot(`2a-start-accept.png`);

  // Accept it
  await page.getByTestId('accept-button').first().click();
  await expect(pageBody).toHaveScreenshot(`2b-click-accept.png`);

  // Move to the next element and hover over it to show the voting interface
  await page.getByTestId('voting-surface').nth(1).hover();
  await expect(pageBody).toHaveScreenshot(`3a-start-reject.png`);

  // Hover over the reject button (should highlight button)
  const rejectButton = page.getByTestId('reject-button').nth(1);
  const box = await rejectButton.boundingBox();
  if (!box) throw new Error('Could not locate vote button for drag test');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await expect(pageBody).toHaveScreenshot(`3b-mousehover-reject.png`);

  // Click & hold the reject button (should change background, start a rejecting)
  await page.mouse.down();
  await expect(pageBody).toHaveScreenshot(`3c-mousedown-reject.png`);

  // Drag the cursor down 60px to reject other items
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 20);
  await expect(pageBody).toHaveScreenshot(`3d-drag-reject1.png`);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 40);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 60);
  await expect(pageBody).toHaveScreenshot(`3e-drag-reject.png`);

  // Release the cursor to commit the votes
  await page.mouse.up();
  await expect(pageBody).toHaveScreenshot(`3f-finish-reject.png`);

  // Hover over the third item since we are going to comment on it
  await page.getByTestId('voting-surface').nth(2).hover();
  const commentButton = page.getByTestId('comment-button').nth(2);
  await commentButton.hover();
  await expect(pageBody).toHaveScreenshot(`4a-start-comment.png`);

  // Click comment button for third entry
  await commentButton.click();
  await expect(pageBody).toHaveScreenshot(`4b-open-comment.png`);

  // Click the comment box to start typing (the previous hover should disappear)
  const commentInput = page.getByTestId('comment-input').first();
  await commentInput.click();
  await expect(pageBody).toHaveScreenshot(`4c-click-to-write-comment.png`);

  // Type in comment
  await commentInput.fill('This is a test comment.');
  await expect(pageBody).toHaveScreenshot(`4d-write-comment.png`);

  // Close comment
  await page.getByTestId('voting-surface').nth(2).hover();
  await commentButton.click();
  await expect(pageBody).toHaveScreenshot(`4e-close-comment.png`);
});
