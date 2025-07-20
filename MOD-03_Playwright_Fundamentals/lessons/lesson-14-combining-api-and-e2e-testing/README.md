# Lesson 14: Combining API and E2E Testing ⭐ **INTEGRATION FOCUS**

## 🎯 Learning Objectives

By the end of this lesson, you will be able to:

- **LO-45**: Design tests that combine API and E2E approaches effectively
- **LO-46**: Use API calls to set up test data for E2E scenarios
- **LO-47**: Validate data consistency across API and UI layers
- **LO-48**: Implement efficient test workflows using both methodologies
- **LO-49**: Share authentication and session state between API and E2E tests
- **LO-50**: Create hybrid testing strategies for comprehensive coverage
- **LO-51**: Debug issues that span both API and UI layers
- **LO-52**: Optimize test execution by combining both approaches strategically

## 📚 Lesson Overview

**Duration**: 1-2 hours  
**Type**: Integration Focus  
**Prerequisites**: Lessons 01-13 (Complete Playwright fundamentals including API and E2E testing)

This lesson represents the culmination of your Playwright fundamentals journey, where you'll learn to combine API and E2E testing approaches into powerful, efficient testing strategies. You'll discover how these methodologies complement each other and create comprehensive test suites.

## 🔄 The Integration Advantage

### **Why Combine API and E2E Testing?**

**Comprehensive Coverage**:
- API tests validate business logic and data integrity
- E2E tests validate user experience and UI functionality
- Combined approach ensures complete application validation

**Efficiency Gains**:
- Use fast API calls for test data setup
- Validate backend changes with API tests
- Confirm UI behavior with targeted E2E tests
- Reduce overall test execution time

**Enhanced Reliability**:
- API tests provide stable foundation testing
- E2E tests catch integration and UI issues
- Cross-validation ensures data consistency
- Better debugging capabilities across layers

### **Integration Patterns**

```
┌─────────────────────────────────────────────────────────┐
│                 Hybrid Testing Strategy                 │
├─────────────────────────────────────────────────────────┤
│  1. API Setup    │  2. E2E Execution  │  3. API Cleanup │
│  - Create data   │  - User actions    │  - Remove data  │
│  - Set state     │  - UI validation   │  - Reset state  │
│  - Authenticate  │  - Workflows       │  - Logout       │
└─────────────────────────────────────────────────────────┘
```

## 🏗️ Hybrid Testing Architecture

### **Test Structure Patterns**

#### **Pattern 1: API Setup + E2E Validation**
```typescript
test('user registration flow with API setup', async ({ request, page }) => {
  // 1. API Setup - Fast data preparation
  const testUser = await createUserViaAPI(request);
  
  // 2. E2E Validation - User experience testing
  await page.goto('/login');
  await loginAsUser(page, testUser);
  await validateUserDashboard(page, testUser);
  
  // 3. API Cleanup - Fast cleanup
  await deleteUserViaAPI(request, testUser.id);
});
```

#### **Pattern 2: E2E Action + API Validation**
```typescript
test('product creation with cross-layer validation', async ({ request, page }) => {
  // 1. E2E Action - User creates product through UI
  await page.goto('/products/new');
  const productData = await createProductThroughUI(page);
  
  // 2. API Validation - Verify backend state
  const apiProduct = await getProductViaAPI(request, productData.id);
  expect(apiProduct).toMatchObject(productData);
  
  // 3. Cross-validation - Ensure UI and API consistency
  await validateProductInUI(page, apiProduct);
});
```

#### **Pattern 3: Parallel API + E2E Execution**
```typescript
test('parallel validation of user data', async ({ request, page }) => {
  const userId = 1;
  
  // Execute API and E2E tests in parallel
  const [apiUser, uiUser] = await Promise.all([
    getUserViaAPI(request, userId),
    getUserViaUI(page, userId)
  ]);
  
  // Cross-validate results
  expect(apiUser.name).toBe(uiUser.name);
  expect(apiUser.email).toBe(uiUser.email);
});
```

## 🔧 Practical Integration Examples

### **Example 1: E-commerce Order Flow**

