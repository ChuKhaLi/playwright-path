# Lesson 3: Assessment

## Knowledge Check

1.  **Question:** What is the primary goal of API schema validation?
    *   a) To check if the API server is online.
    *   b) To verify that the API response's structure and data types match a predefined format.
    *   c) To ensure the API is fast enough.
    *   d) To check for specific data values, like a user's name.

2.  **Question:** In the context of Consumer-Driven Contract Testing, which party is responsible for defining the contract?
    *   a) The API provider.
    *   b) The API consumer.
    *   c) A neutral third-party.
    *   d) The project manager.

3.  **Question:** When using the Zod library, which method is recommended for use in tests because it doesn't throw an error on failure?
    *   a) `zod.parse()`
    *   b) `zod.validate()`
    *   c) `zod.check()`
    *   d) `zod.safeParse()`

## Practical Exercise

### Objective

Write an API test that validates the response for a single resource against a Zod schema.

### Scenario

You are testing an API endpoint that returns a single "todo" item: `https://jsonplaceholder.typicode.com/todos/1`. The structure of a todo item is known. Your task is to define a schema for it and validate the API response.

### Requirements

1.  Create a new test file `todos.spec.ts`.
2.  Create a new schema file `schemas/todo.schema.ts`.
3.  In `todo.schema.ts`, define a Zod schema for a single todo object. It should have the following fields:
    *   `userId`: number
    *   `id`: number
    *   `title`: string
    *   `completed`: boolean
4.  In `todos.spec.ts`, write a test that sends a `GET` request to `https://jsonplaceholder.typicode.com/todos/1`.
5.  Get the JSON response body.
6.  Use your Zod schema's `safeParse()` method to validate the response.
7.  Assert that the validation was successful (`success` property of the result is `true`).

### Solution

**1. Schema Definition File**

```typescript
// schemas/todo.schema.ts
import { z } from 'zod';

export const todoSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
});
```

**2. Test File**

```typescript
// tests/api/todos.spec.ts
import { test, expect } from '@playwright/test';
import { todoSchema } from '../../schemas/todo.schema';

test.describe('Todos API', () => {
  test('should validate the schema for a single todo item', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/todos/1');
    expect(response.ok()).toBe(true);

    const todo = await response.json();

    // Validate the response against our schema
    const validationResult = todoSchema.safeParse(todo);

    // Assert that the data conforms to the schema
    expect(validationResult.success, `Schema validation failed: ${JSON.stringify(validationResult.error)}`).toBe(true);

    // You can also do traditional assertions on the parsed data
    if (validationResult.success) {
      expect(validationResult.data.id).toBe(1);
    }
  });
});