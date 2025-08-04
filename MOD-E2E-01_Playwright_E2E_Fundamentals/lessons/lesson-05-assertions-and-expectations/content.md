# Lesson 5: Assertions and Expectations

## Learning Objectives
After completing this lesson, you will be able to:
- Understand the role of assertions in automated testing.
- Use Playwright's web-first assertions with the `expect` library.
- Write assertions to check for visibility, text content, attributes, and more.
- Use assertion modifiers like `.not` to check for negative conditions.
- Appreciate how auto-waiting makes assertions more reliable.

---

## 1. The "Check" Phase of a Test

A typical automated test follows a simple pattern:
1.  **Arrange:** Set up the initial state (e.g., navigate to a page).
2.  **Act:** Perform an action (e.g., click a button, fill a form).
3.  **Assert:** Check that the outcome of the action is correct.

This lesson focuses on the "Assert" phase. An assertion is a statement that declares an expected condition to be true. If the condition is false, the assertion fails, and so does the test. Without assertions, a test only checks that the application doesn't crash; it doesn't verify that it behaves correctly.

## 2. Introduction to `expect`

Playwright comes with its own assertion library, `expect`, which is specifically designed for the dynamic nature of web applications. These are called "web-first" assertions because they automatically wait for the condition to be met before failing.

The basic syntax is:
`await expect(locator).matcher(expectedValue);`

- **`expect(locator)`**: Takes a locator (or a page object, or a value) that you want to make an assertion about.
- **`.matcher()`**: The specific check you want to perform (e.g., `toBeVisible()`, `toHaveText()`).
- **`expectedValue`**: The value you are comparing against (if the matcher requires one).

## 3. Common Assertions

Let's explore the most common and useful assertions you'll be writing.

### Visibility: `.toBeVisible()`
Checks if an element is present in the DOM and visible on the page.

```typescript
const successMessage = page.getByText('Your order is confirmed!');
await expect(successMessage).toBeVisible();
```

### Text Content: `.toHaveText()` and `.toContainText()`
- **`.toHaveText()`**: Checks if an element has the **exact** text content.
- **`.toContainText()`**: Checks if an element contains a **substring** of the text.

```typescript
const heading = page.getByRole('heading');
await expect(heading).toHaveText('Welcome, Guest!');

const paragraph = page.locator('.description');
await expect(paragraph).toContainText('Playwright is a framework');
```

### Element Attributes: `.toHaveAttribute()`
Checks if an element has a specific attribute with a specific value.

```typescript
const link = page.getByRole('link', { name: 'Docs' });
await expect(link).toHaveAttribute('href', '/docs/intro');
```

### Element State: `.toBeEnabled()`, `.toBeDisabled()`, `.toBeChecked()`
These are perfect for checking the state of form elements.

```typescript
const submitButton = page.getByRole('button', { name: 'Submit' });
await expect(submitButton).toBeEnabled();

const checkbox = page.getByLabel('Subscribe');
await checkbox.check();
await expect(checkbox).toBeChecked();
```

### Page Assertions: `.toHaveURL()` and `.toHaveTitle()`
These assertions apply to the `page` object itself.

```typescript
await expect(page).toHaveURL(/.*\/login/); // Check that URL contains '/login'
await expect(page).toHaveTitle('My Awesome App');
```

## 4. Negative Assertions with `.not`

Sometimes, you need to check that something is *not* the case. You can prepend any matcher with the `.not` modifier.

### Checking for Absence
A common use case is to ensure an element disappears after an action.

```typescript
const loadingSpinner = page.locator('.spinner');
await expect(loadingSpinner).not.toBeVisible();
```
Playwright will wait for the spinner to disappear. If it's still there after the timeout, the test fails.

### Other Examples
```typescript
// Assert a button is disabled before a form is filled
const submitButton = page.getByRole('button', { name: 'Submit' });
await expect(submitButton).toBeDisabled();

// Assert a checkbox is not checked by default
const checkbox = page.getByLabel('Subscribe');
await expect(checkbox).not.toBeChecked();
```

## 5. The Power of Auto-Waiting in Assertions

The single biggest advantage of Playwright's `expect` is its auto-waiting capability.

When you write `await expect(locator).toBeVisible()`, Playwright doesn't just check the visibility once. It continuously retries the check until the condition is met or a timeout is reached (the default is 5 seconds).

This is incredibly powerful. Imagine you click a button that triggers an API call, and a success message appears after 500ms. A traditional assertion would fail immediately. Playwright's assertion will wait patiently for the message to appear.

This means you can write clean, readable tests without littering your code with manual waits.

```typescript
// This code is robust and reliable thanks to auto-waiting.
// No manual waits are needed!
await page.getByRole('button', { name: 'Save' }).click();
const successPopup = page.getByText('Settings saved successfully!');
await expect(successPopup).toBeVisible();
```

---

## Summary

In this lesson, you learned how to write powerful, reliable assertions using Playwright's `expect` library. You can now verify the state of your application by checking element visibility, text, attributes, and more. You also understand how the `.not` modifier and auto-waiting work to make your tests robust. You are now equipped to write complete E2E tests that perform actions and verify the results.