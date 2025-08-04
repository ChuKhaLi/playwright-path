# Lesson 11: Working with Headers and Cookies

## Beyond the Body: Headers and Cookies

While the request and response bodies contain the primary data, **headers** and **cookies** carry critical metadata and state information that can significantly impact how an API behaves. Mastering them is key to writing comprehensive and realistic API tests.

## Working with HTTP Headers

Headers are key-value pairs that provide additional information about the request or the response.

### Sending Request Headers

You can send custom headers with any request using the `headers` option. This is useful for many scenarios, such as:
-   Sending an `Authorization` token.
-   Specifying what kind of response you `Accept` (e.g., `application/json`).
-   Simulating a specific client with a `User-Agent` string.

```typescript
import { test, expect } from '@playwright/test';

test('should send custom headers with a request', async ({ request }) => {
  const response = await request.get('https://api.github.com/users/microsoft', {
    headers: {
      // The GitHub API recommends sending a custom User-Agent.
      'User-Agent': 'My-Playwright-Test-App',
      // We are explicitly asking for a JSON response.
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  expect(response.ok()).toBe(true);
});
```

### Reading Response Headers

Just as you send headers, you can also read them from the response. This is crucial for validating things like:
-   `Content-Type`: Is the server sending back the data format we expect?
-   `Cache-Control`: Is the API configured correctly for caching?
-   `X-RateLimit-Remaining`: Is the API's rate limiting working as expected?

You can access headers using the `response.headers()` method, which returns an object of all headers, or `response.headerValue('header-name')` for a specific one.

```typescript
test('should read and validate response headers', async ({ request }) => {
  const response = await request.get('https://api.github.com/users/microsoft');

  // Get all headers at once
  const headers = response.headers();
  console.log(headers);

  // Assert on specific headers
  expect(headers['content-type']).toContain('application/json');
  expect(headers).toHaveProperty('x-ratelimit-limit');

  // Get a single header value
  const rateLimitRemaining = await response.headerValue('x-ratelimit-remaining');
  expect(rateLimitRemaining).not.toBeNull();
  console.log(`Rate limit remaining: ${rateLimitRemaining}`);
});
```

## Working with Cookies

Cookies are small pieces of data that a server sends to a client. The client then sends that cookie back with subsequent requests, allowing the server to "remember" the client and maintain a session.

### Reading Cookies from a Response (`Set-Cookie`)

When a server wants to set a cookie (e.g., after a login), it sends a `Set-Cookie` header in the response. Playwright makes it easy to read these.

```typescript
import { test, expect } from '@playwright/test';

test('should receive cookies from a login response', async ({ request }) => {
  // httpbin.org is a great tool for testing HTTP features.
  // This endpoint sends back a Set-Cookie header.
  const response = await request.get('https://httpbin.org/cookies/set', {
    params: {
      // We are asking it to set a cookie named 'sessionid'
      sessionid: 'abc123xyz',
    },
  });

  // The .cookies() method parses all Set-Cookie headers for you.
  const cookies = await response.cookies();
  console.log(cookies);

  // Assert that we received the cookie we expected.
  expect(cookies).toHaveLength(1);
  expect(cookies[0].name).toBe('sessionid');
  expect(cookies[0].value).toBe('abc123xyz');
});
```

### Sending Cookies in a Request

To simulate a client that already has a cookie (like a logged-in user), you can send cookies with your request using the `storageState` option or by setting them on the context. A simpler way for one-off requests is to manually construct the `Cookie` header.

```typescript
test('should send cookies with a request', async ({ request }) => {
  // This endpoint at httpbin.org will echo back the cookies it receives.
  const response = await request.get('https://httpbin.org/cookies', {
    headers: {
      // We construct the Cookie header manually.
      // Format is a semicolon-separated list of key=value pairs.
      'Cookie': 'isLoggedIn=true; theme=dark;',
    },
  });

  const body = await response.json();
  console.log(body);

  // Assert that the server received the cookies we sent.
  expect(body.cookies.isLoggedIn).toBe('true');
  expect(body.cookies.theme).toBe('dark');
});
```
*Note: While manual construction works, for more complex scenarios involving multiple tests, managing cookies via the `APIRequestContext` is the recommended approach, which we will touch on in later lessons.*

## Summary

-   Use the **`headers`** option in your request to send custom HTTP headers.
-   Use **`response.headers()`** or **`response.headerValue()`** to read and validate headers from the response. This is essential for testing caching, rate limiting, and content types.
-   Use **`response.cookies()`** to easily parse `Set-Cookie` headers from a response.
-   To send cookies, you can manually construct the **`Cookie`** header for simple tests.

Mastering headers and cookies allows you to test more nuanced API behaviors and accurately simulate different client states and conditions.

## Next Steps

You now have fine-grained control over your requests. Next, we'll focus on how to handle the wide variety of things that can go wrong in an API interaction.
-   **Lesson 12**: API Error Handling and Status Codes