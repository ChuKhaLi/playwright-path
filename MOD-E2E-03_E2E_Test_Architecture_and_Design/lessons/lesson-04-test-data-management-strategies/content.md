# Lesson 4: Test Data Management Strategies

## 1. The Challenge of Test Data

Effective test data management (TDM) is one of the most complex aspects of test automation. Poor TDM leads to:
- **Brittle Tests:** Tests that break when data changes.
- **Flaky Tests:** Tests that fail intermittently due to data conflicts or state issues.
- **High Maintenance:** Constant effort is required to update hardcoded data.
- **Poor Test Coverage:** Inability to test a wide range of data inputs.
- **Test Inter-dependency:** Tests that rely on the state left by other tests, making them impossible to run in parallel.

The goal of a good TDM strategy is to provide each test with the **exact data it needs, at the moment it needs it, in a clean and isolated environment.**

## 2. Strategy 1: External Data Files (Data-Driven Testing)

This is a fundamental strategy where test data is stored outside the test scripts.

**a) Using JSON files:**
JSON is a popular choice for its readability and native support in JavaScript/TypeScript.

**`data/users.json`**
```json
[
  { "username": "standard_user", "password": "password123", "expectedMessage": "Welcome!" },
  { "username": "locked_out_user", "password": "password123", "expectedMessage": "User is locked out" },
  { "username": "invalid_user", "password": "bad_password", "expectedMessage": "Invalid credentials" }
]
```

**`tests/login.spec.ts`**
```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import * as users from '../data/users.json';

test.describe('Login Data-Driven', () => {
  for (const user of users) {
    test(`should handle user: ${user.username}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(user.username, user.password);
      
      const message = await page.locator('#status-message').textContent();
      expect(message).toContain(user.expectedMessage);
    });
  }
});
```

**b) Using CSV files:**
CSV is useful for large datasets and can be easily edited by non-technical users in spreadsheet software. You'll need a library like `csv-parse` to handle it.

## 3. Strategy 2: Test Data Factories

When you need to generate large amounts of unique, realistic data, a Test Data Factory is the perfect solution. A factory is a class or function responsible for creating objects with sensible defaults, which can be overridden for specific tests. Libraries like **Faker.js** are invaluable here.

**`factories/UserFactory.ts`**
```typescript
import { faker } from '@faker-js/faker';

// Define a User interface for strong typing
export interface User {
  firstName: string;
  lastName: string;
  email: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
}

export class UserFactory {
  // Method to create a single user with default fake data
  static createDefaultUser(): User {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        zipCode: faker.location.zipCode(),
      },
    };
  }

  // Method to create a user with specific properties overridden
  static createUser(overrides: Partial<User> = {}): User {
    const defaultUser = this.createDefaultUser();
    return { ...defaultUser, ...overrides };
  }
}
```

**Using the factory in a test:**
```typescript
import { UserFactory } from '../factories/UserFactory';

test('should allow a new user to register', async ({ page }) => {
  // Create a standard user with random data
  const newUser = UserFactory.createDefaultUser();
  
  // ... use newUser object to fill registration form

  // Create a user with a specific first name for an assertion
  const specificUser = UserFactory.createUser({ firstName: 'Jane' });

  // ... use specificUser object
});
```

## 4. Strategy 3: API-Based Data Seeding and Cleanup

This is the most robust and scalable strategy for ensuring **test isolation**. Instead of relying on a pre-existing database state, each test creates the exact data it needs via API calls before it runs, and cleans it up afterward.

**The Flow:**
1.  **`beforeEach` hook:**
    -   Make an API call to your application's backend to create a user.
    -   Make another API call to create a product.
    -   Store the IDs of the created entities.
2.  **Test Execution:**
    -   The test runs, using the UI to interact with the data created in the setup hook.
3.  **`afterEach` hook:**
    -   Make API calls to delete the user and product created for the test, using their stored IDs.

**Example using a fixture:**
```typescript
// fixtures/product.fixture.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  // This fixture creates a new product via API before the test
  // and deletes it after.
  product: async ({ request }, use) => {
    let productId: string;

    // Setup: Create product
    const response = await request.post('/api/products', {
      data: { name: 'Test Product', price: 99.99 },
    });
    const productData = await response.json();
    productId = productData.id;

    // 'use' provides the created product ID to the test
    await use(productId);

    // Teardown: Delete product
    if (productId) {
      await request.delete(`/api/products/${productId}`);
    }
  },
});

// In the test file
import { test, expect } from '../fixtures/product.fixture';

test('should be able to view the created product', async ({ page, product }) => {
  // The 'product' fixture provides the ID of the newly created product
  await page.goto(`/products/${product}`);
  await expect(page.locator('h1')).toHaveText('Test Product');
});
```

**Trade-offs:**
-   **Pros:** Perfect test isolation, enables parallel execution, very fast setup/teardown.
-   **Cons:** Requires a stable testable API, adds complexity to the framework.

## 5. Choosing the Right Strategy

The best approach is often a combination of these strategies:
-   Use **External Files** for simple, static data sets.
-   Use **Data Factories** for generating dynamic data for forms and user creation.
-   Use **API Seeding** for the most critical, state-sensitive tests that require perfect isolation.