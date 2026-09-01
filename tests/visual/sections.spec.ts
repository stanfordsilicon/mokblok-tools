import { expect, test } from '@playwright/test';

import { CoverageLevel } from '../../src/data/CoverageLevel';
import { DataPage, getSectionsForPage } from '../../src/data/DataSection';

import { freezeDate, gotoApp } from './testUtils';

// Testing all sections and most pages (not the "All" page, that will load too many things)
Object.values(DataPage)
  .filter((pageName) => pageName !== DataPage.All)
  .forEach((pageName) => {
    for (const section of getSectionsForPage(pageName)) {
      test(`Test ${pageName} - ${section}`, async ({ page: playwrightPage }) => {
        await freezeDate(playwrightPage);
        await gotoApp(
          playwrightPage,
          `/?step=Edit&page=${pageName}&section=${section}&coverageLevel=${CoverageLevel.Comprehensive}&worksheets=any&targetLanguage=mg`,
        );
        const pageBody = playwrightPage.getByTestId('PageBody');
        await expect(pageBody).toHaveScreenshot(`${pageName}-${section}.png`);
      });
    }
  });
