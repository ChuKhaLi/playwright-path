# Lesson 8: API Testing Frameworks and Patterns

## 1. Introduction: Building Your Framework

So far, we have learned about many individual components of a robust API testing strategy: layered clients, design patterns, schema validation, and contract testing. In this lesson, we will assemble all these pieces into a cohesive, scalable, and maintainable **API Testing Framework**.

A "framework" is more than just a collection of tests. It is a set of guidelines, tools, and libraries that provides a standardized structure for writing tests. A good framework makes it easy to write new tests, hard to write bad tests, and provides clear, actionable results.

## 2. The Anatomy of an Enterprise API Test Framework

A well-architected framework is typically organized into a clear directory structure that enforces separation of concerns.

```
.
├── src/
│   ├── api/
│   │   ├── clients/          # Raw API clients (e.g., UserApiClient)
│   │   ├── repositories/     # Repository pattern implementations (e.g., UserRepository)
│   │   ├── builders/         # Builder pattern for complex objects
│   │   └── BaseApiClient.ts  # Core client with retry/error logic
│   ├── config/
│   │   ├── environments/     # a.k.a. .env.staging, .env.prod
│   │   └── index.ts          # Logic to load the correct config
│   ├── fixtures/
│   │   └── api.fixtures.ts   # Custom Playwright fixtures
│   ├── test-data/
│   │   ├── factories/        # Test data factories (e.g., UserFactory)
│   │   └── static/           # Static JSON/CSV test data
│   └── validation/
│       ├── schemas/          # Standalone JSON schemas
│       └── SchemaValidator.ts # Ajv-based validation helper
├── tests/
│   ├── api/
│   │   ├── functional/       # End-to-end API tests
│   │   └── contract/         # Pact/conformance tests
│   └── e2e/
│       └── ui-with-api-mocks.spec.ts
├── openapi.yaml              # The single source of truth
├── pacts/                    # Generated pact files
└── playwright.config.ts
```

## 3. Key Components in Detail

### a. Configuration Management

As discussed in Lesson 1, your framework must be configuration-driven. This means centralizing all environment-specific variables.

**Example (`src/config/index.ts`):**

```typescript
import * as dotenv from 'dotenv';
import * as path from 'path';

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) });

export const config = {
  environment: env,
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
    timeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
  },
  // ... other config
};
```

### b. Test Data Management

Reliable tests require reliable test data. A mature framework employs a multi-faceted approach to data management.

-   **Factories (`/test-data/factories`):** Use the Factory pattern (as seen in Lesson 3) with tools like `@faker-js/faker` to generate dynamic, realistic test data. This is the preferred approach for most tests as it avoids data conflicts.
-   **Static Data (`/test-data/static`):** For data that is truly static (e.g., a list of countries, standard user roles), it can be stored in JSON or CSV files and loaded into tests.
-   **Seeding via API:** For integration tests, the most reliable method is to use the API itself to create the necessary data at the beginning of a test or test suite, and then clean it up afterwards.

### c. Custom Playwright Fixtures

Playwright's test fixtures are a powerful feature for reducing boilerplate and setting up complex objects for your tests. We can create custom fixtures that provide our tests with fully initialized API clients and repositories.

**Example (`src/fixtures/api.fixtures.ts`):**

```typescript
import { test as baseTest } from '@playwright/test';
import { config } from '../config';
import { UserApiClient } from '../api/clients/UserApiClient';
import { UserRepository, IUserRepository } from '../api/repositories/UserRepository';

// Extend the base Playwright test type with our custom fixtures
type MyFixtures = {
  userApiClient: UserApiClient;
  userRepository: IUserRepository;
};

export const test = baseTest.extend<MyFixtures>({
  // Fixture for the raw API client
  userApiClient: async ({ request }, use) => {
    const client = new UserApiClient(request, { baseUrl: config.api.baseUrl });
    // You could add authentication logic here, e.g., logging in a default test user
    await use(client);
  },

  // Fixture for the repository, which depends on the client fixture
  userRepository: async ({ userApiClient }, use) => {
    const repository = new UserRepository(userApiClient);
    await use(repository);
  },
});

export { expect } from '@playwright/test';
```

**Using the Custom Fixture in a Test:**

By importing `test` from our custom fixture file, our tests now have access to `userRepository` as an argument.

```typescript
// tests/api/functional/user.spec.ts
import { test, expect } from '../../../src/fixtures/api.fixtures';
import { UserFactory } from '../../../src/test-data/factories/UserFactory';

test('should create a new user using the repository fixture', async ({ userRepository }) => {
  const userData = UserFactory.create();
  
  const createdUser = await userRepository.create(userData);
  
  expect(createdUser.id).toBeDefined();
  expect(createdUser.email).toBe(userData.email);
});
```

This makes the test incredibly clean and removes all the setup boilerplate.

### d. Reporting and Logging Strategy

A framework is only as good as the feedback it provides.

-   **Reporting:** Leverage Playwright's built-in reporters (`html`, `json`, `junit`). The HTML reporter is excellent for local development and debugging, while JUnit/XML is standard for integration with CI/CD platforms like Jenkins or CircleCI.
-   **Logging:** Your `BaseApiClient` should have robust logging. When a test fails, you want to see:
    -   The full request (URL, method, headers, body).
    -   The full response (status, headers, body).
    -   The duration of the call.
    -   Any retry attempts.
-   **Attaching Logs to Reports:** In your custom fixtures, you can wrap API calls in a `try...catch` block. If a call fails, you can log the detailed information and use `test.info().attach()` to add this data directly to the Playwright HTML report for easy debugging.

**Example of attaching logs:**

```typescript
// In your BaseApiClient or a logging wrapper
async function makeRequestAndLog(testInfo: TestInfo, requestFn: () => Promise<any>) {
  try {
    return await requestFn();
  } catch (error) {
    if (error instanceof ApiValidationError) {
      testInfo.attach('api-error', {
        body: JSON.stringify({
          message: 'API Validation Error',
          request: error.request, // Assuming you add this context to your errors
          response: {
            status: error.status,
            body: error.responseBody,
          },
        }),
        contentType: 'application/json',
      });
    }
    throw error;
  }
}
```

## 4. Putting It All Together: The Test Execution Flow

1.  A test is started (e.g., `npx playwright test tests/api/functional/user.spec.ts`).
2.  Playwright reads `playwright.config.ts` for global settings.
3.  The test requests the `userRepository` fixture.
4.  Playwright sees that `userRepository` depends on `userApiClient`, so it runs the `userApiClient` fixture first.
5.  The `userApiClient` fixture reads the central `config` to get the `baseUrl`, initializes the client, and passes it to the `userRepository` fixture.
6.  The `userRepository` fixture is initialized and passed to the test function.
7.  The test uses a `UserFactory` to generate test data.
8.  The test calls a method on the `userRepository` (e.g., `create()`).
9.  The repository calls the underlying `userApiClient`.
10. The `userApiClient` calls the `BaseApiClient`, which handles retries, logging, and the raw HTTP request.
11. The response is returned up the chain.
12. The test performs its assertions.
13. Playwright collects the results and generates the configured reports.

## Summary

-   An API testing framework is a structured environment that standardizes and simplifies the process of writing tests.
-   A strong framework is built on the principle of **separation of concerns**, with clear directories for clients, repositories, test data, and configuration.
-   **Custom Playwright fixtures** are a game-changer for reducing boilerplate and managing test setup and teardown.
-   A robust **test data management** strategy, combining factories and API-based seeding, is crucial for reliable tests.
-   **Integrated logging and reporting** are essential for quickly diagnosing failures and understanding test outcomes.