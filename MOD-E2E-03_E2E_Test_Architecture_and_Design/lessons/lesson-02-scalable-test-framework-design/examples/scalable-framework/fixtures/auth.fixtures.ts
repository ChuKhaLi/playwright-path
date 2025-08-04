import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import * as users from '../data/users.json';

// Define the types for our custom fixtures
type MyFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  loggedInPage: Page;
};

// Extend the base 'test' with our custom fixtures
export const test = base.extend<MyFixtures>({
  // Fixture for the LoginPage
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  // Fixture for the HomePage
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  // Fixture that provides a page in a "logged in" state
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.valid.username, users.valid.password);
    // The page is now authenticated. Any test using this fixture
    // will start from this state.
    await use(page);
  },
});

// Re-export 'expect' so we can use it from our fixture file
export { expect } from '@playwright/test';