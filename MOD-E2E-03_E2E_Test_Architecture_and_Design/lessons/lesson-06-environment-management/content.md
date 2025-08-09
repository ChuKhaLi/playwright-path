# Lesson 6: Environment Management

## 1. The Challenge of Multiple Environments

In a typical software development lifecycle, you'll have multiple environments:
- **Local:** Your own machine for development.
- **Development (Dev):** A shared environment for developers to integrate their work.
- **Staging (or QA):** A pre-production environment that mirrors production, used for testing.
- **Production (Prod):** The live environment that your users interact with.

Your test suite needs to be able to run against any of these environments without code changes.

## 2. Configuration-Based Environment Management

The most common and effective way to manage environments is through configuration. As we saw in the previous lesson, Playwright's `projects` feature is perfect for this.

**Recap of the Project-Based Approach:**
```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'local',
      use: { baseURL: 'http://localhost:3000' },
    },
    {
      name: 'staging',
      use: { baseURL: 'https://staging.myapp.com' },
    },
  ],
});
```

This approach allows you to switch the target environment with a simple command-line flag (`--project=staging`).

## 3. Managing Environment-Specific Data

Different environments often have different test data. For example, a user account might exist in staging but not in your local database.

**Strategies for Managing Test Data:**
- **Environment-Specific Data Files:**
  ```
  test-data/
  ├── local/
  │   └── users.json
  └── staging/
      └── users.json
  ```
  You can then have a helper function that loads the correct data file based on the target environment.

- **Dynamic Data Creation:**
  A more robust approach is to create the data you need at the start of a test run, either through the UI or via API calls. This makes your tests more self-contained and less reliant on a pre-existing state.

## 4. Using Fixtures for Environment-Specific Logic

Sometimes, you might need to change the behavior of your tests based on the environment. Fixtures can help you manage this.

**Example:**
Let's say you have a feature flag that's enabled in staging but not in local.

```typescript
// environment.fixture.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  isStaging: [async ({}, use) => {
    await use(process.env.TEST_ENV === 'staging');
  }, { scope: 'worker' }],
});

// my-test.spec.ts
import { test } from './environment.fixture';

test('my test', async ({ page, isStaging }) => {
  if (isStaging) {
    // Test the feature-flagged functionality
  } else {
    // Test the default functionality
  }
});
```

## 5. Best Practices for Environment Management

- **Never run destructive tests against production.**
- **Use environment variables for all secrets** (API keys, passwords, etc.). Do not commit them to your repository.
- **Keep your test environments as close to production as possible.** This helps you catch environment-specific bugs before they reach your users.
- **Automate the process of setting up and tearing down test environments** whenever possible.

## 6. Conclusion

Effective environment management is crucial for a reliable testing process. By using a combination of Playwright's configuration features, environment variables, and smart data management strategies, you can build a test suite that runs consistently and reliably across your entire development pipeline.