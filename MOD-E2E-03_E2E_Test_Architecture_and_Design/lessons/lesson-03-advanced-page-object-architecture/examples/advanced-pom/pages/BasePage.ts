import { Page } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';

/**
 * BasePage contains common elements and functionality
 * shared across all pages.
 */
export abstract class BasePage {
  readonly page: Page;
  readonly header: HeaderComponent;

  constructor(page: Page) {
    this.page = page;
    // Every page that extends BasePage will have access to the header component.
    this.header = new HeaderComponent(page);
  }

  async navigate(path: string) {
    await this.page.goto(path);
  }

  async waitForPageLoad() {
    // Example of a shared function
    await this.page.waitForLoadState('domcontentloaded');
  }
}