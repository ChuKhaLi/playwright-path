import { test, expect } from '@playwright/test';

test('GET /users', async ({ request }) => {
  const response = await request.get('https://reqres.in/api/users');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.page).toBe(1);
});

test('POST /users', async ({ request }) => {
  const response = await request.post('https://reqres.in/api/users', {
    data: {
      name: 'morpheus',
      job: 'leader',
    },
  });
  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.name).toBe('morpheus');
  expect(body.job).toBe('leader');
});