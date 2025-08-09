import { test, expect } from '@playwright/test';

/**
 * Exercise: Data and State Management for a Blog
 *
 * You are testing a blog application. You need to test the functionality
 * for adding a comment to a blog post. To do this reliably, you need to
 * ensure a specific blog post exists and then clean it up afterward.
 *
 * The application also has a "High Contrast" mode for accessibility,
 * which is enabled by setting a `highContrast` key to `true` in `localStorage`.
 *
 * -- INSTRUCTIONS --
 *
 * 1.  **Create a Blog Post:**
 *     - In a `test.beforeEach` hook, send a `POST` request to `/api/posts`
 *       to create a new blog post. The post data should be:
 *       `{ title: 'My E2E Test Post', content: '...' }`
 *     - Store the `id` of the newly created post from the response.
 *
 * 2.  **Clean Up the Blog Post:**
 *     - In a `test.afterEach` hook, send a `DELETE` request to
 *       `/api/posts/{id}` to remove the post created in the setup.
 *
 * 3.  **Enable High Contrast Mode:**
 *     - In the test itself, before navigating, use `page.evaluate()` to set
 *       the `localStorage` key `highContrast` to `"true"`.
 *
 * 4.  **Test Comment Functionality:**
 *     - Navigate to the page for the created blog post (`/posts/{id}`).
 *     - Assert that the `<body>` element has the class `high-contrast-mode`.
 *     - Fill in the comment form with the text "This is a test comment."
 *     - Click the "Submit Comment" button.
 *     - Assert that the new comment "This is a test comment." is visible
 *       on the page.
 *
 */

test.describe('Blog Post Commenting', () => {
  let postId: string;

  // TODO: Step 1 - Implement the beforeEach hook to create a post.
  test.beforeEach(async ({ request }) => {
    // const response = await request.post(...);
    // const post = await response.json();
    // postId = post.id;
  });

  // TODO: Step 2 - Implement the afterEach hook to delete the post.
  test.afterEach(async ({ request }) => {
    // if (postId) {
    //   await request.delete(...);
    // }
  });

  test('should allow a user to add a comment in high contrast mode', async ({ page }) => {
    // TODO: Step 3 - Enable high contrast mode via localStorage.
    // await page.evaluate(...);

    // Navigate to the specific post page
    await page.goto(`/posts/${postId}`);

    // TODO: Step 4 - Assert high contrast mode is active.
    // await expect(page.locator('body')).toHaveClass(...);

    // Add a comment
    const commentInput = page.getByPlaceholder('Write a comment...');
    const submitButton = page.getByRole('button', { name: 'Submit Comment' });

    // TODO: Step 4 - Fill and submit the comment form.
    // await commentInput.fill(...);
    // await submitButton.click();

    // TODO: Step 4 - Assert the new comment is visible.
    // await expect(page.locator('.comment-list')).toContainText(...);
  });
});