import { test, expect } from '@playwright/test';

// Mock page setup
const mockPageURL = 'file://' + __dirname + '/../mock-page/index.html';

test.describe('SPA Testing Strategies', () => {
  test('should handle client-side navigation and API mocking', async ({ page }) => {
    // --- 1. Mock the API response ---
    // Intercept the GET request to the posts API
    await page.route('https://jsonplaceholder.typicode.com/posts', async (route) => {
      const mockPosts = [
        { id: 1, title: 'Mock Post 1', body: 'This is the body of the first mock post.' },
        { id: 2, title: 'Mock Post 2', body: 'This is the body of the second mock post.' },
      ];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPosts),
      });
    });

    // --- 2. Navigate and wait for content ---
    await page.goto(mockPageURL);

    // Assert that the loading message disappears
    await expect(page.locator('#loading-message')).not.toBeVisible();

    // Assert that our mocked posts are rendered
    const postList = page.locator('#posts-list li');
    await expect(postList).toHaveCount(2);
    await expect(postList.first()).toContainText('Mock Post 1');
    await expect(postList.last()).toContainText('Mock Post 2');

    // --- 3. Test client-side navigation ---
    // Mock the API for a single post
    await page.route('https://jsonplaceholder.typicode.com/posts/1', async (route) => {
      const mockPost = {
        id: 1,
        title: 'Mock Post 1',
        body: 'This is the body of the first mock post.',
      };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPost),
      });
    });

    // Click the link for the first post
    await postList.first().getByRole('link').click();

    // --- 4. Assert the new "page" state ---
    // The URL should change (simulated with a hash for this local file example)
    await expect(page).toHaveURL(/#\/post\/1/);

    // The post detail view should be visible
    const postDetailView = page.locator('#post-detail');
    await expect(postDetailView).toBeVisible();
    await expect(postDetailView.getByRole('heading')).toHaveText('Mock Post 1');
    await expect(postDetailView.locator('p')).toContainText('This is the body of the first mock post.');

    // The original post list should now be hidden
    await expect(page.locator('#posts-list')).not.toBeVisible();

    // --- 5. Test navigating back ---
    await page.getByRole('link', { name: 'Back to Posts' }).click();
    await expect(page).toHaveURL(/#\/$/);
    await expect(page.locator('#posts-list')).toBeVisible();
    await expect(page.locator('#post-detail')).not.toBeVisible();
  });
});