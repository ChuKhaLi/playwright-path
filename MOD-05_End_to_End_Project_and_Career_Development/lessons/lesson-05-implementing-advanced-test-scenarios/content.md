# Lesson 5: Implementing Advanced Test Scenarios

## 1. Introduction

Real-world applications are complex. Users don't just click buttons and fill forms; they upload files, interact with dynamic content, and follow complex workflows. In this lesson, we'll level up our skills by learning how to automate these advanced test scenarios with Playwright.

## 2. Learning Objectives

By the end of this lesson, you will be able to:

-   **Handle Authentication:** Efficiently manage user login states across multiple tests.
-   **Implement Data-Driven Tests:** Run the same test logic with multiple datasets.
-   **Interact with Dynamic Elements:** Reliably test UI components that are not always present or that change.
-   **Automate File Uploads:** Test functionality that requires uploading files.
-   **Career Context:** Recognize how mastering these advanced techniques distinguishes you as a senior-level automation engineer.

## 3. Handling Authentication with `storageState`

Logging in before every single test is slow and inefficient. Playwright offers a powerful solution to save and reuse the browser's state (cookies, local storage) after logging in once.

### How it Works:

1.  **Create a setup test:** A special test that logs in and saves the authentication state to a file.
2.  **Configure your project:** Tell Playwright to run this setup test before your actual tests.
3.  **Use the state:** Your tests will now start in a "logged-in" state, skipping the login UI entirely.

**Example `playwright.config.ts`:**

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    // This project is only for authentication setup
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    // This project runs the actual tests
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Use the saved authentication state
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'], // Ensure setup runs first
    },
  ],
});
```

**Example `auth.setup.ts`:**

```typescript
import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login.page';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateTo('/login');
  await loginPage.login('testuser', 'password123');

  // Wait for the page to be in a logged-in state
  await expect(page.locator('#logout-button')).toBeVisible();

  // Save the storage state to the file
  await page.context().storageState({ path: authFile });
});
```

## 4. Data-Driven Testing

Often, you want to test the same workflow with different inputs (e.g., valid, invalid, edge cases). Manually creating a test for each dataset is repetitive. A better way is to use a data-driven approach.

```typescript
import { test, expect } from '@playwright/test';

const testData = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' },
  { username: 'user3', password: 'password3' },
];

for (const data of testData) {
  test(`should log in user: ${data.username}`, async ({ page }) => {
    // Your login test logic using data.username and data.password
  });
}
```
This approach runs the test once for each item in the `testData` array, making it easy to expand your test coverage.

## 5. Handling Dynamic Elements

Modern web apps are full of dynamic content like pop-ups, notifications, or elements that only appear after an action.

- **`locator.waitFor()`**: Explicitly wait for an element to be in a certain state (e.g., `visible`, `hidden`).
- **`if (await locator.isVisible())`**: Conditionally interact with an element only if it appears.
- **Handling Pop-ups**: Use `page.on('dialog', ...)` to listen for and handle browser dialogs like `alert`, `confirm`, or `prompt`.

```typescript
test('should handle a welcome pop-up if it appears', async ({ page }) => {
  const welcomePopup = page.locator('#welcome-popup');
  if (await welcomePopup.isVisible()) {
    await welcomePopup.locator('button:has-text("Close")').click();
  }
  // ...continue with the rest of the test
});
```

## 6. Automating File Uploads

Playwright makes file uploads simple.

```typescript
test('should allow a user to upload a profile picture', async ({ page }) => {
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator('#upload-button').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles('path/to/your/image.jpg');

  await expect(page.locator('#profile-picture')).toBeVisible();
});
```
- **`page.waitForEvent('filechooser')`**: Listens for the file chooser dialog to open.
- **`fileChooser.setFiles(...)`**: Sets the file(s) to be uploaded.

## 7. Career Development: From Scripter to Engineer

Mastering these techniques is a significant step in your career journey.
- **Efficiency:** Knowing how to use `storageState` shows you think about optimizing test execution time.
- **Thoroughness:** Using data-driven testing demonstrates a commitment to comprehensive test coverage.
- **Robustness:** Handling dynamic elements proves you can build reliable tests for modern, complex applications.

Discussing these strategies in an interview will clearly signal that you have the skills to tackle real-world automation challenges effectively.

## 8. Next Steps

We've covered some powerful techniques for handling complex scenarios. Next, we'll focus on integrating our tests into a CI/CD pipeline to automate our test execution and reporting.