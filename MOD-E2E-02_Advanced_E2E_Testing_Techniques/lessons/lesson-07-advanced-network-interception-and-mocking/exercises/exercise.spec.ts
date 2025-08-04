import { test, expect } from '@playwright/test';

/**
 * Exercise: Advanced Mocking for a Weather App
 *
 * You are testing a weather application. The app fetches current weather
 * from `**/api/weather/current` and a 5-day forecast from `**/api/weather/forecast`.
 *
 * -- INSTRUCTIONS --
 *
 * 1.  **Test a "VIP" User State:**
 *     - Intercept the request to `**/api/weather/current`.
 *     - Use `route.continue()` to add a custom HTTP header `x-user-plan: vip`
 *       to the outgoing request.
 *     - The server will respond differently for VIPs. Assert that the element
 *       `#vip-bonus-feature` is visible on the page.
 *
 * 2.  **Test a Modified Forecast:**
 *     - Intercept the request to `**/api/weather/forecast`.
 *     - Use `route.fetch()` to get the real response.
 *     - Modify the JSON response: change the temperature for the first day
 *       of the forecast to `35` degrees Celsius.
 *     - Fulfill the request with the modified data.
 *     - Assert that the temperature displayed for the first day in the
 *       forecast list is "35°C".
 *
 * 3.  **Test Server Unavailability:**
 *     - Create a new test for this scenario.
 *     - Intercept requests to `**/api/weather/current`.
 *     - Fulfill the request with a `503 Service Unavailable` status.
 *     - Assert that a specific error message, "Weather service is currently
 *       unavailable. Please try again later.", is displayed in the `#error-panel` element.
 *
 */

test.describe('Weather App Advanced Mocking', () => {
  test('should show VIP features and a modified forecast', async ({ page }) => {
    // TODO: Step 1 - Intercept and add a header to the 'current' weather request.
    // await page.route('**/api/weather/current', async route => {
    //   ...
    //   await route.continue({ headers });
    // });

    // TODO: Step 2 - Intercept and modify the 'forecast' response.
    // await page.route('**/api/weather/forecast', async route => {
    //   ...
    //   json.days[0].temp = 35;
    //   await route.fulfill({ response, json });
    // });

    await page.goto('/weather');

    // Assertions for steps 1 and 2
    // await expect(page.locator('#vip-bonus-feature')).toBeVisible();
    // await expect(page.locator('.forecast-day-1 .temp')).toHaveText('35°C');
  });

  test('should handle server unavailability gracefully', async ({ page }) => {
    // TODO: Step 3 - Intercept and fulfill with a 503 error.
    // await page.route('**/api/weather/current', async route => {
    //   ...
    // });

    await page.goto('/weather');

    // Assertion for step 3
    // await expect(page.locator('#error-panel')).toContainText(...);
  });
});