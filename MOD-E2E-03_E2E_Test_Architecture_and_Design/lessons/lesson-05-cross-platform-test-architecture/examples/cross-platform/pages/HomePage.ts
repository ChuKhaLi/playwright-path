import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly isMobile: boolean;
  readonly navigationLinks: Locator;
  readonly hamburgerMenuButton: Locator;
  readonly searchBar: Locator;

  constructor(page: Page, isMobile: boolean) {
    this.page = page;
    this.isMobile = isMobile;

    // Locators that are common to both platforms
    this.navigationLinks = page.locator('nav[aria-label="Main"] a');
    this.searchBar = page.locator('[data-testid="search-input"]');

    // Locator that is specific to mobile
    this.hamburgerMenuButton = page.locator('[data-testid="hamburger-menu"]');
  }

  async navigate() {
    await this.page.goto('/');
  }

  /**
   * This method demonstrates handling platform differences.
   * On mobile, it must first open the menu to find the link.
   * On desktop, the link is already visible.
   */
  async goToProfilePage() {
    if (this.isMobile) {
      await this.hamburgerMenuButton.click();
    }
    // The locator for the link itself is the same on both platforms.
    await this.navigationLinks.filter({ hasText: 'Profile' }).click();
  }

  async search(text: string) {
    await this.searchBar.fill(text);
    await this.searchBar.press('Enter');
  }
}