```typescript
import { test, expect } from '@playwright/test';

test.describe('E-commerce Order Integration', () => {
  test('complete order flow with hybrid validation', async ({ request, page }) => {
    // Step 1: API Setup - Create test data
    console.log('🔧 Setting up test data via API...');
    
    const testProduct = await request.post('/api/products', {
      data: {
        name: 'Test Product',
        price: 29.99,
        stock: 10,
        category: 'electronics'
      }
    });
    const product = await testProduct.json();
    
    const testUser = await request.post('/api/users', {
      data: {
        name: 'Test Customer',
        email: 'customer@test.com',
        password: 'password123'
      }
    });
    const user = await testUser.json();
    
    // Step 2: E2E Flow - User journey through UI
    console.log('🎭 Executing user journey via E2E...');
    
    // Login
    await page.goto('/login');
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Browse and add to cart
    await page.goto(`/products/${product.id}`);
    await expect(page.getByText(product.name)).toBeVisible();
    await expect(page.getByText(`$${product.price}`)).toBeVisible();
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    
    // Checkout process
    await page.getByRole('link', { name: 'Cart' }).click();
    await page.getByRole('button', { name: 'Checkout' }).click();
    
    // Fill shipping information
    await page.getByLabel('Address').fill('123 Test Street');
    await page.getByLabel('City').fill('Test City');
    await page.getByLabel('Zip Code').fill('12345');
    
    // Complete order
    await page.getByRole('button', { name: 'Place Order' }).click();
    
    // Get order confirmation
    const orderConfirmation = await page.getByTestId('order-confirmation');
    await expect(orderConfirmation).toBeVisible();
    const orderNumber = await orderConfirmation.getByTestId('order-number').textContent();
    
    // Step 3: API Validation - Verify backend state
    console.log('✅ Validating order via API...');
    
    const orderResponse = await request.get(`/api/orders/${orderNumber}`);
    expect(orderResponse.status()).toBe(200);
    
    const order = await orderResponse.json();
    expect(order.userId).toBe(user.id);
    expect(order.items[0].productId).toBe(product.id);
    expect(order.items[0].quantity).toBe(1);
    expect(order.total).toBe(product.price);
    expect(order.status).toBe('confirmed');
    
    // Step 4: Cross-validation - UI and API consistency
    console.log('🔄 Cross-validating UI and API data...');
    
    await page.goto('/orders');
    const uiOrder = page.getByTestId(`order-${orderNumber}`);
    await expect(uiOrder).toBeVisible();
    await expect(uiOrder.getByText(product.name)).toBeVisible();
    await expect(uiOrder.getByText(`$${product.price}`)).toBeVisible();
    
    // Step 5: API Cleanup
    console.log('🧹 Cleaning up test data...');
    
    await request.delete(`/api/orders/${orderNumber}`);
    await request.delete(`/api/products/${product.id}`);
    await request.delete(`/api/users/${user.id}`);
  });
});
```

### **Example 2: User Profile Management**

```typescript
test.describe('User Profile Integration', () => {
  test('profile update with real-time validation', async ({ request, page }) => {
    // Setup: Create user via API
    const userResponse = await request.post('/api/users', {
      data: {
        name: 'Original Name',
        email: 'original@test.com',
        bio: 'Original bio'
      }
    });
    const user = await userResponse.json();
    
    // Login via API to get session
    const loginResponse = await request.post('/api/auth/login', {
      data: {
        email: user.email,
        password: 'password123'
      }
    });
    const session = await loginResponse.json();
    
    // Set authentication for page context
    await page.addInitScript((token) => {
      localStorage.setItem('authToken', token);
    }, session.token);
    
    // E2E: Navigate to profile page
    await page.goto('/profile');
    
    // Verify current data matches API
    await expect(page.getByDisplayValue(user.name)).toBeVisible();
    await expect(page.getByDisplayValue(user.email)).toBeVisible();
    await expect(page.getByDisplayValue(user.bio)).toBeVisible();
    
    // Update profile through UI
    const updatedData = {
      name: 'Updated Name',
      bio: 'Updated bio description'
    };
    
    await page.getByLabel('Name').fill(updatedData.name);
    await page.getByLabel('Bio').fill(updatedData.bio);
    await page.getByRole('button', { name: 'Save Changes' }).click();
    
    // Verify UI feedback
    await expect(page.getByText('Profile updated successfully')).toBeVisible();
    
    // API Validation: Verify changes persisted
    const updatedUserResponse = await request.get(`/api/users/${user.id}`, {
      headers: {
        'Authorization': `Bearer ${session.token}`
      }
    });
    const updatedUser = await updatedUserResponse.json();
    
    expect(updatedUser.name).toBe(updatedData.name);
    expect(updatedUser.bio).toBe(updatedData.bio);
    expect(updatedUser.email).toBe(user.email); // Should remain unchanged
    
    // Cross-validation: Refresh page and verify persistence
    await page.reload();
    await expect(page.getByDisplayValue(updatedData.name)).toBeVisible();
    await expect(page.getByDisplayValue(updatedData.bio)).toBeVisible();
    
    // Cleanup
    await request.delete(`/api/users/${user.id}`, {
      headers: {
        'Authorization': `Bearer ${session.token}`
      }
    });
  });
});
```

