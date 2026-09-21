import { expect, test } from '@playwright/test';

import { gotoApp } from './testUtils';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/admin/worksheets', (route) =>
    route.fulfill({ json: { worksheets: [] } }),
  );
});

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
  await expect(page.getByRole('button', { name: 'Save to database' })).toBeVisible();
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

test('pasted text saves directly and file loading is independent of saving', async ({ page }) => {
  await page.route('**/api/worksheets', (route) =>
    route.fulfill({ json: { worksheets: [{ targetLanguage: 'kri' }] } }),
  );
  await page.route('**/api/worksheets/kri', (route) =>
    route.fulfill({ json: { worksheets: { '1': { content: source, revision: 1 } } } }),
  );
  await page.route('**/api/review-drafts/**', (route) => route.fulfill({ json: { entries: [] } }));
  const writes: Record<string, unknown>[] = [];
  await page.route('**/api/admin/worksheets/kri/3', (route) => {
    writes.push(route.request().postDataJSON());
    return route.fulfill({ status: 201, json: { revision: 1 } });
  });
  await gotoApp(page, '/?step=Import&targetLanguage=kri&importSource=tsv&worksheets=w1to4');
  await expect(page.getByRole('textbox', { name: 'Worksheet text', exact: true })).toHaveValue(
    source,
  );
  await expect(page.getByRole('button', { name: 'Refresh list and revisions' })).not.toBeVisible();
  await page.getByText('Published worksheets (0)', { exact: true }).click();
  await expect(page.getByRole('button', { name: 'Refresh list and revisions' })).toBeVisible();
  await page.getByRole('button', { name: /^Worksheet 3/ }).click();
  const textarea = page.getByRole('textbox', { name: 'Worksheet text', exact: true });
  await textarea.fill('Pasted worksheet notes');
  expect(writes).toHaveLength(0);
  await page.getByRole('button', { name: 'Save to database' }).click();
  await expect(page.getByRole('status')).toContainText('Saved revision 1');
  expect(writes[0]).toMatchObject({
    content: 'Pasted worksheet notes',
    originalFilename: null,
    expectedRevision: 0,
  });
  await page.getByText('Load from a file instead', { exact: true }).click();
  await page.locator('input[type=file]').setInputFiles({
    name: 'mg_4.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('Loaded worksheet notes'),
  });
  await expect(textarea).toHaveValue('Loaded worksheet notes');
  expect(writes).toHaveLength(1);
  await expect(page.locator('strong').filter({ hasText: 'kri · Worksheet 3' })).toBeVisible();
  await page.getByRole('button', { name: 'Save to database' }).click();
  await expect(page.getByRole('status')).toContainText('Saved revision 1');
  expect(writes[1]).toMatchObject({
    content: 'Loaded worksheet notes',
    originalFilename: 'mg_4.txt',
  });
  await page.screenshot({ path: '/tmp/mokblok-paste-first-import.png', fullPage: true });
  await page.getByRole('button', { name: /^Worksheet 4/ }).click();
  await expect(textarea).toHaveValue('');
  await expect(page.getByRole('button', { name: 'Save to database' })).toBeDisabled();
});

test('non-admins can load a file without any publishing controls or admin requests', async ({
  page,
}) => {
  let adminRequests = 0;
  await page.route('**/api/admin/worksheets**', (route) => {
    adminRequests++;
    return route.fulfill({ status: 403, json: {} });
  });
  await page.route('**/api/worksheets', (route) =>
    route.fulfill({ json: { worksheets: [{ targetLanguage: 'mg' }] } }),
  );
  await page.route('**/api/worksheets/mg', (route) =>
    route.fulfill({ json: { worksheets: { '1': { content: source, revision: 1 } } } }),
  );
  await page.route('**/api/review-drafts/**', (route) => route.fulfill({ json: { entries: [] } }));
  await gotoApp(page, '/?step=Import&targetLanguage=mg&importSource=tsv', 'user');
  await page.getByText('Load from a file instead', { exact: true }).click();
  await page.locator('input[type=file]').setInputFiles({
    name: 'mg_1.tsv',
    mimeType: 'text/tab-separated-values',
    buffer: Buffer.from(source + 'local'),
  });
  await expect(page.getByRole('textbox', { name: 'Worksheet text', exact: true })).toHaveValue(
    source + 'local',
  );
  await expect(page.getByRole('button', { name: 'Save to database' })).toHaveCount(0);
  await expect(page.locator('summary').filter({ hasText: /^Published worksheets/ })).toHaveCount(0);
  expect(adminRequests).toBe(0);
});

test('failed validation preserves pasted text and displays the server diagnostics', async ({
  page,
}) => {
  await page.route('**/api/worksheets', (route) =>
    route.fulfill({ json: { worksheets: [{ targetLanguage: 'kri' }] } }),
  );
  await page.route('**/api/worksheets/kri', (route) => route.fulfill({ json: { worksheets: {} } }));
  await page.route('**/api/review-drafts/**', (route) => route.fulfill({ json: { entries: [] } }));
  await page.route('**/api/admin/worksheets/kri/1', (route) =>
    route.fulfill({
      status: 422,
      json: {
        error: 'Worksheet validation failed.',
        validation: { errors: ['Missing required columns.'], warnings: [], valid: false },
      },
    }),
  );
  await gotoApp(page, '/?step=Import&targetLanguage=kri&importSource=tsv');
  const textarea = page.getByRole('textbox', { name: 'Worksheet text', exact: true });
  await expect(textarea).toBeEnabled();
  await textarea.fill('invalid pasted data');
  await page.getByRole('button', { name: 'Save to database' }).click();
  await expect(
    page.getByRole('alert').filter({ hasText: 'Missing required columns.' }),
  ).toBeVisible();
  await expect(textarea).toHaveValue('invalid pasted data');
});
