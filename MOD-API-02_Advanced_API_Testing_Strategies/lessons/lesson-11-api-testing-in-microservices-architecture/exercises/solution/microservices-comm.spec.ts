import { test, expect } from '@playwright/test';

const USER_ID = '123';
const USER_SERVICE_URL = `http://user-service/api/v1/users/${USER_ID}`;

// This function simulates the logic of the Order Service
async function createOrder(page: any, userId: string): Promise<boolean> {
  console.log(`Checking status for user: ${userId}`);
  const response = await page.request.get(USER_SERVICE_URL);
  const userData = await response.json();

  if (userData.status === 'active') {
    console.log(`User ${userId} is active. Creating order...`);
    // In a real scenario, this would trigger another API call
    console.log('Order created successfully.');
    return true;
  } else {
    console.log(`User ${userId} is inactive. Aborting order.`);
    return false;
  }
}

test.describe('Order Service Logic', () => {
  test('should create an order for a valid user', async ({ page }) => {
    // Mock the User Service to return an active user
    await page.route(USER_SERVICE_URL, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: USER_ID, status: 'active' }),
      });
    });

    const orderCreated = await createOrder(page, USER_ID);
    expect(orderCreated).toBe(true);
  });

  test('should not create an order for an inactive user', async ({ page }) => {
    // Mock the User Service to return an inactive user
    await page.route(USER_SERVICE_URL, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: USER_ID, status: 'inactive' }),
      });
    });

    const orderCreated = await createOrder(page, USER_ID);
    expect(orderCreated).toBe(false);
  });
});