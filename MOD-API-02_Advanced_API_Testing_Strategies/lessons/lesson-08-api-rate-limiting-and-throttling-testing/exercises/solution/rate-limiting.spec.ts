import { test, expect, APIResponse } from '@playwright/test';

test('should trigger a 403 Forbidden error when rate limit is exceeded', async ({ request }) => {
  // Give this test more time as it makes many requests
  test.setTimeout(60000); 

  let finalResponse: APIResponse | null = null;
  let rateLimitHit = false;

  // We'll try up to 70 times, which should be enough to hit the unauthenticated limit
  for (let i = 1; i <= 70; i++) {
    const response = await request.get('https://api.github.com/users/microsoft');
    console.log(`Request #${i}: Status ${response.status()}`);
    
    finalResponse = response;

    if (response.status() === 403) {
      console.log('Rate limit hit!');
      rateLimitHit = true;
      break;
    }
  }

  // Assert that we did hit the rate limit
  expect(rateLimitHit).toBe(true);
  // Assert that the final response status was 403
  expect(finalResponse?.status()).toBe(403);

  // You can also inspect the response body for the rate limit message
  if (finalResponse) {
    const body = await finalResponse.json();
    expect(body.message).toContain('API rate limit exceeded');
  }
});