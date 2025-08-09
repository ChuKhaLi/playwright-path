# Lesson 3: Test Organization Patterns

## 1. The Importance of Test Organization

As a test suite grows, keeping it organized is critical for maintainability and usability. A well-organized test suite makes it easy to:
- Find specific tests.
- Run a subset of tests (e.g., only smoke tests, or only tests for a specific feature).
- Understand test coverage.
- Onboard new team members.

## 2. Organization by Feature

This is the most common and intuitive way to organize tests. You create a directory structure that mirrors the feature areas of your application.

**Example:**
```
tests/
├── auth/
│   ├── login.spec.ts
│   └── registration.spec.ts
├── products/
│   ├── view-product.spec.ts
│   └── add-to-cart.spec.ts
└── checkout/
    ├── guest-checkout.spec.ts
    └── registered-user-checkout.spec.ts
```

**Pros:**
- Easy to find tests related to a specific feature.
- Aligns well with agile development practices where work is often organized by feature.

**Cons:**
- Can be challenging if features are highly interconnected.

## 3. Organization by Page/Component

For applications with a strong component-based architecture (like React or Vue), organizing tests by page or component can be very effective.

**Example:**
```
tests/
├── pages/
│   ├── HomePage.spec.ts
│   └── LoginPage.spec.ts
└── components/
    ├── Header.spec.ts
    └── ProductCard.spec.ts
```

**Pros:**
- Works well for applications with reusable components.
- Makes it easy to test components in isolation.

## 4. Using Tags for Granular Control

Most test runners, including Playwright, support tagging tests. This allows you to create logical groupings of tests that are independent of the file structure.

**Common Tagging Strategies:**
- **`@smoke`:** A small subset of critical-path tests that can be run quickly to verify a build is stable.
- **`@regression`:** The full suite of tests to run before a release.
- **`@feature-X`:** Tests related to a specific new feature.
- **`@critical`:** Business-critical tests.

**Example in Playwright:**
```typescript
import { test, expect } from '@playwright/test';

test('User can log in successfully @smoke', async ({ page }) => {
  // ...
});

test('User sees an error with invalid credentials @regression', async ({ page }) => {
  // ...
});
```

You can then run tests with a specific tag from the command line:
```bash
npx playwright test --grep @smoke
```

## 5. Combining Strategies

The best approach is often a combination of these patterns. Use a directory structure based on features, and then use tags to create logical groupings across different feature areas.

## 6. Conclusion

There is no single "right" way to organize your tests. The best strategy depends on your application's architecture and your team's workflow. The key is to be consistent and to choose a structure that makes your test suite easy to navigate and maintain.