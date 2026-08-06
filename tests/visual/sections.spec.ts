import { expect, test } from '@playwright/test';

import { DataPage, getSectionsForPage } from '../../src/data/DataSection';

import { gotoApp } from './testUtils';

// Testing all sections and most pages (not the "All" page, that will load too many things)
Object.values(DataPage)
  .filter((pageName) => pageName !== DataPage.All)
  .forEach((pageName) => {
    for (const section of getSectionsForPage(pageName)) {
      test(`Test ${pageName} - ${section}`, async ({ page: playwrightPage }) => {
        await gotoApp(playwrightPage, `/?step=Review&page=${pageName}&section=${section}`);
        const pageBody = playwrightPage.getByTestId('PageBody');
        await expect(pageBody).toHaveScreenshot(`${pageName}-${section}.png`);
      });
    }
  });
