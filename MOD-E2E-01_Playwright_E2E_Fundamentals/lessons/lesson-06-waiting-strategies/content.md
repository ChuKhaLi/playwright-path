# Lesson 6: Waiting Strategies

## 1. The Challenge of Modern Web Apps

Modern web applications are dynamic. Content can load at any time, animations can delay the appearance of elements, and network requests can take a variable amount of time to complete.

This can lead to "flaky" tests—tests that sometimes pass and sometimes fail. This usually happens because the test tries to interact with an element before it's ready.

## 2. Playwright's Auto-Waiting to the Rescue

As we learned in the previous lesson, Playwright has a powerful auto-waiting mechanism. Before performing any action on an element, Playwright automatically waits for it to be in a "hittable" state. This means the element is:

-   Attached to the DOM.
-   Visible.
-   Stable (not animating).
-   Enabled.
-   Receives events.

This solves most of our waiting problems automatically!

## 3. When to Use Explicit Waits

Sometimes, auto-waiting isn't enough. You might need to wait for a specific condition to be met before proceeding. For example, you might need to wait for a network request to finish or for a specific piece of text to appear.

Playwright provides several ways to handle these scenarios:

### a. `waitForSelector`

This is the most common way to wait for an element to appear on the page.

```typescript
await page.waitForSelector('.my-element');
```

### b. `waitForFunction`

You can wait for a custom condition to be met using `waitForFunction`.

```typescript
await page.waitForFunction(() => {
  const element = document.querySelector('.my-element');
  return element && element.textContent === 'Hello, World!';
});
```

### c. `waitForTimeout`

You can also wait for a fixed amount of time, but **this should be your last resort**. It can lead to slow and flaky tests.

```typescript
await page.waitForTimeout(5000); // wait for 5 seconds
```

## 4. Example

Let's imagine a scenario where we click a button, and a new element appears after a delay.

```typescript
test('should wait for an element to appear', async ({ page }) => {
  await page.goto('my-app.com');

  // Click a button that loads a new element
  await page.getByRole('button', { name: 'Load Data' }).click();

  // Use an assertion to wait for the element to be visible
  const newElement = page.locator('.new-data');
  await expect(newElement).toBeVisible();
});
```

In this example, `expect(newElement).toBeVisible()` will automatically wait for the element to appear before the test continues.

## 5. Best Practices

-   **Rely on auto-waiting whenever possible.**
-   **Use locator assertions (`expect(locator).toBeVisible()`) for explicit waits.**
-   **Avoid fixed timeouts (`waitForTimeout`).**
-   **If you need to wait for a complex condition, use `waitForFunction`.**