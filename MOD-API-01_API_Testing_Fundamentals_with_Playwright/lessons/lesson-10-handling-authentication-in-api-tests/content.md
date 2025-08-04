# Lesson 10: Handling Authentication in API Tests

## Why Do APIs Need Authentication?

Most APIs expose sensitive data or functionality, and they need a way to ensure that only legitimate users can access them. This process is called **authentication**—proving that you are who you say you are.

**Authentication vs. Authorization**
It's important to understand the difference:
-   **Authentication (AuthN)**: Verifying your identity (e.g., logging in with a username and password). This is like showing your ID to enter a building.
-   **Authorization (AuthZ)**: Verifying that you have permission to do something (e.g., checking if you are an admin). This is like checking if your ID card gives you access to a specific room inside the building.

This lesson focuses on **authentication**.

## Common Authentication Methods

There are many ways to secure an API, but we will focus on two of the most common methods you'll encounter:
1.  **API Keys**: A simple secret key that you send with each request.
2.  **Bearer Tokens (JWT)**: A more complex, temporary token that you get after logging in.

## How to Send Credentials

Authentication credentials are almost always sent in the **HTTP headers** of your request. This keeps them separate from the main data and URL.

The most common header used is the `Authorization` header.

## Method 1: API Key Authentication

This is the simplest form of authentication. You are given a long, unique string (the API Key) that you must include in every request.

API keys can be sent in a few ways, but sending them in a header is the most common.

```typescript
import { test, expect } from '@playwright/test';

// Imagine this is a secret key for a weather API.
// In a real project, you would NOT hardcode this. We'll cover that later.
const API_KEY = 'your-secret-api-key-goes-here';

test('should fetch weather data using an API key', async ({ request }) => {
  const response = await request.get('https://api.weather.com/v1/forecast', {
    headers: {
      // Many APIs use a custom header like 'X-API-Key'.
      'X-API-Key': API_KEY,
    },
    params: {
      city: 'London',
    },
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty('temperature');
});
```

## Method 2: Bearer Token Authentication (JWT)

This is the most common authentication method for modern web applications. It's a two-step process, which makes it perfect for automation.

**The Workflow:**
1.  **Login**: You send a `POST` request to a login endpoint (e.g., `/api/login`) with a username and password.
2.  **Get Token**: The server validates your credentials and sends back a temporary **Bearer Token** (often a JWT - JSON Web Token).
3.  **Use Token**: For all subsequent requests to protected endpoints, you include this token in the `Authorization` header, prefixed with the word "Bearer ".

### The "Login -> Get Token -> Use Token" Pattern in Playwright

This is a fundamental pattern in API testing.

```typescript
import { test, expect } from '@playwright/test';

const baseURL = 'https://your-app-api.com';
let authToken: string; // We'll store the token here

// This special test runs once before all other tests in this file.
test.beforeAll(async ({ request }) => {
  // Step 1 & 2: Login and Get Token
  const loginResponse = await request.post(`${baseURL}/api/login`, {
    data: {
      email: 'test.user@example.com',
      password: 'supersecretpassword',
    },
  });
  expect(loginResponse.ok()).toBe(true);
  const loginBody = await loginResponse.json();
  authToken = loginBody.token; // Store the token
});

test('should fetch user profile with a bearer token', async ({ request }) => {
  // Step 3: Use the Token
  const profileResponse = await request.get(`${baseURL}/api/profile`, {
    headers: {
      // The format is "Bearer <token>"
      Authorization: `Bearer ${authToken}`,
    },
  });

  expect(profileResponse.status()).toBe(200);
  const profileBody = await profileResponse.json();
  expect(profileBody.email).toBe('test.user@example.com');
});

test('should fetch user orders with the same bearer token', async ({ request }) => {
  // Use the same token for another test
  const ordersResponse = await request.get(`${baseURL}/api/orders`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  expect(ordersResponse.status()).toBe(200);
  const ordersBody = await ordersResponse.json();
  expect(Array.isArray(ordersBody)).toBe(true);
});
```

### Why `test.beforeAll()`?
By logging in once inside `test.beforeAll()`, we get a token that can be reused for all the tests in the file. This is much more efficient than logging in before every single test.

## Managing Your Secrets: Don't Hardcode Credentials!

Hardcoding usernames, passwords, and API keys directly in your tests is a major security risk. Anyone who can see your code can see your secrets.

The best practice is to use **environment variables**.

1.  **Create a `.env` file** in the root of your project. This file should be listed in your `.gitignore` so it's never committed to version control.
    ```
    # .env
    API_USER_EMAIL="test.user@example.com"
    API_USER_PASSWORD="supersecretpassword"
    WEATHER_API_KEY="your-secret-api-key"
    ```

2.  **Install a library** to load these variables, like `dotenv`.
    `npm install dotenv`

3.  **Load the variables** in your `playwright.config.ts`.
    ```typescript
    // playwright.config.ts
    import { defineConfig } from '@playwright/test';
    import dotenv from 'dotenv';

    // Read from default ".env" file.
    dotenv.config();

    export default defineConfig({
      // ...
    });
    ```

4.  **Access them in your tests** using `process.env`.
    ```typescript
    const email = process.env.API_USER_EMAIL;
    const password = process.env.API_USER_PASSWORD;

    // Now use these variables in your login request
    const loginResponse = await request.post(`${baseURL}/api/login`, {
      data: { email, password },
    });
    ```

This keeps your secrets safe and allows you to use different credentials for different environments (e.g., test, staging, production).

## Summary

-   **Authentication** is about proving your identity.
-   Credentials like **API Keys** and **Bearer Tokens** are usually sent in the `Authorization` header.
-   The **"Login -> Get Token -> Use Token"** is a critical pattern for testing most modern APIs.
-   Use `test.beforeAll()` to log in once and reuse the token for multiple tests.
-   **Never hardcode secrets**. Use **environment variables** (via a `.env` file) to manage your credentials securely.

## Next Steps

Now that you can authenticate, you can interact with a much wider range of API endpoints. Next, we'll look at other important parts of an HTTP request.
-   **Lesson 11**: Working with Headers and Cookies