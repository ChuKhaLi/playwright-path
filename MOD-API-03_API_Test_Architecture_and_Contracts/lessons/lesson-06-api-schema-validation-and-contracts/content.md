# Lesson 6: API Schema Validation and Contracts

## 1. Introduction: Beyond Functional Assertions

In previous lessons, we've focused on functional assertions: checking status codes, verifying specific values (`expect(user.id).toBe(123)`), etc. This is essential, but it doesn't scale well for complex objects and doesn't protect against unexpected changes in the API's structure.

**API Schema Validation** is the practice of verifying that an API response (or request) conforms to a predefined structure, or "schema." This is a cornerstone of robust API testing.

**Why is it critical?**
-   **Detects Breaking Changes:** It immediately catches changes like removed fields, altered data types, or changes in format, which could break API consumers.
-   **Improves Test Coverage:** A single schema validation can check the structure, types, and formats of dozens of fields, providing broad coverage with minimal code.
-   **Enforces the Contract:** It ensures the API implementation adheres to its documented contract (e.g., the OpenAPI specification).
-   **Reduces Test Maintenance:** Instead of writing dozens of `expect` statements for each field, you validate against a single schema.

## 2. JSON Schema: The Language of Structure

JSON Schema is a vocabulary that allows you to annotate and validate JSON documents. It's the most common way to define the structure of API payloads.

**A Simple JSON Schema Example:**

Let's define a schema for a `User` object.

```json
// schemas/user.schema.json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "User",
  "description": "A user in the system",
  "type": "object",
  "properties": {
    "id": {
      "description": "The unique identifier for a user",
      "type": "integer"
    },
    "email": {
      "description": "The user's email address",
      "type": "string",
      "format": "email"
    },
    "firstName": {
      "type": "string"
    },
    "lastName": {
      "type": "string"
    },
    "role": {
      "type": "string",
      "enum": ["admin", "user", "guest"]
    }
  },
  "required": ["id", "email", "firstName", "lastName", "role"]
}
```

### Key JSON Schema Keywords:
-   `type`: Defines the data type (`object`, `string`, `integer`, `boolean`, `array`, `null`).
-   `properties`: Defines the fields within an object.
-   `required`: An array of strings listing the fields that must be present.
-   `format`: Provides more specific validation for common string formats (`email`, `date-time`, `uri`).
-   `enum`: Restricts a value to a fixed set of values.
-   `items`: Defines the schema for items within an array.

## 3. Implementing Schema Validation with Ajv

**Ajv (Another JSON Schema Validator)** is the most popular and fastest JSON Schema validator for JavaScript.

**Step 1: Installation**

```bash
npm install ajv
```

**Step 2: Creating a Validation Helper**

It's a best practice to create a central validator service in your test framework.

```typescript
// src/validation/SchemaValidator.ts
import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

export class SchemaValidator {
  private ajv: Ajv;

  constructor() {
    this.ajv = new Ajv({ allErrors: true });
    addFormats(this.ajv); // Add support for formats like "email", "date-time"
  }

  /**
   * Compiles a schema and returns a validation function.
   * Caching this function is a key performance optimization.
   */
  public compileValidator(schema: object): ValidateFunction {
    return this.ajv.compile(schema);
  }

  /**
   * Validates data against a schema.
   */
  public validate(schema: object, data: any): { isValid: boolean; errors: string[] } {
    const validateFn = this.compileValidator(schema);
    const isValid = validateFn(data);
    
    let errors: string[] = [];
    if (!isValid && validateFn.errors) {
      errors = validateFn.errors.map(
        (error) => `${error.instancePath || 'object'} ${error.message}`
      );
    }

    return { isValid, errors };
  }
}
```

**Step 3: Using the Validator in a Test**

Now, you can use this validator in your API tests.

```typescript
import { test, expect } from '@playwright/test';
import { SchemaValidator } from '../validation/SchemaValidator';
import * as userSchema from '../schemas/user.schema.json';

const validator = new SchemaValidator();

test('GET /users/{id} should return a valid user object', async ({ request }) => {
  const response = await request.get('/api/users/1');
  expect(response.ok()).toBeTruthy();
  const user = await response.json();

  // Perform schema validation
  const { isValid, errors } = validator.validate(userSchema, user);

  // Provide a clear error message on failure
  expect(isValid, `Schema validation failed: ${errors.join(', ')}`).toBe(true);

  // You can still add specific value assertions if needed
  expect(user.id).toBe(1);
});
```

