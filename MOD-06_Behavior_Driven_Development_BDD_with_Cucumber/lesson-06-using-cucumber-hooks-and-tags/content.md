# Lesson 6: Using Cucumber Hooks and Tags

## 1. Introduction

Welcome to Lesson 6! In this lesson, we'll explore two powerful features of Cucumber: **Hooks** and **Tags**. These features provide you with greater control over your test execution flow and organization.

- **Hooks** allow you to run code at specific points in the Cucumber test cycle, such as before or after a scenario.
- **Tags** let you categorize your scenarios, so you can selectively run a subset of your tests.

## 2. Learning Objectives

By the end of this lesson, you will be able to:

- Understand the purpose and use cases for Cucumber Hooks.
- Implement `Before`, `After`, `BeforeAll`, and `AfterAll` hooks.
- Use hooks to manage browser sessions and test data.
- Understand how to use tags to organize and filter scenarios.
- Apply tags to features and scenarios.
- Run specific tests based on their tags.
- Combine tags using logical operators (`and`, `or`, `not`).

## 3. What are Cucumber Hooks?

Hooks are blocks of code that run before or after each scenario. They are a great way to set up and tear down the test environment, ensuring that each test runs in a clean state.

### Common Hook Types:

- `Before`: Runs before each scenario.
- `After`: Runs after each scenario, even if it fails.
- `BeforeAll`: Runs once before any scenarios are executed.
- `AfterAll`: Runs once after all scenarios have been executed.

### Example: Managing Browser State

A common use case for hooks is to manage the browser instance. You can create a new browser page before each scenario and close it afterward.

```typescript
// src/support/hooks.ts
import { Before, After, BeforeAll, AfterAll, ITestCaseHookParameter } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page, chromium } from "@playwright/test";

let browser: Browser;
let context: BrowserContext;
let page: Page;

BeforeAll(async function () {
  browser = await chromium.launch({ headless: false });
});

Before(async function (this: any, { pickle }: ITestCaseHookParameter) {
  context = await browser.newContext();
  page = await context.newPage();
  this.page = page;
});

After(async function (this: any) {
  await this.page.close();
  await context.close();
});

AfterAll(async function () {
  await browser.close();
});
```

## 4. What are Tags?

Tags are annotations that you can add to your `.feature` files to categorize your scenarios. They are prefixed with the `@` symbol.

### Why Use Tags?

- **Filtering Tests:** Run only the tests relevant to a specific feature or user story (e.g., `@smoke`, `@regression`).
- **Grouping Tests:** Group related tests together, even if they are in different feature files.
- **Conditional Hooks:** Run a hook only for scenarios with a specific tag.

### Example: Tagging Scenarios

```gherkin
@search
Feature: Search functionality on an e-commerce site

  @smoke @fast
  Scenario: User searches for a known product
    Given I am on the homepage
    When I search for "Playwright T-Shirt"
    Then I should see the product "Playwright T-Shirt" in the results

  @regression
  Scenario: User searches for a product that does not exist
    Given I am on the homepage
    When I search for "Non-Existent Product"
    Then I should see a "No results found" message
```

### Running Tests with Tags

You can specify which tags to run from the command line:

```bash
# Run only smoke tests
npm test -- --tags "@smoke"

# Run all tests except regression tests
npm test -- --tags "not @regression"

# Run tests that are either smoke or regression
npm test -- --tags "@smoke or @regression"

# Run tests that are both smoke and fast
npm test -- --tags "@smoke and @fast"
```

## 5. Tagged Hooks

You can also create hooks that only run for scenarios with a specific tag. This is useful for setting up special conditions required for a subset of your tests.

```typescript
// src/support/hooks.ts
import { Before } from "@cucumber/cucumber";

Before({ tags: "@requires-login" }, async function (this: any) {
  // Code to log in the user
  await this.page.goto("https://example.com/login");
  // ... perform login steps
});
```

## 6. Conclusion

Hooks and tags are essential tools for managing a growing BDD test suite. They help you keep your tests organized, maintainable, and efficient.

In the next lesson, we'll look at how to integrate the Page Object Model (POM) with Cucumber to create a more robust and scalable test framework.