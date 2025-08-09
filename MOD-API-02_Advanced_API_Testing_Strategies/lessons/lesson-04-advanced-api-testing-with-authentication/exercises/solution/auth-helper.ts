import { test as base, expect, APIRequestContext } from '@playwright/test';

interface AuthenticatedTestFixtures {
  authenticatedApi: APIRequestContext;
}

export const test = base.extend<AuthenticatedTestFixtures>({
  authenticatedApi: async ({ playwright }, use) => {
    // Perform login to get the token
    const loginRequestContext = await playwright.request.newContext();
    const loginResponse = await loginRequestContext.post('https://dummyjson.com/auth/login', {
      data: {
        username: 'kminchelle',
        password: '0lelplR',
      },
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const loginBody = await loginResponse.json();
    const token = loginBody.token;
    await loginRequestContext.dispose();

    // Create a new context with the authentication token
    const authenticatedContext = await playwright.request.newContext({
      baseURL: 'https://dummyjson.com',
      extraHTTPHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    await use(authenticatedContext);

    // Clean up the context after the test
    await authenticatedContext.dispose();
  },
});

export { expect };