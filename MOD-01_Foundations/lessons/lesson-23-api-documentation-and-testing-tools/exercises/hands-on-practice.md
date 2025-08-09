# Lesson 23: API Documentation and Tools - Hands-On Practice

## Objective

This exercise will guide you through the practical workflow of using API documentation to test an endpoint with a GUI tool (conceptually) and then writing a basic automated test for it.

## Setup

We will use the public **JSONPlaceholder API** and its documentation.
-   **API Documentation:** Open this link in a new tab: [https://jsonplaceholder.typicode.com/guide/](https://jsonplaceholder.typicode.com/guide/)
-   **API Base URL:** `https://jsonplaceholder.typicode.com`
-   **Tool for Manual Testing:** We will describe the steps for a tool like Postman or Insomnia.
-   **Tool for Automation:** We will write a test using Playwright.

---

## Part 1: Reading Documentation and Manual Testing

Your goal is to test the endpoint that creates a new "post".

1.  **Find the Right Documentation:**
    -   Go to the JSONPlaceholder guide.
    -   Scroll down to the "Creating a resource" section.
    -   **Question:** What **HTTP Method** and **Endpoint Path** should you use to create a new post?

2.  **Prepare Your Request in a GUI Tool (like Postman):**
    -   Create a new request.
    -   Set the method and URL based on your findings from step 1.
    -   The documentation shows an example request body. Go to the "Body" tab in your tool, select the "raw" and "JSON" options, and paste in the example body.
        ```json
        {
          "title": "foo",
          "body": "bar",
          "userId": 1
        }
        ```
    -   **Question:** According to the documentation, what `Content-type` header should be sent with this request? (You may need to set this in the "Headers" tab).

3.  **Send the Request and Analyze the Response:**
    -   Click the "Send" button in your GUI tool.
    -   **Question 1:** What **Status Code** did you get back? Does it match what the documentation implies for a successful creation?
    -   **Question 2:** Look at the response body. What `id` was assigned to the new resource you created?

---

## Part 2: Automating the Test with Playwright

Now, let's translate the manual test from Part 1 into an automated test.

1.  **Set up the Test File:**
    -   Imagine you have a Playwright project set up. Create a new test file named `api.spec.ts`.

2.  **Write the Test Code:**
    -   Your task is to write a Playwright test that performs the same `POST` request and validates the response. Fill in the blanks in the code below.

    ```typescript
    import { test, expect } from '@playwright/test';

    test.describe('JSONPlaceholder API', () => {
      const BASE_URL = 'https://jsonplaceholder.typicode.com';

      test('should be able to create a new post', async ({ request }) => {
        const postData = {
          title: 'My Automated Test Post',
          body: 'This was created by a Playwright test.',
          userId: 10,
        };

        // Send the POST request
        const response = await request.post(`${BASE_URL}/posts`, {
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
          data: postData,
        });

        // --- YOUR ASSERTIONS GO HERE ---

        // 1. Assert the status code is correct for a resource creation.
        //    Hint: Look up the status code for "Created".
        // expect(response.status()).toBe( ______ );

        // 2. Parse the response body.
        // const responseBody = await response.json();

        // 3. Assert that the response body contains the data we sent.
        // expect(responseBody.title).toBe( ______ );
        // expect(responseBody.body).toBe( ______ );
        // expect(responseBody.userId).toBe( ______ );

        // 4. Assert that the API assigned a new ID to our post.
        //    Hint: The ID should be a number.
        // expect(typeof responseBody.id).toBe( ______ );
      });
    });
    ```

3.  **Complete the Code:**
    -   Fill in the blanks in the code snippet above with the correct values and assertions.

## Solutions

<details>
<summary>Click to view solutions</summary>

### Part 1: Reading Documentation

1.  **Method:** `POST`, **Path:** `/posts`
2.  **Header:** `Content-type: application/json; charset=UTF-8`
3.  **Status Code:** `201 Created`. **ID:** The API returns an `id` of `101` (it's a fake API, so it's predictable).

### Part 2: Automating the Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('JSONPlaceholder API', () => {
  const BASE_URL = 'https://jsonplaceholder.typicode.com';

  test('should be able to create a new post', async ({ request }) => {
    const postData = {
      title: 'My Automated Test Post',
      body: 'This was created by a Playwright test.',
      userId: 10,
    };

    // Send the POST request
    const response = await request.post(`${BASE_URL}/posts`, {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      data: postData,
    });

    // --- YOUR ASSERTIONS GO HERE ---

    // 1. Assert the status code is correct for a resource creation.
    expect(response.status()).toBe(201);

    // 2. Parse the response body.
    const responseBody = await response.json();

    // 3. Assert that the response body contains the data we sent.
    expect(responseBody.title).toBe('My Automated Test Post');
    expect(responseBody.body).toBe('This was created by a Playwright test.');
    expect(responseBody.userId).toBe(10);

    // 4. Assert that the API assigned a new ID to our post.
    expect(typeof responseBody.id).toBe('number');
    // A more specific test might be:
    expect(responseBody.id).toBeGreaterThan(100);
  });
});
```

</details>