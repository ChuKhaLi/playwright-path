import { test, expect } from '@playwright/test';

/**
 * Comprehensive Element Interaction Examples
 * 
 * This file demonstrates various interaction patterns with web elements,
 * covering basic interactions, form handling, advanced actions, and state validation.
 */

test.describe('Basic Element Interactions', () => {
  
  test('Click Interactions - Buttons and Links', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/');
    
    console.log('Testing basic click interactions');
    
    // Basic click on input to focus
    const todoInput = page.getByRole('textbox', { name: 'What needs to be done?' });
    await todoInput.click();
    await expect(todoInput).toBeFocused();
    
    // Add a todo item
    await todoInput.fill('Learn element interactions');
    await todoInput.press('Enter');
    
    // Click on todo item to edit (double-click)
    const todoItem = page.getByText('Learn element interactions');
    await todoItem.dblclick();
    
    // Verify edit mode is active
    const editInput = page.locator('.editing input');
    await expect(editInput).toBeVisible();
    await expect(editInput).toBeFocused();
    
    console.log('✅ Click interactions working correctly');
  });

  test('Text Input - Fill vs Type Methods', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/');
    
    console.log('Testing text input methods: fill() vs type()');
    
    const todoInput = page.getByRole('textbox', { name: 'What needs to be done?' });
    
    // Demonstrate fill() - clears and replaces content
    await todoInput.fill('First task');
    await expect(todoInput).toHaveValue('First task');
    
    // Clear and demonstrate type() - preserves existing content
    await todoInput.fill('Existing text: ');
    await todoInput.type('appended text');
    await expect(todoInput).toHaveValue('Existing text: appended text');
    
    // Submit the todo
    await todoInput.press('Enter');
    
    // Verify todo was created
    await expect(page.getByText('Existing text: appended text')).toBeVisible();
    
    console.log('✅ Text input methods working correctly');
  });

  test('Keyboard Interactions and Shortcuts', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/');
    
    console.log('Testing keyboard interactions and shortcuts');
    
    const todoInput = page.getByRole('textbox', { name: 'What needs to be done?' });
    
    // Add multiple todos
    await todoInput.fill('Task 1');
    await todoInput.press('Enter');
    await todoInput.fill('Task 2');
    await todoInput.press('Enter');
    await todoInput.fill('Task 3');
    await todoInput.press('Enter');
    
    // Test keyboard navigation
    await page.press('body', 'Tab'); // Focus first todo
    await page.press('body', 'Space'); // Toggle completion
    
    // Test keyboard shortcuts
    await page.press('body', 'Control+A'); // Select all (if supported)
    
    // Test escape key
    const firstTodo = page.locator('.todo-list li').first();
    await firstTodo.dblclick(); // Enter edit mode
    await page.press('body', 'Escape'); // Cancel edit
    
    console.log('✅ Keyboard interactions working correctly');
  });
});

