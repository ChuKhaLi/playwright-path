import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly inventoryList: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryList = page.locator('.inventory_list');
  }

  async addProductToCart(productName: string) {
    const product = this.inventoryList.locator('.inventory_item', { hasText: productName });
    await product.locator('button', { hasText: 'Add to cart' }).click();
  }

  async getProductPrice(productName: string): Promise<string> {
    const product = this.inventoryList.locator('.inventory_item', { hasText: productName });
    const priceElement = product.locator('.inventory_item_price');
    return priceElement.textContent();
  }
}