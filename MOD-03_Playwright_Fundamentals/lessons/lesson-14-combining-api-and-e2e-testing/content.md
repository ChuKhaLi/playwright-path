# Lesson 14: Combining API and E2E Testing - Detailed Content ⭐ **INTEGRATION FOCUS**

## 🎯 Mastering Hybrid Testing Strategies

This lesson provides comprehensive coverage of integrating API and E2E testing approaches, demonstrating how to create powerful, efficient test suites that leverage the strengths of both methodologies.

## 🔄 The Integration Mindset

### **Understanding the Synergy**

API and E2E testing aren't competing approaches—they're complementary strategies that together provide comprehensive application validation:

```
┌─────────────────────────────────────────────────────────────┐
│                    Testing Layer Synergy                    │
├─────────────────────────────────────────────────────────────┤
│  API Layer          │  Integration Layer  │  UI Layer       │
│  ─────────          │  ─────────────────  │  ────────       │
│  • Data validation  │  • State consistency│  • User experience│
│  • Business logic   │  • Cross-layer sync │  • Visual validation│
│  • Performance      │  • Authentication   │  • Workflow testing│
│  • Error handling   │  • Session sharing  │  • Browser compat │
└─────────────────────────────────────────────────────────────┘
```

### **Strategic Test Distribution**

**The 70-20-10 Rule for Hybrid Testing**:
- **70% API Tests**: Fast, reliable validation of business logic
- **20% Integration Tests**: Cross-layer validation and data consistency
- **10% Pure E2E Tests**: Critical user journeys and visual validation

## 🏗️ Advanced Integration Patterns

### **Pattern 1: API-First Test Design**

```typescript
import { test, expect } from '@playwright/test';

class APIFirstTestPattern {
  static async setupTestEnvironment(request: APIRequestContext) {
    // Create comprehensive test environment via API
    const environment = {
      users: [],
      products: [],
      orders: [],
      categories: []
    };
    
    // Create test users with different roles
    const userTypes = [
      { role: 'admin', name: 'Admin User', email: 'admin@test.com' },
      { role: 'customer', name: 'Customer User', email: 'customer@test.com' },
      { role: 'vendor', name: 'Vendor User', email: 'vendor@test.com' }
    ];
    
    for (const userType of userTypes) {
      const response = await request.post('/api/users', {
        data: {
          ...userType,
          password: 'password123',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      });
      
      const user = await response.json();
      environment.users.push({ ...user, role: userType.role });
    }
    
    // Create product categories
    const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden'];
    for (const categoryName of categories) {
      const response = await request.post('/api/categories', {
        data: {
          name: categoryName,
          description: `${categoryName} category for testing`,
          isActive: true
        }
      });
      
      const category = await response.json();
      environment.categories.push(category);
    }
    
    // Create products for each category
    for (const category of environment.categories) {
      for (let i = 1; i <= 3; i++) {
        const response = await request.post('/api/products', {
          data: {
            name: `${category.name} Product ${i}`,
            description: `Test product ${i} in ${category.name}`,
            price: Math.floor(Math.random() * 100) + 10,
            stock: Math.floor(Math.random() * 50) + 5,
            categoryId: category.id,
            isActive: true
          }
        });
        
        const product = await response.json();
        environment.products.push(product);
      }
    }
    
    return environment;
  }
  
  static async validateEnvironmentConsistency(
    request: APIRequestContext,
    page: Page,
    environment: any
  ) {
    // API Validation
    const apiUsers = await request.get('/api/users');
    const apiProducts = await request.get('/api/products');
    const apiCategories = await request.get('/api/categories');
    
    const apiData = {
      users: await apiUsers.json(),
      products: await apiProducts.json(),
      categories: await apiCategories.json()
    };
    
    // UI Validation
    await page.goto('/admin/dashboard');
    
    const uiStats = await page.evaluate(() => {
      return {
        userCount: parseInt(document.querySelector('[data-testid="user-count"]')?.textContent || '0'),
        productCount: parseInt(document.querySelector('[data-testid="product-count"]')?.textContent || '0'),
        categoryCount: parseInt(document.querySelector('[data-testid="category-count"]')?.textContent || '0')
      };
    });
    
    // Cross-validation
    expect(apiData.users.length).toBe(uiStats.userCount);
    expect(apiData.products.length).toBe(uiStats.productCount);
    expect(apiData.categories.length).toBe(uiStats.categoryCount);
    
    console.log('✅ Environment consistency validated across API and UI');
    return { api: apiData, ui: uiStats, consistent: true };
  }
}

test.describe('API-First Integration Pattern', () => {
  let testEnvironment: any;
  
  test.beforeAll(async ({ request }) => {
    console.log('🔧 Setting up comprehensive test environment...');
    testEnvironment = await APIFirstTestPattern.setupTestEnvironment(request);
    console.log(`Created ${testEnvironment.users.length} users, ${testEnvironment.products.length} products, ${testEnvironment.categories.length} categories`);
  });
  
  test('should validate complete e-commerce workflow', async ({ request, page }) => {
    // Step 1: Validate environment consistency
    await APIFirstTestPattern.validateEnvironmentConsistency(request, page, testEnvironment);
    
    // Step 2: Customer journey via E2E
    const customer = testEnvironment.users.find(u => u.role === 'customer');
    const product = testEnvironment.products[0];
    
    // Login via UI
    await page.goto('/login');
    await page.getByLabel('Email').fill(customer.email);
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Browse products
    await page.goto('/products');
    await page.getByText(product.name).click();
    
    // Add to cart
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await expect(page.getByText('Added to cart')).toBeVisible();
    
    // Proceed to checkout
    await page.getByRole('link', { name: 'Cart' }).click();
    await page.getByRole('button', { name: 'Checkout' }).click();
    
    // Complete order
    await page.getByLabel('Shipping Address').fill('123 Test Street, Test City');
    await page.getByRole('button', { name: 'Place Order' }).click();
    
    const orderConfirmation = await page.getByTestId('order-number').textContent();
    
    // Step 3: API validation of order
    const orderResponse = await request.get(`/api/orders/${orderConfirmation}`);
    const order = await orderResponse.json();
    
    expect(order.customerId).toBe(customer.id);
    expect(order.items[0].productId).toBe(product.id);
    expect(order.status).toBe('confirmed');
    
    // Step 4: Validate inventory update
    const updatedProductResponse = await request.get(`/api/products/${product.id}`);
    const updatedProduct = await updatedProductResponse.json();
    
    expect(updatedProduct.stock).toBe(product.stock - 1);
    
    console.log('✅ Complete e-commerce workflow validated across all layers');
  });
});
```

