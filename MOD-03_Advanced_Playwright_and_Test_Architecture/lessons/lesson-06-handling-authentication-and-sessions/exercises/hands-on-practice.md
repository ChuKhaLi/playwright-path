# Lesson 6: Hands-on Practice - Handling Authentication

## Objective

To implement a global setup for authentication to make your test suite faster and more efficient.

## Scenario

You will refactor your test suite for the Sauce Labs Demo Application to use Playwright's global setup and storage state features. You will create a single authentication script that logs in and saves the session, and then run tests that use this session, bypassing the UI login.

## Instructions

### Part 1: Create the Global Setup File

1.  **Create a new directory and file:** Create `tests/auth/global.setup.ts`.

2.  **Write the authentication script:**
    -   Inside `global.setup.ts`, import `test as setup` and `expect` from `@playwright/test`.
    -   Import your `LoginPage` Page Object.
    -   Define a constant for the authentication file path: `const authFile = 'playwright/.auth/user.json';`.
    -   Create a `setup()` test block with the title `'authenticate'`.
    -   Inside the block, use your `LoginPage` to navigate and log in as `'standard_user'`.
    -   After the login action, add an assertion to ensure the login was successful (e.g., `await expect(page.locator('#inventory_container')).toBeVisible();`).
    -   Finally, call `await page.context().storageState({ path: authFile });` to save the session.

### Part 2: Configure `playwright.config.ts`

1.  **Open your `playwright.config.ts` file.**

2.  **Add the `globalSetup` property:**
    -   At the top level of the `defineConfig` object, add the `globalSetup` property.
    -   Its value should resolve the path to your new setup file: `globalSetup: require.resolve('./tests/auth/global.setup.ts'),`.

3.  **Configure the projects:**
    -   Modify your `projects` array to have two projects: `setup` and one for your main tests (e.g., `chromium`).
    -   The `setup` project should only run the `global.setup.ts` file.
        ```typescript
        {
          name: 'setup',
          testMatch: /global.setup\.ts/,
        }
        ```
    -   The main project (e.g., `chromium`) should be configured to *use* the saved state and *depend* on the setup project.
        ```typescript
        {
          name: 'chromium',
          use: {
            storageState: 'playwright/.auth/user.json',
          },
          dependencies: ['setup'],
        }
        ```
    -   Make sure to remove the `storageState` and `dependencies` from any other projects if they exist.

### Part 3: Refactor an Existing Test

1.  **Choose a test file to refactor**, for example, `tests/specs/product.spec.ts`.

2.  **Remove the login steps:**
    -   Delete the `test.beforeEach` or any other code that performs the UI login. Your tests will now start already logged in.
    -   The test should now directly navigate to a page that requires authentication, like the inventory page.

3.  **Update the test logic:**
    -   The first line of your test might now be `await page.goto('/inventory.html');`.
    -   The rest of the test logic (adding items to the cart, etc.) can remain the same.

### Part 4: Run Your Tests

1.  **Run the entire test suite:** `npx playwright test`.
2.  **Observe the output:** You should see the `setup` project run first, followed by your other tests.
3.  **Check the test report:** Notice how much faster the tests run because they no longer have to wait for the UI login process each time. You should also see a new `playwright/.auth/user.json` file in your project directory.

## Bonus Challenge

-   Create a new `global.teardown.ts` file.
-   In the teardown script, add logic to clean up resources. For example, you could add a `console.log("Global teardown finished.")`.
-   Configure the `globalTeardown` property in `playwright.config.ts` to point to this new file.
-   Run your tests again and observe the message in the console after all tests have completed.