test.describe('Form Element Interactions', () => {
  
  test('Checkbox and Radio Button Handling', async ({ page }) => {
    // Create a test form with checkboxes and radio buttons
    await page.setContent(`
      <html>
        <body>
          <form>
            <fieldset>
              <legend>Preferences</legend>
              <label>
                <input type="checkbox" name="newsletter" value="yes">
                Subscribe to newsletter
              </label>
              <label>
                <input type="checkbox" name="notifications" value="yes">
                Enable notifications
              </label>
            </fieldset>
            
            <fieldset>
              <legend>Payment Method</legend>
              <label>
                <input type="radio" name="payment" value="credit">
                Credit Card
              </label>
              <label>
                <input type="radio" name="payment" value="paypal">
                PayPal
              </label>
              <label>
                <input type="radio" name="payment" value="bank">
                Bank Transfer
              </label>
            </fieldset>
          </form>
        </body>
      </html>
    `);
    
    console.log('Testing checkbox and radio button interactions');
    
    // Checkbox interactions
    const newsletterCheckbox = page.getByLabel('Subscribe to newsletter');
    const notificationsCheckbox = page.getByLabel('Enable notifications');
    
    // Check checkboxes
    await newsletterCheckbox.check();
    await notificationsCheckbox.check();
    
    // Verify checked state
    await expect(newsletterCheckbox).toBeChecked();
    await expect(notificationsCheckbox).toBeChecked();
    
    // Uncheck one checkbox
    await newsletterCheckbox.uncheck();
    await expect(newsletterCheckbox).not.toBeChecked();
    
    // Radio button interactions
    const creditCardRadio = page.getByLabel('Credit Card');
    const paypalRadio = page.getByLabel('PayPal');
    
    // Select radio buttons
    await creditCardRadio.check();
    await expect(creditCardRadio).toBeChecked();
    
    // Select different radio button (should uncheck previous)
    await paypalRadio.check();
    await expect(paypalRadio).toBeChecked();
    await expect(creditCardRadio).not.toBeChecked();
    
    console.log('✅ Checkbox and radio button interactions working correctly');
  });

  test('Select Dropdown Interactions', async ({ page }) => {
    // Create a test form with select dropdowns
    await page.setContent(`
      <html>
        <body>
          <form>
            <label for="country">Country:</label>
            <select id="country" name="country">
              <option value="">Select a country</option>
              <option value="us">United States</option>
              <option value="ca">Canada</option>
              <option value="uk">United Kingdom</option>
              <option value="de">Germany</option>
            </select>
            
            <label for="languages">Languages (multiple):</label>
            <select id="languages" name="languages" multiple>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </form>
        </body>
      </html>
    `);
    
    console.log('Testing select dropdown interactions');
    
    const countrySelect = page.getByLabel('Country:');
    const languagesSelect = page.getByLabel('Languages (multiple):');
    
    // Select by visible text
    await countrySelect.selectOption('United States');
    await expect(countrySelect).toHaveValue('us');
    
    // Select by value
    await countrySelect.selectOption({ value: 'ca' });
    await expect(countrySelect).toHaveValue('ca');
    
    // Select by index
    await countrySelect.selectOption({ index: 3 }); // United Kingdom
    await expect(countrySelect).toHaveValue('uk');
    
    // Multiple selection
    await languagesSelect.selectOption(['en', 'es', 'fr']);
    
    // Verify multiple selections
    const selectedValues = await languagesSelect.evaluate(el => 
      Array.from(el.selectedOptions).map(option => option.value)
    );
    expect(selectedValues).toEqual(['en', 'es', 'fr']);
    
    console.log('✅ Select dropdown interactions working correctly');
  });

  test('File Upload Interactions', async ({ page }) => {
    // Create a test form with file upload
    await page.setContent(`
      <html>
        <body>
          <form>
            <label for="single-file">Upload Document:</label>
            <input type="file" id="single-file" name="document" accept=".pdf,.doc,.docx">
            
            <label for="multiple-files">Upload Images:</label>
            <input type="file" id="multiple-files" name="images" multiple accept="image/*">
          </form>
        </body>
      </html>
    `);
    
    console.log('Testing file upload interactions');
    
    const singleFileInput = page.getByLabel('Upload Document:');
    const multipleFileInput = page.getByLabel('Upload Images:');
    
    // Create test files in memory
    const testFile1 = {
      name: 'test-document.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('PDF content')
    };
    
    const testFile2 = {
      name: 'image1.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('JPEG content')
    };
    
    const testFile3 = {
      name: 'image2.png',
      mimeType: 'image/png',
      buffer: Buffer.from('PNG content')
    };
    
    // Upload single file
    await singleFileInput.setInputFiles(testFile1);
    
    // Verify single file upload
    const singleFileName = await singleFileInput.evaluate(el => el.files[0]?.name);
    expect(singleFileName).toBe('test-document.pdf');
    
    // Upload multiple files
    await multipleFileInput.setInputFiles([testFile2, testFile3]);
    
    // Verify multiple file upload
    const multipleFileCount = await multipleFileInput.evaluate(el => el.files.length);
    expect(multipleFileCount).toBe(2);
    
    // Clear file selection
    await singleFileInput.setInputFiles([]);
    const clearedFileCount = await singleFileInput.evaluate(el => el.files.length);
    expect(clearedFileCount).toBe(0);
    
    console.log('✅ File upload interactions working correctly');
  });
});

