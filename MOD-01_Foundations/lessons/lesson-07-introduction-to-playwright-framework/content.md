# Lesson 7: Introduction to Playwright Framework

## Learning Objectives

- Define what a test automation framework is.
- Describe Playwright and its key features.
- Understand the benefits of using Playwright (e.g., cross-browser, auto-waits).
- Initialize a new Playwright project.
- Understand the basic structure of a Playwright test file.
- Run a test and view the test report.

---

## 1. What is a Test Automation Framework?

A **test automation framework** is a set of guidelines, tools, and best practices for creating and designing test cases. It's not just a single tool; it's an integrated system that provides everything you need to automate tests effectively.

Think of it as a toolkit for a mechanic. The toolkit doesn't just have a wrench; it has sockets, screwdrivers, and a case to keep everything organized. A framework provides the structure, the test runner, the assertion library, and reporting tools all in one package.

## 2. Introducing Playwright

**Playwright** is a modern, open-source test automation framework for web applications, developed and maintained by Microsoft. It is designed to be fast, reliable, and capable, enabling you to test your web applications across all modern browsers.

## 3. Why Choose Playwright? Core Features and Benefits

Playwright has become incredibly popular for several key reasons:

- **Cross-Browser:** It can run tests on all modern browsers, including Chromium (the engine for Chrome and Edge), Firefox, and WebKit (the engine for Safari), all with a single API.
- **Auto-Waits:** This is a game-changer. Playwright automatically waits for elements to be ready before interacting with them. This eliminates a huge source of flaky (unreliable) tests that plague older frameworks. You don't need to add manual waits or sleeps in your code.
- **Powerful Tooling:** Playwright comes with fantastic tools out of the box, including:
  - **Codegen:** Records your actions on a website and generates the test script for you.
  - **Playwright Inspector:** A GUI tool to help you debug your tests step-by-step.
  - **Trace Viewer:** A detailed report that shows you exactly what happened during your test run, including screenshots, network requests, and console logs.
- **Rich Set of Features:** It can handle complex scenarios like file uploads/downloads, iframes, multiple browser tabs, and even API testing.
- **Fast Execution:** Its architecture is designed for speed and parallel execution.

## 4. Setting Up Your First Playwright Project

Let's get our hands dirty and create our first project.

1.  **Create a Project Folder:**
    - Open VS Code.
    - Go to `File > Open Folder...`.
    - Create a new folder on your computer called `my-first-playwright-project` and open it.

2.  **Open the Terminal in VS Code:**
    - In VS Code, go to `Terminal > New Terminal`. This will open a PowerShell terminal at the bottom of your screen, already in your project's directory.

3.  **Initialize the Playwright Project:**
    - In the terminal, type the following command and press Enter. This command tells npm to download and run the Playwright installer.
      ```powershell
      npm init playwright@latest
      ```

4.  **Follow the Prompts:**
    - The installer will ask you a few questions. For your first project, the defaults are perfect.
      - `Use TypeScript or JavaScript?` -> Choose **TypeScript**.
      - `Name of your tests folder?` -> Press Enter to accept `tests`.
      - `Add a GitHub Actions workflow?` -> Type `n` for No and press Enter.
      - `Install Playwright browsers?` -> Press Enter to accept `true`.

    - The installer will now set up your project, create some files, and download the browsers. This might take a few minutes.

When it's finished, you will see a new file structure in the VS Code explorer on the left.

## 5. Anatomy of a Playwright Test

Open the `tests` folder and then open the `example.spec.ts` file. This is a sample test file created by the installer. Let's break it down.

```typescript
// 1. Import necessary parts from the Playwright/test library
import { test, expect } from '@playwright/test';

// 2. Define a test suite (optional, but good for organization)
test.describe('My First Test Suite', () => {

  // 3. Define a test case
  test('has title', async ({ page }) => {
    // 4. Navigate to a URL
    await page.goto('https://playwright.dev/');

    // 5. Create a locator for the title element
    const title = page.locator('.navbar__inner .navbar__title');

    // 6. Make an assertion (check if something is true)
    await expect(title).toHaveText('Playwright');
  });

});
```

- **`import`:** Brings in the `test` and `expect` functions from the Playwright library.
- **`test('test name', ...)`:** This defines a single test case. The first argument is the name of the test.
- **`async ({ page }) => { ... }`:** This is the function that contains your test logic. Playwright gives you a `page` object, which represents a single tab in a browser.
- **`await page.goto(...)`:** Navigates the browser tab to the specified URL. The `await` keyword is crucial; it tells our code to wait for the action to complete.
- **`expect(...)`:** This is an assertion. It's how you check if your application is behaving correctly.
- **`.toHaveText(...)`:** This is the specific check. Here, we are asserting that the element has the text "Playwright". If it doesn't, the test will fail.

## 6. Writing and Running Your First Test

Let's modify the example test slightly.

1.  Change the URL in `page.goto` to `https://www.google.com`.
2.  Change the assertion to check for the title of the Google page. Replace the `locator` and `expect` lines with this:
    ```typescript
    await expect(page).toHaveTitle(/Google/);
    ```
    This line asserts that the page's title contains the word "Google".

Your modified test should look like this:
```typescript
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://www.google.com/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Google/);
});
```

**Now, let's run it!**

In the terminal, type this command and press Enter:
```powershell
npx playwright test
```

You will see Playwright start up, run the test (it happens very fast!), and then show you the results in the terminal. It should say "1 passed".

## 7. Understanding the Test Report

Playwright automatically generates a beautiful HTML report for you. To view it, run this command in the terminal:

```powershell
npx playwright show-report
```

This will open a new tab in your web browser with a detailed report of your test run. You can click on the test to see the exact steps that were executed. This report is one of Playwright's most powerful features for debugging and sharing results.

Congratulations! You have successfully set up a Playwright project, written a test, run it, and viewed the report.