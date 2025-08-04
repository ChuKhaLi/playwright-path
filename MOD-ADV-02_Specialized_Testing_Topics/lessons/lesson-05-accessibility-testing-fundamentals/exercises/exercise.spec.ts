import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Exercise: Run Your First Accessibility Scan
 *
 * Objective:
 * To practice using axe-playwright to find accessibility violations on a webpage.
 *
 * Instructions:
 * 1. Target URL: Use a website known to have accessibility issues for practice,
 *    such as 'http://the-internet.herokuapp.com/'.
 * 2. Create a test that navigates to the target URL.
 * 3. Run an accessibility scan on the entire page.
 * 4. Instead of asserting that the violations array is empty, log the violations to the console
 *    to inspect them.
 * 5. Assert that the number of violations is greater than 0 to confirm your scan is working.
 *
 * Bonus Challenge:
 * - Pick one of the violations reported by the scan.
 * - Read the `description` and `helpUrl` for that violation.
 * - In your own words, write a comment in your test file explaining what the issue is and
 *   a possible way to fix it.
 */

test.describe('Accessibility Scan Exercises', () => {
  test('should find accessibility issues on a sample page', async ({ page }) => {
    // Your code goes here
    await page.goto('http://the-internet.herokuapp.com/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    if (accessibilityScanResults.violations.length > 0) {
      console.log('Found Accessibility Violations:');
      console.log(JSON.stringify(accessibilityScanResults.violations, null, 2));
    }

    // We expect to find issues on this page
    expect(accessibilityScanResults.violations.length).toBeGreaterThan(0);

    /**
     * Bonus Challenge Example Comment:
     *
     * Violation found: "landmark-one-main"
     * Description: The page should have one main landmark.
     * Fix: Wrap the primary content of the page in a `<main>` HTML tag.
     * This helps screen reader users easily navigate to the main content area.
     */
  });
});