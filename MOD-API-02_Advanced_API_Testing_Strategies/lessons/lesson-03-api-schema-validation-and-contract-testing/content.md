# Lesson 3: API Schema Validation and Contract Testing

## 1. The Problem: The Fragility of Integrations

In modern software development, applications are often built from many small, independent services (microservices) that communicate with each other via APIs. A "consumer" (like a frontend application) depends on the API provided by a "provider" (a backend service).

What happens if the provider changes their API?
- A field is renamed (`"userName"` -> `"username"`).
- A data type changes (`"id": 123` -> `"id": "user-123"`).
- A field is removed.

Any of these changes can break the consumer. Traditional end-to-end tests might catch this, but they are slow, expensive, and run late in the development cycle. **Schema validation** and **contract testing** are two powerful techniques to catch these integration issues early.

## 2. What is API Schema Validation?

Schema validation is the process of checking if an API response (or request) conforms to a predefined structure, or "schema." Instead of writing dozens of `expect` statements to check every single field and its type, you validate the entire JSON object against its schema in one go.

### Key Benefits:
- **Efficiency:** One assertion to validate the entire structure.
- **Robustness:** Catches unexpected fields, missing fields, and incorrect data types.
- **Maintainability:** The schema, not the test code, becomes the source of truth for the API's structure.

### Popular Schema Definition Languages:
- **JSON Schema:** A standard for defining the structure of JSON data.
- **OpenAPI (formerly Swagger):** A comprehensive specification for describing REST APIs. It includes schemas for all requests and responses.
- **Zod, Yup, Ajv:** Libraries that allow you to define schemas programmatically in your code.

## 3. Implementing Schema Validation in Playwright

Let's use **Zod**, a popular TypeScript-first schema declaration and validation library.

**Step 1: Install Zod**

```bash
npm install zod
```

**Step 2: Define a Schema**

Create a file to define the schema for an API resource. For example, a `User` object.

```typescript
// schemas/user.schema.ts
import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  address: z.object({
    street: z.string(),
    suite: z.string(),
    city: z.string(),
    zipcode: z.string(),
    geo: z.object({
      lat: z.string(),
      lng: z.string(),
    }),
  }),
  phone: z.string(),
  website: z.string().url(),
  company: z.object({
    name: z.string(),
    catchPhrase: z.string(),
    bs: z.string(),
  }),
});

// If the API returns a list of users
export const usersSchema = z.array(userSchema);
```

**Step 3: Use the Schema in a Test**

Now, in your API test, you can fetch the data and validate it against the schema.

```typescript
// tests/api/users.spec.ts
import { test, expect } from '@playwright/test';
import { usersSchema } from '../../schemas/user.schema';

test('should fetch users and validate against the schema', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/users');
  expect(response.ok()).toBe(true);

  const users = await response.json();

  // Validate the entire array of users against the schema
  const validationResult = usersSchema.safeParse(users);

  // Assert that the validation was successful
  expect(validationResult.success).toBe(true);

  // For debugging, you can log errors if validation fails
  if (!validationResult.success) {
    console.error(validationResult.error.issues);
  }
});
```
The `safeParse` method returns a result object, which is perfect for assertions. If it fails, `validationResult.error` contains detailed information about what went wrong.

## 4. What is Contract Testing?

While schema validation is great, it only validates one side of the interaction. Contract testing takes this a step further by verifying that the expectations of the **consumer** are met by the **provider**.

A "contract" is a collection of agreed-upon interactions between a consumer and a provider. It defines the structure of requests and the expected structure of responses.

### Consumer-Driven Contract Testing

This is the most common approach.
1.  **Consumer Defines Contract:** The consumer team writes tests that define their expectations of the provider's API.
2.  **Contract Generation:** Running these tests generates a contract file (a JSON file).
3.  **Provider Verifies Contract:** The provider team uses this contract file in their own CI/CD pipeline to verify that their API fulfills the contract. If they make a breaking change, this verification step fails, and they are immediately notified *before* deploying the change.

This creates a fast feedback loop and prevents breaking changes from ever reaching production.

### Tools for Contract Testing
- **Pact:** The most popular open-source tool for consumer-driven contract testing.
- **PactumJS:** A REST API testing tool that has built-in contract testing features.

Implementing a full contract testing pipeline is an advanced topic beyond the scope of this lesson, but understanding the concept is crucial. Schema validation is often the first step towards a full contract testing strategy.

## 5. Summary

- **Schema Validation:** A powerful technique to ensure the structure and data types of an API response are correct. It's efficient and robust.
- **Zod:** A fantastic, easy-to-use library for defining schemas and validating data in a TypeScript environment.
- **Contract Testing:** A methodology to ensure that services can communicate with each other. It formalizes the API "contract" and uses it to prevent breaking changes.
- **Consumer-Driven Contracts:** The standard approach where the consumer's expectations drive the contract, which the provider must then honor.

By incorporating schema validation into your API tests, you make them more resilient to change and significantly improve the reliability of your test suite.