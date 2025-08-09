import { test, expect } from '@playwright/test';

test('should authenticate with JWT and access a protected route', async ({ request }) => {
  // Step 1: Login to get the JWT
  const loginResponse = await request.post('https://dummyjson.com/auth/login', {
    data: {
      username: 'kminchelle',
      password: '0lelplR',
    },
    headers: {
      'Content-Type': 'application/json',
    }
  });

  expect(loginResponse.ok()).toBe(true);
  const loginBody = await loginResponse.json();
  const token = loginBody.token;
  expect(token).toBeDefined();

  // Step 2: Access the protected route with the token
  const authResponse = await request.get('https://dummyjson.com/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  // Step 3: Assert on the response
  expect(authResponse.ok()).toBe(true);
  const authBody = await authResponse.json();
  expect(authBody.id).toBe(15);
  expect(authBody.username).toBe('kminchelle');
});