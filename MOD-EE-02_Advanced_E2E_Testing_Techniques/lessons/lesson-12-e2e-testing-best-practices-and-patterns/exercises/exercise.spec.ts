import { test, expect } from '@playwright/test';

/**
 * Exercise: Refactor a Test to Apply Best Practices
 *
 * You have been given a poorly written test for a login form. Your task is to
 * refactor it into a high-quality test that follows the best practices
 * discussed in this lesson.
 *
 * -- INSTRUCTIONS --
 *
 * 1.  **Organize with `describe`:**
 *     - Create a `test.describe` block called "Login and Authentication".
 *
 * 2.  **Improve Naming:**
 *     - Rename the test from "login test" to something descriptive, like
 *       "should allow a user to log in with valid credentials".
 *
 * 3.  **Use User-Facing Locators:**
 *     - Replace the brittle CSS selectors (`#user`, `#pass`, `button.login-btn`)
 *       with robust, user-facing locators like `getByLabel` and `getByRole`.
 *
 * 4.  **Apply AAA Structure:**
 *     - Add comments (`// Arrange`, `// Act`, `// Assert`) to clearly
 *       separate the three phases of the test.
 *
 * 5.  **Add Annotations:**
 *     - Add a `@smoke` tag to the test.
 *
 * 6.  **Create a Second Test for Failure Case:**
 *     - Add another test within the same `describe` block.
 *     - Name it "should show an error message with invalid credentials".
 *     - This test should follow all the same best practices. It should
 *       enter incorrect credentials and assert that an error message is shown.
 *
 */

const mockPageURL = 'file://' + __dirname + '/../mock-page/exercise.html';

// --- Original Bad Test (for reference) ---
// test('login test', async ({ page }) => {
//   await page.goto(mockPageURL);
//   await page.locator('#user').fill('admin');
//   await page.locator('#pass').fill('admin123');
//   await page.locator('button.login-btn').click();
//   await expect(page).toHaveURL(/.*#dashboard/);
// });


// --- REFACTORED TEST GOES HERE ---

// TODO: Step 1 - Create a `test.describe` block.
// test.describe('...', () => {

  // TODO: Steps 2, 3, 4, 5 - Create the refactored test for a successful login.
  // test('...', { tag: ... }, async ({ page }) => {
    // Arrange
    // ...

    // Act
    // ...

    // Assert
    // ...
  // });

  // TODO: Step 6 - Create the second test for a failed login.
  // test('...', async ({ page }) => {
    // ...
  // });

// });