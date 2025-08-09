import { test, expect } from '@playwright/test';

test.describe('Reqres API', () => {
  test.use({ baseURL: 'https://reqres.in' });

  test('should get a single user', async ({ request }) => {
    const response = await request.get('/api/users/2');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.id).toBe(2);
  });

  test('should get a list of users', async ({ request }) => {
    const response = await request.get('/api/users?page=2');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.page).toBe(2);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('should create a new user', async ({ request }) => {
    const newUser = {
      name: 'morpheus',
      job: 'leader',
    };
    const response = await request.post('/api/users', {
      data: newUser,
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.name).toBe(newUser.name);
    expect(body.job).toBe(newUser.job);
  });

  test('should update a user', async ({ request }) => {
    const updatedUser = {
      name: 'morpheus',
      job: 'zion resident',
    };
    const response = await request.put('/api/users/2', {
      data: updatedUser,
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.name).toBe(updatedUser.name);
    expect(body.job).toBe(updatedUser.job);
  });

  test('should delete a user', async ({ request }) => {
    const response = await request.delete('/api/users/2');
    expect(response.status()).toBe(204);
  });
});
