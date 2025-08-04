# Lesson 8 Assessment: Async Programming and Promises

## Multiple Choice Questions

1.  **Why is asynchronous programming necessary for web automation with Playwright?**
    a)  Because JavaScript is a single-threaded language.
    b)  Because actions like navigating pages and finding elements are not instantaneous.
    c)  Because it makes the code look more modern.
    d)  Because all functions must return a value.

2.  **What does an `async` function always return?**
    a)  A `string`
    b)  A `boolean`
    c)  A `Promise`
    d)  `void`

3.  **What is the purpose of the `await` keyword?**
    a)  To mark a function as asynchronous.
    b)  To pause the execution of an `async` function until a `Promise` is settled.
    c)  To create a new `Promise`.
    d)  To handle errors in synchronous code.

4.  **Which of the following lines of code is the most likely cause of a common bug in a Playwright test?**
    a)  `await page.goto("https://example.com");`
    b)  `const title = await page.title();`
    c)  `page.locator("#submit").click();`
    d)  `await expect(page).toHaveURL("https://example.com");`

5.  **What is the correct return type for an `async` function that fetches a user's age?**
    a)  `number`
    b)  `Promise<number>`
    c)  `async<number>`
    d)  `Promise<void>`

## Practical Exercise

In this exercise, you will create and use a set of functions that simulate the asynchronous steps of an API test.

1.  **Create a Mock API Function:**
    -   Create an `async` function named `fetchApiResponse`.
    -   It should accept one parameter: `endpoint` (a `string`).
    -   It should return a `Promise` that resolves to an object: `Promise<{ status: number; data: string }>`.
    -   Inside the function, log a message like `"Fetching from /api/${endpoint}..."`.
    -   Use `new Promise` and `setTimeout` to simulate a 1-second network delay.
    -   After the delay, the promise should resolve with an object, for example: `{ status: 200, data: "Login Successful" }`.

2.  **Create a Verification Function:**
    -   Create an `async` function named `verifyApiResponse`.
    -   It should accept one parameter: `endpoint` (a `string`).
    -   It should return a `Promise` that resolves to a `boolean`: `Promise<boolean>`.
    -   Inside this function:
        -   `await` the result of calling `fetchApiResponse(endpoint)`.
        -   Log the status code you received from the response.
        -   Return `true` if the `status` from the response is `200`, otherwise return `false`.

3.  **Create a Main Test Function:**
    -   Create a final `async` function named `runApiTest`. It should take no parameters and return `Promise<void>`.
    -   Inside `runApiTest`:
        -   Log "Starting API test for /login...".
        -   `await` the result of `verifyApiResponse("login")`.
        -   Based on the boolean result, log either "Login API Test: PASSED" or "Login API Test: FAILED".
        -   Add a separator log like `---`.
        -   Do the same for a "/users" endpoint. Log "Starting API test for /users...", call `verifyApiResponse("users")`, and log the pass/fail result.

4.  **Execute the Test:**
    -   Call `runApiTest()` to start the entire sequence.

## Answer Key

### Multiple Choice
1.  b) Because actions like navigating pages and finding elements are not instantaneous.
2.  c) A `Promise`
3.  b) To pause the execution of an `async` function until a `Promise` is settled.
4.  c) `page.locator("#submit").click();` (This is a bug because it's missing `await`).
5.  b) `Promise<number>`

### Practical Exercise (Example Solution)
```typescript
// 1. Create a Mock API Function
async function fetchApiResponse(endpoint: string): Promise<{ status: number; data: string }> {
  console.log(`Fetching from /api/${endpoint}...`);
  return new Promise(resolve => {
    setTimeout(() => {
      // Simulate different responses for different endpoints
      if (endpoint === "login") {
        resolve({ status: 200, data: "Login Successful" });
      } else {
        resolve({ status: 404, data: "Not Found" });
      }
    }, 1000); // 1-second delay
  });
}

// 2. Create a Verification Function
async function verifyApiResponse(endpoint: string): Promise<boolean> {
  const response = await fetchApiResponse(endpoint);
  console.log(`Received status: ${response.status}`);
  return response.status === 200;
}

// 3. Create a Main Test Function
async function runApiTest(): Promise<void> {
  console.log("Starting API test for /login...");
  const loginResult = await verifyApiResponse("login");
  console.log(`Login API Test: ${loginResult ? 'PASSED' : 'FAILED'}`);
  
  console.log("---");

  console.log("Starting API test for /users...");
  const usersResult = await verifyApiResponse("users");
  console.log(`Users API Test: ${usersResult ? 'PASSED' : 'FAILED'}`);
}

// 4. Execute the Test
runApiTest();

// Expected Output:
// Starting API test for /login...
// Fetching from /api/login...
// (1 second later)
// Received status: 200
// Login API Test: PASSED
// ---
// Starting API test for /users...
// Fetching from /api/users...
// (1 second later)
// Received status: 404
// Users API Test: FAILED