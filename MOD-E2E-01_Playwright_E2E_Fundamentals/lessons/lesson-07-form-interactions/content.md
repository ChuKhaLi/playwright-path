# Lesson 7: Form Interactions

## 1. Interacting with Forms

Forms are a fundamental part of most web applications. Playwright provides a simple and intuitive API for interacting with all kinds of form elements.

## 2. Common Form Interactions

### a. Text Inputs

We've already seen how to fill a text input using `locator.fill(text)`.

```typescript
await page.getByLabel('Username').fill('my-username');
```

### b. Checkboxes and Radio Buttons

You can check and uncheck checkboxes and radio buttons using `locator.check()` and `locator.uncheck()`.

```typescript
// Check a checkbox
await page.getByLabel('I agree to the terms').check();

// Assert that it's checked
await expect(page.getByLabel('I agree to the terms')).toBeChecked();

// Uncheck it
await page.getByLabel('I agree to the terms').uncheck();
```

### c. Select Dropdowns

You can select an option from a dropdown using `locator.selectOption()`. You can select by value, label, or index.

```typescript
// Select by value
await page.getByLabel('Country').selectOption('US');

// Select by label
await page.getByLabel('Country').selectOption({ label: 'United States' });
```

### d. File Uploads

Playwright makes it easy to test file uploads. You can use `locator.setInputFiles()` to select one or more files to upload.

```typescript
await page.getByLabel('Upload a file').setInputFiles('path/to/my-file.txt');
```

### e. Buttons

As we've seen, you can click a button using `locator.click()`.

```typescript
await page.getByRole('button', { name: 'Submit' }).click();
```

## 3. Example

Let's write a test for a simple login form.

```typescript
test('should allow me to log in', async ({ page }) => {
  await page.goto('my-app.com/login');

  // Fill in the form
  await page.getByLabel('Username').fill('test-user');
  await page.getByLabel('Password').fill('password123');
  await page.getByLabel('Remember me').check();

  // Submit the form
  await page.getByRole('button', { name: 'Log In' }).click();

  // Assert that we've been redirected to the dashboard
  await expect(page).toHaveURL('my-app.com/dashboard');
});
```

## 4. Best Practices

-   **Use user-facing locators like `getByLabel` and `getByRole` whenever possible.**
-   **Assert the state of form elements after interacting with them (e.g., `expect(locator).toBeChecked()`).**
-   **Use the Page Object Model to encapsulate your form interaction logic.**