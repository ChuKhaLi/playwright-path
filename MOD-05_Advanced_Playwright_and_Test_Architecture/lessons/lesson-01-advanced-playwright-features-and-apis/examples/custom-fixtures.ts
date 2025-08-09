/**
 * Advanced Playwright Fixtures - Custom Test Setup and Teardown
 * 
 * This example demonstrates how to create professional-grade custom fixtures
 * for complex test scenarios including database integration, API clients,
 * and authentication management.
 * 
 * @author Playwright Learning Module
 * @version 1.0.0
 */

import { test as base, expect, Page, BrowserContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Custom fixture types for enterprise testing scenarios
 */
type TestFixtures = {
  /** Database helper for test data management */
  database: DatabaseHelper;
  /** API client for service integration */
  apiClient: APIClient;
  /** Pre-authenticated user for testing */
  testUser: {
    id: string;
    email: string;
    password: string;
    role: 'admin' | 'user' | 'guest';
  };
  /** Page with authentication pre-configured */
  authenticatedPage: Page;
  /** Test environment configuration */
  testEnvironment: TestEnvironment;
};

/**
 * Worker-scoped fixtures for expensive setup operations
 */
type WorkerFixtures = {
  /** Shared authentication state across worker */
  workerStorageState: string;
  /** Global test data setup */
  globalTestData: {
    products: any[];
    categories: any[];
  };
};

// =============================================================================
// HELPER CLASSES
// =============================================================================

/**
 * Database helper for managing test data
 * Simulates database operations for learning purposes
 */
class DatabaseHelper {
  private isConnected = false;
  private createdUsers: any[] = [];
  private createdData: any[] = [];

  /**
   * Connect to the test database
   */
  async connect(): Promise<void> {
    console.log('📡 Connecting to test database...');
    // Simulate database connection
    await this.delay(100);
    this.isConnected = true;
    console.log('✅ Database connected successfully');
  }

  /**
   * Create a test user with specified properties
   */
  async createUser(userData: {
    email: string;
    password: string;
    role: string;
  }): Promise<any> {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    const user = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      createdAt: new Date().toISOString()
    };

    // Simulate database insert
    await this.delay(50);
    this.createdUsers.push(user);
    
    console.log(`👤 Created test user: ${user.email} (${user.role})`);
    return user;
  }

  /**
   * Create test products for e-commerce scenarios
   */
  async createProducts(products: any[]): Promise<any[]> {
    const createdProducts = [];
    
    for (const productData of products) {
      const product = {
        id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...productData,
        createdAt: new Date().toISOString()
      };
      
      await this.delay(25);
      this.createdData.push(product);
      createdProducts.push(product);
      
      console.log(`📦 Created test product: ${product.name} ($${product.price})`);
    }
    
    return createdProducts;
  }

  /**
   * Clean up all test data created during test execution
   */
  async cleanup(): Promise<void> {
    if (!this.isConnected) return;

    console.log('🧹 Cleaning up test data...');
    
    // Clean up users
    for (const user of this.createdUsers) {
      console.log(`🗑️ Removing test user: ${user.email}`);
      await this.delay(10);
    }
    
    // Clean up other data
    for (const data of this.createdData) {
      console.log(`🗑️ Removing test data: ${data.id}`);
      await this.delay(10);
    }
    
    this.createdUsers = [];
    this.createdData = [];
    
    console.log('✅ Test data cleanup completed');
  }

  /**
   * Disconnect from the database
   */
  async disconnect(): Promise<void> {
    if (this.isConnected) {
      console.log('📡 Disconnecting from test database...');
      await this.delay(50);
      this.isConnected = false;
      console.log('✅ Database disconnected');
    }
  }

  /**
   * Utility method to simulate async operations
   */
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * API client for service integration testing
 * Demonstrates hybrid API + UI testing approaches
 */
class APIClient {
  private isAuthenticated = false;
  private authToken: string | null = null;
  private baseURL: string;

  constructor(private request: any, baseURL: string = 'https://api.example.com') {
    this.baseURL = baseURL;
  }

  /**
   * Authenticate the API client
   */
  async authenticate(credentials: {
    username?: string;
    password?: string;
    apiKey?: string;
    secret?: string;
  }): Promise<void> {
    console.log('🔐 Authenticating API client...');
    
    // Simulate API authentication
    await this.delay(100);
    
    if (credentials.apiKey && credentials.secret) {
      this.authToken = `Bearer ${credentials.apiKey}.${credentials.secret}`;
    } else if (credentials.username && credentials.password) {
      this.authToken = `Bearer ${btoa(credentials.username + ':' + credentials.password)}`;
    }
    
    this.isAuthenticated = true;
    console.log('✅ API client authenticated successfully');
  }

  /**
   * Create test products via API
   */
  async createTestProducts(products: any[]): Promise<any[]> {
    if (!this.isAuthenticated) {
      throw new Error('API client not authenticated');
    }

    const createdProducts = [];
    
    for (const productData of products) {
      const product = {
        id: `api_prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...productData,
        createdViaAPI: true,
        createdAt: new Date().toISOString()
      };
      
      // Simulate API call
      await this.delay(50);
      createdProducts.push(product);
      
      console.log(`🚀 Created product via API: ${product.name}`);
    }
    
    return createdProducts;
  }

  /**
   * Create test orders via API
   */
  async createTestOrders(products: any[]): Promise<any[]> {
    if (!this.isAuthenticated) {
      throw new Error('API client not authenticated');
    }

    const orders = [];
    
    for (let i = 0; i < products.length; i++) {
      const order = {
        id: `api_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        productId: products[i].id,
        quantity: Math.floor(Math.random() * 5) + 1,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      await this.delay(30);
      orders.push(order);
      
      console.log(`📝 Created order via API: ${order.id}`);
    }
    
    return orders;
  }

  /**
   * Delete test data via API
   */
  async deleteTestData(items: any[]): Promise<void> {
    console.log('🧹 Cleaning up API test data...');
    
    for (const item of items) {
      console.log(`🗑️ Deleting via API: ${item.id}`);
      await this.delay(20);
    }
    
    console.log('✅ API test data cleanup completed');
  }

  /**
   * Utility method to simulate async operations
   */
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Test environment configuration and management
 */
class TestEnvironment {
  private config: any = {};
  private initialized = false;

  /**
   * Initialize the test environment
   */
  async initialize(): Promise<void> {
    console.log('🏗️ Initializing test environment...');
    
    this.config = {
      environment: process.env.TEST_ENV || 'development',
      baseURL: process.env.BASE_URL || 'http://localhost:3000',
      apiURL: process.env.API_URL || 'https://api.example.com',
      databaseURL: process.env.DATABASE_URL || 'sqlite://test.db',
      initialized: true,
      timestamp: new Date().toISOString()
    };
    
    await this.delay(100);
    this.initialized = true;
    
    console.log(`✅ Test environment initialized: ${this.config.environment}`);
  }

  /**
   * Get environment configuration
   */
  getConfig(): any {
    if (!this.initialized) {
      throw new Error('Test environment not initialized');
    }
    return { ...this.config };
  }

  /**
   * Clean up test environment
   */
  async cleanup(): Promise<void> {
    if (this.initialized) {
      console.log('🧹 Cleaning up test environment...');
      await this.delay(50);
      this.initialized = false;
      console.log('✅ Test environment cleanup completed');
    }
  }

  /**
   * Utility method to simulate async operations
   */
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// =============================================================================
// CUSTOM FIXTURES IMPLEMENTATION
// =============================================================================

/**
 * Extended test with custom fixtures
 * This creates a powerful testing framework with built-in setup and teardown
 */
export const test = base.extend<TestFixtures, WorkerFixtures>({
  // -------------------------------------------------------------------------
  // WORKER-SCOPED FIXTURES (Expensive, shared across tests)
  // -------------------------------------------------------------------------
  
  /**
   * Worker-scoped authentication state
   * Expensive authentication setup shared across all tests in worker
   */
  workerStorageState: [async ({ browser }, use) => {
    console.log('🏭 Setting up worker-scoped authentication...');
    
    // Create a temporary context for authentication
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Perform authentication flow
    await page.goto('https://example.com/login');
    
    // Simulate authentication
    await page.evaluate(() => {
      localStorage.setItem('authToken', 'worker-auth-token-12345');
      localStorage.setItem('userRole', 'admin');
      sessionStorage.setItem('sessionId', 'worker-session-67890');
    });
    
    // Navigate to authenticated page to ensure auth is complete
    await page.goto('https://example.com/dashboard');
    
    // Save authentication state to file (Windows-compatible path)
    const storageState = await context.storageState();
    const statePath = path.join('test-results', 'worker-auth-state.json');
    
    // Ensure directory exists
    const stateDir = path.dirname(statePath);
    if (!fs.existsSync(stateDir)) {
      fs.mkdirSync(stateDir, { recursive: true });
    }
    
    fs.writeFileSync(statePath, JSON.stringify(storageState, null, 2));
    
    await context.close();
    
    console.log(`✅ Worker authentication state saved to: ${statePath}`);
    
    await use(statePath);
    
    // Cleanup authentication state file
    if (fs.existsSync(statePath)) {
      fs.unlinkSync(statePath);
      console.log('🧹 Worker authentication state cleaned up');
    }
  }, { scope: 'worker' }],

  /**
   * Worker-scoped global test data
   * Expensive data setup shared across all tests
   */
  globalTestData: [async ({}, use) => {
    console.log('🏭 Setting up worker-scoped global test data...');
    
    // Simulate expensive data setup
    const products = [
      {
        id: 'global_prod_1',
        name: 'Premium Laptop',
        price: 1299.99,
        category: 'electronics',
        inStock: true
      },
      {
        id: 'global_prod_2', 
        name: 'Wireless Headphones',
        price: 199.99,
        category: 'electronics',
        inStock: true
      },
      {
        id: 'global_prod_3',
        name: 'Ergonomic Chair',
        price: 499.99,
        category: 'furniture',
        inStock: false
      }
    ];
    
    const categories = [
      { id: 'cat_1', name: 'Electronics', slug: 'electronics' },
      { id: 'cat_2', name: 'Furniture', slug: 'furniture' },
      { id: 'cat_3', name: 'Clothing', slug: 'clothing' }
    ];
    
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate setup time
    
    const globalData = { products, categories };
    
    console.log(`✅ Global test data created: ${products.length} products, ${categories.length} categories`);
    
    await use(globalData);
    
    console.log('🧹 Global test data cleanup completed');
  }, { scope: 'worker' }],

  // -------------------------------------------------------------------------
  // TEST-SCOPED FIXTURES (Per-test setup and teardown)
  // -------------------------------------------------------------------------

  /**
   * Database fixture with automatic cleanup
   */
  database: async ({}, use) => {
    const db = new DatabaseHelper();
    await db.connect();
    
    await use(db);
    
    // Automatic cleanup after test
    await db.cleanup();
    await db.disconnect();
  },

  /**
   * API client fixture with authentication
   */
  apiClient: async ({ request }, use) => {
    const client = new APIClient(request);
    
    // Authenticate with environment variables or defaults
    await client.authenticate({
      apiKey: process.env.API_KEY || 'test-api-key',
      secret: process.env.API_SECRET || 'test-api-secret'
    });
    
    await use(client);
    
    // API client is stateless, no cleanup needed
  },

  /**
   * Test user fixture with automatic creation and cleanup
   */
  testUser: async ({ database }, use) => {
    // Create a unique test user for this test
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    
    // Best Practice: Use environment variables for sensitive data like passwords.
    // Fallback to a default for local development environments.
    const user = await database.createUser({
      email: `test-user-${timestamp}-${randomId}@example.com`,
      password: process.env.TEST_USER_PASSWORD || 'DefaultSecurePassword123!',
      role: 'user'
    });
    
    await use(user);
    
    // Cleanup is handled by database fixture
  },

  /**
   * Authenticated page fixture using worker storage state
   */
  authenticatedPage: async ({ browser, workerStorageState }, use) => {
    // Create context with saved authentication state
    const context = await browser.newContext({
      storageState: workerStorageState,
      extraHTTPHeaders: {
        'X-Test-User': 'authenticated-fixture-user',
        'X-Test-Session': `session-${Date.now()}`
      }
    });
    
    const page = await context.newPage();
    
    // Navigate to authenticated area to verify auth state
    await page.goto('https://example.com/dashboard');
    
    console.log('🔐 Authenticated page ready for testing');
    
    await use(page);
    
    // Cleanup context
    await context.close();
    console.log('🧹 Authenticated page context cleaned up');
  },

  /**
   * Test environment fixture
   */
  testEnvironment: async ({}, use) => {
    const env = new TestEnvironment();
    await env.initialize();
    
    await use(env);
    
    await env.cleanup();
  }
});

// =============================================================================
// USAGE EXAMPLES
// =============================================================================

/**
 * Example test using database fixture
 */
test('database fixture example', async ({ database, testUser }) => {
  // Test user is automatically created and available
  expect(testUser.email).toContain('@example.com');
  expect(testUser.role).toBe('user');
  
  // Create additional test data
  const products = await database.createProducts([
    { name: 'Test Product 1', price: 29.99 },
    { name: 'Test Product 2', price: 39.99 }
  ]);
  
  expect(products).toHaveLength(2);
  expect(products[0].name).toBe('Test Product 1');
  
  // Database cleanup happens automatically after test
});

/**
 * Example test using API client fixture
 */
test('API client fixture example', async ({ apiClient, globalTestData }) => {
  // API client is automatically authenticated
  const products = await apiClient.createTestProducts([
    { name: 'API Test Product', price: 49.99 }
  ]);
  
  expect(products).toHaveLength(1);
  expect(products[0].createdViaAPI).toBe(true);
  
  // Access global test data
  expect(globalTestData.products).toHaveLength(3);
  expect(globalTestData.categories).toHaveLength(3);
  
  // API cleanup happens automatically
});

/**
 * Example test using authenticated page fixture
 */
test('authenticated page fixture example', async ({ authenticatedPage }) => {
  // Page is already authenticated and ready to use
  await authenticatedPage.goto('/user-profile');
  
  // Test authenticated functionality
  await expect(authenticatedPage.locator('[data-testid="user-menu"]')).toBeVisible();
  await expect(authenticatedPage.locator('[data-testid="logout-button"]')).toBeVisible();
  
  // Context cleanup happens automatically
});

/**
 * Example test using multiple fixtures together
 */
test('combined fixtures example', async ({ 
  database, 
  apiClient, 
  testUser, 
  authenticatedPage,
  testEnvironment 
}) => {
  // All fixtures are available and configured
  const config = testEnvironment.getConfig();
  expect(config.environment).toBeDefined();
  
  // Create test data via API
  const products = await apiClient.createTestProducts([
    { name: 'Combined Test Product', price: 99.99 }
  ]);
  
  // Create additional user data via database
  // Best Practice: Use environment variables for sensitive data like passwords.
  const additionalUser = await database.createUser({
    email: 'additional-user@example.com',
    password: process.env.ADMIN_USER_PASSWORD || 'DefaultAdminPassword456!',
    role: 'admin'
  });
  
  // Use authenticated page for UI testing
  await authenticatedPage.goto('/admin/users');
  await expect(authenticatedPage.locator('h1')).toContainText('User Management');
  
  // All cleanup happens automatically
});

// Export the enhanced test function and types
export { expect };
export type { TestFixtures, WorkerFixtures };