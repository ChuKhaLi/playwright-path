# Testing Complex User Workflows

While unit tests focus on small pieces of code and component tests focus on individual UI elements, end-to-end (E2E) tests shine when validating complete user journeys. These workflows often span multiple pages, involve several steps, and represent a critical business process.

## 1. What is a User Workflow?

A user workflow is a sequence of steps a user takes to accomplish a goal. Examples include:
-   Searching for a product, adding it to the cart, and completing the checkout process.
-   Registering for an account, confirming the email, and setting up a profile.
-   Creating a new project, adding team members, and assigning the first task.

Testing these workflows is vital because it verifies that different parts of your application work together correctly.

## 2. Structuring Complex Tests

Long tests can become hard to read and maintain. It's important to structure them logically. Playwright's `test.step()` function is an excellent tool for this. It groups parts of your test into collapsible sections in the test report, making it much easier to debug failures.

### Example: E-commerce Checkout Workflow

```typescript
import { test, expect } from '@playwright/test';

test('should allow a user to purchase a product', async ({ page }) => {
  
  await test.step('Search for a product', async () => {
    await page.goto('/');
    await page.getByPlaceholder('Search for products...').fill('Laptop');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.locator('.product-list')).toBeVisible();
  });

  await test.step('Add product to cart', async () => {
    await page.locator('.product-item:has-text("Laptop")').getByRole('button', { name: 'Add to Cart' }).click();
    await expect(page.locator('.cart-item-count')).toHaveText('1');
  });

  await test.step('Navigate to cart and begin checkout', async () => {
    await page.locator('.cart-icon').click();
    await expect(page.getByRole('heading', { name: 'Your Cart' })).toBeVisible();
    await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
  });

  await test.step('Fill shipping information', async () => {
    await expect(page.getByRole('heading', { name: 'Shipping Details' })).toBeVisible();
    await page.getByLabel('Full Name').fill('Test User');
    await page.getByLabel('Address').fill('123 Playwright Lane');
    await page.getByRole('button', { name: 'Continue to Payment' }).click();
  });

  await test.step('Complete payment and verify order', async () => {
    await expect(page.getByRole('heading', { name: 'Payment' })).toBeVisible();
    // Mock payment interaction
    await page.getByLabel('Card Number').fill('4242 4242 4242 4242');
    await page.getByRole('button', { name: 'Place Order' }).click();
    
    await expect(page.getByRole('heading', { name: 'Order Confirmed!' })).toBeVisible();
    const orderId = await page.locator('.order-id').textContent();
    expect(orderId).toContain('ORD-');
  });
});
```

## 3. Using Helper Functions for Reusability

If a sequence of actions is repeated across multiple tests (like logging in or adding an item to the cart), extract it into a helper function. This follows the DRY (Don't Repeat Yourself) principle.

### Example: A `login` Helper

```typescript
// In a helper file, e.g., `test-helpers.ts`
import { Page } from '@playwright/test';

export async function login(page: Page, username: string, password: string) {
  await page.goto('/login');
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForURL('**/dashboard');
}

// In your test file
import { test, expect } from '@playwright/test';
import { login } from './test-helpers';

test('should be able to post a comment after logging in', async ({ page }) => {
  await login(page, 'testuser', 'password123');
  
  await page.goto('/posts/1');
  await page.getByPlaceholder('Add a comment...').fill('Great post!');
  await page.getByRole('button', { name: 'Submit' }).click();
  
  await expect(page.locator('.comment-list')).toContainText('Great post!');
});
```

## 4. Passing State Between Steps

In a workflow, you often need to use data from one step in a later step (e.g., using a product ID from the search results to visit the product page). You can simply store this data in a variable within your test's scope.

```typescript
test('should view product details from search results', async ({ page }) => {
  await page.goto('/search?q=book');

  const firstResult = page.locator('.product-item').first();
  const productId = await firstResult.getAttribute('data-product-id');
  const productName = await firstResult.locator('h3').textContent();

  expect(productId).toBeDefined();

  await firstResult.getByRole('link', { name: 'View Details' }).click();

  await expect(page).toHaveURL(`/products/${productId}`);
  await expect(page.getByRole('heading', { name: productName! })).toBeVisible();
});
```

## 5. Testing Conditional Workflows

Real user journeys are not always linear. A user might get an error, or the UI might change based on their input. Your tests should cover these conditional paths.

### Example: Testing Form Validation

```typescript
test('should show an error for invalid input and then succeed with valid input', async ({ page }) => {
  await page.goto('/register');

  // --- Conditional Path 1: Invalid Data ---
  await test.step('Attempt submission with invalid email', async () => {
    await page.getByLabel('Email').fill('invalid-email');
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.locator('.error-message')).toHaveText('Please enter a valid email address.');
  });

  // --- Conditional Path 2: Valid Data ---
  await test.step('Submit with valid data', async () => {
    await page.getByLabel('Email').fill('valid@example.com');
    // ... fill other fields
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page).toHaveURL('**/welcome');
  });
});
```

## Summary

Testing complex workflows is the ultimate goal of E2E testing. By structuring your tests with `test.step()`, creating reusable helper functions, passing state between steps, and testing conditional logic, you can build a powerful and maintainable test suite that gives you high confidence in your application's critical user journeys.