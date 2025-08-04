import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * This example demonstrates advanced configuration of axe-playwright.
 */
test.describe('Advanced Accessibility Scans', () => {
  test('should scan a specific component and disable a rule', async ({
    page,
  }) => {
    // Using a known "bad" page for demonstration
    await page.goto('https://www.w3.org/WAI/demos/bad/before/home.html');

    // Example: We only want to test the main content area and we have decided
    // to temporarily ignore the 'color-contrast' issue.
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#main') // Scan only the main content
      .disableRules(['color-contrast']) // Ignore color contrast issues
      .withTags(['wcag2aa']) // Focus on WCAG 2 AA standards
      .analyze();

    // Even with the exclusions, this "bad" page will still have violations.
    // We log them for review.
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Filtered Accessibility Violations:');
      console.log(JSON.stringify(accessibilityScanResults.violations, null, 2));
    }

    // In a real test, you would assert for an empty array.
    // Here we assert that there are still violations to show the scan worked.
    expect(accessibilityScanResults.violations.length).toBeGreaterThan(0);
  });
});