### **Pattern 2: State Synchronization Testing**

```typescript
class StateSynchronizationTester {
  static async testRealTimeUpdates(
    request: APIRequestContext,
    page: Page,
    userId: number
  ) {
    console.log('🔄 Testing real-time state synchronization...');
    
    // Setup: Open user profile page
    await page.goto(`/users/${userId}/profile`);
    
    // Get initial state from both layers
    const initialApiResponse = await request.get(`/api/users/${userId}`);
    const initialApiUser = await initialApiResponse.json();
    
    const initialUiName = await page.getByTestId('profile-name').textContent();
    const initialUiEmail = await page.getByTestId('profile-email').textContent();
    
    // Verify initial consistency
    expect(initialApiUser.name).toBe(initialUiName);
    expect(initialApiUser.email).toBe(initialUiEmail);
    
    // Test 1: Update via API, verify UI reflects change
    console.log('📡 Testing API → UI synchronization...');
    
    const apiUpdate = {
      name: `${initialApiUser.name} (Updated via API)`,
      bio: 'Updated bio via API call'
    };
    
    await request.patch(`/api/users/${userId}`, { data: apiUpdate });
    
    // Wait for UI to reflect API changes (assuming real-time updates)
    await page.waitForFunction(
      (expectedName) => {
        const nameElement = document.querySelector('[data-testid="profile-name"]');
        return nameElement?.textContent === expectedName;
      },
      apiUpdate.name,
      { timeout: 5000 }
    );
    
    const updatedUiName = await page.getByTestId('profile-name').textContent();
    const updatedUiBio = await page.getByTestId('profile-bio').textContent();
    
    expect(updatedUiName).toBe(apiUpdate.name);
    expect(updatedUiBio).toBe(apiUpdate.bio);
    
    // Test 2: Update via UI, verify API reflects change
    console.log('🎭 Testing UI → API synchronization...');
    
    const uiUpdate = {
      name: `${apiUpdate.name} (Updated via UI)`,
      bio: 'Updated bio via UI interaction'
    };
    
    await page.getByRole('button', { name: 'Edit Profile' }).click();
    await page.getByLabel('Name').fill(uiUpdate.name);
    await page.getByLabel('Bio').fill(uiUpdate.bio);
    await page.getByRole('button', { name: 'Save Changes' }).click();
    
    // Verify UI update
    await expect(page.getByText('Profile updated successfully')).toBeVisible();
    
    // Verify API reflects the change
    const finalApiResponse = await request.get(`/api/users/${userId}`);
    const finalApiUser = await finalApiResponse.json();
    
    expect(finalApiUser.name).toBe(uiUpdate.name);
    expect(finalApiUser.bio).toBe(uiUpdate.bio);
    
    // Test 3: Concurrent updates handling
    console.log('⚡ Testing concurrent update handling...');
    
    const concurrentUpdates = await Promise.allSettled([
      // API update
      request.patch(`/api/users/${userId}`, {
        data: { lastLoginAt: new Date().toISOString() }
      }),
      
      // UI update
      page.evaluate(() => {
        // Simulate UI action that triggers an update
        const event = new CustomEvent('profileUpdate', {
          detail: { field: 'preferences', value: { theme: 'dark' } }
        });
        document.dispatchEvent(event);
      })
    ]);
    
    // Verify both updates were handled
    const concurrentApiResponse = await request.get(`/api/users/${userId}`);
    const concurrentApiUser = await concurrentApiResponse.json();
    
    expect(concurrentApiUser.lastLoginAt).toBeTruthy();
    expect(concurrentApiUser.preferences?.theme).toBe('dark');
    
    console.log('✅ State synchronization testing completed');
  }
  
  static async testDataConsistencyAcrossMultipleSessions(
    request: APIRequestContext,
    context: BrowserContext,
    userId: number
  ) {
    console.log('👥 Testing multi-session data consistency...');
    
    // Create multiple pages (simulating different browser sessions)
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    // Setup authentication for both pages
    await this.setupAuthentication(page1, userId);
    await this.setupAuthentication(page2, userId);
    
    // Navigate both pages to user dashboard
    await Promise.all([
      page1.goto('/dashboard'),
      page2.goto('/dashboard')
    ]);
    
    // Get initial data from both sessions
    const [session1Data, session2Data] = await Promise.all([
      this.extractUserDataFromPage(page1),
      this.extractUserDataFromPage(page2)
    ]);
    
    // Verify initial consistency
    expect(session1Data.name).toBe(session2Data.name);
    expect(session1Data.email).toBe(session2Data.email);
    
    // Update user preferences in session 1
    await page1.getByRole('button', { name: 'Settings' }).click();
    await page1.getByLabel('Theme').selectOption('dark');
    await page1.getByRole('button', { name: 'Save Settings' }).click();
    
    // Verify API reflects the change
    const apiResponse = await request.get(`/api/users/${userId}`);
    const apiUser = await apiResponse.json();
    expect(apiUser.preferences.theme).toBe('dark');
    
    // Verify session 2 reflects the change (real-time sync)
    await page2.reload();
    const updatedSession2Theme = await page2.getByTestId('current-theme').textContent();
    expect(updatedSession2Theme).toBe('dark');
    
    // Cleanup
    await page1.close();
    await page2.close();
    
    console.log('✅ Multi-session consistency validated');
  }
  
  private static async setupAuthentication(page: Page, userId: number) {
    await page.addInitScript((id) => {
      localStorage.setItem('userId', id.toString());
      localStorage.setItem('authToken', `test-token-${id}`);
    }, userId);
  }
  
  private static async extractUserDataFromPage(page: Page) {
    return await page.evaluate(() => {
      return {
        name: document.querySelector('[data-testid="user-name"]')?.textContent || '',
        email: document.querySelector('[data-testid="user-email"]')?.textContent || '',
        theme: document.querySelector('[data-testid="current-theme"]')?.textContent || 'light'
      };
    });
  }
}
```

