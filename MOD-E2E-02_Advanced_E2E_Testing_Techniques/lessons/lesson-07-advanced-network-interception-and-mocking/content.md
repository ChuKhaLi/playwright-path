# Advanced Network Interception and Mocking

While basic API mocking involves replacing a response, advanced testing often requires more nuanced control over network traffic. Playwright's `page.route()` method provides a powerful API to intercept, inspect, modify, and even abort network requests and responses.

## 1. The `Route` Object

When you intercept a request with `page.route()`, the callback function receives a `Route` object. This object is your key to controlling the request.

**Key `Route` Methods:**
-   `route.request()`: Access the original `Request` object.
-   `route.fulfill()`: Fulfill the request with a custom response (as seen before).
-   `route.continue()`: Continue the request, optionally modifying it.
-   `route.abort()`: Abort the request, simulating a network failure.

## 2. Modifying a Request on the Fly

You can intercept a request and change its parameters (URL, method, headers, post data) before it's sent to the server.

### Example: Adding a Custom Header

```typescript
import { test, expect } from '@playwright/test';

test('should add a custom header to an outgoing request', async ({ page }) => {
  await page.route('**/api/data', async route => {
    // Get the original headers
    const headers = route.request().headers();
    
    // Add a new header
    headers['x-test-id'] = 'my-test-run-123';

    // Continue the request with the modified headers
    await route.continue({ headers });
  });

  // This action will trigger the API call
  await page.goto('/some-page-that-calls-api-data');

  // On the server side, you could now have logic that looks for this header.
  // For the test, we can assert that the UI reflects a change driven by the header.
  await expect(page.locator('.test-specific-banner')).toBeVisible();
});
```

## 3. Modifying a Response from the Server

Instead of completely replacing a response, you can fetch the real response from the server and then modify it before it reaches the browser. This is useful for testing how the UI handles slight variations in data without having to mock the entire object.

### Example: Changing a Single Field in a JSON Response

```typescript
import { test, expect } from '@playwright/test';

test('should handle a modified user status in the UI', async ({ page }) => {
  await page.route('**/api/user/me', async route => {
    // Fetch the original response
    const response = await route.fetch();
    let json = await response.json();

    // Modify the response body
    json.status = 'premium_plus'; // Change the user's status

    // Fulfill with the modified body
    await route.fulfill({ response, json });
  });

  await page.goto('/profile');

  // Assert that the UI shows the premium plus features
  await expect(page.locator('#premium-plus-badge')).toBeVisible();
});
```

## 4. Simulating Network and Server Errors

Testing how your application behaves during network failures is crucial for building a resilient UI.

### Example: Simulating a 500 Server Error

```typescript
import { test, expect } from '@playwright/test';

test('should display a friendly error message on server failure', async ({ page }) => {
  // Intercept the request and fulfill with a 500 status code
  await page.route('**/api/products', async route => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Internal Server Error' }),
    });
  });

  await page.goto('/products');

  // Assert that the application's error boundary caught the error
  await expect(page.locator('.error-message')).toHaveText('Oops! Something went wrong. Please try again later.');
});
```

### Example: Simulating a Network Failure

Use `route.abort()` to simulate a complete network failure for a specific request.

```typescript
import { test, expect } from '@playwright/test';

test('should display an offline message when an image fails to load', async ({ page }) => {
  // Abort any request for a .png file
  await page.route('**/*.png', route => route.abort());

  await page.goto('/gallery');

  // The application should gracefully handle the missing image
  await expect(page.locator('img[alt="Image failed to load"]')).toBeVisible();
});
```
This is also a great way to speed up tests by blocking non-essential resources like tracking scripts, ads, or large images.

## 5. Managing Complex Mocking Scenarios

For larger test suites, you might need to organize your mocks. You can create helper functions or classes to encapsulate mocking logic.

```typescript
// Helper function in a separate file
export async function mockUserDetails(page, userOverrides) {
  const defaultUser = { id: '1', name: 'Default User', role: 'user' };
  const mockUser = { ...defaultUser, ...userOverrides };
  
  await page.route('**/api/user/me', route => {
    route.fulfill({ json: mockUser });
  });
}

// In your test file
import { mockUserDetails } from './mocks';

test('admin user should see the admin dashboard link', async ({ page }) => {
  // Use the helper to mock an admin user
  await mockUserDetails(page, { role: 'admin' });

  await page.goto('/dashboard');
  
  await expect(page.getByRole('link', { name: 'Admin Panel' })).toBeVisible();
});
```

## Summary

Advanced network interception with Playwright gives you fine-grained control to simulate a wide variety of network conditions. By modifying requests and responses, simulating errors, and aborting requests, you can test your application's resilience and its handling of edge cases. Organizing this logic into reusable helpers keeps your tests clean and maintainable.