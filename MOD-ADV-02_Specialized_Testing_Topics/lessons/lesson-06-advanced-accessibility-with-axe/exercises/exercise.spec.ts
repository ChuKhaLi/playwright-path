import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Exercise: Advanced Accessibility Scanning
 *
 * Objective:
 * To practice using advanced AxeBuilder configurations to perform a targeted scan.
 *
 * Instructions:
 * 1. Target URL: Use a complex website like 'https://www.amazon.com/'.
 * 2. Create a test that navigates to the homepage.
 * 3. We want to check the accessibility of the main search bar and its surrounding area.
 *    - Use the `include()` method to target the element with the id 'nav-belt'.
 * 4. We also want to ignore any color contrast issues for this specific test.
 *    - Use the `disableRules()` method to disable the 'color-contrast' rule.
 * 5. Run the scan and log any violations to the console.
 * 6. Assert that the violations array is empty for your targeted, configured scan.
 *    (Note: This may or may not pass depending on Amazon's current site structure and
 *    accessibility. The goal is to practice the configuration.)
 *
 * Bonus Challenge:
 * - Chain another method, `withTags(['wcag2a'])`, to only check for Level A violations.
 * - Does this change the number of violations found?
 */

test.describe('Advanced Accessibility Exercises', () => {
  test('should run a targeted scan on the Amazon navigation belt', async ({
    page,
  }) => {
    // Your code goes here
    await page.goto('https://www.amazon.com/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#nav-belt')
      .disableRules(['color-contrast'])
      .analyze();

    if (accessibilityScanResults.violations.length > 0) {
      console.log('Targeted Scan Violations:');
      console.log(JSON.stringify(accessibilityScanResults.violations, null, 2));
    }

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});