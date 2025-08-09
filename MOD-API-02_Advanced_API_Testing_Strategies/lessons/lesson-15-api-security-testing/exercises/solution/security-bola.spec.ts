import { test, expect } from '../../lesson-04-advanced-api-testing-with-authentication/exercises/solution/auth-helper';

test.describe('API Security: BOLA', () => {
  // The authenticated user is kminchelle, who is user #15.
  // Their own cart is at /auth/carts/15.
  // We will try to access the cart for user #1.
  const OTHER_USER_CART_URL = '/auth/carts/1';

  test('should not allow a user to access another user\'s cart', async ({ authenticatedApi }) => {
    console.log('Attempting to access another user\'s cart...');
    
    const response = await authenticatedApi.get(OTHER_USER_CART_URL);

    // A secure API should prevent this action.
    // The DummyJSON API correctly returns a 403 Forbidden status.
    console.log(`Received status: ${response.status()}`);
    expect(response.status()).toBe(403);

    const body = await response.json();
    expect(body.message).toContain('not valid'); // The error message confirms the issue
  });
});