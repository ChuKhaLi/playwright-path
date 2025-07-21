import { test, expect } from '@playwright/test';

/**
 * Comprehensive Locator Strategies Demo
 * 
 * This file demonstrates various locator strategies using real-world examples.
 * Each test showcases different approaches to element selection and their use cases.
 */

test.describe('Built-in Locators - The Playwright Way', () => {
  
  test('getByRole() - Semantic Element Selection', async ({ page }) => {
    // Navigate to a demo form page
    await page.goto('https://demo.playwright.dev/todomvc/');
    
    console.log('Testing getByRole() locator with various ARIA roles');
    
    // Find input by role - most semantic approach
    const todoInput = page.getByRole('textbox', { name: 'What needs to be done?' });
    await todoInput.fill('Learn Playwright locators');
    
    // Find button by role and name
    await page.getByRole('button', { name: 'Add' }).click();
    
    // Verify the todo was added using role-based selection
    const todoItem = page.getByRole('listitem').filter({ hasText: 'Learn Playwright locators' });
    await expect(todoItem).toBeVisible();
    
    console.log('✅ getByRole() successfully found elements by semantic meaning');
  });

  test('getByText() - Content-Based Selection', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/');
    
    console.log('Testing getByText() locator with various text matching strategies');
    
    // Add some todos first
    await page.getByRole('textbox').fill('Buy groceries');
    await page.keyboard.press('Enter');
    await page.getByRole('textbox').fill('Walk the dog');
    await page.keyboard.press('Enter');
    
    // Find by exact text
    await expect(page.getByText('Buy groceries')).toBeVisible();
    
    // Find by partial text (case-insensitive)
    await expect(page.getByText('groceries', { exact: false })).toBeVisible();
    
    // Find using regular expression for dynamic content
    await expect(page.getByText(/Walk the \w+/)).toBeVisible();
    
    // Find and interact with footer text
    const footerText = page.getByText('Double-click to edit a todo');
    await expect(footerText).toBeVisible();
    
    console.log('✅ getByText() successfully found elements by content');
  });

  test('getByLabel() - Form Element Specialist', async ({ page }) => {
    // Navigate to a form demo page
    await page.goto('https://the-internet.herokuapp.com/login');
    
    console.log('Testing getByLabel() locator for form elements');
    
    // Find form inputs by their associated labels
    const usernameInput = page.getByLabel('Username');
    const passwordInput = page.getByLabel('Password');
    
    // Fill form fields using label-based selection
    await usernameInput.fill('tomsmith');
    await passwordInput.fill('SuperSecretPassword!');
    
    // Find and click submit button
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify successful login
    await expect(page.getByText('You logged into a secure area!')).toBeVisible();
    
    console.log('✅ getByLabel() successfully found form elements by labels');
  });

  test('getByPlaceholder() - Input Field Helper', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/');
    
    console.log('Testing getByPlaceholder() locator for input fields');
    
    // Find input by placeholder text
    const todoInput = page.getByPlaceholder('What needs to be done?');
    
    // Verify the input is found and functional
    await expect(todoInput).toBeVisible();
    await expect(todoInput).toBeEditable();
    
    // Use the input found by placeholder
    await todoInput.fill('Test placeholder locator');
    await todoInput.press('Enter');
    
    // Verify the todo was added
    await expect(page.getByText('Test placeholder locator')).toBeVisible();
    
    console.log('✅ getByPlaceholder() successfully found input by placeholder');
  });

  test('getByTestId() - Developer-Friendly Targeting', async ({ page }) => {
    // Create a simple HTML page with test IDs for demonstration
    await page.setContent(`
      <html>
        <body>
          <div data-testid="header">
            <h1>Test Page</h1>
            <button data-testid="menu-button">Menu</button>
          </div>
          <main data-testid="main-content">
            <form data-testid="contact-form">
              <input data-testid="name-input" placeholder="Name" />
              <input data-testid="email-input" placeholder="Email" />
              <button data-testid="submit-button" type="submit">Submit</button>
            </form>
          </main>
          <footer data-testid="footer">
            <p>© 2024 Test Company</p>
          </footer>
        </body>
      </html>
    `);
    
    console.log('Testing getByTestId() locator with custom test IDs');
    
    // Find elements by test ID
    const header = page.getByTestId('header');
    const menuButton = page.getByTestId('menu-button');
    const contactForm = page.getByTestId('contact-form');
    const nameInput = page.getByTestId('name-input');
    const emailInput = page.getByTestId('email-input');
    const submitButton = page.getByTestId('submit-button');
    
    // Verify all elements are found
    await expect(header).toBeVisible();
    await expect(menuButton).toBeVisible();
    await expect(contactForm).toBeVisible();
    
    // Interact with form elements
    await nameInput.fill('John Doe');
    await emailInput.fill('john@example.com');
    await submitButton.click();
    
    console.log('✅ getByTestId() successfully found elements by test IDs');
  });
});