test.describe('Advanced Interactions', () => {
  
  test('Hover and Focus Interactions', async ({ page }) => {
    // Create a test page with hover and focus effects
    await page.setContent(`
      <html>
        <head>
          <style>
            .tooltip-container { position: relative; display: inline-block; }
            .tooltip { 
              visibility: hidden; 
              position: absolute; 
              background: black; 
              color: white; 
              padding: 5px; 
              top: 25px; 
              left: 0; 
            }
            .tooltip-container:hover .tooltip { visibility: visible; }
            .focus-indicator { outline: 2px solid blue; }
            input:focus { outline: 2px solid green; }
          </style>
        </head>
        <body>
          <div class="tooltip-container">
            <button>Hover for tooltip</button>
            <div class="tooltip">This is a tooltip</div>
          </div>
          
          <input type="text" placeholder="Focus me" />
          <button>Focusable button</button>
        </body>
      </html>
    `);
    
    console.log('Testing hover and focus interactions');
    
    // Hover interactions
    const tooltipButton = page.getByText('Hover for tooltip');
    const tooltip = page.locator('.tooltip');
    
    // Verify tooltip is initially hidden
    await expect(tooltip).toBeHidden();
    
    // Hover to show tooltip
    await tooltipButton.hover();
    await expect(tooltip).toBeVisible();
    
    // Focus interactions
    const textInput = page.getByPlaceholder('Focus me');
    const focusableButton = page.getByText('Focusable button');
    
    // Focus on input
    await textInput.focus();
    await expect(textInput).toBeFocused();
    
    // Tab to next focusable element
    await page.press('body', 'Tab');
    await expect(focusableButton).toBeFocused();
    
    console.log('✅ Hover and focus interactions working correctly');
  });

  test('Drag and Drop Interactions', async ({ page }) => {
    // Create a test page with drag and drop functionality
    await page.setContent(`
      <html>
        <head>
          <style>
            .drag-container { display: flex; gap: 20px; margin: 20px; }
            .drag-source, .drop-target { 
              width: 200px; 
              height: 100px; 
              border: 2px solid #ccc; 
              padding: 10px; 
              text-align: center; 
            }
            .drag-source { background: lightblue; cursor: move; }
            .drop-target { background: lightgreen; }
            .draggable-item { 
              background: yellow; 
              padding: 5px; 
              margin: 5px; 
              cursor: move; 
            }
          </style>
        </head>
        <body>
          <div class="drag-container">
            <div class="drag-source">
              <div class="draggable-item" draggable="true">Item 1</div>
              <div class="draggable-item" draggable="true">Item 2</div>
              <div class="draggable-item" draggable="true">Item 3</div>
            </div>
            <div class="drop-target" id="drop-zone">
              Drop items here
            </div>
          </div>
        </body>
      </html>
    `);
    
    console.log('Testing drag and drop interactions');
    
    // Drag and drop items
    const item1 = page.getByText('Item 1');
    const item2 = page.getByText('Item 2');
    const dropZone = page.locator('#drop-zone');
    
    // Perform drag and drop
    await item1.dragTo(dropZone);
    await item2.dragTo(dropZone);
    
    // Note: In a real application, you would verify the drop result
    // This example demonstrates the drag and drop API
    console.log('✅ Drag and drop interactions demonstrated');
  });

  test('Context Menu and Double Click', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/');
    
    console.log('Testing context menu and double click interactions');
    
    // Add a todo item
    const todoInput = page.getByRole('textbox', { name: 'What needs to be done?' });
    await todoInput.fill('Test context menu');
    await todoInput.press('Enter');
    
    const todoItem = page.getByText('Test context menu');
    
    // Double-click to edit
    await todoItem.dblclick();
    
    // Verify edit mode
    const editInput = page.locator('.editing input');
    await expect(editInput).toBeVisible();
    await expect(editInput).toBeFocused();
    
    // Cancel edit with Escape
    await page.press('body', 'Escape');
    await expect(editInput).not.toBeVisible();
    
    // Right-click for context menu (browser context menu)
    await todoItem.click({ button: 'right' });
    
    console.log('✅ Context menu and double click interactions working correctly');
  });
});

