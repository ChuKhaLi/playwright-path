# Lesson 6: API Versioning and Backward Compatibility Testing

## 1. The Inevitability of Change

APIs, like all software, evolve. New features are added, data models are updated, and authentication methods are improved. The challenge is to introduce these changes without breaking existing clients (like mobile apps or other services) that depend on the older version of the API. This is where **API versioning** comes in.

Versioning is the practice of managing changes to your API in a way that clients can choose which version of the API they want to interact with.

## 2. Common API Versioning Strategies

There are three primary ways to specify the API version in a request.

### a) URI Versioning

This is the most common and straightforward approach. The version is included directly in the URL path.

-   `https://api.example.com/v1/products`
-   `https://api.example.com/v2/products`

**Pros:** Simple, explicit, and easy to see which version is being used from logs or browser history.
**Cons:** Can lead to "ugly" URLs and violates the principle that a URI should refer to a unique resource.

### b) Header Versioning

The version is specified in a custom request header, often the `Accept` header.

-   `GET /products`
-   `Accept: application/vnd.example.v1+json`

And for v2:
-   `GET /products`
-   `Accept: application/vnd.example.v2+json`

**Pros:** Keeps URIs clean. Considered by many to be a more "correct" RESTful approach.
**Cons:** Less visible to a casual observer. Requires clients to know how to set custom headers.

### c) Query Parameter Versioning

The version is specified as a query parameter.

-   `https://api.example.com/products?version=1`
-   `https://api.example.com/products?api-version=2.0`

**Pros:** Simple to implement and use.
**Cons:** Can clutter the URL with parameters not directly related to the resource itself.

## 3. Breaking vs. Non-Breaking Changes

A key part of a versioning strategy is deciding *when* to create a new version. This depends on whether a change is "breaking."

-   **Non-Breaking Change (Minor Update):** A change that old clients can safely ignore. The API is still "backward compatible."
    -   Adding a new, optional field to a JSON response.
    -   Adding a new, optional query parameter.
    -   Adding a new API endpoint.

-   **Breaking Change (Major Update):** A change that will cause existing clients to fail. This **requires** a new version.
    -   Renaming or removing a field in a response.
    -   Changing the data type of a field (`"id": 123` -> `"id": "user-123"`).
    -   Adding a new, required field to a request body.
    -   Changing the authentication mechanism.
    -   Removing an endpoint.

## 4. Testing for Backward Compatibility

When you release a new version (v2) of an API, you must ensure it doesn't accidentally break clients still using the old version (v1). This is **backward compatibility testing**.

The core idea is to run your existing test suite for v1 against the new deployment that supports both v1 and v2.

### Test Strategy

Let's assume your API uses URI versioning.

1.  **Parameterize Your Tests:** Design your test suite so that the API version is a parameter.
2.  **Create Version-Specific Tests:**
    -   A test suite for `v1` (`v1.spec.ts`).
    -   A test suite for `v2` (`v2.spec.ts`).
3.  **Run Tests Against the Correct Versions:**
    -   When a change is made, run the `v1` suite against the `/v1` endpoints.
    -   Run the `v2` suite against the `/v2` endpoints.

This ensures that the new code deployed for v2 hasn't inadvertently broken the logic that serves v1.

### Example: Data-Driven Version Testing

You can use a data-driven approach to run the same fundamental tests against multiple versions, with slight variations for what you expect.

```typescript
// tests/api/products.spec.ts
import { test, expect } from '@playwright/test';

const versions = [
  { 
    version: 'v1', 
    url: '/v1/products/1',
    schema: v1ProductSchema, // Zod schema for v1
    expectedFields: ['id', 'name', 'price'] 
  },
  { 
    version: 'v2', 
    url: '/v2/products/1',
    schema: v2ProductSchema, // Zod schema for v2, maybe with a new 'stock' field
    expectedFields: ['id', 'name', 'price', 'stock'] 
  },
];

for (const api of versions) {
  test(`Product endpoint for ${api.version} should be correct`, async ({ request }) => {
    test.info().annotations.push({ type: 'version', description: api.version });

    const response = await request.get(api.url);
    expect(response.ok()).toBe(true);

    const product = await response.json();

    // Schema validation is perfect for this!
    const validation = api.schema.safeParse(product);
    expect(validation.success).toBe(true);

    // You can also do basic checks
    expect(Object.keys(product)).toEqual(expect.arrayContaining(api.expectedFields));
  });
}
```
In this example, we use schema validation (from Lesson 3) to enforce the contract for each version. This is a very powerful and clean way to manage tests for versioned APIs.

## 5. Summary

-   **Versioning is essential** for evolving an API without breaking existing clients.
-   Choose a versioning strategy (**URI, Header, or Query Param**) and stick with it. URI versioning is the most common.
-   Understand the difference between **breaking** and **non-breaking** changes to know when a new major version is required.
-   **Backward compatibility testing** is crucial. Always run your old version's test suite against new deployments.
-   Use **data-driven tests** and **schema validation** to efficiently test multiple API versions and enforce their contracts.