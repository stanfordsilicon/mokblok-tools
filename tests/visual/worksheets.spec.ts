import { expect, test } from '@playwright/test';

import { gotoApp } from './testUtils';

const source =
  'English\tFrench\tTranslation\tNotes\text_id\txpath\nHello\tBonjour\tKrio source\t\tkey\t//ldml/example\n';

test('loads database worksheets, discovers Krio, and preserves local textarea edits', async ({
  page,
}) => {
  let reads = 0;
  await page.route('**/api/worksheets', (route) =>
    route.fulfill({
      json: {
        worksheets: [{ targetLanguage: 'kri', worksheetKey: '1', revision: 3 }],
      },
    }),
  );
  await page.route('**/api/worksheets/kri', (route) => {
    reads++;
    return route.fulfill({ json: { worksheets: { '1': { content: source, revision: 3 } } } });
  });
  await page.route('**/api/review-drafts/**', (route) => route.fulfill({ json: { entries: [] } }));
  await gotoApp(page, '/?step=Import&targetLanguage=kri&importSource=tsv');
  const textarea = page.locator('textarea').first();
  await expect(textarea).toHaveValue(source);
  await expect(page.getByRole('link', { name: 'Manage worksheets' })).toBeVisible();
  await page.getByText('Worksheet revisions', { exact: true }).click();
  await expect(page.getByText('1: revision 3', { exact: true })).toBeVisible();
  const beforeEdit = reads;
  await textarea.fill(source + 'local edit');
  await expect(textarea).toHaveValue(source + 'local edit');
  await page.getByText('Worksheet revisions', { exact: true }).click();
  expect(reads).toBe(beforeEdit);
});

test('database errors are visible and retry can recover', async ({ page }) => {
  await page.route('**/api/worksheets', (route) =>
    route.fulfill({ json: { worksheets: [{ targetLanguage: 'kri' }] } }),
  );
  let failing = true;
  await page.route('**/api/worksheets/kri', (route) =>
    route.fulfill(
      failing
        ? { status: 500, json: { error: 'Database unavailable' } }
        : { json: { worksheets: { '1': { content: source, revision: 1 } } } },
    ),
  );
  await page.route('**/api/review-drafts/**', (route) => route.fulfill({ json: { entries: [] } }));
  await gotoApp(page, '/?step=Import&targetLanguage=kri&importSource=tsv');
  await expect(page.getByRole('alert').filter({ hasText: 'Database unavailable' })).toBeVisible();
  failing = false;
  await page.getByRole('button', { name: 'Retry', exact: true }).click();
  await expect(page.locator('textarea').first()).toHaveValue(source);
});
