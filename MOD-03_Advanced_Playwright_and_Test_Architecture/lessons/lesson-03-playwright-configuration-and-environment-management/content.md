# Lesson 3: Playwright Configuration and Environment Management

## 1. Anatomy of `playwright.config.ts`

The `playwright.config.ts` file is the heart of your Playwright test setup. It allows you to configure almost every aspect of how your tests run. Let's break down a typical configuration file.

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // The directory where your tests are located
  testDir: './tests',

  // Maximum time one test can run for.
  timeout: 30 * 1000, // 30 seconds

  // Global expect timeout
  expect: {
    timeout: 5000 // 5 seconds
  },

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use. See https://playwright.dev/docs/test-reporters
  reporter: 'html',

  // Shared settings for all the projects below.
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: 'http://localhost:3000',

    // Collect trace when retrying the failed test.
    trace: 'on-first-retry',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

## 2. Key Configuration Options

### `testDir`
Specifies the root directory for your test files. Playwright will search for files matching the pattern `.*(test|spec)\.(js|ts|mjs)` within this directory.

### `timeout` and `expect.timeout`
- `timeout`: This is the global timeout for each test case, in milliseconds. If a test takes longer than this, it will be marked as "Timed Out".
- `expect.timeout`: This is the default timeout for all `expect` assertions, such as `expect(locator).toBeVisible()`.

### `use` Object
The `use` object contains global settings that are applied to all projects.
- `baseURL`: This is a crucial setting. If you set a `baseURL`, you can use relative paths in your navigation commands, like `await page.goto('/dashboard')`. This makes it easy to switch between different environments (e.g., local, staging, production).
- `trace`: Tracing is a powerful debugging tool. `'on-first-retry'` is a great setting, as it captures a detailed trace of a test's execution only when it fails and is retried, saving resources.

## 3. Managing Multiple Environments with Projects

The `projects` array is where you define different configurations for your test runs. This is the foundation of cross-browser testing and environment management.

### Cross-Browser Testing
The default configuration sets up projects for Chromium, Firefox, and WebKit. When you run `npx playwright test`, it will run your entire test suite against all three browsers in parallel.

To run tests for a specific project, use the `--project` flag:
```bash
# Run tests only on Chromium
npx playwright test --project=chromium
```

### Environment-Specific Configurations
Let's say you have a staging environment and a production environment with different base URLs. You can create projects for them.

```typescript
// playwright.config.ts
export default defineConfig({
  // ... other settings

  projects: [
    // ... browser projects
    {
      name: 'staging',
      use: {
        baseURL: 'https://staging.example.com',
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'production',
      use: {
        baseURL: 'https://app.example.com',
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
```
Now you can target an environment: `npx playwright test --project=staging`.

## 4. Using Environment Variables (`.env`)

Hardcoding sensitive data or environment-specific URLs in your config is not a good practice. A better approach is to use environment variables. The `dotenv` package is excellent for this.

1.  **Install `dotenv`:** `npm install --save-dev dotenv`
2.  **Create a `.env` file** in your project root:
    ```
    # .env file
    STAGING_URL=https://staging.example.com
    PROD_URL=https://app.example.com
    API_KEY=super-secret-key
    ```
3.  **Load the variables** in your `playwright.config.ts`:
    ```typescript
    import { defineConfig, devices } from '@playwright/test';
    import dotenv from 'dotenv';

    // Read from default ".env" file.
    dotenv.config();

    export default defineConfig({
      use: {
        baseURL: process.env.STAGING_URL,
        extraHTTPHeaders: {
          'X-API-KEY': process.env.API_KEY,
        },
      },
      // ...
    });
    ```
    Now your configuration is driven by the `.env` file, which should not be committed to version control (add it to `.gitignore`).

## 5. Global Setup and Teardown

Sometimes you need to perform actions before any tests run (e.g., log in once and save the session) or after all tests have finished (e.g., clean up a database).

### `globalSetup`
This points to a file that exports a function to be run once before all tests.

**Example: Authenticate and save storage state**

```typescript
// global.setup.ts
import { test as setup, expect } from '@playwright/test';
import { LoginPage } from './pages/login-page';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('testuser', 'password');
  
  // Wait for the page to be in a logged-in state.
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();

  // End of authentication steps.
  await page.context().storageState({ path: authFile });
});
```

### `globalTeardown`
This points to a file that exports a function to be run once after all tests.

```typescript
// global.teardown.ts
async function globalTeardown() {
  console.log('All tests have finished. Cleaning up resources...');
  // Add cleanup logic here, e.g., call an API to delete test data.
}

export default globalTeardown;
```

### Configure in `playwright.config.ts`

```typescript
export default defineConfig({
  globalSetup: require.resolve('./global.setup.ts'),
  globalTeardown: require.resolve('./global.teardown.ts'),

  use: {
    // Use the saved authentication state for all tests.
    storageState: 'playwright/.auth/user.json',
  },
  // ...
});
```

## 6. Summary

Mastering `playwright.config.ts` is key to building a professional-grade test automation framework. You can now create flexible configurations for different browsers and environments, manage sensitive data securely, and run setup/teardown logic for your entire test suite. This centralized control makes your framework scalable and easy to manage.