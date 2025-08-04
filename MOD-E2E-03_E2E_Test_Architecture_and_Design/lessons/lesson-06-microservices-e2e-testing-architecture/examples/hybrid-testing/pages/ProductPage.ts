import { Page, Locator } from '@playwright/test';
import { HeaderComponent } from './HeaderComponent'; // Assuming a shared header component

export class ProductPage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly addToCartButton: Locator;
  readonly productName: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.addToCartButton = page.locator('[data-testid="add-to-cart-button"]');
    this.productName = page.locator('h1[data-testid="product-name"]');
  }

  async navigate(productId: string) {
    await this.page.goto(`/products/${productId}`);
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async getProductName(): Promise<string> {
    return this.productName.textContent();
  }
}