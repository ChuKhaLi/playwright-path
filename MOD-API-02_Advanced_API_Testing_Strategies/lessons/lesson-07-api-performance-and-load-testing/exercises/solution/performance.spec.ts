import { test, expect } from '@playwright/test';

const API_URL = 'https://jsonplaceholder.typicode.com';

test.describe('API Performance Tests', () => {
  test('should respond within a performance budget', async ({ request }) => {
    const startTime = Date.now();
    
    const response = await request.get(`${API_URL}/posts`);
    
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`Single request duration: ${duration}ms`);

    expect(response.ok()).toBe(true);
    expect(duration).toBeLessThan(1000); // 1 second budget
  });

  test('should handle concurrent requests', async ({ request }) => {
    const CONCURRENT_USERS = 15;
    const requests = [];

    console.log(`Simulating ${CONCURRENT_USERS} concurrent users...`);

    for (let i = 0; i < CONCURRENT_USERS; i++) {
      requests.push(request.get(`${API_URL}/posts`));
    }

    const responses = await Promise.all(requests);

    for (const response of responses) {
      expect(response.ok()).toBe(true);
    }

    console.log(`Successfully handled ${responses.length} concurrent requests.`);
  });
});