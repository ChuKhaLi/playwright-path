import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid'; // Using uuid for a more robust unique ID

test('should add a correlation ID to an outgoing request', async ({ page }) => {
  const correlationId = uuidv4();
  const targetUrl = 'https://jsonplaceholder.typicode.com/posts/1';
  let capturedHeader = '';

  console.log(`Generated Correlation ID: ${correlationId}`);

  // Intercept the request to add the header
  await page.route(targetUrl, async (route) => {
    const headers = {
      ...route.request().headers(),
      'X-Correlation-ID': correlationId,
    };
    await route.continue({ headers });
  });

  // Set up a listener to verify the header on the outgoing request
  page.on('request', (request) => {
    if (request.url() === targetUrl) {
      capturedHeader = request.headers()['x-correlation-id'];
      console.log(`Captured Header: ${capturedHeader}`);
    }
  });

  // Make the API call that will be intercepted
  const response = await page.request.get(targetUrl);
  expect(response.ok()).toBe(true);

  // Assert that the header was correctly captured
  expect(capturedHeader).toBe(correlationId);
});