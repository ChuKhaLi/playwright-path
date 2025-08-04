# Lesson 7: Navigation and Page Interactions

## Learning Objectives
After completing this lesson, you will be able to:
- Understand and use basic navigation commands like `goBack`, `goForward`, and `reload`.
- Handle new tabs and popups that open from user actions.
- Wait for specific navigation events to occur.
- Manage multiple browser contexts for test isolation.

---

## 1. Basic Navigation Commands

The `page` object provides methods to control the browser's history, just like a user clicking the back, forward, or refresh buttons.

- **`page.goBack()`**: Navigates to the previous page in the browser history.
- **`page.goForward()`**: Navigates to the next page in the browser history.
- **`page.reload()`**: Reloads the current page.

```typescript
test('should navigate back and forward', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'Docs' }).click();

  // Assert we are on the docs page
  await expect(page).toHaveURL(/.*docs/);

  // Go back to the homepage
  await page.goBack();
  await expect(page).not.toHaveURL(/.*docs/);

  // Go forward to the docs page again
  await page.goForward();
  await expect(page).toHaveURL(/.*docs/);
});
```

## 2. Handling New Tabs and Popups

Many web applications open links in new tabs (e.g., links with `target="_blank"`). Your test needs to be able to handle this to interact with the new page.

Playwright makes this seamless by capturing the new `page` object that is created. The key is to wrap the action that opens the new tab in `page.waitForEvent('popup')`.

```typescript
test('should handle a new tab', async ({ page }) => {
  await page.goto('http://the-internet.herokuapp.com/windows');

  // Start waiting for the popup event before clicking
  const pagePromise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Click Here' }).click();
  
  // The new page is the result of the promise
  const newPage = await pagePromise;

  // Now you can interact with the new page
  await expect(newPage).toHaveURL('http://the-internet.herokuapp.com/windows/new');
  await expect(newPage.getByRole('heading')).toHaveText('New Window');

  // You can also close the new page
  await newPage.close();

  // And continue interacting with the original page
  await expect(page.getByRole('heading')).toHaveText('Opening a new window');
});
```

This pattern is crucial:
1.  Start waiting for the event (`page.waitForEvent('popup')`).
2.  Perform the action that triggers the event (`.click()`).
3.  `await` the promise to get the new `page` object.

## 3. Waiting for Navigation Events

Sometimes, you need to wait for a navigation to complete before proceeding. While Playwright's auto-waiting handles most cases, explicit waits can be useful.

The `page.waitForURL()` method waits until the page's URL matches the provided string or regular expression.

```typescript
await page.getByRole('button', { name: 'Submit' }).click();

// Wait for the URL to change to the dashboard page
await page.waitForURL('**/dashboard');

// Now you can safely assert things on the dashboard
await expect(page.getByRole('heading')).toHaveText('My Dashboard');
```

This is more explicit than relying on an assertion like `await expect(page).toHaveURL(...)` and can make your test's intent clearer.

## 4. Browser Contexts for Test Isolation

So far, all our tests have run within a single browser instance. A **Browser Context** is an isolated, "incognito-like" session within a browser instance. Each test file in Playwright gets its own `browser` fixture, and each test within that file gets its own `page` fixture, which belongs to a fresh browser context.

This is a key reason why Playwright tests are so reliable and independent. One test cannot interfere with another because they don't share cookies, local storage, or sessions.

While Playwright manages this for you automatically, you can create your own contexts if you need to test scenarios involving multiple, isolated user sessions simultaneously.

**Example: Testing a chat application with two different users.**

```typescript
import { test, expect, chromium } from '@playwright/test';

test('two users should be able to chat', async () => {
  // Create a single browser instance
  const browser = await chromium.launch();

  // Create two isolated browser contexts
  const user1Context = await browser.newContext();
  const user2Context = await browser.newContext();

  // Create a page for each user
  const user1Page = await user1Context.newPage();
  const user2Page = await user2Context.newPage();

  // User 1 logs in
  await user1Page.goto('/login');
  // ... login logic for user 1

  // User 2 logs in
  await user2Page.goto('/login');
  // ... login logic for user 2

  // Now you can automate interactions between the two pages
  await user1Page.getByLabel('Chat message').fill('Hello, User 2!');
  await user1Page.getByRole('button', { name: 'Send' }).click();

  await expect(user2Page.locator('.message')).toHaveText('Hello, User 2!');

  // Clean up
  await browser.close();
});
```
This is an advanced use case, but it demonstrates the power and flexibility of browser contexts for creating isolated test environments.

---

## Summary

In this lesson, you mastered browser navigation and page management. You learned how to move back and forth in the browser's history, handle new tabs and popups, and explicitly wait for navigation events. You also gained an understanding of browser contexts and how they provide test isolation. These skills are vital for building robust tests for complex, multi-page applications.