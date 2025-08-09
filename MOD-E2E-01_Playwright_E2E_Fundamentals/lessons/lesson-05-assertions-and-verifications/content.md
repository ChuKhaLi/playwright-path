# Lesson 5: Assertions and Verifications

## 1. What are Assertions?

An assertion is a check that verifies that the application is in the correct state. It's how we answer the question, "Is my application behaving as expected?"

In Playwright, we use the `expect` function to make assertions. If an assertion fails, the test will stop and be marked as failed.

## 2. Common Assertions

Playwright comes with a rich set of assertions. Here are some of the most common ones:

### a. Page Assertions

-   **`expect(page).toHaveTitle(title)`**: Checks the title of the page.
-   **`expect(page).toHaveURL(url)`**: Checks the URL of the page.

### b. Locator Assertions

These assertions are used to check the state of elements on the page.

-   **`expect(locator).toBeVisible()`**: Checks if the element is visible.
-   **`expect(locator).toBeHidden()`**: Checks if the element is hidden.
-   **`expect(locator).toBeEnabled()`**: Checks if a form element is enabled.
-   **`expect(locator).toBeDisabled()`**: Checks if a form element is disabled.
-   **`expect(locator).toBeChecked()`**: Checks if a checkbox or radio button is checked.
-   **`expect(locator).toBeEmpty()`**: Checks if an element has no text content.
-   **`expect(locator).toHaveText(text)`**: Checks the text content of an element.
-   **`expect(locator).toHaveValue(value)`**: Checks the value of an input, select, or textarea.
-   **`expect(locator).toHaveCount(count)`**: Checks the number of elements that match the locator.
-   **`expect(locator).toContainText(text)`**: Checks if an element contains the given text.

## 3. Auto-Waiting

One of the best features of Playwright is its auto-waiting mechanism. When you use a locator assertion, Playwright will automatically wait for the element to be in the expected state before making the assertion.

For example, if you write `expect(locator).toBeVisible()`, Playwright will wait for the element to appear on the page before checking its visibility. This eliminates a whole class of flaky tests that are common in other testing frameworks.

## 4. Example

Let's add some more assertions to our TodoMVC test.

```typescript
test('should allow me to add and complete a todo item', async ({ page }) => {
  const todoPage = new TodoPage(page);
  await todoPage.goto();

  // Add a new item
  await todoPage.addTodo('Buy milk');
  await expect(todoPage.todoList.locator('li')).toHaveText(['Buy milk']);

  // Mark the item as complete
  await page.locator('.toggle').check();
  await expect(page.locator('.todo-list li')).toHaveClass('completed');
});
```

In this example, we've added an assertion to check that the to-do item has the `completed` class after we check the checkbox.

## 5. Best Practices

-   **Be specific:** Write assertions that are as specific as possible.
-   **Assert one thing at a time:** Each assertion should check a single condition.
-   **Use descriptive failure messages:** If an assertion fails, the message should make it clear what went wrong. (Playwright's default messages are usually very good).