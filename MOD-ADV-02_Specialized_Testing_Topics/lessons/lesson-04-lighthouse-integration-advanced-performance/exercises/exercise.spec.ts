import { test } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

/**
 * Exercise: Run Your Own Lighthouse Audit
 *
 * Objective:
 * To practice setting up and running a Lighthouse audit on a live website.
 *
 * Instructions:
 * 1. Target URL: Choose a website you use frequently, for example, 'https://developer.mozilla.org/'.
 * 2. Create a test that runs a Lighthouse audit on the chosen URL.
 * 3. Set the following thresholds:
 *    - performance: 60
 *    - accessibility: 90
 *    - best-practices: 85
 *    - seo: 80
 * 4. Configure the test to generate an HTML report in the 'lighthouse-reports' directory.
 * 5. Run the test. If it fails, inspect the HTML report to see why the scores were below the thresholds.
 *
 * Bonus Challenge:
 * - Create a second test that audits a different page on the same website (e.g., a specific article or documentation page).
 * - Compare the Lighthouse scores between the homepage and the inner page. Are there significant differences?
 */

test.describe('Lighthouse Audit Exercises', () => {
  test('should audit the MDN homepage', async ({ page }) => {
    // Your code goes here
    await page.goto('https://developer.mozilla.org/');

    await playAudit({
      page: page,
      port: 9222,
      thresholds: {
        performance: 60,
        accessibility: 90,
        'best-practices': 85,
        seo: 80,
      },
      reports: {
        formats: {
          html: true,
        },
        name: 'lighthouse-mdn-homepage',
        directory: 'lighthouse-reports',
      },
    });
  });
});