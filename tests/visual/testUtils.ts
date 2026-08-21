import { expect, type Page } from '@playwright/test';

const FIXED_ISO_TIME = '2026-01-15T12:00:00Z';
const ADMIN_SESSION = {
  user: {
    id: 'playwright-screenshot-admin',
    name: 'Screenshot Admin',
    email: 'admin-screenshots@example.com',
    role: 'admin',
    languages: [],
  },
  expires: '2099-01-01T00:00:00.000Z',
};
const USER_SESSION = {
  user: {
    id: 'playwright-screenshot-user',
    name: 'Screenshot User',
    email: 'screenshots@example.com',
    role: 'user',
    languages: ['mg', 'wo'],
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

export type ScreenshotViewer = 'admin' | 'user' | 'signed-out';

function sessionBodyFor(viewer: ScreenshotViewer) {
  switch (viewer) {
    case 'admin':
      return ADMIN_SESSION;
    case 'user':
      return USER_SESSION;
    case 'signed-out':
      return null;
  }
}

export async function gotoApp(page: Page, path: string, viewer: ScreenshotViewer = 'admin') {
  const pathMaybeAdmin = path + (viewer === 'admin' ? '&admin=true' : '');

  await page.route('**/api/auth/session', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(sessionBodyFor(viewer)),
    });
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(pathMaybeAdmin, { waitUntil: 'domcontentloaded' });
  await page.addStyleTag({ content: DISABLE_MOTION_CSS });
  await expect(page.getByTestId('FullPage')).toBeVisible();
  await expect(page.getByTestId('PageBody')).toBeVisible();
}
