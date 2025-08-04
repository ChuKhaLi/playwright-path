# Lesson 5: Introduction to Playwright's `request` Fixture

## Your New Best Friend for API Testing

So far, we've learned the theory: HTTP, REST, and JSON. Now, let's get practical. Playwright provides a special tool, called a **fixture**, specifically for API testing. It's named `request`, and it's going to be your primary tool for the rest of this module.

### What is the `request` Fixture?

The `request` fixture is an object that Playwright gives you in your tests. It has methods that let you make HTTP requests (`GET`, `POST`, etc.) directly from your test file, without needing to open a browser.

**Why is this so great?**
-   **It's built-in**: No need to install extra libraries like Axios or Fetch.
-   **It's consistent**: It uses the same networking engine as Playwright's browser, so behavior is predictable.
-   **It's powerful**: It can automatically handle things like cookies and authentication, which we'll see in later lessons.

## Your First API Test: Making a `GET` Request

Let's write a complete test that makes a `GET` request to a public API and validates the response. We'll use `https://reqres.in/`, a great site for practicing API testing.

```typescript
// tests/my-first-api-test.spec.ts
import { test, expect } from '@playwright/test';

test('should get user details', async ({ request }) => {
  // 1. Make the API request
  const response = await request.get('https://reqres.in/api/users/2');

  // 2. Check the status code
  expect(response.status()).toBe(200);

  // 3. Parse the JSON response body
  const body = await response.json();

  // 4. Make assertions about the response body
  expect(body.data.id).toBe(2);
  expect(body.data.first_name).toBe('Janet');
});
```

### Let's Break It Down:

1.  `async ({ request }) => { ... }`: We tell Playwright we want to use the `request` fixture by adding it as an argument to our test function.
2.  `await request.get(...)`: We call the `.get()` method on the `request` fixture, passing the URL of the API endpoint we want to test. We `await` it because it's an asynchronous operation.
3.  `expect(response.status()).toBe(200);`: The `response` object has a `.status()` method that returns the HTTP status code. We assert that it's `200 OK`.
4.  `await response.json()`: This handy method parses the JSON string from the response body into a JavaScript object so we can work with it.
5.  `expect(body.data.id).toBe(2);`: Now that `body` is an object, we can access its properties using dot notation and make assertions about the data.

## Configuring Your Tests for Success

Hardcoding URLs in every test is not a good practice. Let's make our tests cleaner by setting a `baseURL` in the Playwright configuration file.

### Setting a `baseURL`

Open your `playwright.config.ts` file and add a `use` section with a `baseURL`.

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // All requests we make will be relative to this URL
    baseURL: 'https://reqres.in',
  },
});
```

Now, we can simplify our test:

```typescript
// tests/my-first-api-test.spec.ts
import { test, expect } from '@playwright/test';

test('should get user details with baseURL', async ({ request }) => {
  // Playwright automatically prepends the baseURL
  // So, '/api/users/2' becomes 'https://reqres.in/api/users/2'
  const response = await request.get('/api/users/2');

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.data.id).toBe(2);
});
```
This makes your tests much cleaner and easier to maintain. If the API domain changes, you only have to update it in one place!

## Creating Data with `POST` Requests

Now let's create something new. `POST` requests are used to send data to the server. With the `request` fixture, you can provide this data using the `data` option.

```typescript
// tests/my-first-api-test.spec.ts
import { test, expect } from '@playwright/test';

test('should create a new user', async ({ request }) => {
  // The data we want to send in the request body
  const newUser = {
    name: 'morpheus',
    job: 'leader',
  };

  // Make the POST request
  const response = await request.post('/api/users', {
    data: newUser,
  });

  // Assert the response
  expect(response.status()).toBe(201); // 201 Created is the correct status for a successful POST

  const body = await response.json();

  // Check that the response contains the data we sent
  expect(body.name).toBe(newUser.name);
  expect(body.job).toBe(newUser.job);

  // Check for server-generated properties
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('createdAt');
});
```

Playwright automatically sets the `Content-Type` header to `application/json` when you use the `data` option, so you don't have to worry about it.

## Summary

-   The **`request` fixture** is Playwright's built-in tool for API testing.
-   You use methods like `request.get()` and `request.post()` to make HTTP requests.
-   The `response` object gives you access to the **status code** (`.status()`) and the **body** (`.json()` or `.text()`).
-   You should configure a **`baseURL`** in `playwright.config.ts` to keep your tests clean.
-   For `POST` requests, you pass your payload in the **`data`** option.

You now have the fundamental skills to write real API tests. You can send requests, receive responses, and validate that the API is behaving as expected.

## Next Steps

You've learned the basics of the `request` fixture. Now it's time to dive deeper into each HTTP method and learn more advanced assertion techniques.
-   **Lesson 6**: Making GET Requests and Assertions