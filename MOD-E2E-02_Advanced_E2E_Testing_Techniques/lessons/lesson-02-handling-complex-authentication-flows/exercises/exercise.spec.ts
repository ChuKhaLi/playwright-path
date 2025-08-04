import { test, expect } from '@playwright/test';

/**
 * Exercise: Setting Up Authentication
 *
 * In this exercise, you will create a global setup file to handle
 * authentication for a mock application.
 *
 * The application has two pages:
 * - /login.html: A simple login form.
 * - /dashboard.html: A protected page visible only after login.
 *
 * -- INSTRUCTIONS --
 *
 * 1.  Create a new file named `exercise.setup.ts`.
 * 2.  In `exercise.setup.ts`, write a setup test that:
 *     a. Navigates to the mock login page (`/login.html`).
 *     b. Fills the username with "admin".
 *     c. Fills the password with "password123".
 *     d. Clicks the "Login" button.
 *     e. Asserts that the page redirects to `/dashboard.html`.
 *     f. Saves the storage state to a file named `playwright/.auth/exercise-auth.json`.
 *
 * 3.  Configure `playwright.config.ts` to:
 *     a. Use `exercise.setup.ts` as a global setup file.
 *     b. Create a new project that uses the saved `exercise-auth.json` state.
 *
 * 4.  Run the test below. If your setup is correct, it should pass.
 *
 */

// Mock page setup
const mockDashboardURL = 'file://' + __dirname + '/../mock-page/dashboard.html';

test.describe('Authenticated Dashboard', () => {
  test('should display the correct welcome message', async ({ page }) => {
    // This test will run using the authentication state from your setup file.
    await page.goto(mockDashboardURL);

    // Verify that the dashboard content is visible
    const welcomeMessage = page.locator('#welcome-message');
    await expect(welcomeMessage).toBeVisible();
    await expect(welcomeMessage).toHaveText('Welcome, admin!');

    const secretData = page.locator('#secret-data');
    await expect(secretData).toBeVisible();
  });
});