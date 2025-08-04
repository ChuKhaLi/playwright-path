import { test, expect, Browser } from '@playwright/test';

// Mock page setup
const mockPageURL = 'file://' + __dirname + '/../mock-page/index.html';

// Helper function to get the service worker
const getServiceWorker = (browser: Browser) => {
  const sws = browser.contexts().flatMap(context => context.serviceWorkers());
  return sws.length > 0 ? sws[0] : null;
};

test.describe('PWA Features', () => {
  test('should register a service worker and it should be active', async ({ page, browser }) => {
    await page.goto(mockPageURL);

    // Wait for the service worker to be registered and activated
    const sw = await page.evaluateHandle(async () => {
      const registration = await navigator.serviceWorker.ready;
      return registration.active;
    });

    // Check if the service worker handle is not null
    expect(sw.asElement()).not.toBeNull();
  });

  test('should load from cache when offline', async ({ browser }) => {
    // Step 1: Go online and load the page to cache resources
    const onlinePage = await browser.newPage();
    await onlinePage.goto(mockPageURL);
    
    // Wait for the service worker to claim the client
    await onlinePage.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    await onlinePage.close();

    // Step 2: Create a new offline context
    const offlineContext = await browser.newContext({ offline: true });
    const offlinePage = await offlineContext.newPage();

    // Step 3: Try to load the page again while offline
    try {
      await offlinePage.goto(mockPageURL, { timeout: 5000 });
      // Assert that the offline content is visible
      await expect(offlinePage.locator('#offline-title')).toHaveText('You are offline!');
      await expect(offlinePage.locator('#cached-content')).toBeVisible();
    } catch (e) {
      test.fail(true, `Page failed to load offline. Error: ${e.message}`);
    } finally {
      await offlineContext.close();
    }
  });

  test('should have a valid web app manifest', async ({ page }) => {
    await page.goto(mockPageURL);

    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', 'manifest.json');

    const manifestUrl = await manifestLink.getAttribute('href');
    const response = await page.request.get(mockPageURL.replace('index.html', manifestUrl!));
    const manifest = await response.json();

    expect(manifest.name).toBe('PWA Test App');
    expect(manifest.short_name).toBe('PWA App');
    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBe('.');
    expect(manifest.icons[0].src).toBe('icon-192.png');
  });
});