# Lesson 2: Scalable Test Framework Design

## 1. Core Components of a Scalable Framework

A scalable framework is built from a set of well-defined components. Here's a breakdown of the essentials:

- **Test Runner:** The engine that discovers, runs, and reports on tests. In our case, this is Playwright Test.
- **Configuration Management:** A system for managing different test environments (e.g., local, development, staging, production), browsers, and other settings.
- **Directory Structure:** A logical organization of files and folders that makes the framework easy to navigate and maintain.
- **Base Test / Fixtures:** A mechanism for sharing setup, teardown, and common objects (like page objects) across tests, reducing code duplication.
- **Page Object Model (POM):** A design pattern for encapsulating UI interactions, which we will explore in depth in the next lesson.
- **Utility Libraries:** Reusable functions for common tasks like data generation, API requests, or string manipulation.
- **Reporting:** Tools for generating human-readable reports on test execution results.

## 2. Designing a Scalable Directory Structure

A good directory structure is a map of your framework. It should be intuitive and enforce separation of concerns.

```
/
├── data/                  # Test data files (JSON, CSV, etc.)
├── pages/                 # Page Object classes
├── tests/                 # Test files (*.spec.ts)
│   ├── e2e/               # End-to-end scenarios
│   └── component/         # Component-level tests
├── utils/                 # Reusable utility functions
├── fixtures/              # Custom test fixtures
├── playwright.config.ts   # Playwright configuration
├── package.json           # Project dependencies
└── tsconfig.json          # TypeScript configuration
```

**Key Principles:**
- **Group by Feature or Type:** You can group tests by feature (`tests/login/`) or by type (`tests/smoke/`, `tests/regression/`).
- **Keep Tests and App Code Separate:** Test code (`tests/`, `pages/`) should be clearly separated from the application code it is testing.
- **Be Consistent:** Whatever structure you choose, apply it consistently across the project.

## 3. Robust Configuration Management

A scalable framework must run against different environments without code changes. Playwright's project configuration is perfect for this.

In `playwright.config.ts`, you can define different "projects" for each environment or browser.

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // ... other settings

  projects: [
    {
      name: 'chromium-staging',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://staging.yourapp.com',
      },
    },
    {
      name: 'firefox-prod',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'https://www.yourapp.com',
      },
    },
    {
      name: 'webkit-local',
      use: {
        ...devices['Desktop Safari'],
        baseURL: 'http://localhost:3000',
      },
    },
  ],
});
```

To run tests against a specific project, use the `--project` flag:
`npx playwright test --project=chromium-staging`

## 4. Using a Base Test and Fixtures

To avoid duplicating code in every test file (like logging in a user), we can use test fixtures. Fixtures allow you to define and share setup, teardown, and objects.

Let's create a custom fixture that provides an authenticated `LoginPage` instance to our tests.

**1. Define the Fixture (`fixtures/auth.fixtures.ts`)**
```typescript
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import * as userData from '../data/users.json';

type MyFixtures = {
  loginPage: LoginPage;
  loggedInPage: Page; // A page object for a page after login
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(userData.validUser.username, userData.validUser.password);
    // Now the page is in a logged-in state
    await use(page);
  },
});

export { expect } from '@playwright/test';
```

**2. Use the Fixture in a Test**
```typescript
// tests/e2e/profile.spec.ts
import { test, expect } from '../fixtures/auth.fixtures';

test.describe('User Profile', () => {
  test('should display the user\'s name', async ({ loggedInPage }) => {
    // The `loggedInPage` fixture handles the login process automatically.
    // This test starts with the user already logged in.
    const profileName = loggedInPage.locator('#profile-name');
    await expect(profileName).toHaveText('Test User');
  });
});
```

By using fixtures, we make our tests cleaner, more readable, and easier to maintain. If the login process changes, we only need to update it in one place: the `loggedInPage` fixture. This is a cornerstone of scalable test design.