## 4. Specification-Driven Validation with OpenAPI

Manually creating and maintaining separate JSON schemas can be redundant if you already have an OpenAPI specification, which contains schemas internally.

We can leverage the OpenAPI spec as the single source of truth for validation.

**Workflow:**

1.  **Load the OpenAPI Spec:** Load your `openapi.yaml` or `openapi.json` file at the start of your test suite.
2.  **Extract the Schema:** For a given endpoint and response code, extract the corresponding schema from the spec.
3.  **Validate:** Use a validator like Ajv to validate the actual API response against the extracted schema.

**Example Helper for OpenAPI Validation:**

```typescript
// src/validation/OpenApiValidator.ts
import { SchemaValidator } from './SchemaValidator';
import * as OpenApiParser from '@readme/openapi-parser';
import { OpenAPI, OpenAPIV3 } from 'openapi-types';

export class OpenApiValidator {
  private spec: OpenAPIV3.Document | undefined;
  private schemaValidator = new SchemaValidator();

  async loadSpec(specPath: string) {
    this.spec = (await OpenApiParser.bundle(specPath)) as OpenAPIV3.Document;
  }

  public validateResponse(
    path: string,
    method: string,
    statusCode: number,
    responseBody: any
  ): { isValid: boolean; errors: string[] } {
    if (!this.spec) {
      throw new Error('OpenAPI spec not loaded.');
    }

    const pathItem = this.spec.paths[path];
    if (!pathItem) {
      return { isValid: false, errors: [`Path '${path}' not found in spec.`] };
    }

    const operation = pathItem[method.toLowerCase() as keyof typeof pathItem];
    if (!operation) {
      return { isValid: false, errors: [`Method '${method}' not found for path '${path}'.`] };
    }

    const response = (operation as OpenAPIV3.OperationObject).responses[statusCode];
    if (!response) {
      return { isValid: false, errors: [`Status code '${statusCode}' not found for operation.`] };
    }

    const schema = (response as OpenAPIV3.ResponseObject).content?.['application/json']?.schema;
    if (!schema) {
      return { isValid: false, errors: ['No JSON schema found for this response.'] };
    }

    return this.schemaValidator.validate(schema as object, responseBody);
  }
}
```

**Usage in a Test:**

```typescript
import { test, expect } from '@playwright/test';
import { OpenApiValidator } from '../validation/OpenApiValidator';

const openApiValidator = new OpenApiValidator();

test.beforeAll(async () => {
  await openApiValidator.loadSpec('./openapi.yaml');
});

test('GET /users/{id} response should conform to the OpenAPI spec', async ({ request }) => {
  const response = await request.get('/api/users/1');
  const body = await response.json();

  const { isValid, errors } = openApiValidator.validateResponse(
    '/users/{id}',
    'get',
    200,
    body
  );

  expect(isValid, `OpenAPI spec validation failed: ${errors.join(', ')}`).toBe(true);
});
```

## 5. Handling Schema Evolution

APIs change. The key is to manage this change without breaking consumers.

-   **Versioning:** The most robust way to handle breaking changes is to introduce a new version of the API (e.g., `/v2/users`). Your test suite should be able to run against multiple versions.
-   **Backward-Compatible Changes:** Adding new, optional fields to a response is generally a non-breaking change. Your schema tests will still pass.
-   **Breaking Change Detection:** You can programmatically detect breaking changes by comparing two versions of an OpenAPI specification. Tools like `openapi-diff` can be integrated into your CI/CD pipeline to automatically flag breaking changes before they are deployed.

## Summary

-   **Schema validation** is a powerful technique for ensuring the structural integrity of API responses.
-   **JSON Schema** is the standard for defining the structure of JSON data.
-   **Ajv** is a high-performance library for implementing JSON Schema validation in your test framework.
-   Using your **OpenAPI specification** as the single source of truth for validation ensures that your API's implementation and documentation never drift apart.
-   A solid schema validation strategy is your first and best line of defense against **breaking changes** in an API.