## 🔐 Authentication and Session Sharing

### **Sharing Authentication Between API and E2E**

```typescript
class AuthenticationHelper {
  static async loginViaAPI(request: APIRequestContext, credentials: any) {
    const response = await request.post('/api/auth/login', {
      data: credentials
    });
    
    expect(response.status()).toBe(200);
    const authData = await response.json();
    
    return {
      token: authData.token,
      user: authData.user,
      cookies: response.headers()['set-cookie']
    };
  }
  
  static async setupPageAuthentication(page: Page, authData: any) {
    // Method 1: Set localStorage token
    await page.addInitScript((token) => {
      localStorage.setItem('authToken', token);
    }, authData.token);
    
    // Method 2: Set cookies
    if (authData.cookies) {
      const cookies = this.parseCookies(authData.cookies);
      await page.context().addCookies(cookies);
    }
  }
  
  static parseCookies(cookieHeader: string) {
    // Parse Set-Cookie header into Playwright cookie format
    return cookieHeader.split(',').map(cookie => {
      const [nameValue, ...attributes] = cookie.trim().split(';');
      const [name, value] = nameValue.split('=');
      
      return {
        name: name.trim(),
        value: value.trim(),
        domain: 'localhost', // Adjust as needed
        path: '/'
      };
    });
  }
}

test.describe('Shared Authentication', () => {
  test('should share authentication between API and E2E', async ({ request, page }) => {
    // Login via API
    const authData = await AuthenticationHelper.loginViaAPI(request, {
      email: 'user@test.com',
      password: 'password123'
    });
    
    // Setup page authentication
    await AuthenticationHelper.setupPageAuthentication(page, authData);
    
    // Now both API and page requests are authenticated
    
    // API request with authentication
    const apiResponse = await request.get('/api/user/profile', {
      headers: {
        'Authorization': `Bearer ${authData.token}`
      }
    });
    const apiProfile = await apiResponse.json();
    
    // E2E navigation (automatically authenticated)
    await page.goto('/dashboard');
    await expect(page.getByText(`Welcome, ${apiProfile.name}`)).toBeVisible();
    
    // Both approaches access the same authenticated session
    expect(apiProfile.name).toBeTruthy();
  });
});
```

## 📊 Data Consistency Validation

### **Cross-Layer Data Validation Patterns**

```typescript
class DataValidator {
  static async validateUserConsistency(
    request: APIRequestContext, 
    page: Page, 
    userId: number
  ) {
    // Get user data from API
    const apiResponse = await request.get(`/api/users/${userId}`);
    const apiUser = await apiResponse.json();
    
    // Get user data from UI
    await page.goto(`/users/${userId}`);
    const uiName = await page.getByTestId('user-name').textContent();
    const uiEmail = await page.getByTestId('user-email').textContent();
    const uiBio = await page.getByTestId('user-bio').textContent();
    
    // Cross-validate
    expect(apiUser.name).toBe(uiName);
    expect(apiUser.email).toBe(uiEmail);
    expect(apiUser.bio).toBe(uiBio);
    
    return {
      api: apiUser,
      ui: { name: uiName, email: uiEmail, bio: uiBio },
      consistent: true
    };
  }
  
  static async validateProductInventory(
    request: APIRequestContext,
    page: Page,
    productId: number
  ) {
    // API: Get current stock level
    const apiResponse = await request.get(`/api/products/${productId}`);
    const apiProduct = await apiResponse.json();
    
    // UI: Check displayed stock
    await page.goto(`/products/${productId}`);
    const stockText = await page.getByTestId('stock-level').textContent();
    const uiStock = parseInt(stockText.match(/\d+/)[0]);
    
    // Validate consistency
    expect(apiProduct.stock).toBe(uiStock);
    
    // Test stock update
    const purchaseQuantity = 2;
    
    // UI: Make purchase
    await page.getByLabel('Quantity').fill(purchaseQuantity.toString());
    await page.getByRole('button', { name: 'Buy Now' }).click();
    await expect(page.getByText('Purchase successful')).toBeVisible();
    
    // API: Verify stock decreased
    const updatedApiResponse = await request.get(`/api/products/${productId}`);
    const updatedApiProduct = await updatedApiResponse.json();
    
    expect(updatedApiProduct.stock).toBe(apiProduct.stock - purchaseQuantity);
    
    // UI: Verify updated stock display
    await page.reload();
    const newStockText = await page.getByTestId('stock-level').textContent();
    const newUiStock = parseInt(newStockText.match(/\d+/)[0]);
    
    expect(newUiStock).toBe(updatedApiProduct.stock);
  }
}
```

