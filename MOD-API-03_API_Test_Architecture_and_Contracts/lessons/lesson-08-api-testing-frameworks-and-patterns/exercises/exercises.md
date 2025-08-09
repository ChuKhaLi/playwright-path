# Exercises: API Testing Frameworks and Patterns

## Exercise 1: Structure a Framework

**Objective:** Organize files into a logical framework structure.

**Instructions:**

You are given a list of files for an API test framework. Your task is to place each file into the most appropriate directory within the framework structure provided below.

**File List:**
1.  `user.repository.ts` (Implements the UserRepository pattern)
2.  `staging.env` (Configuration for the staging environment)
3.  `create-user.spec.ts` (A functional test for creating a user)
4.  `UserFactory.ts` (Generates test data for users)
5.  `api.fixtures.ts` (Provides custom fixtures like `userRepository` to tests)
6.  `UserApiClient.ts` (A class that makes raw HTTP calls to the User API)
7.  `pact-verification.spec.ts` (A Pact provider verification test)

**Directory Structure:**
```
.
├── src/
│   ├── api/
│   │   ├── clients/
│   │   └── repositories/
│   ├── config/
│   │   └── environments/
│   ├── fixtures/
│   └── test-data/
│       └── factories/
└── tests/
    ├── api/
    │   ├── functional/
    │   └── contract/
```

---

## Exercise 2: Write a Custom Playwright Fixture

**Objective:** Create a custom test fixture to provide a pre-initialized object to a test.

**Instructions:**

You have a `Config` class that loads and provides configuration for your tests.

```typescript
// src/config.ts
export class Config {
  public readonly apiUrl: string;
  public readonly apiKey: string;

  constructor() {
    // In a real scenario, this would load from a file or environment variables
    this.apiUrl = 'https://api.test.com';
    this.apiKey = 'default-api-key';
  }

  load(environment: 'staging' | 'production') {
    // Logic to load different configs
  }
}
```

Write a custom Playwright test fixture named `config`. This fixture should:
1.  Create an instance of the `Config` class.
2.  Provide this instance to the tests.
3.  Be defined in a file that extends the base Playwright `test`.

Finally, show how you would use this `config` fixture in a test to access the `apiUrl`.

---

## Exercise 3: Connect the Patterns

**Objective:** Explain how different framework patterns work together to execute a test.

**Instructions:**

Consider the following clean test script:

```typescript
// tests/api/functional/post.spec.ts
import { test, expect } from '../../../src/fixtures/api.fixtures';
import { PostFactory } from '../../../src/test-data/factories/PostFactory';

test('should allow a user to create and delete a post', async ({ postRepository }) => {
  // 1. Arrange
  const postData = PostFactory.create({ title: 'My Test Post' });

  // 2. Act
  const createdPost = await postRepository.create(postData);
  await postRepository.delete(createdPost.id);

  // 3. Assert
  const foundPost = await postRepository.findById(createdPost.id);
  expect(foundPost).toBeNull();
});
```

Describe the chain of events that happens when the line `await postRepository.create(postData)` is executed.

Your description should mention:
-   The `postRepository` fixture.
-   The `PostRepository` class.
-   The `PostApiClient` class (which the repository uses).
-   The `BaseApiClient` class (which the `PostApiClient` extends or uses).
-   How the final HTTP `POST` request is constructed and sent.

This exercise is about tracing the flow of a command through the different layers of the framework.
