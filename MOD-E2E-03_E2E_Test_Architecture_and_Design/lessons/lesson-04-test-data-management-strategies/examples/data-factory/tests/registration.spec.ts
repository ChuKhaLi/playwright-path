import { test, expect } from '@playwright/test';
import { UserFactory } from '../factories/UserFactory';
import { RegistrationPage } from '../pages/RegistrationPage';

test.describe('User Registration', () => {
  let registrationPage: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await registrationPage.navigate();
  });

  test('should allow a user to register with valid data', async () => {
    // 1. Create a standard user with completely random data.
    const newUser = UserFactory.createDefaultUser();

    // 2. Use the data from the factory to fill the registration form.
    await registrationPage.fillRegistrationForm(newUser);
    await registrationPage.submit();

    // 3. Assert that the registration was successful.
    await expect(registrationPage.successMessage).toBeVisible();
    await expect(registrationPage.successMessage).toContainText(
      `Welcome, ${newUser.firstName}!`
    );
  });

  test('should show an error if the username is already taken', async () => {
    // 1. Create a user, but override the username to be a known, existing user.
    // This is useful for testing specific edge cases.
    const existingUser = UserFactory.createUser({ username: 'admin' });

    // 2. Attempt to register with the data.
    await registrationPage.fillRegistrationForm(existingUser);
    await registrationPage.submit();

    // 3. Assert that the correct error message is shown.
    await expect(registrationPage.errorMessage).toBeVisible();
    await expect(registrationPage.errorMessage).toContainText(
      'Username "admin" is already taken.'
    );
  });
});