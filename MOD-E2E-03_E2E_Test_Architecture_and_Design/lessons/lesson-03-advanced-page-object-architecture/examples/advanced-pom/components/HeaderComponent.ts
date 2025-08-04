import { Page, Locator } from '@playwright/test';
import { CartPage } from '../pages/CartPage';

/**
 * Represents the header, a reusable component on many pages.
 */
export class HeaderComponent {
  readonly page: Page;
  readonly cartLink: Locator;
  readonly cartCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = page.locator('a.shopping_cart_link');
    this.cartCount = page.locator('.shopping_cart_badge');
  }

  async getCartCount(): Promise<number> {
    const text = await this.cartCount.textContent();
    return text ? parseInt(text, 10) : 0;
  }

  async goToCart(): Promise<CartPage> {
    await this.cartLink.click();
    return new CartPage(this.page);
  }
}