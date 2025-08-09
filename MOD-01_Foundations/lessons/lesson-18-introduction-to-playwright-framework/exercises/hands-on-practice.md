# Lesson 18: Introduction to Playwright Framework - Hands-On Practice

## Objective

This exercise will give you your first hands-on experience writing a real Playwright test. You will write a script that navigates to a website, interacts with elements, and makes an assertion to verify the page content.

## Setup

1.  **Prerequisites:** Ensure you have completed the "Development Environment Setup" exercise from Lesson 16. You should have a project folder with Playwright installed.
2.  **Open Your Project:** Open your Playwright project folder in VS Code.
3.  **Create a New Test File:**
    -   In the `tests` folder of your project, create a new file named `my-first-test.spec.ts`.
    -   The `.spec.ts` extension is a convention that Playwright uses to identify test files.

---

## Task 1: Writing Your First Test Script

Copy and paste the following code into your new `my-first-test.spec.ts` file. We will then walk through what each part does.

```typescript
// Import the necessary parts from the Playwright test library
import { test, expect } from '@playwright/test';

// Define a test suite using test.describe()
test.describe('My First Test Suite', () => {

  // Define a single test case using test()
  test('should navigate to the Playwright website and check the title', async ({ page }) => {
    
    // Step 1: Navigate to a URL
    // The 'await' keyword is crucial because web operations are asynchronous.
    await page.goto('https://playwright.dev/');

    // Step 2: Make an assertion
    // We expect the page to have a specific title.
    await expect(page).toHaveTitle(/Playwright/);

  });

});
```

### Understanding the Code
-   **`import { test, expect } from '@playwright/test';`**: This line imports the core `test` function and the `expect` assertion library from Playwright.
-   **`test.describe('My First Test Suite', () => { ... });`**: This is optional but good practice. It groups related tests together under a descriptive name.
-   **`test('should navigate...', async ({ page }) => { ... });`**: This defines an individual test case.
    -   The first argument is the name of the test, which should describe what it does.
    -   The second argument is an asynchronous function that contains the test logic.
    -   `{ page }` is a "fixture" provided by Playwright. The `page` object is your main tool for interacting with a web page.
-   **`await page.goto('https://playwright.dev/');`**: This command tells the browser controlled by Playwright to navigate to the specified URL.
-   **`await expect(page).toHaveTitle(/Playwright/);`**: This is an **assertion**. It checks if a condition is met. If it is, the test continues. If not, the test fails. Here, we are checking that the page's title contains the word "Playwright". The `/ /` characters create a regular expression for flexible matching.

---

## Task 2: Running Your Test

1.  **Open the Terminal:** Make sure your VS Code terminal is open and pointing to your project's root directory.
2.  **Run the Command:** Execute the Playwright test command.
    ```bash
    npx playwright test
    ```
3.  **Run a Specific File (Optional):** If you only want to run your new test file, you can specify it:
    ```bash
    npx playwright test tests/my-first-test.spec.ts
    ```
4.  **Observe the Output:** You should see that your test was discovered and run. It should pass!

---

## Task 3: Modifying the Test and Making it Fail

Understanding failure is as important as seeing success. Let's make a change that will cause the test to fail.

1.  **Change the Assertion:** In your `my-first-test.spec.ts` file, change the `toHaveTitle` assertion to something you know is incorrect.
    ```typescript
    // Change this line
    await expect(page).toHaveTitle(/A Wrong Title/);
    ```
2.  **Re-run the Test:** Run `npx playwright test` again in the terminal.
3.  **Analyze the Failure:** This time, the test should fail. Look closely at the output in the terminal. Playwright gives you a very detailed error message, telling you:
    -   What it expected (`"A Wrong Title"`)
    -   What it received (the actual page title)
    -   A link to the test report for more details.

---

## Task 4: Adding Another Step

Let's add another interaction and assertion to our test.

1.  **Restore the Original Test:** Change the title assertion back so the test passes again.
    ```typescript
    await expect(page).toHaveTitle(/Playwright/);
    ```
2.  **Add New Steps:** Add the following lines after the title assertion.

    ```typescript
    // Find the "Get started" link by its text content
    const getStartedLink = page.getByText('Get started');

    // Assert that this link is visible on the page
    await expect(getStartedLink).toBeVisible();

    // Click the link
    await getStartedLink.click();

    // Assert that the new page URL contains 'intro'
    await expect(page).toHaveURL(/.*intro/);
    ```
3.  **Run the Test Again:** Run `npx playwright test`. It should pass, and you'll see it performing more actions.

## Congratulations!

You have now written, run, debugged, and expanded your first Playwright test. You've practiced the fundamental workflow of navigating, interacting with elements, and making assertions.