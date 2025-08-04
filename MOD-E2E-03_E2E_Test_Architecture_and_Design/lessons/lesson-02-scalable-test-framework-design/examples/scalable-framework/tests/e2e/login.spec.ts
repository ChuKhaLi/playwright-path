// Using our custom test fixture
import { test, expect } from '../../fixtures/auth.fixtures';

test.describe('Authentication', () => {
  // This test uses the 'loginPage' fixture, but not the 'loggedInPage' fixture.
  // It starts on the login page, but not yet authenticated.
  test('should show error for locked out user', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.login('locked_out_user', 'secret_sauce');
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Sorry, this user has been locked out.');
  });
});

test.describe('Homepage', () => {
  // This test uses the 'loggedInPage' fixture.
  // The test will start with the user already logged in.
  test('should display welcome message after login', async ({ loggedInPage, homePage }) => {
    // No need to call loginPage.login() here!
    // The fixture handles the setup.
    const welcomeText = await homePage.getWelcomeText();
    expect(welcomeText).toContain('Welcome');
  });

  // This test also starts with the user logged in.
  test('should log out successfully', async ({ loggedInPage, homePage, loginPage }) => {
    await homePage.logout();
    // After logout, the login button should be visible again.
    await expect(loginPage.loginButton).toBeVisible();
  });
});