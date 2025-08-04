# Lesson 2: Complex Authentication Strategies (OAuth, JWT)

## 1. Introduction to Modern Authentication

Most modern APIs are not open to the public; they require authentication to verify the identity of the client. In this lesson, we'll explore two of the most prevalent and important authentication standards: **OAuth 2.0** and **JSON Web Tokens (JWT)**.

Automating tests for services protected by these schemes requires more than just a static API key. It involves multi-step flows, token management, and an understanding of how these tokens are used and refreshed.

## 2. Testing APIs with JWT Authentication

JWT (pronounced "jot") is a compact, URL-safe means of representing claims to be transferred between two parties. In the context of API testing, a client (our test script) typically sends a username and password to a login endpoint. The server validates these credentials and, if successful, returns a JWT. This token is then included in the `Authorization` header for all subsequent requests to protected endpoints.

### The JWT Authentication Flow

1.  **Login:** Send a `POST` request to a `/login` or `/token` endpoint with user credentials.
2.  **Receive Token:** The server responds with a JWT.
3.  **Make Authenticated Requests:** For every request to a protected resource, include the JWT in the `Authorization` header, usually prefixed with `Bearer `.

### Example: Automating JWT Login and Token Usage

A common and efficient pattern in Playwright is to use a global setup file to perform the login once and save the authenticated state.

**Step 1: Create a Global Setup File**

This file will log in and save the browser state (including the token stored in `localStorage` or cookies) to a file.

```typescript
// global.setup.ts
import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page, request }) => {
  // Perform authentication steps. Replace with your app's login flow.
  // This could be a UI login or a direct API call.
  
  // Example using a direct API call:
  const response = await request.post('/api/login', {
    data: {
      username: process.env.TEST_USERNAME,
      password: process.env.TEST_PASSWORD,
    },
  });
  expect(response.ok()).toBe(true);
  const { token } = await response.json();

  // For APIs that expect the token in localStorage or cookies,
  // you might need to visit a page and set it.
  await page.goto('/');
  await page.evaluate(t => {
    localStorage.setItem('jwt_token', t);
  }, token);

  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});
```

**Step 2: Configure `playwright.config.ts`**

Tell Playwright to use this setup file and the saved storage state.

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // ... other configurations
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
    },
  ],
});
```

**Step 3: Write Authenticated Tests**

Your tests will now run in a browser context that is already authenticated.

```typescript
// tests/api/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test('should fetch dashboard data for an authenticated user', async ({ request }) => {
  // No need to log in here. The `request` object uses the authenticated context.
  const response = await request.get('/api/dashboard');
  expect(response.ok()).toBe(true);
  const data = await response.json();
  expect(data).toHaveProperty('widgets');
});
```

## 3. Testing APIs with OAuth 2.0

OAuth 2.0 is an authorization framework, not an authentication protocol. It's about granting limited access to a resource on behalf of a user. For testing, we often need to bypass the user-interactive consent screen.

The most common grant type for web applications is the **Authorization Code Grant**. However, for automated testing, this is complex. A better approach is to use the **Client Credentials Grant** or **Resource Owner Password Grant** if the OAuth provider supports them for test users.

### Strategy: Using the Client Credentials Grant

This is the simplest flow and is ideal for machine-to-machine communication (like our test runner).

1.  **Request Token:** Send a `POST` request to the token endpoint with your `client_id`, `client_secret`, and `grant_type='client_credentials'`.
2.  **Receive Token:** The server returns an access token.
3.  **Use Token:** Use this token in the `Authorization: Bearer <token>` header.

### Example: Fetching an OAuth Token

This can also be done in a global setup or a before-all hook.

```typescript
// tests/api/oauth.setup.ts
import { APIRequestContext, request } from '@playwright/test';

let api: APIRequestContext;
let accessToken: string;

async function getAccessToken() {
  if (accessToken) {
    return accessToken;
  }

  api = await request.newContext();
  const response = await api.post('https://auth.yourapp.com/oauth/token', {
    form: {
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      grant_type: 'client_credentials',
      scope: 'read:data write:data',
    },
  });

  const body = await response.json();
  accessToken = body.access_token;
  return accessToken;
}

// You can then use this function in your tests
test('should access protected resource with OAuth token', async ({ request }) => {
  const token = await getAccessToken();
  const response = await request.get('https://api.yourapp.com/v1/data', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  expect(response.ok()).toBe(true);
});
```

## 4. Token Management: Storage and Refresh

Tokens expire. A robust test suite must handle this.

-   **Storage:** For JWTs managed via `storageState`, Playwright handles this seamlessly. For manually managed tokens (like our OAuth example), you can store them in a global variable or a temporary file.
-   **Refresh:** OAuth 2.0 provides refresh tokens. When an access token expires (indicated by a 401 status), you can use the refresh token to get a new access token without re-authenticating. Your test framework should include logic to catch 401s, trigger a refresh, and retry the original request.

## 5. Summary

-   **JWT:** A common token-based authentication method. The best practice for testing is to log in once using a global setup and reuse the authenticated state.
-   **OAuth 2.0:** An authorization framework. For testing, prefer non-interactive flows like Client Credentials or Resource Owner Password Grant.
-   **Token Management:** A key part of testing authenticated endpoints. Your strategy must account for fetching, storing, and refreshing tokens.

By mastering these authentication flows, you can test the vast majority of modern, secure APIs effectively.