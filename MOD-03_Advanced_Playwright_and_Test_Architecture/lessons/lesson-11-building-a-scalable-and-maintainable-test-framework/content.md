# Lesson 11: Building a Scalable and Maintainable Test Framework

## 1. Introduction

We've laid the architectural foundation, and now it's time to build upon it. This lesson is about taking the architectural concepts from the previous lesson and implementing them as concrete code. We will focus on creating a "core" layer for our framework that promotes reusability and simplifies test creation.

The goal is to build a framework that is not just a collection of tests, but a powerful tool that enables anyone on the team to write high-quality, robust tests quickly and efficiently.

## 2. Learning Objectives

By the end of this lesson, you will be able to:

-   **Implement a `BasePage` class to share common page logic.**
-   **Create custom Playwright fixtures to provide test-specific resources.**
-   **Develop an API client utility to encapsulate API interactions.**
-   **Integrate custom utilities into your test framework.**
-   **Understand how these core components work together to create a scalable system.**

## 3. Implementing a `BasePage`

A `BasePage` is a class that all other Page Objects will inherit from. It's the perfect place to put functionality that is common to all pages in your application, such as interacting with the header or footer, or common wait conditions.

### Example: `BasePage`

`tests/pages/base.page.ts`

```typescript
import { Page } from '@playwright/test';
import { HeaderComponent } from './components/header.component';
import { FooterComponent } from './components/footer.component'; // Assuming you have a FooterComponent

export class BasePage {
    readonly page: Page;
    readonly header: HeaderComponent;
    readonly footer: FooterComponent;

    constructor(page: Page) {
        this.page = page;
        this.header = new HeaderComponent(this.page);
        this.footer = new FooterComponent(this.page);
    }

    async navigateTo(path: string) {
        await this.page.goto(path);
    }

    async getPageTitle(): Promise<string> {
        return await this.page.title();
    }
}
```

Now, your other Page Objects can `extend` this class and get all its functionality for free.

`tests/pages/login.page.ts`

```typescript
import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
    // No need to redefine page, header, or footer. They are inherited.
    // ... (locators specific to the login page)

    constructor(page: Page) {
        super(page); // This calls the constructor of BasePage
        // ... (initialize login-specific locators)
    }

    // ... (login-specific action methods)
}
```

## 4. Custom Playwright Fixtures

Fixtures are one of Playwright's most powerful features. They allow you to set up and provide resources to your tests. We've already used built-in fixtures like `page` and `request`. Now, let's create our own.

A common use case for a custom fixture is to automatically provide an instance of a Page Object to a test, so you don't have to create it manually every time.

### Example: A `loginPage` Fixture

**Step 1: Define the Fixture Types**

Create a file to define your custom fixtures.

`tests/fixtures/custom-fixtures.ts`

```typescript
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ProductPage } from '../pages/product.page';

type MyFixtures = {
    loginPage: LoginPage;
    productPage: ProductPage;
};

// Extend the base test to include our custom fixtures
export const test = base.extend<MyFixtures>({
    // Define the loginPage fixture
    loginPage: async ({ page }, use) => {
        // Set up the fixture
        const loginPage = new LoginPage(page);
        // Use the fixture value in the test
        await use(loginPage);
        // Teardown logic can go here if needed
    },

    // Define the productPage fixture
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
});

export { expect } from '@playwright/test';
```

**Step 2: Use the Custom Fixture in a Test**

Now, in your test files, import `test` and `expect` from your custom fixtures file instead of from `@playwright/test`.

`tests/specs/ui/login.spec.ts`

```typescript
// Import from your custom fixtures file
import { test, expect } from '../../fixtures/custom-fixtures';

test('should allow a user to log in', async ({ loginPage, page }) => {
    // The loginPage object is automatically provided by the fixture!
    await loginPage.navigateTo('/login');
    await loginPage.login('testuser', 'password123');

    await expect(page).toHaveURL(/.*dashboard/);
});
```

This makes your tests cleaner and reduces boilerplate code.

## 5. Creating an API Client Utility

Just as Page Objects encapsulate UI logic, an API Client can encapsulate the logic for interacting with your application's API. This keeps your API tests clean and your `request` logic reusable.

### Example: `ApiClient`

`tests/utils/api-client.ts`

```typescript
import { APIRequestContext } from '@playwright/test';

export class ApiClient {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async getPosts() {
        return await this.request.get('/posts');
    }

    async createPost(data: { title: string; body: string; userId: number }) {
        return await this.request.post('/posts', { data });
    }

    async deletePost(id: number) {
        return await this.request.delete(`/posts/${id}`);
    }
}
```

You can then use this client in your API tests, or even create a custom fixture for it.

`tests/specs/api/posts.api.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../utils/api-client';

test('should create a post using the API client', async ({ request }) => {
    const apiClient = new ApiClient(request);
    const response = await apiClient.createPost({
        title: 'New Post via Client',
        body: '...',
        userId: 1,
    });

    expect(response.status()).toBe(201);
});
```

## 6. Conclusion

By implementing a `BasePage`, custom fixtures, and utility classes like an `ApiClient`, you are building the core of a truly professional test automation framework. These patterns promote reusability, reduce code duplication, and make your tests significantly easier to write and maintain. Your framework is no longer just a set of scripts; it's a well-oiled machine designed for scalability and efficiency.