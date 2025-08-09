# Lesson 6: Handling Authentication and Sessions

## 1. Introduction

In most of our tests so far, we've started from a logged-out state and performed a login for every single test. While this ensures test isolation, it's highly inefficient. Logging in via the UI is slow and repetitive. For tests that require an authenticated state, we need a faster, more reliable way to manage sessions.

This lesson explores how to handle authentication efficiently in Playwright by saving and reusing the browser's authenticated state.

## 2. Learning Objectives

By the end of this lesson, you will be able to:

-   **Understand the cost of repeated UI logins.**
-   **Programmatically log in and save the authentication state to a file.**
-   **Reuse the saved authentication state across multiple tests.**
-   **Isolate authentication logic into a global setup file.**
-   **Configure a Playwright project to use global setup for authentication.**

## 3. The Problem with UI Login in Every Test

-   **Slow:** Each login adds seconds to your test execution time. Across hundreds of tests, this adds up to minutes or even hours.
-   **Brittle:** The login flow itself can fail, causing unrelated tests to fail.
-   **Repetitive:** It's boilerplate code that clutters your tests.

The solution is to log in *once*, save the session information (cookies, local storage, etc.), and then inject that state into a new browser context for each subsequent test.

## 4. Saving Authentication State

Playwright provides a powerful feature to save the entire authentication state of a browser context into a JSON file.

The key method is `page.context().storageState({ path: 'auth.json' })`.

Let's create a standalone script to perform the login and save the state.

**Step 1: Create a Global Setup File**

It's a best practice to put this logic in a dedicated setup file.

`tests/auth/global.setup.ts`

```typescript
import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Perform authentication steps. Replace with your own login logic.
  const loginPage = new LoginPage(page);
  await loginPage.navigateTo();
  await loginPage.login('standard_user', 'secret_sauce');

  // Wait for the next page to load after login.
  await expect(page.locator('#inventory_container')).toBeVisible();

  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});
```

**Key Points:**

-   We use `test as setup` to indicate this is a setup file.
-   We define a path for our authentication file. It's good practice to store it in the `playwright/.auth/` directory.
-   After the login is successful, `page.context().storageState()` saves all session data to the specified file.

## 5. Using the Saved Authentication State

Now that we have a way to create the `user.json` file, we need to tell our tests to use it.

**Step 1: Configure Playwright**

Open your `playwright.config.ts` file and make two important changes:

1.  **Tell Playwright to run the global setup file before all tests.**
2.  **Tell your test project to use the saved authentication state.**

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // 1. Run global setup before all tests
  globalSetup: require.resolve('./tests/auth/global.setup.ts'),

  use: {
    // ... other settings
  },

  projects: [
    {
      name: 'chromium-authenticated',
      use: {
        // 2. Use the saved authentication state
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'], // Ensure setup runs before this project
    },
    {
      name: 'setup',
      testMatch: /global.setup\.ts/,
    },
  ],
});
```

**Configuration Explained:**

-   `globalSetup`: Points to our authentication script. Playwright will run this file once before any tests start.
-   `projects`: We define two projects.
    -   The `setup` project is a special project that *only* runs our `global.setup.ts` file.
    -   The `chromium-authenticated` project is our main test project.
        -   `storageState`: This is the magic part. It tells Playwright to load the browser context for each test with the data from this file, effectively making every test start as if it's already logged in.
        -   `dependencies: ['setup']`: This explicitly tells Playwright that the `chromium-authenticated` project depends on the `setup` project, ensuring the authentication runs first.

**Step 2: Write Tests That Assume Login**

Now your test files can be much simpler. They can directly navigate to authenticated pages without needing to log in.

`tests/specs/product-page-auth.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/product-page';

test.describe('Product Page (Authenticated)', () => {
  test('should display the product inventory', async ({ page }) => {
    // No login needed! We start already authenticated.
    await page.goto('/inventory.html');

    const productPage = new ProductPage(page);
    const title = await productPage.getPageTitle();
    await expect(title).toBe('Products');
  });
});
```

## 6. Conclusion

By separating authentication into a global setup, you've made your test suite dramatically faster and more robust. Your tests are now cleaner, more focused on their specific objectives, and less prone to failures from unrelated UI changes in the login flow. This is a critical pattern for any professional test automation framework.