### **Pattern 3: Performance-Optimized Hybrid Testing**

```typescript
class PerformanceOptimizedTesting {
  static async benchmarkHybridApproaches(
    request: APIRequestContext,
    page: Page
  ) {
    console.log('⚡ Benchmarking hybrid testing approaches...');
    
    const results = {
      apiOnly: { time: 0, operations: 0 },
      e2eOnly: { time: 0, operations: 0 },
      hybrid: { time: 0, operations: 0 }
    };
    
    // Benchmark 1: API-Only Approach
    console.log('📡 Benchmarking API-only approach...');
    const apiStartTime = Date.now();
    
    // Create 10 users via API
    const apiUsers = [];
    for (let i = 0; i < 10; i++) {
      const response = await request.post('/api/users', {
        data: {
          name: `API User ${i}`,
          email: `apiuser${i}@test.com`,
          password: 'password123'
        }
      });
      apiUsers.push(await response.json());
    }
    
    // Validate all users via API
    for (const user of apiUsers) {
      const response = await request.get(`/api/users/${user.id}`);
      const userData = await response.json();
      expect(userData.name).toBe(user.name);
    }
    
    // Cleanup via API
    for (const user of apiUsers) {
      await request.delete(`/api/users/${user.id}`);
    }
    
    results.apiOnly.time = Date.now() - apiStartTime;
    results.apiOnly.operations = 30; // 10 creates + 10 reads + 10 deletes
    
    // Benchmark 2: E2E-Only Approach
    console.log('🎭 Benchmarking E2E-only approach...');
    const e2eStartTime = Date.now();
    
    // Create 3 users via E2E (fewer due to time constraints)
    const e2eUsers = [];
    for (let i = 0; i < 3; i++) {
      await page.goto('/register');
      await page.getByLabel('Name').fill(`E2E User ${i}`);
      await page.getByLabel('Email').fill(`e2euser${i}@test.com`);
      await page.getByLabel('Password').fill('password123');
      await page.getByRole('button', { name: 'Register' }).click();
      
      await expect(page.getByText('Registration successful')).toBeVisible();
      
      // Extract user ID from success message or URL
      const userId = await page.getByTestId('user-id').textContent();
      e2eUsers.push({ id: parseInt(userId), name: `E2E User ${i}` });
    }
    
    // Validate users via E2E
    for (const user of e2eUsers) {
      await page.goto(`/users/${user.id}`);
      await expect(page.getByText(user.name)).toBeVisible();
    }
    
    // Cleanup via E2E
    for (const user of e2eUsers) {
      await page.goto(`/users/${user.id}/settings`);
      await page.getByRole('button', { name: 'Delete Account' }).click();
      await page.getByRole('button', { name: 'Confirm Delete' }).click();
    }
    
    results.e2eOnly.time = Date.now() - e2eStartTime;
    results.e2eOnly.operations = 9; // 3 creates + 3 reads + 3 deletes
    
    // Benchmark 3: Hybrid Approach
    console.log('🔄 Benchmarking hybrid approach...');
    const hybridStartTime = Date.now();
    
    // Create users via API (fast setup)
    const hybridUsers = [];
    for (let i = 0; i < 10; i++) {
      const response = await request.post('/api/users', {
        data: {
          name: `Hybrid User ${i}`,
          email: `hybriduser${i}@test.com`,
          password: 'password123'
        }
      });
      hybridUsers.push(await response.json());
    }
    
    // Validate critical user journey via E2E (sample validation)
    const sampleUser = hybridUsers[0];
    await page.goto('/login');
    await page.getByLabel('Email').fill(sampleUser.email);
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await expect(page.getByText(`Welcome, ${sampleUser.name}`)).toBeVisible();
    
    // Validate remaining users via API (fast validation)
    for (let i = 1; i < hybridUsers.length; i++) {
      const response = await request.get(`/api/users/${hybridUsers[i].id}`);
      const userData = await response.json();
      expect(userData.name).toBe(hybridUsers[i].name);
    }
    
    // Cleanup via API (fast cleanup)
    for (const user of hybridUsers) {
      await request.delete(`/api/users/${user.id}`);
    }
    
    results.hybrid.time = Date.now() - hybridStartTime;
    results.hybrid.operations = 30; // 10 creates + 10 reads + 10 deletes + 1 E2E validation
    
    // Analysis
    console.log('\n📊 Performance Benchmark Results:');
    console.log(`API-Only: ${results.apiOnly.time}ms for ${results.apiOnly.operations} operations`);
    console.log(`E2E-Only: ${results.e2eOnly.time}ms for ${results.e2eOnly.operations} operations`);
    console.log(`Hybrid: ${results.hybrid.time}ms for ${results.hybrid.operations} operations`);
    
    const apiPerOp = results.apiOnly.time / results.apiOnly.operations;
    const e2ePerOp = results.e2eOnly.time / results.e2eOnly.operations;
    const hybridPerOp = results.hybrid.time / results.hybrid.operations;
    
    console.log(`\nTime per operation:`);
    console.log(`API-Only: ${apiPerOp.toFixed(2)}ms/op`);
    console.log(`E2E-Only: ${e2ePerOp.toFixed(2)}ms/op`);
    console.log(`Hybrid: ${hybridPerOp.toFixed(2)}ms/op`);
    
    // Efficiency analysis
    const hybridEfficiency = (apiPerOp / hybridPerOp) * 100;
    console.log(`\nHybrid approach is ${hybridEfficiency.toFixed(1)}% as efficient as pure API testing`);
    console.log(`But provides ${((results.hybrid.operations / results.e2eOnly.operations) * 100).toFixed(1)}% more coverage than pure E2E`);
    
    return results;
  }
  
  static async optimizeTestExecution(
    request: APIRequestContext,
    page: Page,
    testScenarios: any[]
  ) {
    console.log('🚀 Optimizing test execution with strategic approach selection...');
    
    const optimizedResults = [];
    
    for (const scenario of testScenarios) {
      const startTime = Date.now();
      
      switch (scenario.type) {
        case 'data-heavy':
          // Use API for data-heavy operations
          await this.executeDataHeavyScenario(request, scenario);
          break;
          
        case 'ui-critical':
          // Use E2E for UI-critical scenarios
          await this.executeUICriticalScenario(page, scenario);
          break;
          
        case 'integration':
          // Use hybrid approach for integration scenarios
          await this.executeIntegrationScenario(request, page, scenario);
          break;
          
        default:
          // Default to hybrid approach
          await this.executeHybridScenario(request, page, scenario);
      }
      
      const executionTime = Date.now() - startTime;
      optimizedResults.push({
        scenario: scenario.name,
        type: scenario.type,
        executionTime,
        approach: this.getOptimalApproach(scenario.type)
      });
    }
    
    // Report optimization results
    console.log('\n📈 Execution Optimization Results:');
    optimizedResults.forEach(result => {
      console.log(`${result.scenario}: ${result.executionTime}ms (${result.approach})`);
    });
    
    return optimizedResults;
  }
  
  private static async executeDataHeavyScenario(request: APIRequestContext, scenario: any) {
    // Optimized for bulk data operations
    const batchSize = 50;
    const batches = Math.ceil(scenario.dataCount / batchSize);
    
    for (let i = 0; i < batches; i++) {
      const batchData = scenario.data.slice(i * batchSize, (i + 1) * batchSize);
      await request.post('/api/batch', { data: { items: batchData } });
    }
  }
  
  private static async executeUICriticalScenario(page: Page, scenario: any) {
    // Optimized for UI validation
    await page.goto(scenario.url);
    
    for (const action of scenario.actions) {
      await this.executeUIAction(page, action);
    }
  }
  
  private static async executeIntegrationScenario(
    request: APIRequestContext,
    page: Page,
    scenario: any
  ) {
    // Setup via API
    const setupData = await request.post('/api/setup', { data: scenario.setup });
    const setup = await setupData.json();
    
    // Execute critical path via E2E
    await page.goto(scenario.url);
    await this.executeUIAction(page, scenario.criticalAction);
    
    // Validate via API
    const validation = await request.get(`/api/validate/${setup.id}`);
    expect(validation.status()).toBe(200);
  }
  
  private static async executeHybridScenario(
    request: APIRequestContext,
    page: Page,
    scenario: any
  ) {
    // Balanced approach
    if (scenario.setup) {
      await request.post('/api/setup', { data: scenario.setup });
    }
    
    if (scenario.uiActions) {
      await page.goto(scenario.url);
      for (const action of scenario.uiActions) {
        await this.executeUIAction(page, action);
      }
    }
    
    if (scenario.validation) {
      const validation = await request.get(scenario.validation.endpoint);
      expect(validation.status()).toBe(scenario.validation.expectedStatus);
    }
  }
  
  private static async executeUIAction(page: Page, action: any) {
    switch (action.type) {
      case 'click':
        await page.locator(action.selector).click();
        break;
      case 'fill':
        await page.locator(action.selector).fill(action.value);
        break;
      case 'select':
        await page.locator(action.selector).selectOption(action.value);
        break;
      case 'wait':
        await page.waitForSelector(action.selector);
        break;
    }
  }
  
  private static getOptimalApproach(scenarioType: string): string {
    const approaches = {
      'data-heavy': 'API-Optimized',
      'ui-critical': 'E2E-Focused',
      'integration': 'Hybrid-Balanced',
      'default': 'Hybrid-Strategic'
    };
    
    return approaches[scenarioType] || approaches.default;
  }
}
```

