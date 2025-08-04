import { test } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

/**
 * This example demonstrates how to run a Lighthouse audit within a Playwright test.
 */
test.describe('Lighthouse Performance Audit', () => {
  test('should meet performance, accessibility, and best practices thresholds', async ({
    page,
  }) => {
    // Navigate to the page you want to audit
    await page.goto('https://www.wikipedia.org/');

    // Run the Lighthouse audit
    await playAudit({
      page: page,
      port: 9222, // Make sure this port is not used by other processes
      thresholds: {
        // Set your performance budget. These are example values.
        performance: 80,
        accessibility: 95,
        'best-practices': 90,
        seo: 90,
      },
      reports: {
        formats: {
          html: true, // Generate an HTML report for detailed analysis
        },
        // Name the report with a timestamp to keep a history
        name: `lighthouse-wikipedia-${new Date().toISOString()}`,
        directory: 'lighthouse-reports', // Save reports to this directory
      },
    });
  });
});