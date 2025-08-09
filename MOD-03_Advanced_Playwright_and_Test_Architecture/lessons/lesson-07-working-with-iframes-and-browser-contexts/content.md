# Lesson 7: Working with iFrames and Browser Contexts

## 1. Introduction

Modern web applications often use multiple browser contexts or embed content from other sources using iFrames. For example, a chat widget, a payment form, or a third-party ad might live inside an iFrame. Similarly, an application might open a new tab or window (a new browser context) to handle a specific workflow, like an OAuth login.

Being able to interact with these different contexts and frames is a crucial skill for any automation engineer. This lesson will teach you how to master these scenarios in Playwright.

## 2. Learning Objectives

By the end of this lesson, you will be able to:

-   **Understand what an iFrame is and how to identify it.**
-   **Use Playwright's `frameLocator` to interact with elements inside an iFrame.**
-   **Understand the concept of a browser context.**
-   **Handle tests that involve multiple pages (tabs/windows).**
-   **Switch between different pages within a single test.**

## 3. Working with iFrames

An iFrame (Inline Frame) is an HTML element used to embed another HTML document within the current one. From a testing perspective, an iFrame is like a separate, nested webpage. The locators on the main page cannot see inside the iFrame, and vice-versa.

Playwright provides a specific and robust way to handle this: `frameLocator`.

### How to Interact with an iFrame

**Step 1: Locate the iFrame**

First, you need a selector for the `<iframe>` element itself. You can find this using the browser's developer tools.

```html
<iframe id="my-iframe" src="/some/other/page.html"></iframe>
```

**Step 2: Use `frameLocator`**

Once you have the selector for the iFrame, you use `page.frameLocator()` to create a dedicated locator for that frame. This `frameLocator` can then be used to find elements *inside* the iFrame.

### Example:

Let's say the iFrame with the ID `#my-iframe` contains a button with the ID `#submit-button`.

```typescript
import { test, expect } from '@playwright/test';

test('should interact with an element inside an iframe', async ({ page }) => {
  await page.goto('/page-with-iframe.html');

  // 1. Create a locator for the iframe
  const frameLocator = page.frameLocator('#my-iframe');

  // 2. Use the frameLocator to find elements *within* that iframe
  const buttonInFrame = frameLocator.locator('#submit-button');

  // 3. Interact with the element
  await buttonInFrame.click();

  // 4. Assert something on the main page or within the frame
  await expect(frameLocator.locator('.success-message')).toBeVisible();
});
```

**Best Practice:** Add iFrame locators to your Page Objects, just like any other locator. You can even create a "Page Object" for the content of the iFrame itself for better organization.

## 4. Handling Multiple Browser Contexts (Tabs/Windows)

A **Browser Context** is an isolated, incognito-like session within a browser instance. Each test in Playwright runs in its own browser context by default. However, sometimes your application will open a new tab or window, which creates a *new page* within the *same browser context*.

Playwright makes handling this easy by listening for the `'page'` event on the browser context.

### How to Handle New Tabs/Windows

**Step 1: Set up a Promise to Wait for the New Page**

Before you click the link or button that opens the new tab, you need to tell Playwright you're expecting a new page to open.

```typescript
const pagePromise = page.context().waitForEvent('page');
```

**Step 2: Perform the Action**

Click the element that triggers the new tab.

```typescript
await page.locator('#open-new-tab-link').click();
```

**Step 3: Resolve the Promise**

The `pagePromise` will resolve with the new `Page` object.

```typescript
const newPage = await pagePromise;
```

**Step 4: Interact with the New Page**

You can now use the `newPage` object to interact with the new tab, just like you would with the original `page` object.

### Example:

```typescript
import { test, expect } from '@playwright/test';

test('should handle a new tab', async ({ page }) => {
  await page.goto('/main-page.html');

  // 1. Start waiting for the new page before the action
  const pagePromise = page.context().waitForEvent('page');

  // 2. Click the link that opens a new tab
  await page.locator('#new-tab-link').click();

  // 3. Wait for the new page to open and get a reference to it
  const newPage = await pagePromise;

  // It's good practice to wait for the new page to load
  await newPage.waitForLoadState();

  // 4. Now you can interact with the new page
  await expect(newPage).toHaveTitle('New Tab Title');
  await newPage.locator('#some-element-on-new-page').fill('some text');
  await newPage.close(); // Close the new tab when you're done

  // 5. You can continue to interact with the original page
  await expect(page.locator('#main-page-header')).toBeVisible();
});
```

## 5. Conclusion

Handling iFrames and multiple contexts are common challenges in web automation. Playwright's dedicated APIs (`frameLocator` and the `page` event) provide a robust and non-flaky way to manage these scenarios. By mastering these techniques, you'll be equipped to test even the most complex, modern web applications.