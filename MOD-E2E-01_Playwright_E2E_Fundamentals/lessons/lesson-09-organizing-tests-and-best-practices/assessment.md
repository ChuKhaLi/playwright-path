# Lesson 9: Assessment

## Knowledge Check

### Question 1
Which hook should you use to run setup code, like logging in, before *every single test* in a `describe` block?
a) `beforeAll`
b) `beforeEach`
c) `setup`
d) `test.setup`

**Answer:** b) `beforeEach` is the correct hook for running code before each test to ensure a clean, independent state.

---

### Question 2
What is the primary purpose of `test.only()`?
a) To mark a test as the most important one.
b) To run only that specific test or `describe` block, skipping all others.
c) To make a test run faster.
d) To prevent a test from running in parallel.

**Answer:** b) `test.only()` is a development tool used to focus execution on a single test or group of tests, which is invaluable for debugging and writing new tests.

---

### Question 3
What is a key best practice for writing automated tests?
a) Tests should depend on the successful completion of previous tests.
b) Tests should be independent and able to run in any order.
c) Tests should contain as many assertions as possible.
d) Tests should use `page.waitForTimeout()` frequently to avoid flakiness.

**Answer:** b) Test independence is crucial for a reliable and maintainable test suite. Each test should set up its own state and not rely on others.

---

## Practical Exercise

### Task
1.  Create a new test file named `todo-app.spec.ts`.
2.  We will be testing the [TodoMVC application](https://demo.playwright.dev/todomvc/).
3.  Create a `describe` block for the "TodoMVC Application".
4.  Use a `beforeEach` hook to navigate to the application's URL before each test.
5.  **Test 1: "should allow me to add todo items"**
    - Create a new todo item with the text "Buy milk".
    - Create another todo item with the text "Feed the cat".
    - **Assertion:** Assert that the todo list shows two items.
6.  **Test 2: "should allow me to check off an item"**
    - Create a new todo item "Pay bills".
    - Check the item as completed.
    - **Assertion:** Assert that the checked item has the `completed` CSS class.
7.  Use `test.only` to run only the second test ("should allow me to check off an item") to verify that it works in isolation. Remember to remove it afterward.

### Expected Code
Your `todo-app.spec.ts` file should look something like this:

```typescript
import { test, expect } from '@playwright/test';

test.describe('TodoMVC Application', () => {
  // Navigate to the page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/');
  });

  test('should allow me to add todo items', async ({ page }) => {
    const newTodoInput = page.getByPlaceholder('What needs to be done?');
    
    await newTodoInput.fill('Buy milk');
    await newTodoInput.press('Enter');

    await newTodoInput.fill('Feed the cat');
    await newTodoInput.press('Enter');

    // Assert that the list now contains two items
    await expect(page.locator('.todo-list li')).toHaveCount(2);
  });

  test('should allow me to check off an item', async ({ page }) => {
    const newTodoInput = page.getByPlaceholder('What needs to be done?');

    await newTodoInput.fill('Pay bills');
    await newTodoInput.press('Enter');

    // Find the checkbox and click it
    const todoItem = page.locator('.todo-list li').first();
    await todoItem.getByRole('checkbox').check();

    // Assert that the item has the 'completed' class
    await expect(todoItem).toHaveClass('completed');
  });
});
```

This exercise provides hands-on practice with `describe` and `beforeEach` to structure tests efficiently. It reinforces the concept of test independence and gives you a chance to use `test.only` for focused execution.