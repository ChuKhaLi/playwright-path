# Lesson 8: Visual Regression and Screenshot Testing

## 1. What is Visual Regression Testing?

While functional tests check if a button works, visual regression tests check if the button *looks* right. They do this by taking a screenshot of a UI component or page and comparing it pixel by pixel against a "golden" or "snapshot" image that was previously approved.

This is incredibly useful for catching unintended visual bugs, such as:
- CSS changes that mess up the layout.
- A button's color changing unexpectedly.
- Text overlapping or wrapping incorrectly.
- Elements disappearing or being misplaced after a code change.

Playwright has a first-class, built-in assertion for this: `toHaveScreenshot()`.

## 2. Your First Screenshot Test

Let's write a simple test that takes a screenshot of a page.

```typescript
import { test, expect } from '@playwright/test';

test('landing page should look the same', async ({ page }) => {
  await page.goto('https://playwright.dev');
  
  // This is the core assertion for visual testing
  await expect(page).toHaveScreenshot('landing-page.png');
});
```

### The Snapshot Workflow

**First Run:**
The first time you run this test, Playwright will see that no `landing-page.png` snapshot exists. It will take a screenshot and save it as the "golden" version. The test will pass, and you'll see a message like: `A new snapshot was created...`.

The snapshot will be saved in a new directory next to your test file, like `tests/example.spec.ts-snapshots/landing-page.png`. **You should commit this snapshot file to your Git repository.**

**Subsequent Runs:**
On every subsequent run, Playwright will:
1.  Take a new screenshot in memory.
2.  Compare it to the saved `landing-page.png` snapshot.
3.  If they are identical, the test passes.
4.  If they are different, the test fails.

### Updating Snapshots
If a visual change was intentional (e.g., you redesigned the landing page), you need to update the golden snapshot. You can do this by running the test command with the `--update-snapshots` flag.

```bash
npx playwright test --update-snapshots
```
This will replace the old snapshots with the new screenshots, and your tests will pass again.

## 3. Screenshotting Specific Elements

Sometimes, you don't want to screenshot the entire page, especially if parts of it are dynamic. You can call `toHaveScreenshot()` on a specific locator.

```typescript
test('login form should look correct', async ({ page }) => {
  await page.goto('/login');
  const loginForm = page.locator('#login-form');
  
  await expect(loginForm).toHaveScreenshot('login-form.png');
});
```
This is much more stable as it isolates the test to a single, self-contained component.

## 4. Handling Dynamic Data with Masking

Visual tests can be flaky if your UI contains dynamic data like timestamps, user avatars, or animations. The `mask` option allows you to "black out" certain elements before the comparison happens.

```typescript
test('dashboard should look correct, ignoring the clock', async ({ page }) => {
  await page.goto('/dashboard');
  
  // The clock element shows the current time, which always changes.
  const clock = page.locator('#live-clock');
  
  await expect(page).toHaveScreenshot('dashboard.png', {
    // Pass an array of locators to mask
    mask: [clock]
  });
});
```
Playwright will draw a pink box over the masked elements in the snapshot, effectively ignoring them during the comparison.

## 5. Fine-Tuning the Comparison

Sometimes, minor differences due to anti-aliasing or rendering variations are acceptable. You can fine-tune the comparison algorithm.

```typescript
await expect(page).toHaveScreenshot('some-page.png', {
  // The maximum number of pixels that can be different.
  maxDiffPixels: 100,

  // A number between 0 and 1. The threshold for what is considered a
  // different pixel. 0.2 means a 20% difference in color is tolerated.
  threshold: 0.2,
  
  // Disable anti-aliasing which can cause flakiness
  animations: 'disabled'
});
```
**Rule of thumb:** Use these options sparingly. The goal is to catch regressions, and being too lenient can defeat the purpose. Masking is often a better solution than increasing thresholds.

## 6. Best Practices for Visual Testing

- **Test Components, Not Just Pages:** Element screenshots are more stable and easier to manage than full-page screenshots.
- **Control the Viewport:** Ensure your viewport is a consistent size for every test run to avoid responsive layout changes. Configure this in `playwright.config.ts`.
  ```typescript
  // playwright.config.ts
  use: {
    viewport: { width: 1280, height: 720 },
  }
  ```
- **Wait for Stability:** Before taking a screenshot, ensure the page is fully loaded and any entry animations have completed. Use `expect(locator).toBeVisible()` or other assertions to wait for a stable state.
- **Review Changes Carefully:** When a visual test fails, use the HTML report to see the "actual", "expected", and "diff" images. Carefully review if the change is a bug or an intentional update before running `--update-snapshots`.

## 7. Summary

Visual regression testing is a vital layer in a comprehensive automation strategy. Playwright's built-in `toHaveScreenshot` assertion provides a powerful, all-in-one tool for catching visual bugs early. By managing snapshots, masking dynamic content, and testing components in isolation, you can build a reliable and low-maintenance visual test suite.