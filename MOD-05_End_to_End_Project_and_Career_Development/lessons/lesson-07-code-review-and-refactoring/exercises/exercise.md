# Exercise: Refactor Your Code and Review a Peer's Code

## 1. Objective

This exercise has two parts. First, you will refactor some of your existing test code to improve its quality. Second, you will practice your code review skills by analyzing a sample piece of code.

## 2. Instructions

### Part 1: Refactor Your Own Code

1.  **Identify a "Code Smell":**
    Look back at the tests you wrote in the previous exercises. Find at least one example of a "code smell." Some common ones you might find are:
    -   A hardcoded URL string instead of using `baseURL` in `playwright.config.ts`.
    -   A test that is getting a bit long and could be broken down.
    -   A locator that is a bit too specific (e.g., a long, brittle CSS selector).

2.  **Apply a Refactoring Technique:**
    -   Refactor the code to remove the smell.
    -   For example, if you found a hardcoded URL, move it to the `baseURL` property in your `playwright.config.ts` and use `page.goto('/')`.
    -   If you found a brittle locator, try to replace it with a more robust, user-facing locator like `page.getByRole(...)`.

3.  **Commit Your Changes:**
    -   Commit your refactored code with a clear commit message, like `refactor: Improve locator strategy in login test`. This is a professional best practice.

### Part 2: Peer Code Review

Below is a sample Playwright test. Your task is to review it and provide constructive feedback.

**Code to Review:**

```typescript
import { test, expect } from '@playwright/test';

test('Test user purchase flow', async ({ page }) => {
  await page.goto('https://my-e-commerce-site.com/login');
  await page.locator('#user').fill('test@example.com');
  await page.locator('#pass').fill('SuperSecret123');
  await page.locator('button.login-btn').click();

  await page.waitForTimeout(2000); // Wait for login to process

  await page.locator('#search').fill('Cool Gadget');
  await page.locator('#search-btn').click();

  await page.locator('div.product-list > div:nth-child(1) > button').click();

  const cartTotal = await page.locator('#cart-total').innerText();
  expect(cartTotal).toBe('$19.99');
});
```

**Your Task:**

1.  **Identify Issues:** Find at least three issues or "code smells" in the code above.
2.  **Write a Code Review:**
    -   For each issue, write a constructive comment as if you were leaving it on a pull request.
    -   Explain *why* it's an issue and suggest a specific improvement.
    -   Keep your tone helpful and collaborative.

**Example Review Comment:**

> **Issue:** Use of `page.waitForTimeout(2000)`
>
> **Comment:** "Hey, great start on this test! I noticed we're using a fixed wait here. This can sometimes lead to flaky tests if the network is slow, or it can slow down our test suite unnecessarily if the page loads faster. Have you considered using a web-first assertion instead? For example, we could wait for a specific element on the post-login page to be visible, like `await expect(page.locator('#user-avatar')).toBeVisible();`. That would make the test more robust. Let me know what you think!"

## 3. Career Development Reflection

-   How did it feel to critique your own code? What does this process teach you about your own coding habits?
-   When writing your review comments, how did you balance being direct with being constructive and polite? This is a key "soft skill" for senior engineers.