# API Testing Quick Reference

This guide provides a quick reference for common API testing tasks using Playwright.

## 1. HTTP Methods

| Method  | Description                               | Playwright `request` Method |
| :------ | :---------------------------------------- | :-------------------------- |
| `GET`   | Retrieves data from a specified resource. | `request.get()`             |
| `POST`  | Submits data to be processed to a specified resource. | `request.post()`            |
| `PUT`   | Updates a specified resource with new data. | `request.put()`             |
| `PATCH` | Partially updates a specified resource.   | `request.patch()`           |
| `DELETE`| Deletes a specified resource.             | `request.delete()`          |

## 2. Common `expect` Assertions

- `expect(response.ok()).toBeTruthy()`: Checks if the response status is in the 2xx range.
- `expect(response.status()).toBe(200)`: Checks for a specific status code.
- `expect(await response.json()).toHaveProperty('key', 'value')`: Checks a property in a JSON response.
- `expect(await response.json()).toMatchObject({ key: 'value' })`: Checks for partial object matching.

## 3. Code Examples

### GET Request
```typescript
import { test, expect } from '@playwright/test';

test('GET /posts/1', async ({ request }) => {
  const response = await request.get('/posts/1');
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.id).toBe(1);
});
```

### POST Request
```typescript
import { test, expect } from '@playwright/test';

test('POST /posts', async ({ request }) => {
  const response = await request.post('/posts', {
    data: {
      title: 'New Post',
      body: 'This is a new post.',
      userId: 1,
    },
  });
  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.title).toBe('New Post');
});
```

### PUT Request
```typescript
import { test, expect } from '@playwright/test';

test('PUT /posts/1', async ({ request }) => {
  const response = await request.put('/posts/1', {
    data: {
      id: 1,
      title: 'Updated Post',
      body: 'This post has been updated.',
      userId: 1,
    },
  });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.title).toBe('Updated Post');
});
```

### DELETE Request
```typescript
import { test, expect } from '@playwright/test';

test('DELETE /posts/1', async ({ request }) => {
  const response = await request.delete('/posts/1');
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
});
```

## 4. Base URL Configuration

You can set a `baseURL` in your `playwright.config.ts` to avoid repeating the full URL in every request.

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://jsonplaceholder.typicode.com',
  },
});