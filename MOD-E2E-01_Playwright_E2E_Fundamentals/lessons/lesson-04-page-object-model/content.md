# Lesson 4: The Page Object Model (POM)

## 1. The Problem with Scaling Tests

As you write more and more tests, you'll start to notice a problem: you're repeating yourself. You might have the same locators and sequences of actions in multiple test files.

If the UI changes, you have to go back and update all of those tests. This is time-consuming and error-prone.

## 2. The Solution: Page Object Model

The Page Object Model (POM) is a design pattern that helps us solve this problem. The idea is to create a separate class for each page of your application. This class will contain:

-   **Locators:** All the locators for the elements on that page.
-   **Methods:** Functions that represent the user's interactions with that page.

This way, if the UI changes, you only have to update the page object, not all of your tests.

## 3. Creating a Page Object

Let's create a page object for our TodoMVC application. Create a new file called `poms/todo.page.ts`:

```typescript
import { type Page, type Locator } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly newTodoInput: Locator;
  readonly todoList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.todoList = page.locator('.todo-list');
  }

  async goto() {
    await this.page.goto('https://demo.playwright.dev/todomvc');
  }

  async addTodo(text: string) {
    await this.newTodoInput.fill(text);
    await this.newTodoInput.press('Enter');
  }
}
```

-   We've created a `TodoPage` class.
-   The `constructor` takes the `page` object as an argument.
-   We've defined locators as class properties.
-   We've created methods for the actions a user can perform on the page (`goto` and `addTodo`).

## 4. Using the Page Object in a Test

Now, we can refactor our test to use the new page object.

```typescript
import { test, expect } from '@playwright/test';
import { TodoPage } from '../poms/todo.page';

test.describe('TodoMVC with POM', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test('should allow me to add todo items', async () => {
    await todoPage.addTodo('Buy milk');
    await expect(todoPage.todoList.locator('li')).toHaveText([
      'Buy milk'
    ]);
  });
});
```

Our test is now much cleaner and easier to read. All the implementation details are hidden away in the `TodoPage` class. If the locators or the way we add a to-do item changes, we only need to update `todo.page.ts`.

## 5. Benefits of POM

-   **Reusability:** We can reuse the same page objects across multiple tests.
-   **Maintainability:** When the UI changes, we only have to update the page object.
-   **Readability:** Our tests are cleaner and easier to understand.