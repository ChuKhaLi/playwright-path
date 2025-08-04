# Lesson 13: Data-Driven API Testing

## The Problem: Repetitive Tests

Imagine you need to test a login endpoint. You want to check several scenarios:
-   A valid user
-   A user with a wrong password
-   A user that doesn't exist
-   A request with a missing password
-   A request with a missing email

Writing a separate `test()` block for each of these would lead to a lot of duplicated code. The test logic (make a POST request, check the status) is almost identical; only the input data and the expected outcome change.

This is where **Data-Driven Testing** comes in.

## What is Data-Driven Testing?

Data-Driven Testing is a technique where you **separate the test logic from the test data**. You write one generic test and then run it multiple times with different sets of input data and expected outcomes.

**Benefits:**
-   **DRY (Don't Repeat Yourself)**: Reduces code duplication, making tests easier to maintain.
-   **Scalability**: To add a new test case, you just add a new row of data, not a whole new test block.
-   **Clarity**: Separates the "what" (the data) from the "how" (the test logic).
-   **Increased Coverage**: Makes it easy to test a wide range of inputs and edge cases.

## Implementing Data-Driven Tests in Playwright

The simplest way to create a data-driven test in Playwright is to define an array of your test cases and then loop over it, creating a test for each case.

### Example: Testing a Login Endpoint

Let's refactor our login test scenarios into a data-driven test.

**The "Old" Way (Repetitive):**
```typescript
test('should fail with missing password', async ({ request }) => {
  const response = await request.post('/api/login', {
    data: { email: 'eve.holt@reqres.in' }
  });
  expect(response.status()).toBe(400);
});

test('should fail with missing email', async ({ request }) => {
  const response = await request.post('/api/login', {
    data: { password: '123' }
  });
  expect(response.status()).toBe(400);
});
```

**The Data-Driven Way:**
```typescript
import { test, expect } from '@playwright/test';

// 1. Define the test data as an array of objects.
const testCases = [
  {
    description: 'should fail with missing password',
    payload: { email: 'eve.holt@reqres.in' },
    expectedStatus: 400,
    expectedError: 'Missing password',
  },
  {
    description: 'should fail with missing email',
    payload: { password: 'somepassword' },
    expectedStatus: 400,
    expectedError: 'Missing email or username',
  },
  {
    description: 'should succeed with valid credentials',
    payload: { email: 'eve.holt@reqres.in', password: 'cityslicka' },
    expectedStatus: 200,
    expectedError: null, // No error expected
  },
];

// 2. Loop over the test data.
for (const tc of testCases) {
  // 3. Create a dynamic test for each case.
  // Using tc.description makes the test report clear.
  test(tc.description, async ({ request }) => {
    const response = await request.post('https://reqres.in/api/login', {
      data: tc.payload,
    });

    // Assert the status code from our test case data.
    expect(response.status()).toBe(tc.expectedStatus);

    const body = await response.json();

    // Assert the error message or success token.
    if (tc.expectedError) {
      expect(body.error).toBe(tc.expectedError);
    } else {
      expect(body).toHaveProperty('token');
    }
  });
}
```
In this example, we have one block of test logic that can handle three different scenarios just by changing the data.

## Reading Test Data from External Files

For a large number of test cases, keeping the data in the test file can become messy. A better approach is to store the data in an external file, like a JSON or CSV file.

### Using a JSON Data File

1.  **Create a data file**:
    ```json
    // data/login-cases.json
    [
      {
        "case": "Missing Password",
        "payload": { "email": "eve.holt@reqres.in" },
        "expectedStatus": 400
      },
      {
        "case": "Missing Email",
        "payload": { "password": "123" },
        "expectedStatus": 400
      }
    ]
    ```

2.  **Import the data** into your test file.

    ```typescript
    import { test, expect } from '@playwright/test';
    // Import the JSON file directly.
    // Playwright/TypeScript is configured to handle this.
    import testCases from '../data/login-cases.json';

    for (const tc of testCases) {
      test(`should handle login case: ${tc.case}`, async ({ request }) => {
        const response = await request.post('https://reqres.in/api/login', {
          data: tc.payload,
        });
        expect(response.status()).toBe(tc.expectedStatus);
      });
    }
    ```

### Using a CSV Data File

For very large data sets, or when working with non-technical stakeholders, CSV can be a good option.

1.  **Create a data file**:
    ```csv
    // data/users.csv
    userId,expectedName
    1,George
    2,Janet
    3,Emma
    ```

2.  **Use a library** to parse the CSV file. `csv-parse` is a popular choice.
    `npm install csv-parse`

3.  **Read and parse the file** in your test.

    ```typescript
    import { test, expect } from '@playwright/test';
    import fs from 'fs';
    import path from 'path';
    import { parse } from 'csv-parse/sync';

    // Read the CSV file and parse it into an array of objects.
    const csvData = fs.readFileSync(path.join(__dirname, '../data/users.csv'), 'utf8');
    const testCases = parse(csvData, {
      columns: true, // Treat the first row as headers
      skip_empty_lines: true,
    });

    for (const tc of testCases) {
      test(`should get the correct name for user ${tc.userId}`, async ({ request }) => {
        const response = await request.get(`https://reqres.in/api/users/${tc.userId}`);
        const body = await response.json();
        expect(body.data.first_name).toBe(tc.expectedName);
      });
    }
    ```

## Summary

-   **Data-Driven Testing** separates your test logic from your test data, making your suite more efficient and scalable.
-   The simplest implementation in Playwright is to **loop over an array of test case objects**.
-   Use **dynamic test titles** to make your test reports clear and easy to read.
-   For larger data sets, store your test data in external files like **JSON or CSV** and read them into your tests.

Adopting a data-driven approach is a major step towards building a professional, maintainable, and powerful API test suite.

## Next Steps

You've learned how to make your tests more efficient. Now let's look at how to organize your entire test suite for long-term success.
-   **Lesson 14**: API Test Organization and Best Practices