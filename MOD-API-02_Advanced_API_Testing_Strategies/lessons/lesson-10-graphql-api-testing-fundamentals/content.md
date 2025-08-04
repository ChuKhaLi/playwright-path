# Lesson 10: GraphQL API Testing Fundamentals

## 1. What is GraphQL?

GraphQL is a query language for your API and a server-side runtime for executing those queries. Unlike REST, which has many endpoints for different resources, a GraphQL API typically has a **single endpoint** (e.g., `/graphql`).

The key difference is that the **client specifies exactly what data it needs**.

**REST vs. GraphQL Analogy:**
-   **REST:** Like ordering a fixed combo meal at a restaurant. You get everything in that combo, whether you want it or not (over-fetching), or you might have to order multiple combos to get what you want (under-fetching).
-   **GraphQL:** Like ordering à la carte. You pick exactly the items you want, and you get them all in a single order.

## 2. The Core Concepts of GraphQL

### a) Schema and Types
The GraphQL schema is the heart of a GraphQL API. It's a strongly typed contract that defines all the capabilities of the API. It specifies what queries are available, what data types they return, and what mutations can be performed.

### b) Queries
Queries are used to **fetch** data. The client sends a query that mirrors the shape of the JSON response it wants.

**Example Query:**
```graphql
query GetUserById {
  user(id: "1") {
    id
    name
    email
    posts {
      title
    }
  }
}
```
This query asks for the user with `id` "1", and specifically requests their `id`, `name`, `email`, and the `title` of all their posts.

### c) Mutations
Mutations are used to **modify** data (create, update, delete). They are structured like queries but use the `mutation` keyword.

**Example Mutation:**
```graphql
mutation CreatePost($title: String!, $content: String!) {
  createPost(title: $title, content: $content) {
    id
    title
    content
    author {
      name
    }
  }
}
```
This mutation creates a new post. Notice the use of **variables** (`$title`, `$content`), which is the recommended way to pass dynamic data.

## 3. Testing GraphQL APIs with Playwright

Since a GraphQL API usually has a single endpoint, all our requests will be `POST` requests to that endpoint. The `data` of the request will be a JSON object containing the `query` and optionally `variables`.

### Helper Function for GraphQL Requests
It's a good practice to create a helper function to standardize how you make GraphQL requests.

```typescript
// utils/graphql-client.ts
import { APIRequestContext } from '@playwright/test';

export async function sendGraphQLQuery(
  request: APIRequestContext,
  query: string,
  variables?: Record<string, any>
) {
  return request.post('/graphql', {
    data: {
      query,
      variables,
    },
  });
}
```

### Testing a Query

Let's test the `GetUserById` query.

```typescript
// tests/api/graphql-users.spec.ts
import { test, expect } from '@playwright/test';
import { sendGraphQLQuery } from '../../utils/graphql-client';

test('should fetch a user with specific fields', async ({ request }) => {
  const getUserQuery = `
    query GetUserById($id: ID!) {
      user(id: $id) {
        id
        name
        email
      }
    }
  `;

  const variables = { id: '1' };

  const response = await sendGraphQLQuery(request, getUserQuery, variables);
  expect(response.ok()).toBe(true);

  const responseBody = await response.json();
  
  // GraphQL responses are nested under a "data" key
  const user = responseBody.data.user;

  expect(user.id).toBe('1');
  expect(user.name).toBe('Leanne Graham'); // Example data
  expect(user.email).toBe('Sincere@april.biz');
  
  // Importantly, check that fields we didn't ask for are not present
  expect(user).not.toHaveProperty('address');
});
```

### Testing a Mutation

Now let's test the `CreatePost` mutation.

```typescript
// tests/api/graphql-posts.spec.ts
import { test, expect } from '@playwright/test';
import { sendGraphQLQuery } from '../../utils/graphql-client';

test('should create a new post via mutation', async ({ request }) => {
  const createPostMutation = `
    mutation CreatePost($title: String!, $content: String!) {
      createPost(title: $title, content: $content) {
        id
        title
        content
      }
    }
  `;

  const variables = {
    title: 'My New Post',
    content: 'This is the content of the new post.',
  };

  const response = await sendGraphQLQuery(request, createPostMutation, variables);
  expect(response.ok()).toBe(true);

  const responseBody = await response.json();
  const newPost = responseBody.data.createPost;

  expect(newPost.id).toBeDefined(); // The server should generate an ID
  expect(newPost.title).toBe(variables.title);
  expect(newPost.content).toBe(variables.content);
});
```

## 4. Handling GraphQL Errors

A key difference from REST is that GraphQL APIs often return a `200 OK` status even if there's an error in the query. The errors are returned in a separate `errors` array in the JSON response.

**Example Error Response:**
```json
{
  "errors": [
    {
      "message": "Cannot query field \"address\" on type \"User\".",
      "locations": [{ "line": 6, "column": 5 }],
      "path": ["user", "address"]
    }
  ],
  "data": null
}
```

Your tests must check for the presence of this `errors` array.

```typescript
test('should return an error for an invalid field', async ({ request }) => {
  const invalidQuery = `
    query {
      user(id: "1") {
        invalidField
      }
    }
  `;

  const response = await sendGraphQLQuery(request, invalidQuery);
  expect(response.ok()).toBe(true); // Status is still 200!

  const responseBody = await response.json();
  
  expect(responseBody.data).toBeNull();
  expect(responseBody.errors).toBeDefined();
  expect(responseBody.errors[0].message).toContain('Cannot query field "invalidField"');
});
```

## 5. Summary

-   GraphQL uses a **single endpoint** and `POST` requests.
-   The client sends a **query** or **mutation** in the request body.
-   **Queries** fetch data; **Mutations** modify data.
-   Use **variables** to pass dynamic data to your operations.
-   Successful responses have the data nested under a `data` key.
-   Errors are handled differently: look for an `errors` array in the response body, even with a `200 OK` status.
-   Creating a helper function for sending GraphQL requests keeps your tests clean and consistent.