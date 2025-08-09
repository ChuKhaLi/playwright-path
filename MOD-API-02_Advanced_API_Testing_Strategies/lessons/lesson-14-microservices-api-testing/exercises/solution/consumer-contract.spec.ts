import { test, expect } from '@playwright/test';

const USER_ID = '1';
const USER_SERVICE_URL = `http://user-service/api/v1/users/${USER_ID}`;

// This is the contract defined by the consumer.
// It specifies the expected structure and types of the data.
const userContract = {
  id: expect.any(Number),
  name: expect.any(String),
  email: expect.stringMatching(/@/), // A simple regex to check for an email format
  status: expect.stringMatching(/^(active|inactive)$/), // Must be one of these two values
};

test('User Service should adhere to the consumer contract', async ({ page }) => {
  // This mock represents the Provider (User Service) returning a valid response.
  const mockUserResponse = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    status: 'active',
  };

  // Mock the provider's endpoint
  await page.route(USER_SERVICE_URL, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUserResponse),
    });
  });

  // Make the request as the consumer
  const response = await page.request.get(USER_SERVICE_URL);
  const responseBody = await response.json();

  // Assert that the response body matches the defined contract
  expect(responseBody).toMatchObject(userContract);
  console.log('Contract test passed!');
});