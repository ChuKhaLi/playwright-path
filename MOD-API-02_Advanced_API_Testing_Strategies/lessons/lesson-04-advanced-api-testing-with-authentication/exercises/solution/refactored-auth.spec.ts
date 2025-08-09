import { test, expect } from './auth-helper';

test('should access protected route using the authenticatedApi fixture', async ({ authenticatedApi }) => {
  const response = await authenticatedApi.get('/auth/me');

  expect(response.ok()).toBe(true);

  const body = await response.json();
  expect(body.id).toBe(15);
  expect(body.username).toBe('kminchelle');
  expect(body.email).toBe('kminchelle@qq.com');
});