import { Page, Locator } from '@playwright/test';
import { User } from '../factories/UserFactory';

export class RegistrationPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.usernameInput = page.locator('#username');
    this.emailInput = page.locator('#email');
    this.submitButton = page.locator('button[type="submit"]');
    this.successMessage = page.locator('.alert-success');
    this.errorMessage = page.locator('.alert-danger');
  }

  async navigate() {
    await this.page.goto('/register');
  }

  async fillRegistrationForm(user: User) {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.usernameInput.fill(user.username);
    await this.emailInput.fill(user.email);
  }

  async submit() {
    await this.submitButton.click();
  }
}