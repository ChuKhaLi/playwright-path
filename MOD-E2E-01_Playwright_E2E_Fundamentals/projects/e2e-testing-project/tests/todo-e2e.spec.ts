import { test, expect } from '@playwright/test';
import { TodoPage } from '../poms/todo.page';

test.describe('TodoMVC E2E Test', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test('should allow a user to manage their todo list', async () => {
    // 1. Add two items
    await todoPage.addTodo('Create a new Playwright test');
    await todoPage.addTodo('Run the test');
    await expect(todoPage.todoList.locator('li')).toHaveCount(2);
    await expect(todoPage.todoCount).toHaveText('2 items left');

    // 2. Mark one item as complete
    await todoPage.completeTodo('Create a new Playwright test');
    await expect(todoPage.getTodoItem('Create a new Playwright test')).toHaveClass('completed');
    await expect(todoPage.todoCount).toHaveText('1 item left');

    // 3. Clear the completed item
    await todoPage.clearCompleted();
    await expect(todoPage.todoList.locator('li')).toHaveCount(1);
    await expect(todoPage.getTodoItem('Create a new Playwright test')).toBeHidden();
  });
});