test.describe('CSS Selectors with page.locator()', () => {
  
  test('Basic CSS Selector Patterns', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/');
    
    console.log('Testing basic CSS selector patterns');
    
    // Element selectors
    const heading = page.locator('h1');
    await expect(heading).toContainText('Welcome to the-internet');
    
    // Class selectors
    const listItems = page.locator('.large-2.columns');
    await expect(listItems.first()).toBeVisible();
    
    // Attribute selectors
    const links = page.locator('a[href*="/login"]');
    await expect(links).toBeVisible();
    
    // Pseudo-selectors
    const firstLink = page.locator('ul li:first-child a');
    await expect(firstLink).toBeVisible();
    
    console.log('✅ Basic CSS selectors working correctly');
  });

  test('Advanced CSS Selector Techniques', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <nav class="main-nav">
            <ul class="nav-list">
              <li class="nav-item active"><a href="/home">Home</a></li>
              <li class="nav-item"><a href="/about">About</a></li>
              <li class="nav-item"><a href="/contact">Contact</a></li>
            </ul>
          </nav>
          <main class="content">
            <div class="card featured">
              <h2>Featured Article</h2>
              <p>This is a featured article.</p>
              <button class="btn btn-primary">Read More</button>
            </div>
            <div class="card">
              <h2>Regular Article</h2>
              <p>This is a regular article.</p>
              <button class="btn btn-secondary">Read More</button>
            </div>
          </main>
        </body>
      </html>
    `);
    
    console.log('Testing advanced CSS selector techniques');
    
    // Descendant selectors
    const navLinks = page.locator('.main-nav a');
    await expect(navLinks).toHaveCount(3);
    
    // Child selectors
    const directNavItems = page.locator('.nav-list > .nav-item');
    await expect(directNavItems).toHaveCount(3);
    
    // Multiple class selectors
    const featuredCard = page.locator('.card.featured');
    await expect(featuredCard).toBeVisible();
    
    // Attribute value matching
    const primaryButton = page.locator('[class*="btn-primary"]');
    await expect(primaryButton).toContainText('Read More');
    
    // Complex combinations
    const activeNavLink = page.locator('.nav-item.active a');
    await expect(activeNavLink).toContainText('Home');
    
    console.log('✅ Advanced CSS selectors working correctly');
  });
});

test.describe('Dynamic Content Handling', () => {
  
  test('Flexible Attribute Matching', async ({ page }) => {
    // Create dynamic content simulation
    await page.setContent(`
      <html>
        <body>
          <div id="user-123" class="user-card active">John Doe</div>
          <div id="user-456" class="user-card">Jane Smith</div>
          <div id="user-789" class="user-card inactive">Bob Johnson</div>
          <button data-order-id="ORD-2024-001" class="order-btn">Order #2024-001</button>
          <button data-order-id="ORD-2024-002" class="order-btn">Order #2024-002</button>
        </body>
      </html>
    `);
    
    console.log('Testing flexible attribute matching for dynamic content');
    
    // Find elements with dynamic IDs using partial matching
    const userCards = page.locator('[id*="user-"]');
    await expect(userCards).toHaveCount(3);
    
    // Find active user card
    const activeUser = page.locator('[id*="user-"].active');
    await expect(activeUser).toContainText('John Doe');
    
    // Find order buttons with dynamic order IDs
    const orderButtons = page.locator('[data-order-id^="ORD-"]');
    await expect(orderButtons).toHaveCount(2);
    
    // Find specific order by partial ID
    const specificOrder = page.locator('[data-order-id*="2024-001"]');
    await expect(specificOrder).toContainText('Order #2024-001');
    
    console.log('✅ Flexible attribute matching handles dynamic content');
  });

  test('Chaining and Filtering Locators', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <div class="product-grid">
            <div class="product-card">
              <h3>Laptop</h3>
              <span class="price">$999</span>
              <span class="stock in-stock">In Stock</span>
              <button class="buy-btn">Buy Now</button>
            </div>
            <div class="product-card">
              <h3>Phone</h3>
              <span class="price">$699</span>
              <span class="stock out-of-stock">Out of Stock</span>
              <button class="buy-btn" disabled>Buy Now</button>
            </div>
            <div class="product-card">
              <h3>Tablet</h3>
              <span class="price">$399</span>
              <span class="stock in-stock">In Stock</span>
              <button class="buy-btn">Buy Now</button>
            </div>
          </div>
        </body>
      </html>
    `);
    
    console.log('Testing locator chaining and filtering');
    
    // Chain locators for precision
    const laptopBuyButton = page.locator('.product-card')
      .filter({ hasText: 'Laptop' })
      .locator('.buy-btn');
    
    await expect(laptopBuyButton).toBeEnabled();
    await laptopBuyButton.click();
    
    // Use multiple filters
    const inStockProducts = page.locator('.product-card')
      .filter({ has: page.locator('.in-stock') });
    
    await expect(inStockProducts).toHaveCount(2);
    
    // Complex filtering with text and element presence
    const availableExpensiveProduct = page.locator('.product-card')
      .filter({ has: page.locator('.in-stock') })
      .filter({ hasText: '$999' });
    
    await expect(availableExpensiveProduct).toContainText('Laptop');
    
    console.log('✅ Locator chaining and filtering working correctly');
  });
});

