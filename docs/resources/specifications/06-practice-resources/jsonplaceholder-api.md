# Resource Specification: JSONPlaceholder

## 1. General Information
- **Resource Name**: JSONPlaceholder
- **URL**: [https://jsonplaceholder.typicode.com/](https://jsonplaceholder.typicode.com/)
- **Type**: API Testing Practice
- **Maintained by**: typicode
- **License**: MIT

## 2. Content Overview
- **Description**: JSONPlaceholder is a free online REST API that you can use whenever you need some fake data. It's great for tutorials, testing new libraries, and prototyping.
- **Key Features**:
  - Supports all common HTTP methods (GET, POST, PUT, PATCH, DELETE).
  - Provides a variety of common resource types (posts, comments, albums, photos, todos, users).
  - No registration required.
  - Cross-domain CORS support.
- **Target Audience**: Developers and QA engineers learning or practicing API testing.

## 3. Educational Value
- **Learning Objectives**:
  - Practice making `GET` requests to retrieve data.
  - Learn how to create new resources with `POST`.
  - Understand how to update existing resources with `PUT` and `PATCH`.
  - Practice deleting resources with `DELETE`.
  - Learn to work with nested resources (e.g., `/posts/1/comments`).
- **Complexity**:
  - **Beginner**: Excellent. The API is simple, intuitive, and requires no setup.
  - **Intermediate**: Good. Can be used to practice more complex scenarios like chaining requests.
  - **Advanced**: Limited. Not suitable for practicing authentication, rate limiting, or other advanced API concepts.

## 4. Integration with Learning Modules
- **MOD-API-01: API Testing Fundamentals**: This is the primary resource for hands-on practice in this module.
- **MOD-02: TypeScript for Automation**: Can be used to practice creating type-safe API clients.
- **MOD-ADV-01: CI/CD Integration**: Scripts written against this API can be used in CI/CD pipeline examples.

## 5. Usage Examples

### Get a list of posts
```typescript
import { test, expect } from '@playwright/test';

test('should get a list of posts', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts');
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.length).toBeGreaterThan(0);
});
```

### Create a new post
```typescript
import { test, expect } from '@playwright/test';

test('should create a new post', async ({ request }) => {
  const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
    data: {
      title: 'foo',
      body: 'bar',
      userId: 1,
    },
  });
  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.title).toBe('foo');
});
```

## 6. Conclusion
JSONPlaceholder is an invaluable resource for anyone starting with API testing. Its simplicity and ease of use make it the perfect sandbox for learning the fundamentals of REST APIs.