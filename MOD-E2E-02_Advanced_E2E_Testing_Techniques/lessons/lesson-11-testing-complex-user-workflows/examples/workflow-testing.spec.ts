import { test, expect, Page } from '@playwright/test';

const mockPageURL = 'file://' + __dirname + '/../mock-page/index.html';

// --- Helper Function ---
// A helper function to encapsulate the login logic, making tests cleaner.
async function loginAs(page: Page, userType: 'standard' | 'admin') {
  await page.goto(mockPageURL);
  const username = userType === 'admin' ? 'admin' : 'user';
  const password = 'password'; // In a real app, use env vars
  
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Log In' }).click();
  await expect(page).toHaveURL(/#dashboard/);
}

test.describe('Complex User Workflows', () => {
  
  test('should complete the full article publishing workflow', async ({ page }) => {
    const articleTitle = `My New Article - ${Date.now()}`;
    let articleId: string | null = null;

    await loginAs(page, 'admin');

    await test.step('Create a new draft article', async () => {
      await page.getByRole('link', { name: 'New Article' }).click();
      await expect(page.locator('h1')).toHaveText('Create New Article');
      
      await page.getByPlaceholder('Article Title').fill(articleTitle);
      await page.getByPlaceholder('Write your article...').fill('This is the content.');
      await page.getByRole('button', { name: 'Save Draft' }).click();
      
      await expect(page.locator('.status-badge')).toHaveText('Draft');
      articleId = await page.locator('body').getAttribute('data-article-id');
      expect(articleId).not.toBeNull();
    });

    await test.step('Edit the draft and add tags', async () => {
      await page.getByRole('button', { name: 'Edit' }).click();
      await page.getByPlaceholder('Add tags...').fill('playwright, testing');
      await page.getByRole('button', { name: 'Save Draft' }).click();
      
      await expect(page.locator('.tags-list')).toContainText('playwright');
      await expect(page.locator('.tags-list')).toContainText('testing');
    });

    await test.step('Publish the article', async () => {
      await page.getByRole('button', { name: 'Publish' }).click();
      await expect(page.locator('.status-badge')).toHaveText('Published');
    });

    await test.step('Verify the article is visible to the public', async () => {
      // Navigate to the public view of the article
      await page.goto(`${mockPageURL}#articles/${articleId}`);
      
      await expect(page.getByRole('heading', { name: articleTitle })).toBeVisible();
      await expect(page.locator('article')).toContainText('This is the content.');
      await expect(page.locator('.tags-list')).toContainText('playwright');
    });
  });

  test('should handle conditional workflow: trying to publish without a title', async ({ page }) => {
    await loginAs(page, 'admin');

    await test.step('Attempt to save without a title', async () => {
      await page.getByRole('link', { name: 'New Article' }).click();
      await page.getByRole('button', { name: 'Save Draft' }).click();
      
      // Assert that an error message appears and we are still on the same page
      await expect(page.locator('.error-message')).toHaveText('Title cannot be empty.');
      await expect(page).toHaveURL(/#new-article/);
    });

    await test.step('Enter a title and save successfully', async () => {
      await page.getByPlaceholder('Article Title').fill('A Valid Title');
      await page.getByRole('button', { name: 'Save Draft' }).click();
      
      await expect(page.locator('.status-badge')).toHaveText('Draft');
    });
  });
});