## ⚡ Performance Optimization Strategies

### **Optimizing Hybrid Test Execution**

```typescript
test.describe('Performance Optimized Integration', () => {
  test('should optimize test execution with strategic API usage', async ({ request, page }) => {
    console.time('Total Test Execution');
    
    // Strategy 1: Parallel API setup
    console.time('Parallel Setup');
    const [user, product, category] = await Promise.all([
      createUserViaAPI(request),
      createProductViaAPI(request),
      createCategoryViaAPI(request)
    ]);
    console.timeEnd('Parallel Setup');
    
    // Strategy 2: Batch API operations
    console.time('Batch Operations');
    await request.post('/api/batch', {
      data: {
        operations: [
          { type: 'assign_product_category', productId: product.id, categoryId: category.id },
          { type: 'set_user_preferences', userId: user.id, preferences: { theme: 'dark' } },
          { type: 'create_user_session', userId: user.id }
        ]
      }
    });
    console.timeEnd('Batch Operations');
    
    // Strategy 3: Minimal E2E validation
    console.time('E2E Validation');
    await page.goto('/login');
    await quickLogin(page, user);
    
    // Only validate critical UI elements
    await expect(page.getByTestId('user-dashboard')).toBeVisible();
    await expect(page.getByText(user.name)).toBeVisible();
    console.timeEnd('E2E Validation');
    
    // Strategy 4: API verification of complex state
    console.time('API Verification');
    const userState = await request.get(`/api/users/${user.id}/state`);
    const state = await userState.json();
    
    expect(state.isLoggedIn).toBe(true);
    expect(state.preferences.theme).toBe('dark');
    expect(state.assignedProducts).toContain(product.id);
    console.timeEnd('API Verification');
    
    // Strategy 5: Bulk cleanup
    console.time('Cleanup');
    await request.delete('/api/batch', {
      data: {
        operations: [
          { type: 'delete_user', id: user.id },
          { type: 'delete_product', id: product.id },
          { type: 'delete_category', id: category.id }
        ]
      }
    });
    console.timeEnd('Cleanup');
    
    console.timeEnd('Total Test Execution');
  });
});
```

## 🐛 Debugging Hybrid Tests

### **Debugging Strategies for Integration Issues**

```typescript
class HybridTestDebugger {
  static async debugDataFlow(
    request: APIRequestContext,
    page: Page,
    testContext: any
  ) {
    console.log('🔍 Starting hybrid test debugging...');
    
    // 1. API State Inspection
    console.log('\n📡 API State:');
    const apiState = await this.captureAPIState(request, testContext);
    console.log(JSON.stringify(apiState, null, 2));
    
    // 2. UI State Inspection
    console.log('\n🎭 UI State:');
    const uiState = await this.captureUIState(page);
    console.log(JSON.stringify(uiState, null, 2));
    
    // 3. Network Activity
    console.log('\n🌐 Network Activity:');
    const networkLogs = await this.captureNetworkActivity(page);
    networkLogs.forEach(log => console.log(log));
    
    // 4. State Comparison
    console.log('\n⚖️ State Comparison:');
    const inconsistencies = this.compareStates(apiState, uiState);
    if (inconsistencies.length > 0) {
      console.warn('❌ Inconsistencies found:');
      inconsistencies.forEach(issue => console.warn(`  - ${issue}`));
    } else {
      console.log('✅ States are consistent');
    }
    
    // 5. Performance Metrics
    console.log('\n⏱️ Performance Metrics:');
    const metrics = await this.capturePerformanceMetrics(page);
    console.log(JSON.stringify(metrics, null, 2));
  }
  
  static async captureAPIState(request: APIRequestContext, context: any) {
    try {
      const responses = await Promise.all([
        request.get(`/api/users/${context.userId}`),
        request.get(`/api/users/${context.userId}/sessions`),
        request.get(`/api/users/${context.userId}/preferences`)
      ]);
      
      return {
        user: await responses[0].json(),
        sessions: await responses[1].json(),
        preferences: await responses[2].json()
      };
    } catch (error) {
      return { error: error.message };
    }
  }
  
  static async captureUIState(page: Page) {
    return await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        localStorage: { ...localStorage },
        sessionStorage: { ...sessionStorage },
        cookies: document.cookie,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };
    });
  }
  
  static async captureNetworkActivity(page: Page) {
    const networkLogs = [];
    
    page.on('request', request => {
      networkLogs.push({
        type: 'request',
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        timestamp: new Date().toISOString()
      });
    });
    
    page.on('response', response => {
      networkLogs.push({
        type: 'response',
        url: response.url(),
        status: response.status(),
        headers: response.headers(),
        timestamp: new Date().toISOString()
      });
    });
    
    return networkLogs;
  }
  
  static compareStates(apiState: any, uiState: any) {
    const inconsistencies = [];
    
    // Compare user data
    if (apiState.user && uiState.localStorage.currentUser) {
      const uiUser = JSON.parse(uiState.localStorage.currentUser);
      if (apiState.user.name !== uiUser.name) {
        inconsistencies.push(`User name mismatch: API="${apiState.user.name}" vs UI="${uiUser.name}"`);
      }
    }
    
    // Compare authentication state
    const apiLoggedIn = apiState.sessions && apiState.sessions.length > 0;
    const uiLoggedIn = !!uiState.localStorage.authToken;
    
    if (apiLoggedIn !== uiLoggedIn) {
      inconsistencies.push(`Login state mismatch: API=${apiLoggedIn} vs UI=${uiLoggedIn}`);
    }
    
    return inconsistencies;
  }
  
  static async capturePerformanceMetrics(page: Page) {
    return await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    });
  }
}
```

