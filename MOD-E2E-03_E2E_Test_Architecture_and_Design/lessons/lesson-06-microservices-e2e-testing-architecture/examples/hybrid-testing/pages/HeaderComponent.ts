import { Page, Locator } from '@playwright/test';

export class HeaderComponent {
  readonly page: Page;
  readonly cartCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartCount = page.locator('[data-testid="cart-count"]');
  }
}