# Lesson 5: Test Configuration

## 1. The Role of `playwright.config.ts`

The `playwright.config.ts` file is the heart of your project's configuration. It allows you to control almost every aspect of how Playwright runs your tests. A well-structured configuration is key to managing different environments and test scenarios.

## 2. Core Configuration Options

### a) `testDir`
Specifies the root directory of your tests.

### b) `timeout` and `expect.timeout`
- **`timeout`:** The maximum time (in ms) for a single test to run.
- **`expect.timeout`:** The maximum time for an `expect` assertion to be true.

### c) `fullyParallel`
A boolean that, when true, allows tests in different files to run in parallel.

### d) `retries`
The number of times to retry a failed test. This can be useful for flaky tests, but it's better to fix the root cause of the flakiness.

### e) `use`
A global `use` object that provides options to all tests. This is where you can configure:
- **`browserName`:** 'chromium', 'firefox', 'webkit'
- **`headless`:** `true` or `false`
- **`screenshot`:** 'on', 'off', 'only-on-failure'
- **`trace`:** 'on', 'off', 'on-first-retry', 'retain-on-failure'
- **`baseURL`:** A base URL for all navigations.

## 3. Managing Multiple Environments with Projects

The `projects` array in your config file is the best way to manage different test configurations. You can define a separate project for each environment or scenario.

**Example:**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    // A project for local development
    {
      name: 'local-chrome',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
      },
    },

    // A project for running against staging
    {
      name: 'staging-firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'https://staging.myapp.com',
      },
    },

    // A project for mobile testing
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 13'],
        baseURL: 'https://staging.myapp.com',
      },
    },
  ],
});
```

You can then run a specific project from the command line:
```bash
npx playwright test --project=staging-firefox
```

## 4. Environment Variables

For sensitive data like API keys or passwords, you should not hardcode them in your config file. Instead, use environment variables.

**Using Environment Variables in `playwright.config.ts`:**
You can use a library like `dotenv` to load environment variables from a `.env` file.

1.  **Install `dotenv`:** `npm install dotenv`
2.  **Create a `.env` file:**
    ```
    STAGING_URL=https://staging.myapp.com
    API_KEY=supersecret
    ```
3.  **Update your config:**
    ```typescript
    import { defineConfig } from '@playwright/test';
    import dotenv from 'dotenv';

    dotenv.config();

    export default defineConfig({
      use: {
        baseURL: process.env.STAGING_URL,
      },
      // You can also pass env variables to your tests
      // process.env.API_KEY
    });
    ```

## 5. Conclusion

Playwright's configuration system is highly flexible. By leveraging projects and environment variables, you can create a clean and maintainable configuration that supports your entire development lifecycle, from local development to CI/CD pipelines.