import { expect, type Page } from '@playwright/test';

const FIXED_ISO_TIME = '2026-01-15T12:00:00Z';

export async function freezeDate(page: Page) {
  await page.addInitScript((fixedIsoTime) => {
    const fixedTime = new Date(fixedIsoTime).valueOf();
    const OriginalDate = Date;

    class MockDate extends OriginalDate {
      constructor(...args: ConstructorParameters<DateConstructor>) {
        if (args.length === 0) {
          super(fixedTime);
        } else {
          super(...args);
        }
      }

      static now() {
        return fixedTime;
      }

      static parse(dateString: string) {
        return OriginalDate.parse(dateString);
      }

      static UTC(...args: Parameters<DateConstructor['UTC']>) {
        return OriginalDate.UTC(...args);
      }
    }

    Object.setPrototypeOf(MockDate, OriginalDate);
    // @ts-expect-error browser runtime override for deterministic screenshots
    globalThis.Date = MockDate;
  }, FIXED_ISO_TIME);
}

export async function gotoApp(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('FullPage')).toBeVisible();
  await expect(page.getByTestId('PageBody')).toBeVisible();
}
