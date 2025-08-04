import { test, expect, Page } from '@playwright/test';

// --- Helper Function (Good Practice) ---
// Encapsulates a common action, making tests cleaner and more maintainable.
async function searchFor(page: Page, searchTerm: string) {
  await page.getByPlaceholder('Search...').fill(searchTerm);
  await page.getByRole('button', { name: 'Search' }).click();
}

// --- Test Suite (Good Practice: `describe` block for organization) ---
test.describe('Search Functionality', () => {
  
  // --- Hook for Shared Setup (Good Practice: Test Isolation) ---
  test.beforeEach(async ({ page }) => {
    // This ensures every test starts from the same clean state.
    await page.goto('/search');
  });

  // --- Descriptive Title and Tags (Good Practice) ---
  test('should display results for a valid search term', {
    tag: ['@smoke', '@search'],
  }, async ({ page }) => {
    
    // --- Arrange-Act-Assert Pattern (Good Practice) ---

    // Arrange: Define locators and test data.
    const searchTerm = 'Playwright';
    const resultsContainer = page.locator('#search-results');

    // Act: Perform the user action being tested.
    await searchFor(page, searchTerm);

    // Assert: Verify the outcome.
    await expect(resultsContainer).toBeVisible();
    await expect(resultsContainer.locator('.result-item').first()).toContainText(searchTerm);
  });

  test('should show a "no results" message for an unknown term', async ({ page }) => {
    // Arrange
    const searchTerm = 'NonExistentTerm12345';
    const noResultsMessage = page.getByText('No results found for "NonExistentTerm12345"');

    // Act
    await searchFor(page, searchTerm);

    // Assert
    await expect(noResultsMessage).toBeVisible();
  });

  // --- Example of a less ideal test for comparison ---
  test('BAD EXAMPLE - should find item', async ({ page }) => {
    // No AAA structure, brittle locators, poor title.
    await page.locator('input.search-bar').fill('Playwright');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('#search-results > div:first-child')).toBeVisible();
  });

  // --- Using Test IDs (Good Practice: Stable Locators) ---
  test('should use data-testid for stable element selection', async ({ page }) => {
    // Arrange
    const resultsContainer = page.getByTestId('search-results-container');

    // Act
    await searchFor(page, 'Playwright');

    // Assert
    await expect(resultsContainer).toBeVisible();
  });
});