# Assessment: Introduction to the `request` Fixture

This assessment will test your understanding of how to use Playwright's `request` fixture for basic API testing.

---

## Question 1: Using the Fixture (Multiple Choice)

How do you get access to the `request` fixture in a Playwright test?
A) `import { request } from '@playwright/test';`
B) By adding it as a parameter to the test function: `test('my test', async ({ request }) => { ... });`
C) By calling `playwright.request()` inside the test.
D) It is available globally in all test files.

---

## Question 2: Checking the Response (Multiple Choice)

In a Playwright API test, you have a response object named `response`. Which method do you call to get the HTTP status code?
A) `response.statusCode`
B) `response.status()`
C) `response.getCode()`
D) `response.status`

---

## Question 3: Parsing JSON (Short Answer)

What `APIResponse` method should you use to parse a JSON response body, and what JavaScript keyword is essential when calling it?

---

## Question 4: `baseURL` Configuration (Short Answer)

In which file would you typically configure the `baseURL` for your API tests?

---

## Question 5: Making a POST Request (Code Snippet)

You have a `newUser` object that you want to send as a JSON payload in a `POST` request to the `/api/users` endpoint. Fill in the blank in the code below.

```typescript
const response = await request.post('/api/users', {
  // _____: newUser
});
```

---

## Answer Key

### Question 1
**B) By adding it as a parameter to the test function: `test('my test', async ({ request }) => { ... });`**. Playwright's test runner injects the fixture into the test.

### Question 2
**B) `response.status()`**. It is a method that returns the status code of the response.

### Question 3
The method is `.json()`, and you must use the `await` keyword. Example: `const body = await response.json();`

### Question 4
You would configure the `baseURL` in the **`playwright.config.ts`** file, inside the `use` object.

### Question 5
The correct property is `data`.
```typescript
const response = await request.post('/api/users', {
  data: newUser
});