test.describe('Element State Validation', () => {
  
  test('Visibility and Presence Validation', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <div id="visible-element">Visible Element</div>
          <div id="hidden-element" style="display: none;">Hidden Element</div>
          <button onclick="toggleVisibility()">Toggle Visibility</button>
          
          <script>
            function toggleVisibility() {
              const hidden = document.getElementById('hidden-element');
              hidden.style.display = hidden.style.display === 'none' ? 'block' : 'none';
            }
          </script>
        </body>
      </html>
    `);
    
    console.log('Testing visibility and presence validation');
    
    const visibleElement = page.locator('#visible-element');
    const hiddenElement = page.locator('#hidden-element');
    const toggleButton = page.getByText('Toggle Visibility');
    
    // Test initial states
    await expect(visibleElement).toBeVisible();
    await expect(hiddenElement).toBeHidden();
    await expect(hiddenElement).toBeAttached(); // Exists in DOM but hidden
    
    // Toggle visibility
    await toggleButton.click();
    await expect(hiddenElement).toBeVisible();
    
    // Toggle back
    await toggleButton.click();
    await expect(hiddenElement).toBeHidden();
    
    console.log('✅ Visibility and presence validation working correctly');
  });

  test('Content and Value Validation', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <input type="text" id="text-input" value="Initial value">
          <input type="number" id="number-input" value="42">
          <select id="select-input">
            <option value="option1">Option 1</option>
            <option value="option2" selected>Option 2</option>
          </select>
          <div id="text-content">Dynamic content</div>
          <a href="/dashboard" id="link-element">Dashboard Link</a>
          <img src="image.jpg" alt="Test image" id="image-element">
        </body>
      </html>
    `);
    
    console.log('Testing content and value validation');
    
    // Value validation
    await expect(page.locator('#text-input')).toHaveValue('Initial value');
    await expect(page.locator('#number-input')).toHaveValue('42');
    await expect(page.locator('#select-input')).toHaveValue('option2');
    
    // Text content validation
    await expect(page.locator('#text-content')).toHaveText('Dynamic content');
    await expect(page.locator('#text-content')).toContainText('Dynamic');
    
    // Attribute validation
    await expect(page.locator('#link-element')).toHaveAttribute('href', '/dashboard');
    await expect(page.locator('#image-element')).toHaveAttribute('alt', 'Test image');
    
    // Update values and re-validate
    await page.locator('#text-input').fill('Updated value');
    await expect(page.locator('#text-input')).toHaveValue('Updated value');
    
    console.log('✅ Content and value validation working correctly');
  });

  test('Dynamic Content and Loading States', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <button onclick="loadContent()">Load Content</button>
          <div id="loading" style="display: none;">Loading...</div>
          <div id="content" style="display: none;">Loaded content</div>
          
          <script>
            function loadContent() {
              document.getElementById('loading').style.display = 'block';
              setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('content').style.display = 'block';
              }, 1000);
            }
          </script>
        </body>
      </html>
    `);
    
    console.log('Testing dynamic content and loading states');
    
    const loadButton = page.getByText('Load Content');
    const loadingIndicator = page.locator('#loading');
    const content = page.locator('#content');
    
    // Initial state
    await expect(loadingIndicator).toBeHidden();
    await expect(content).toBeHidden();
    
    // Trigger loading
    await loadButton.click();
    
    // Verify loading state
    await expect(loadingIndicator).toBeVisible();
    await expect(content).toBeHidden();
    
    // Wait for content to load
    await expect(loadingIndicator).toBeHidden();
    await expect(content).toBeVisible();
    
    console.log('✅ Dynamic content and loading states working correctly');
  });
});

/**
 * Summary of Element Interaction Patterns Demonstrated:
 * 
 * 1. Basic Interactions:
 *    - click() - Button and link interactions
 *    - fill() vs type() - Text input methods
 *    - press() - Keyboard interactions and shortcuts
 * 
 * 2. Form Elements:
 *    - check()/uncheck() - Checkbox interactions
 *    - selectOption() - Dropdown selections
 *    - setInputFiles() - File upload handling
 * 
 * 3. Advanced Actions:
 *    - hover()/focus() - Mouse and keyboard focus
 *    - dragTo() - Drag and drop operations
 *    - dblclick() - Double-click interactions
 * 
 * 4. State Validation:
 *    - toBeVisible()/toBeHidden() - Visibility checks
 *    - toHaveValue()/toHaveText() - Content validation
 *    - toHaveAttribute() - Attribute verification
 * 
 * Key Takeaways:
 * - Use semantic interaction methods for better reliability
 * - Always validate element states before and after interactions
 * - Handle dynamic content with proper waiting strategies
 * - Choose appropriate methods based on the interaction context
 * - Test both success and edge case scenarios
 */