# Lesson 4: JSON Data Handling and Validation

## What is JSON?

JSON stands for **J**ava**S**cript **O**bject **N**otation. It's a lightweight, text-based format for data interchange that is easy for humans to read and write, and easy for machines to parse and generate.

In the world of REST APIs, JSON is the undisputed king. Nearly every modern API you test will use JSON to structure the data it sends and receives.

## JSON Syntax Rules

JSON has a very simple and strict syntax based on two structures:

1.  **A collection of name/value pairs**: In most languages, this is realized as an *object*, dictionary, or hash map.
2.  **An ordered list of values**: In most languages, this is realized as an *array* or list.

### JSON Objects
-   Enclosed in curly braces `{}`.
-   Contain comma-separated `name: value` pairs.
-   Names (keys) must be strings in double quotes.

**Example Object:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "age": 30
}
```

### JSON Arrays
-   Enclosed in square brackets `[]`.
-   Contain comma-separated values.

**Example Array:**
```json
[ "apple", "banana", "orange" ]
```

### JSON Data Types

JSON values can be one of the following types:
-   **string**: Text in double quotes (e.g., `"hello world"`).
-   **number**: An integer or floating-point number (e.g., `101` or `3.14`).
-   **object**: A collection of name/value pairs (see above).
-   **array**: An ordered list of values (see above).
-   **boolean**: `true` or `false`.
-   **null**: Represents an empty or non-existent value.

### Complex Example

Objects and arrays can be nested to create complex data structures.

```json
{
  "id": "001",
  "user": {
    "name": "Jane Smith",
    "email": "jane.smith@example.com"
  },
  "roles": [ "Admin", "Editor" ],
  "isActive": true,
  "lastLogin": null
}
```

## Working with JSON in Playwright Tests

When you make an API request with Playwright, the response body is typically a JSON string. To work with it, you need to convert that string into a JavaScript object. This process is called **parsing**.

### Parsing JSON Responses

Playwright provides a convenient `.json()` method on the `APIResponse` object that does this for you.

```typescript
import { test, expect } from '@playwright/test';

test('should get user data as JSON', async ({ request }) => {
  const response = await request.get('/api/users/2');

  // The .json() method parses the response body and returns a promise
  // that resolves to the JavaScript object.
  const responseBody = await response.json();

  // Now you can work with responseBody as a regular JavaScript object.
  console.log(responseBody.data.first_name); // Outputs: Janet
});
```

## Validating JSON Payloads

Once you have the parsed JSON object, you can use Playwright's `expect` library to make assertions about its contents.

### Asserting on Simple Values

You can check for specific values using `toBe()` or `toEqual()`.

```typescript
test('should validate user properties', async ({ request }) => {
  const response = await request.get('/api/users/2');
  const body = await response.json();

  expect(body.data.id).toBe(2);
  expect(body.data.email).toBe('janet.weaver@reqres.in');
  expect(body.data.first_name).toBe('Janet');
});
```

### Asserting on Nested Objects

To check values in nested objects, simply use dot notation to access the property.

```typescript
// Assuming a response like: { "user": { "details": { "status": "active" } } }
expect(body.user.details.status).toBe('active');
```

### Asserting on Arrays

You can check the length of an array or the value of a specific element.

```typescript
// Assuming a response like: { "data": [ { "id": 1 }, { "id": 2 } ] }
const response = await request.get('/api/users');
const body = await response.json();

// Check the number of items in the array
expect(body.data).toHaveLength(6);

// Check a property of the first element in the array
expect(body.data[0].first_name).toBe('George');

// Check that the array contains an object with a specific property
expect(body.data).toContainEqual(
  expect.objectContaining({
    id: 4,
    first_name: 'Eve'
  })
);
```
`expect.objectContaining` is very useful when you only care about a subset of an object's properties.

## Schema Validation: Validating the Shape of Data

Sometimes, you don't care about the *exact* value of a property, but you want to ensure it exists and has the correct *type*. This is called **schema validation**.

For example, you might want to verify that `id` is always a number and `createdAt` is always a string, even if their values change with every test run.

While you can write manual checks, this can become tedious for large objects.
```typescript
// Manual type checking
expect(typeof body.id).toBe('number');
expect(typeof body.name).toBe('string');
```

A more robust approach is to use a dedicated schema validation library. These libraries allow you to define the expected "shape" of your JSON object and then validate the response against that shape in a single step.

Popular libraries for this in the TypeScript ecosystem include:
-   **Zod**: A modern, TypeScript-first schema declaration and validation library.
-   **Ajv (Another JSON Schema Validator)**: A fast and popular validator that uses the official JSON Schema standard.

We will explore how to integrate these libraries in a later, more advanced lesson. For now, it's important to understand the concept.

**Why Schema Validation is Important:**
-   It catches breaking changes in the API contract. If a developer changes a field from a number to a string, your schema validation will fail.
-   It makes your tests more resilient to dynamic data.
-   It clearly documents the expected structure of the API response.

## Summary

-   **JSON** is the primary data format for REST APIs, built on **objects** (`{}`) and **arrays** (`[]`).
-   Playwright's `response.json()` method is the easiest way to **parse** a JSON response into a usable JavaScript object.
-   Use `expect` with dot/bracket notation to **assert** on values within the JSON structure.
-   For arrays, you can check `toHaveLength` or use `toContainEqual` with `expect.objectContaining` for powerful assertions.
-   **Schema validation** is the practice of verifying the *shape* and *data types* of a JSON response, not just its values.

Mastering JSON handling is a critical skill for any API tester. With these techniques, you can write clear, robust, and maintainable tests for any API response.

## Next Steps

You now have all the foundational knowledge you need: HTTP, REST, and JSON. It's time to put it all together and start writing tests with Playwright!
-   **Lesson 5**: Introduction to Playwright's `request` Fixture