## 🎯 Best Practices for Hybrid Testing

### **Design Principles**

1. **Use API for Setup, E2E for Validation**
   - Fast API calls for test data creation
   - E2E tests for user experience validation
   - API cleanup for efficient teardown

2. **Validate Critical Paths with Both Approaches**
   - API tests for business logic validation
   - E2E tests for user workflow validation
   - Cross-validation for data consistency

3. **Share Authentication and Session State**
   - Single login for both API and E2E tests
   - Consistent session management
   - Efficient authentication workflows

4. **Optimize for Performance**
   - Parallel API operations where possible
   - Minimal E2E interactions for maximum coverage
   - Strategic use of each testing approach

5. **Comprehensive Error Handling**
   - Handle failures in both API and E2E layers
   - Provide clear debugging information
   - Graceful degradation when one layer fails

## 📚 Additional Resources

### **Integration Testing Resources**
- [Playwright API Testing Guide](https://playwright.dev/docs/api-testing) ⭐⭐⭐⭐⭐
- [Testing Strategies Documentation](https://playwright.dev/docs/test-configuration) ⭐⭐⭐⭐
- [Hybrid Testing Patterns](https://martinfowler.com/articles/practical-test-pyramid.html) ⭐⭐⭐⭐

### **Advanced Topics**
- [Test Data Management](https://playwright.dev/docs/test-fixtures) ⭐⭐⭐⭐
- [Authentication Patterns](https://playwright.dev/docs/auth) ⭐⭐⭐⭐⭐
- [Performance Testing](https://playwright.dev/docs/test-performance) ⭐⭐⭐

## ✅ Lesson Completion Checklist

- [ ] Understand the benefits of combining API and E2E testing
- [ ] Can design hybrid testing strategies effectively
- [ ] Successfully implement API setup with E2E validation
- [ ] Can share authentication between API and E2E tests
- [ ] Validate data consistency across layers
- [ ] Implement performance optimization strategies
- [ ] Debug issues that span both API and UI layers
- [ ] Apply best practices for hybrid testing

## 🚀 Next Steps

In **Lesson 15: Debugging and Trace Viewer**, you'll learn:
- Advanced debugging techniques for both API and E2E tests
- Using Playwright's trace viewer for hybrid test analysis
- Performance profiling and optimization
- Troubleshooting complex integration issues

In **Lesson 16: Test Organization and Structure**, you'll learn:
- Organizing hybrid test suites effectively
- Creating reusable utilities for both API and E2E tests
- Implementing test data management strategies
- Building maintainable test architectures

---

**🎭 Congratulations! You've mastered the art of combining API and E2E testing with Playwright. You now have the skills to create comprehensive, efficient test suites that validate both backend logic and user experience. This integration approach will make you a highly effective automation engineer!**