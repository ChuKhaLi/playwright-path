import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart_item');
  }

  async getCartItem(productName: string): Promise<Locator> {
    return this.cartItems.filter({ hasText: productName });
  }
}