test.describe('Locator Performance and Best Practices', () => {
  
  test('Locator Caching and Reuse', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/');
    
    console.log('Testing locator caching and reuse patterns');
    
    // Cache frequently used locators
    const todoInput = page.getByRole('textbox', { name: 'What needs to be done?' });
    const todoList = page.locator('.todo-list');
    const clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
    
    // Reuse cached locators multiple times
    await todoInput.fill('First task');
    await todoInput.press('Enter');
    
    await todoInput.fill('Second task');
    await todoInput.press('Enter');
    
    await todoInput.fill('Third task');
    await todoInput.press('Enter');
    
    // Verify using cached locator
    await expect(todoList.locator('li')).toHaveCount(3);
    
    // Mark first task as completed
    await todoList.locator('li').first().locator('input[type="checkbox"]').check();
    
    // Use cached clear button
    await clearCompletedButton.click();
    
    // Verify remaining tasks
    await expect(todoList.locator('li')).toHaveCount(2);
    
    console.log('✅ Locator caching improves performance and readability');
  });

  test('Locator Debugging and Validation', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/');
    
    console.log('Testing locator debugging and validation techniques');
    
    // Test locator existence before interaction
    const todoInput = page.getByRole('textbox', { name: 'What needs to be done?' });
    
    // Validate locator finds exactly one element
    await expect(todoInput).toHaveCount(1);
    await expect(todoInput).toBeVisible();
    await expect(todoInput).toBeEditable();
    
    // Test multiple element locators
    await todoInput.fill('Debug test 1');
    await todoInput.press('Enter');
    await todoInput.fill('Debug test 2');
    await todoInput.press('Enter');
    
    const todoItems = page.locator('.todo-list li');
    await expect(todoItems).toHaveCount(2);
    
    // Validate specific elements in the list
    await expect(todoItems.first()).toContainText('Debug test 1');
    await expect(todoItems.last()).toContainText('Debug test 2');
    
    console.log('✅ Locator debugging and validation successful');
  });
});

/**
 * Summary of Locator Strategies Demonstrated:
 * 
 * 1. Built-in Locators (Preferred):
 *    - getByRole() - Semantic, accessibility-focused
 *    - getByText() - Content-based selection
 *    - getByLabel() - Form element targeting
 *    - getByPlaceholder() - Input field helper
 *    - getByTestId() - Developer-friendly targeting
 * 
 * 2. CSS Selectors:
 *    - Basic patterns (element, class, ID, attribute)
 *    - Advanced techniques (descendant, child, pseudo-selectors)
 *    - Complex combinations and multiple conditions
 * 
 * 3. Dynamic Content Handling:
 *    - Flexible attribute matching with wildcards
 *    - Locator chaining and filtering
 *    - Multiple filter conditions
 * 
 * 4. Best Practices:
 *    - Locator caching and reuse
 *    - Validation and debugging
 *    - Performance optimization
 * 
 * Key Takeaways:
 * - Prefer built-in locators for semantic, user-centric selection
 * - Use CSS selectors for complex scenarios
 * - Handle dynamic content with flexible matching
 * - Cache locators for better performance
 * - Always validate locators before interaction
 */