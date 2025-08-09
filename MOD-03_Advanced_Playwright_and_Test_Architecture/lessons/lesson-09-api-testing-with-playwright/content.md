# Lesson 9: API Testing with Playwright

## 1. Introduction

While Playwright is famous for its end-to-end browser automation capabilities, it also includes a powerful, built-in API testing module. This is a game-changer because it allows you to combine UI and API tests within the same framework, and even within the same test file.

You can use API testing to:
-   Set up application state before a UI test runs (e.g., create a user, post data).
-   Verify application state after a UI test runs (e.g., check if an item was correctly added to the database).
-   Run pure API tests completely independent of the UI.

This lesson will introduce you to the fundamentals of API testing using Playwright's `request` object.

## 2. Learning Objectives

By the end of this lesson, you will be able to:

-   **Understand the purpose of Playwright's API testing module.**
-   **Make basic API requests (GET, POST, PUT, DELETE) using `playwright/test`.**
-   **Handle API authentication.**
-   **Inspect API responses (status codes, headers, and body).**
-   **Use API requests to set up and tear down state for UI tests.**

## 3. Meet the `request` Object

Playwright's test runner provides a `request` fixture, which is an instance of `APIRequestContext`. This object is your gateway to making HTTP requests.

### Making a Simple GET Request

Let's start with a simple GET request to a public API, like JSONPlaceholder.

```typescript
import { test, expect } from '@playwright/test';

test('should fetch a list of posts', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts');

  // 1. Check the status code
  expect(response.status()).toBe(200);

  // 2. Check the response body
  const responseBody = await response.json();
  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
  expect(responseBody[0]).toHaveProperty('title');
});
```

**Key Concepts:**

-   `request`: The fixture provided by Playwright.
-   `request.get()`: Makes a GET request to the specified URL. There are also methods for `post()`, `put()`, `patch()`, and `delete()`.
-   `response.status()`: Returns the HTTP status code of the response.
-   `response.json()`: Parses the response body as JSON. There's also `response.text()` for plain text.

## 4. Making a POST Request

POST requests are used to create new resources. They typically include a request body containing the data to be created.

### Example: Creating a New Post

```typescript
import { test, expect } from '@playwright/test';

test('should create a new post', async ({ request }) => {
  const newPostData = {
    title: 'My New Post',
    body: 'This is the body of my new post.',
    userId: 1,
  };

  const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
    data: newPostData,
  });

  // Check status code for resource creation
  expect(response.status()).toBe(201);

  const responseBody = await response.json();
  expect(responseBody.title).toBe(newPostData.title);
  expect(responseBody).toHaveProperty('id'); // The API should assign an ID
});
```

**Key Points:**

-   The second argument to `request.post()` is an options object.
-   `data`: This property holds the payload (request body) for the request. Playwright automatically sets the `Content-Type` header to `application/json`.

## 5. Combining API and UI Tests

This is where Playwright's integrated approach truly shines. You can use an API call to set up a specific state and then verify the result in the UI.

### Example: Create a To-Do Item via API, then Verify in UI

Imagine a to-do list application. Creating a to-do item via the UI can be slow. We can speed it up by creating it via an API call first.

```typescript
import { test, expect } from '@playwright/test';

test.describe('Todo List with API setup', () => {
  let todoId: string;
  const todoTitle = `My API Test Todo - ${Date.now()}`;

  test.beforeEach(async ({ request }) => {
    // ARRANGE: Create a new todo item via API before the test
    const response = await request.post('/api/todos', {
      data: { title: todoTitle, completed: false },
    });
    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();
    todoId = responseBody.id;
  });

  test('should display the new todo item in the UI', async ({ page }) => {
    // ACT: Visit the page
    await page.goto('/todos');

    // ASSERT: Check that the item created via API is visible in the UI
    await expect(page.locator(`[data-testid="todo-${todoId}"]`)).toBeVisible();
    await expect(page.locator(`text=${todoTitle}`)).toBeVisible();
  });

  test.afterEach(async ({ request }) => {
    // CLEANUP: Delete the todo item via API after the test
    if (todoId) {
      await request.delete(`/api/todos/${todoId}`);
    }
  });
});
```

**Workflow Explained:**

1.  **`test.beforeEach`**: Before the UI test runs, we make a `POST` request to our application's API to create a new to-do item. We store its `id` for later use.
2.  **The Test**: The test itself is very simple. It just navigates to the page and asserts that the to-do item created in the `beforeEach` hook is visible.
3.  **`test.afterEach`**: To keep our tests clean and independent, we make a `DELETE` request to remove the to-do item we created, ensuring the test doesn't leave behind any data.

## 6. Conclusion

Playwright's integrated API testing is a powerful feature that can make your test suite faster, more reliable, and more robust. By combining UI and API interactions, you can efficiently set up complex scenarios, test backend logic, and ensure data integrity between your application's frontend and backend.