## 🔐 Advanced Authentication Integration

### **Seamless Authentication Sharing**

```typescript
class AuthenticationIntegrator {
  static async createUnifiedAuthSession(
    request: APIRequestContext,
    context: BrowserContext,
    credentials: { email: string; password: string }
  ) {
    console.log('🔐 Creating unified authentication session...');
    
    // Step 1: Authenticate via API
    const loginResponse = await request.post('/api/auth/login', {
      data: credentials
    });
    
    expect(loginResponse.status()).toBe(200);
    const authData = await loginResponse.json();
    
    // Step 2: Extract authentication tokens and cookies
    const authTokens = {
      accessToken: authData.accessToken,
      refreshToken: authData.refreshToken,
      sessionId: authData.sessionId,
      userId: authData.user.id
    };
    
    const cookieHeader = loginResponse.headers()['set-cookie'];
    const cookies = this.parseCookieHeader(cookieHeader);
    
    // Step 3: Setup browser context with authentication
    await context.addCookies(cookies);
    
    // Step 4: Add authentication to all pages in context
    await context.addInitScript((tokens) => {
      // Set localStorage tokens
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('sessionId', tokens.sessionId);
      localStorage.setItem('userId', tokens.userId.toString());
      
      // Set up automatic token refresh
      window.addEventListener('beforeunload', () => {
        // Cleanup logic if needed
      });
      
      // Intercept fetch requests to add authentication
      const originalFetch = window.fetch;
      window.fetch = function(url, options = {}) {
        const token = localStorage.getItem('accessToken');
        if (token && !options.headers?.['Authorization']) {
          options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
          };
        }
        return originalFetch(url, options);
      };
    }, authTokens);
    
    // Step 5: Configure request context with authentication
    const authenticatedRequest = request;
    
    // Override request methods to include authentication
    const originalGet = request.get.bind(request);
    const originalPost = request.post.bind(request);
    const originalPut = request.put.bind(request);
    const originalPatch = request.patch.bind(request);
    const originalDelete = request.delete.bind(request);
    
    // Add authentication headers to all requests
    const addAuthHeaders = (options: any = {}) => {
      return {
        ...options,
        headers: {
          'Authorization': `Bearer ${authTokens.accessToken}`,
          'X-Session-ID': authTokens.sessionId,
          ...options.headers
        }
      };
    };
    
    // Return authenticated request context
    return {
      request: {
        get: (url: string, options?: any) => originalGet(url, addAuthHeaders(options)),
        post: (url: string, options?: any) => originalPost(url, addAuthHeaders(options)),
        put: (url: string, options?: any) => originalPut(url, addAuthHeaders(options)),
        patch: (url: string, options?: any) => originalPatch(url, addAuthHeaders(options)),
        delete: (url: string, options?: any) => originalDelete(url, addAuthHeaders(options))
      },
      authData,
      tokens: authTokens
    };
  }
  
  static async validateAuthenticationConsistency(
    authenticatedRequest: any,
    page: Page,
    expectedUser: any
  ) {
    console.log('✅ Validating authentication consistency...');
    
    // API validation
    const apiProfileResponse = await authenticatedRequest.request.get('/api/user/profile');
    expect(apiProfileResponse.status()).toBe(200);
    const apiProfile = await apiProfileResponse.json();
    
    // UI validation
    await page.goto('/profile');
    const uiProfile = await page.evaluate(() => {
      return {
        name: document.querySelector('[data-testid="profile-name"]')?.textContent,
        email: document.querySelector('[data-testid="profile-email"]')?.textContent,
        id: localStorage.getItem('userId')
      };
    });
    
    // Cross-validation
    expect(apiProfile.id.toString()).toBe(uiProfile.id);
    expect(apiProfile.name).toBe(uiProfile.name);
    expect(apiProfile.email).toBe(uiProfile.email);
    expect(apiProfile.email).toBe(expectedUser