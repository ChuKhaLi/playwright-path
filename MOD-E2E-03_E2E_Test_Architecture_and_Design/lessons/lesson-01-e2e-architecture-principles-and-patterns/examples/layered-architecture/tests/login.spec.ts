// Layer: Test Layer
// This file contains the test logic. It describes the steps of the test case from a user's perspective.

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import * as userData from '../data/users.json';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should allow a user to log in with valid credentials', async () => {
    // The test reads like a user story, focusing on the "what" not the "how".
    await loginPage.login(userData.validUser.username, userData.validUser.password);

    // Assertion is part of the test layer
    await expect(loginPage.page.locator('#logout_button')).toBeVisible();
  });

  test('should show an error message with invalid credentials', async ({ page }) => {
    await loginPage.login(userData.invalidUser.username, userData.invalidUser.password);

    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Invalid username or password');
  });
});