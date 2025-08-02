# Example 01: Basic Step Definitions

## Overview

This example demonstrates the fundamental concepts of implementing step definitions in TypeScript. You'll learn how to connect Gherkin steps to executable TypeScript code, understand the basic structure of step definitions, and implement simple test actions and assertions.

## Learning Objectives

- Understand step definition anatomy and structure
- Implement basic Given/When/Then step definitions
- Connect step definitions to Playwright actions
- Use proper TypeScript async/await patterns
- Create simple assertions and verifications

## Feature File Context

First, let's look at the feature file we'll be implementing:

```gherkin
Feature: User Login
  As a registered user
  I want to log into the application
  So that I can access my personal dashboard

  Background:
    Given the application is running
    And I am on the login page

  Scenario: Successful login with valid credentials
    When I enter "john.doe@example.com" in the email field
    And I enter "securePassword123" in the password field
    And I click the "Login" button
    Then I should be redirected to the dashboard
    And I should see "Welcome back, John!"

  Scenario: Failed login with invalid credentials
    When I enter "invalid@example.com" in the email field
    And I enter "wrongPassword" in the password field
    And I click the "Login" button
    Then I should see "Invalid credentials"
    And I should remain on the login page
```

## Step Definition Implementation

### Basic File Structure

```typescript
// step-definitions/login.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Type the 'this' context for better IntelliSense
interface LoginStepContext extends CustomWorld {
  page: Page;
}
```

### Given Steps - Setup and Context

Given steps establish the initial state and context for your scenarios:

```typescript
Given('the application is running', async function (this: LoginStepContext) {
  // Verify the application is accessible
  const response = await this.page.goto(process.env.BASE_URL || 'http://localhost:3000');
  
  // Ensure the response is successful
  expect(response?.status()).toBe(200);
  
  console.log('✅ Application is running and accessible');
});

Given('I am on the login page', async function (this: LoginStepContext) {
  // Navigate to the login page
  await this.page.goto('/login');
  
  // Verify we're on the correct page by checking the URL
  expect(this.page.url()).toContain('/login');
  
  // Verify key elements are present
  await expect(this.page.getByLabel('Email')).toBeVisible();
  await expect(this.page.getByLabel('Password')).toBeVisible();
  await expect(this.page.getByRole('button', { name: 'Login' })).toBeVisible();
  
  console.log('✅ Successfully navigated to login page');
});
```

### When Steps - Actions and Interactions

When steps perform actions that change the state of the application:

```typescript
When('I enter {string} in the email field', async function (this: LoginStepContext, email: string) {
  // Find the email input field and enter the value
  const emailField = this.page.getByLabel('Email');
  
  // Clear any existing content and enter new value
  await emailField.clear();
  await emailField.fill(email);
  
  // Verify the value was entered correctly
  expect(await emailField.inputValue()).toBe(email);
  
  console.log(`✅ Entered email: ${email}`);
});

When('I enter {string} in the password field', async function (this: LoginStepContext, password: string) {
  // Find the password input field and enter the value
  const passwordField = this.page.getByLabel('Password');
  
  // Clear any existing content and enter new value
  await passwordField.clear();
  await passwordField.fill(password);
  
  // For security, we don't log the actual password
  console.log('✅ Password entered successfully');
});

When('I click the {string} button', async function (this: LoginStepContext, buttonText: string) {
  // Find the button by its accessible name and click it
  const button = this.page.getByRole('button', { name: buttonText });
  
  // Ensure the button is visible and enabled before clicking
  await expect(button).toBeVisible();
  await expect(button).toBeEnabled();
  
  // Click the button
  await button.click();
  
  console.log(`✅ Clicked ${buttonText} button`);
});
```

### Then Steps - Assertions and Verification

Then steps verify the expected outcomes and results:

```typescript
Then('I should be redirected to the dashboard', async function (this: LoginStepContext) {
  // Wait for navigation to complete
  await this.page.waitForURL('**/dashboard', { timeout: 5000 });
  
  // Verify the URL contains 'dashboard'
  expect(this.page.url()).toContain('/dashboard');
  
  // Verify we can see dashboard-specific elements
  await expect(this.page.getByRole('navigation')).toBeVisible();
  
  console.log('✅ Successfully redirected to dashboard');
});

Then('I should see {string}', async function (this: LoginStepContext, expectedText: string) {
  // Look for the text anywhere on the page
  const textElement = this.page.getByText(expectedText);
  
  // Verify the text is visible
  await expect(textElement).toBeVisible();
  
  console.log(`✅ Found expected text: "${expectedText}"`);
});

Then('I should remain on the login page', async function (this: LoginStepContext) {
  // Verify we're still on the login page
  expect(this.page.url()).toContain('/login');
  
  // Verify login form is still visible
  await expect(this.page.getByLabel('Email')).toBeVisible();
  await expect(this.page.getByLabel('Password')).toBeVisible();
  
  console.log('✅ Remained on login page as expected');
});
```

## Advanced Patterns

### Error Handling

