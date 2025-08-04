import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly welcomeMessage: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.locator('#welcome-message');
    this.logoutButton = page.locator('#logout-button');
  }

  async getWelcomeText() {
    return this.welcomeMessage.textContent();
  }

  async logout() {
    await this.logoutButton.click();
  }
}