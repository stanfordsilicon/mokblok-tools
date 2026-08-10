import { expect, type Page } from '@playwright/test';

const FIXED_ISO_TIME = '2026-01-15T12:00:00Z';
const MOCK_SESSION = {
  user: {
    id: 'playwright-screenshot-user',
    name: 'Screenshot Tester',
    email: 'screenshots@example.com',
    role: 'admin',
  },
  expires: '2099-01-01T00:00:00.000Z',
};
const DISABLE_MOTION_CSS = `
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
    caret-color: transparent !important;
    scroll-behavior: auto !important;
  }
`;

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
  await page.route('**/api/auth/session', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(MOCK_SESSION),
    });
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.addStyleTag({ content: DISABLE_MOTION_CSS });
  await expect(page.getByTestId('FullPage')).toBeVisible();
  await expect(page.getByTestId('PageBody')).toBeVisible();
}
