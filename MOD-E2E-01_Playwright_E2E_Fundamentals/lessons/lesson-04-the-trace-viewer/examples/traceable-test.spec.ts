import { test, expect } from '@playwright/test';

/**
 * Traceable Test Example
 * 
 * This test demonstrates various Playwright actions that will generate
 * a rich trace file for exploration in the Trace Viewer.
 * 
 * The test simulates a realistic user workflow:
 * 1. Navigate to a contact form page
 * 2. Fill out form fields
 * 3. Submit the form
 * 4. Verify success message
 * 
 * When this test runs with tracing enabled, it will create a trace
 * that shows all these interactions in detail.
 */

test.describe('Contact Form Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Add console log for trace context
    console.log('TRACE: Starting contact form test setup');
    
    // Navigate to a demo contact form page
    // Note: This uses a public demo site for testing purposes
    await page.goto('https://the-internet.herokuapp.com/login');
    
    console.log('TRACE: Page loaded successfully');
  });

  test('should successfully submit contact form with valid data', async ({ page }) => {
    console.log('TRACE: Beginning form submission test');

    // Step 1: Fill out the username field
    console.log('TRACE: Filling username field');
    await page.fill('#username', 'tomsmith');
    
    // Add a small delay to make the trace more interesting
    await page.waitForTimeout(500);

    // Step 2: Fill out the password field
    console.log('TRACE: Filling password field');
    await page.fill('#password', 'SuperSecretPassword!');
    
    // Step 3: Take a screenshot before submission (will appear in trace)
    console.log('TRACE: Taking screenshot before form submission');
    await page.screenshot({ path: 'before-submit.png' });

    // Step 4: Submit the form
    console.log('TRACE: Clicking submit button');
    await page.click('button[type="submit"]');

    // Step 5: Wait for navigation and verify success
    console.log('TRACE: Waiting for success message');
    await expect(page.locator('.flash.success')).toBeVisible();
    
    // Step 6: Verify the success message content
    console.log('TRACE: Verifying success message text');
    await expect(page.locator('.flash.success')).toContainText('You logged into a secure area!');

    // Step 7: Take a final screenshot
    console.log('TRACE: Taking final screenshot');
    await page.screenshot({ path: 'after-submit.png' });

    console.log('TRACE: Test completed successfully');
  });

  test('should handle form validation errors gracefully', async ({ page }) => {
    console.log('TRACE: Beginning form validation test');

    // Step 1: Try to submit form without filling any fields
    console.log('TRACE: Attempting to submit empty form');
    await page.click('button[type="submit"]');

    // Step 2: Wait for and verify error message
    console.log('TRACE: Checking for validation error');
    await expect(page.locator('.flash.error')).toBeVisible();
    
    // Step 3: Verify error message content
    console.log('TRACE: Verifying error message text');
    await expect(page.locator('.flash.error')).toContainText('Your username is invalid!');

    console.log('TRACE: Validation test completed');
  });

  test('should demonstrate network activity in trace', async ({ page }) => {
    console.log('TRACE: Beginning network activity demonstration');

    // Step 1: Navigate to a page that makes API calls
    console.log('TRACE: Navigating to dynamic content page');
    await page.goto('https://the-internet.herokuapp.com/dynamic_content');

    // Step 2: Click button to trigger network requests
    console.log('TRACE: Clicking refresh button to trigger network activity');
    await page.click('a[href="/dynamic_content?with_content=static"]');

    // Step 3: Wait for content to load
    console.log('TRACE: Waiting for dynamic content to load');
    await page.waitForLoadState('networkidle');

    // Step 4: Verify content loaded
    console.log('TRACE: Verifying dynamic content is present');
    await expect(page.locator('.large-10.columns')).toHaveCount(3);

    console.log('TRACE: Network activity test completed');
  });

  test('should demonstrate element interaction timing', async ({ page }) => {
    console.log('TRACE: Beginning timing demonstration test');

    // Step 1: Navigate to a page with interactive elements
    console.log('TRACE: Navigating to dropdown page');
    await page.goto('https://the-internet.herokuapp.com/dropdown');

    // Step 2: Interact with dropdown (shows timing in trace)
    console.log('TRACE: Clicking dropdown to open options');
    await page.click('#dropdown');

    // Step 3: Wait a moment to show the opened state
    await page.waitForTimeout(1000);

    // Step 4: Select an option
    console.log('TRACE: Selecting dropdown option');
    await page.selectOption('#dropdown', 'Option 1');

    // Step 5: Verify selection
    console.log('TRACE: Verifying dropdown selection');
    await expect(page.locator('#dropdown')).toHaveValue('1');

    // Step 6: Navigate to checkboxes page
    console.log('TRACE: Navigating to checkboxes page');
    await page.goto('https://the-internet.herokuapp.com/checkboxes');

    // Step 7: Interact with checkboxes
    console.log('TRACE: Clicking first checkbox');
    await page.check('input[type="checkbox"]:first-child');

    // Step 8: Verify checkbox state
    console.log('TRACE: Verifying checkbox is checked');
    await expect(page.locator('input[type="checkbox"]:first-child')).toBeChecked();

    console.log('TRACE: Timing demonstration completed');
  });

  test('should demonstrate error handling in trace', async ({ page }) => {
    console.log('TRACE: Beginning error handling demonstration');

    // Step 1: Navigate to the login page
    console.log('TRACE: Navigating to login page');
    await page.goto('https://the-internet.herokuapp.com/login');

    // Step 2: Fill form with invalid credentials
    console.log('TRACE: Filling form with invalid credentials');
    await page.fill('#username', 'invaliduser');
    await page.fill('#password', 'wrongpassword');

    // Step 3: Submit form (this will generate an error)
    console.log('TRACE: Submitting form with invalid credentials');
    await page.click('button[type="submit"]');

    // Step 4: Handle the error gracefully
    console.log('TRACE: Handling authentication error');
    await expect(page.locator('.flash.error')).toBeVisible();
    
    // Step 5: Verify error message
    console.log('TRACE: Verifying error message content');
    await expect(page.locator('.flash.error')).toContainText('Your username is invalid!');

    // Step 6: Clear form and try again with correct credentials
    console.log('TRACE: Clearing form for retry');
    await page.fill('#username', '');
    await page.fill('#password', '');

    // Step 7: Fill with correct credentials
    console.log('TRACE: Filling form with correct credentials');
    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');

    // Step 8: Submit again
    console.log('TRACE: Submitting form with correct credentials');
    await page.click('button[type="submit"]');

    // Step 9: Verify success
    console.log('TRACE: Verifying successful login');
    await expect(page.locator('.flash.success')).toBeVisible();

    console.log('TRACE: Error handling demonstration completed');
  });

  test.afterEach(async ({ page }) => {
    console.log('TRACE: Test cleanup completed');
  });
});

/**
 * Additional Test Suite for Advanced Trace Features
 */
test.describe('Advanced Trace Features', () => {
  test('should demonstrate custom trace annotations', async ({ page, context }) => {
    console.log('TRACE: Starting advanced trace features test');

    // Custom trace annotation using page evaluation
    await page.evaluate(() => {
      console.log('CUSTOM_TRACE: This is a custom trace annotation');
    });

    // Navigate and perform actions
    await page.goto('https://the-internet.herokuapp.com/hovers');
    
    // Add custom trace markers
    await page.evaluate(() => {
      console.log('CUSTOM_TRACE: About to perform hover actions');
    });

    // Hover over elements (great for trace visualization)
    await page.hover('.figure:first-child img');
    await page.waitForTimeout(500);
    
    await page.hover('.figure:nth-child(2) img');
    await page.waitForTimeout(500);
    
    await page.hover('.figure:last-child img');
    await page.waitForTimeout(500);

    await page.evaluate(() => {
      console.log('CUSTOM_TRACE: Hover actions completed');
    });

    console.log('TRACE: Advanced features test completed');
  });
});