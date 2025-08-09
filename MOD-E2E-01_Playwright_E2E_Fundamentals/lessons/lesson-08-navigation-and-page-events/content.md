# Lesson 8: Navigation and Page Events

## 1. Navigating Between Pages

We've already seen the most common way to navigate: `page.goto(url)`. But Playwright can also handle navigation that's triggered by user actions, like clicking a link.

```typescript
await page.getByRole('link', { name: 'About Us' }).click();

// Wait for the new page to load and assert the URL
await expect(page).toHaveURL('my-app.com/about-us');
```

Playwright will automatically wait for the new page to load before moving on.

## 2. Handling Multiple Pages

Some applications open new browser tabs or windows. Playwright can handle these with ease.

When you click a link that opens a new page, Playwright will emit a `popup` event. You can listen for this event to get a reference to the new page.

```typescript
test('should handle a new page', async ({ page }) => {
  await page.goto('my-app.com');

  // Start waiting for the new page before clicking
  const pagePromise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Open in new tab' }).click();
  const newPage = await pagePromise;

  // Now you can interact with the new page
  await expect(newPage).toHaveTitle('New Page Title');
});
```

## 3. Other Navigation Methods

-   **`page.goBack()`**: Navigates to the previous page in the browser history.
-   **`page.goForward()`**: Navigates to the next page in the browser history.
-   **`page.reload()`**: Reloads the current page.

## 4. Page Events

You can listen for various page events to gain more control over your tests.

-   **`page.on('load', ...)`**: Fired when the page has finished loading.
-   **`page.on('request', ...)`**: Fired when the page makes a network request.
-   **`page.on('response', ...)`**: Fired when a network request receives a response.
-   **`page.on('console', ...)`**: Fired when a message is logged to the browser console.

This is useful for debugging and for more advanced testing scenarios, like checking if a specific API call was made.

## 5. Example

Let's write a test that checks for a console message.

```typescript
test('should log a message to the console', async ({ page }) => {
  // Listen for console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`Error text: "${msg.text()}"`);
    }
  });

  // Trigger an action that logs an error
  await page.getByRole('button', { name: 'Create Error' }).click();
});
```

## 6. Best Practices

-   **When a user action opens a new page, start waiting for the `popup` event *before* you click.**
-   **Use page events for debugging and for verifying that specific network requests are being made.**
-   **Avoid using page events for waiting. Use locator assertions instead.**