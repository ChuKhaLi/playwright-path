import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * This example demonstrates how to run a basic accessibility scan using axe-playwright.
 */
test.describe('Accessibility Scan Example', () => {
  test('should have no detectable accessibility violations on the home page', async ({
    page,
  }) => {
    // Navigate to a page to be tested
    await page.goto('https://www.w3.org/WAI/demos/bad/before/home.html');

    // Create a new AxeBuilder instance and analyze the page
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    // For demonstration, we log the violations to the console.
    // In a real test, you would assert that this array is empty.
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Accessibility Violations Found:');
      console.log(JSON.stringify(accessibilityScanResults.violations, null, 2));
    }

    // The actual assertion
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});