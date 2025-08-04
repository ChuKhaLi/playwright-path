# Lesson 1: Visual Regression Testing Fundamentals

## 1. What is Visual Regression Testing?

Visual Regression Testing is the process of detecting unintended visual changes in an application's UI. While functional tests verify that a feature *works*, visual tests verify that it *looks right*.

Think of it as an automated version of a game of "spot the difference." The testing process involves:
1.  **Capturing a baseline:** Taking a screenshot of a UI component or page when it's in a known "good" state.
2.  **Running tests:** After making code changes, taking a new screenshot of the same component or page.
3.  **Comparing:** Using a pixel-by-pixel comparison tool to highlight any differences between the baseline and the new screenshot.

If the differences are unexpected, the test fails, alerting the team to a potential visual bug. If the changes are intentional (e.g., a UI redesign), the baseline can be updated to reflect the new correct state.

### Why is it Important?

-   **Catches "Human" Errors:** Catches bugs that automated functional tests miss, such as CSS issues, layout problems, or incorrect font rendering.
-   **Protects Brand Integrity:** Ensures a consistent and professional look and feel across the application.
-   **Improves User Experience:** A polished UI builds user trust and confidence.
-   **Saves Time:** Reduces the need for manual visual inspection, which is tedious and error-prone.

## 2. Common Visual Bugs

Visual bugs can range from subtle to glaring. Here are a few common examples:

-   **Layout Issues:** Elements overlapping, misaligned, or not responding correctly to different screen sizes.
-   **Styling Errors:** Incorrect colors, fonts, or spacing.
-   **Content Overflow:** Text or images breaking out of their containers.
-   **Hidden Elements:** Elements that are unintentionally hidden or not rendered at all.
-   **Cross-Browser Inconsistencies:** The UI appearing differently on Chrome, Firefox, or Safari.

## 3. Playwright's Built-in Visual Testing

Playwright comes with a powerful built-in visual comparison feature that makes screenshot testing seamless. The key function is `await expect(page).toHaveScreenshot()`.

### How it Works

-   **First Run:** The first time you run a test with `toHaveScreenshot()`, Playwright generates a baseline screenshot and stores it. The test will fail on this first run because no baseline existed.
-   **Subsequent Runs:** On future runs, Playwright takes a new screenshot and compares it against the stored baseline.
-   **Updating Baselines:** If a change is intentional, you can update the baseline screenshots with a simple command.

## 4. Setting Up Your Project

Let's configure a Playwright project for visual testing.

### Step 1: Initialize a Playwright Project

If you don't have one already, create a new project:

```bash
npm init playwright@latest
```

Follow the prompts, selecting TypeScript.

### Step 2: Configure `playwright.config.ts`

Open your [`playwright.config.ts`](playwright.config.ts) and add or modify the `expect` block to configure screenshot testing options.

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // ... other configurations
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,

    toHaveScreenshot: {
      // An acceptable amount of pixels that could be different, unset by default.
      maxDiffPixels: 10,
    },
  },
  // ... other configurations
});
```

-   `maxDiffPixels`: Sets a threshold for the number of different pixels allowed before a test fails. This can be useful for handling minor anti-aliasing differences between environments.

## 5. Writing Your First Visual Test

Let's write a simple test to capture a screenshot of a webpage.

### Step 1: Create a Test File

Create a new file named `visual.spec.ts` in your `tests` directory.

### Step 2: Add the Test Code

```typescript
import { test, expect } from '@playwright/test';

test('example test', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveScreenshot('landing-page.png');
});
```

### Step 3: Run the Test to Generate a Baseline

Run the test from your terminal. Since this is the first run, it will fail and create the baseline screenshot.

```bash
npx playwright test --update-snapshots
```

You will see a new directory created: `tests/visual.spec.ts-snapshots`. Inside, you'll find `landing-page.png`.

### Step 4: Run the Test Again

Now, run the test again without the `--update-snapshots` flag:

```bash
npx playwright test
```

This time, the test should pass because the new screenshot matches the baseline.

### Step 5: Simulate a Visual Change

To see a failure, you can simulate a change. For example, you could use your browser's developer tools to change the background color of the Playwright site, or you can run the test against a different page.

If a visual bug is introduced in the application code, the test will fail, and Playwright will generate a diff image showing you exactly what changed.