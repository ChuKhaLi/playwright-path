import { test, expect } from '@playwright/test';

/**
 * Exercise: Testing a PWA News App
 *
 * You are testing a PWA that displays news articles. It should be installable,
 * register a service worker, and provide an offline reading experience for
 * articles that have been visited online.
 *
 * -- INSTRUCTIONS --
 *
 * 1.  **Validate the Web App Manifest:**
 *     - Navigate to the app's home page.
 *     - Find the link to the `manifest.json` file.
 *     - Fetch the manifest and assert that its `short_name` is "News" and
 *       its `background_color` is "#ffffff".
 *
 * 2.  **Verify Service Worker Registration:**
 *     - On the home page, evaluate code in the browser to check for an active
 *       service worker.
 *     - Assert that the service worker's script URL includes `news-sw.js`.
 *
 * 3.  **Test Offline Caching:**
 *     - While online, click on the first news article to navigate to its page.
 *       This action should cache the article.
 *     - Create a new browser context that is set to `offline: true`.
 *     - In the new offline context, attempt to navigate directly to the URL
 *       of the article you just visited.
 *     - Assert that the article's title is visible, confirming that it was
 *       served from the cache.
 *
 */

const mockPageURL = 'file://' + __dirname + '/../mock-page/exercise.html';
const articleURL = 'file://' + __dirname + '/../mock-page/article.html';

test.describe('PWA News App', () => {
  test('should meet PWA criteria for installability and offline access', async ({ page, browser }) => {
    await page.goto(mockPageURL);

    // TODO: Step 1 - Validate the manifest properties.
    // const manifestLink = ...
    // const manifestUrl = ...
    // const response = ...
    // const manifest = ...
    // expect(manifest.short_name).toBe(...);
    // expect(manifest.background_color).toBe(...);

    // TODO: Step 2 - Verify the service worker registration.
    // const swURL = await page.evaluate(...);
    // expect(swURL).toContain(...);

    // --- Offline Test ---
    // First, visit the article online to cache it.
    await page.goto(articleURL);
    await expect(page.getByRole('heading', { name: 'Playwright Conquers the Web' })).toBeVisible();
    // Wait for service worker to be ready
    await page.evaluate(async () => await navigator.serviceWorker.ready);

    // TODO: Step 3 - Create an offline context and test offline access.
    // const offlineContext = await browser.newContext({ offline: true });
    // const offlinePage = await offlineContext.newPage();
    // await offlinePage.goto(articleURL);
    // await expect(offlinePage.getByRole('heading', { name: 'Playwright Conquers the Web' })).toBeVisible();
    // await offlineContext.close();
  });
});