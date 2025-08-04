import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

type PlatformFixtures = {
  homePage: HomePage;
  isMobile: boolean;
};

export const test = base.extend<PlatformFixtures>({
  // The isMobile fixture is automatically provided by Playwright Test.
  // It's a boolean that is true if the project configuration is a mobile device.
  homePage: async ({ page, isMobile }, use) => {
    await use(new HomePage(page, isMobile));
  },
});

export { expect } from '@playwright/test';