# Testing Single-Page Applications (SPA)

Single-Page Applications (SPAs) have fundamentally changed how web applications are built and behave. Unlike traditional multi-page applications, SPAs load a single HTML page and dynamically update content as the user interacts with the app. This presents unique challenges for E2E testing.

## 1. Key Characteristics of SPAs

-   **Client-Side Routing:** Navigation between "pages" happens in the browser without a full page reload. The URL changes, but the browser doesn't request a new HTML document from the server.
-   **Asynchronous Data Loading:** SPAs frequently fetch data from APIs in the background after the initial page load. UI components may render in a loading state before being populated with data.
-   **Dynamic DOM:** The Document Object Model (DOM) is constantly changing as components are mounted, updated, and unmounted.

## 2. Handling Client-Side Navigation

Playwright is designed to handle SPAs effectively. When you click a link that triggers client-side routing, Playwright waits for the navigation to complete.

```typescript
import { test, expect } from '@playwright/test';

test('should navigate between pages in a SPA', async ({ page }) => {
  await page.goto('https://your-spa.com/');

  // Click a link to navigate to the "About" page
  await page.getByRole('link', { name: 'About' }).click();

  // Playwright automatically waits for the URL to change
  await expect(page).toHaveURL(/.*\/about/);
  
  // It also waits for the new content to appear
  await expect(page.getByRole('heading', { name: 'About Us' })).toBeVisible();

  // Navigate back
  await page.goBack();
  await expect(page).toHaveURL('https://your-spa.com/');
  await expect(page.getByRole('heading', { name: 'Welcome Home' })).toBeVisible();
});
```
**Key Takeaway:** Treat client-side navigation clicks just like regular link clicks. Playwright's auto-waiting handles most of the complexity.

## 3. Dealing with Asynchronous Data

A common challenge in SPAs is waiting for data to be fetched from an API and rendered on the screen. Hard-coded waits (`page.waitForTimeout()`) are a bad practice as they lead to flaky and slow tests.

Playwright's **web-first assertions** are the solution. They automatically wait for the condition to be met before proceeding or failing.

### Example: Waiting for a List of Products

```typescript
import { test, expect } from '@playwright/test';

test('should display a list of products fetched from an API', async ({ page }) => {
  await page.goto('https://your-spa.com/products');

  // The page might initially show a loading spinner
  const loadingSpinner = page.locator('.loader');
  await expect(loadingSpinner).toBeVisible();

  // Assert that the spinner disappears. Playwright waits for this to happen.
  await expect(loadingSpinner).not.toBeVisible({ timeout: 10000 });

  // Now, assert that the product list is rendered.
  // Playwright will wait for the list to contain at least one item.
  const productList = page.locator('.product-list li');
  await expect(productList).toHaveCountGreaterThan(0);

  // Assert a specific product is visible
  await expect(page.getByText('Awesome Gadget')).toBeVisible();
});
```

## 4. Mocking API Requests

To make tests faster, more reliable, and independent of backend services, you can mock API responses. This allows you to test the frontend in isolation with predictable data.

Playwright's `page.route()` method is perfect for this.

### Example: Mocking a User Profile API

```typescript
import { test, expect } from '@playwright/test';

test('should display user data from a mocked API', async ({ page }) => {
  // Intercept the network request to the user API
  await page.route('**/api/user/123', async route => {
    // Provide a mock JSON response
    const mockUser = {
      id: '123',
      name: 'John Doe',
      email: 'john.doe@example.com',
    };
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUser),
    });
  });

  // Navigate to the profile page
  await page.goto('https://your-spa.com/profile/123');

  // The page will now render with your mock data
  await expect(page.getByRole('heading', { name: 'John Doe' })).toBeVisible();
  await expect(page.getByText('john.doe@example.com')).toBeVisible();
});
```

**Benefits of Mocking:**
-   **Speed:** No real network latency.
-   **Stability:** Not dependent on a live backend.
-   **Control:** You can easily test edge cases, like error responses (`status: 500`) or empty data arrays.

## Summary

Testing SPAs requires a shift in mindset from traditional page loads to a world of dynamic content and client-side logic. Playwright's modern architecture, with its auto-waiting capabilities and powerful network interception tools, is perfectly suited for these challenges. By embracing web-first assertions and API mocking, you can build a robust, fast, and reliable test suite for any SPA.