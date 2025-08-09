import { test as base, expect, APIRequestContext } from '@playwright/test';

export const test = base.extend<{ api: APIRequestContext }>({
  api: async ({ playwright }, use) => {
    const requestContext = await playwright.request.newContext({
      baseURL: 'https://jsonplaceholder.typicode.com',
      extraHTTPHeaders: {
        'Accept': 'application/json',
      },
    });
    await use(requestContext);
    await requestContext.dispose();
  },
});

export { expect };