```typescript
When('I attempt to login with credentials', async function (this: LoginStepContext) {
  try {
    // Attempt the login action
    await this.page.getByRole('button', { name: 'Login' }).click();
    
    // Wait for either success or error state
    await Promise.race([
      this.page.waitForURL('**/dashboard'),
      this.page.waitForSelector('.error-message', { timeout: 3000 })
    ]);
    
  } catch (error) {
    // Log the error for debugging
    console.error('Login attempt failed:', error.message);
    
    // Take a screenshot for visual debugging
    await this.page.screenshot({ 
      path: `screenshots/login-error-${Date.now()}.png`,
      fullPage: true 
    });
    
    // Re-throw to fail the test
    throw new Error(`Login process failed: ${error.message}`);
  }
});
```

### Conditional Logic

```typescript
Then('I should see the appropriate response', async function (this: LoginStepContext) {
  // Check if we successfully logged in or got an error
  const isOnDashboard = this.page.url().includes('/dashboard');
  const hasErrorMessage = await this.page.locator('.error-message').isVisible();
  
  if (isOnDashboard) {
    console.log('✅ Login successful - on dashboard');
    await expect(this.page.getByText('Welcome')).toBeVisible();
  } else if (hasErrorMessage) {
    console.log('ℹ️ Login failed as expected - error message shown');
    await expect(this.page.locator('.error-message')).toBeVisible();
  } else {
    throw new Error('Unexpected state: neither success nor error condition met');
  }
});
```

### Timeout Management

```typescript
Then('the login should complete within {int} seconds', async function (this: LoginStepContext, timeoutSeconds: number) {
  const startTime = Date.now();
  
  try {
    // Wait for login completion with custom timeout
    await this.page.waitForURL('**/dashboard', { 
      timeout: timeoutSeconds * 1000 
    });
    
    const duration = Date.now() - startTime;
    console.log(`✅ Login completed in ${duration}ms`);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    throw new Error(`Login did not complete within ${timeoutSeconds} seconds (took ${duration}ms)`);
  }
});
```

## Best Practices Demonstrated

### 1. Clear Function Names and Documentation

```typescript
/**
 * Enters user credentials into the login form
 * @param email - User's email address
 * @param password - User's password
 */
When('I login with email {string} and password {string}', 
  async function (this: LoginStepContext, email: string, password: string) {
    await this.loginActions.enterCredentials(email, password);
  }
);
```

### 2. Meaningful Assertions

```typescript
Then('I should see a personalized welcome message', async function (this: LoginStepContext) {
  // Instead of just checking for any text, be specific
  const welcomeMessage = this.page.getByText(/Welcome back, \w+!/);
  await expect(welcomeMessage).toBeVisible();
  
  // Verify the message is personalized (contains user's name)
  const messageText = await welcomeMessage.textContent();
  expect(messageText).toMatch(/Welcome back, [A-Za-z]+!/);
});
```

### 3. Robust Element Selection

```typescript
When('I click the primary action button', async function (this: LoginStepContext) {
  // Multiple strategies for finding the button
  const button = this.page.getByRole('button', { name: 'Login' })
    .or(this.page.getByTestId('login-button'))
    .or(this.page.locator('button[type="submit"]').first());
  
  await expect(button).toBeVisible();
  await button.click();
});
```

## Common Pitfalls and Solutions

### ❌ Problem: Not awaiting async operations
```typescript
// Wrong - missing await
When('I click login', function () {
  this.page.click('button[type="submit"]'); // Missing await!
});

// Correct - properly awaited
When('I click login', async function () {
  await this.page.click('button[type="submit"]');
});
```

### ❌ Problem: Weak assertions
```typescript
// Wrong - too generic
Then('something should happen', async function () {
  // Too vague, doesn't verify specific behavior
});

// Correct - specific verification
Then('I should see the user dashboard', async function () {
  await expect(this.page.getByRole('main')).toContainText('Dashboard');
  await expect(this.page.getByRole('navigation')).toBeVisible();
});
```

### ❌ Problem: Not handling timeouts
```typescript
// Wrong - no timeout handling
When('I wait for login to complete', async function () {
  await this.page.waitForURL('**/dashboard'); // Could hang forever
});

// Correct - explicit timeout
When('I wait for login to complete', async function () {
  await this.page.waitForURL('**/dashboard', { timeout: 10000 });
});
```

## Integration with Test Runner

### Running the Tests

```bash
# Run all login tests
npx cucumber-js features/login.feature

# Run with specific tags
npx cucumber-js --tags "@login"

# Run with detailed output
npx cucumber-js --format-options '{"snippetInterface": "async-await"}'
```

### Configuration Example

```javascript
// cucumber.config.js
module.exports = {
  default: {
    require: ['step-definitions/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json'
    ],
    parallel: 1
  }
};
```

## Summary

This example demonstrated:

- ✅ **Basic step definition structure** with proper TypeScript typing
- ✅ **Given/When/Then implementation patterns** for different test phases
- ✅ **Parameter handling** with string extraction from Gherkin steps
- ✅ **Playwright integration** for browser automation actions
- ✅ **Assertion patterns** using Playwright's expect API
- ✅ **Error handling** and debugging techniques
- ✅ **Best practices** for maintainable step definitions

### Key Takeaways

1. **Always use async/await** for Playwright operations
2. **Type your step context** for better development experience
3. **Be specific with assertions** - verify exactly what you expect
4. **Handle errors gracefully** with meaningful error messages
5. **Use consistent logging** to aid in debugging
6. **Follow the Given/When/Then semantics** strictly

---

*This foundation prepares you for more complex step definition patterns involving parameter handling, data tables, and advanced integration techniques.*