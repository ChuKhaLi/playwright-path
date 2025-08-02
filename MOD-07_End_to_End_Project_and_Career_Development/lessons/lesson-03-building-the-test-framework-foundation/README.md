# Lesson 03: Building the Test Framework Foundation

## Learning Objectives

By the end of this lesson, you will be able to:

1. **Design and implement** a scalable test framework architecture using TypeScript
2. **Create base classes** for Page Object Model and API client patterns
3. **Implement configuration management** and utility functions for framework extensibility
4. **Establish error handling** and logging strategies for robust test execution
5. **Build reusable components** that support maintainable and scalable test development

## Introduction

The foundation of any successful test automation project lies in its architecture. This lesson focuses on building the core framework components that will support all your testing activities. You'll implement industry-standard patterns and create reusable utilities that enable efficient test development and maintenance.

### Why Framework Foundation Matters

A well-designed framework foundation provides:
- **Scalability**: Architecture that grows with your testing needs
- **Maintainability**: Clean patterns that simplify updates and modifications
- **Reusability**: Common components that reduce code duplication
- **Reliability**: Robust error handling and consistent behavior
- **Efficiency**: Streamlined development workflow for test creation

## Framework Architecture Design

### Core Architecture Principles

Our framework follows these key architectural principles:

```typescript
/**
 * Framework Architecture Overview
 * 
 * Layer 1: Test Layer (tests/e2e/, tests/api/)
 * ├── Individual test specifications
 * ├── Test data and fixtures
 * └── Test configuration
 * 
 * Layer 2: Business Logic Layer (src/pages/, src/api/)
 * ├── Page Object Model classes
 * ├── API client implementations
 * └── Business workflow methods
 * 
 * Layer 3: Framework Core (src/utils/, src/fixtures/)
 * ├── Base classes and interfaces
 * ├── Utility functions and helpers
 * └── Configuration management
 * 
 * Layer 4: Infrastructure (config/, .env files)
 * ├── Environment configurations
 * ├── Tool configurations
 * └── CI/CD pipeline setup
 */
```

### Design Patterns Implementation

#### 1. Page Object Model (POM) Pattern
- **Encapsulation**: Page-specific functionality within dedicated classes
- **Abstraction**: High-level methods that hide implementation details
- **Reusability**: Common page components shared across tests

#### 2. API Client Pattern
- **Separation**: Distinct clients for different API domains
- **Type Safety**: Strong typing for request/response objects
- **Error Handling**: Consistent error management across API calls

#### 3. Factory Pattern
- **Object Creation**: Centralized creation of page objects and API clients
- **Configuration**: Environment-specific object initialization
- **Dependency Injection**: Flexible component composition

## Base Classes Implementation

### Step 1: Base Page Object Class

Create the foundation for all page objects (`src/pages/BasePage.ts`):

```typescript
import { Page, Locator, expect } from '@playwright/test';
import { config } from '../utils/config';
import { Logger } from '../utils/logger';

/**
 * Base Page Object Class
 * Provides common functionality for all page objects
 */
export abstract class BasePage {
  protected page: Page;
  protected logger: Logger;
  protected baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.logger = Logger.getInstance();
    this.baseUrl = config.getBaseUrl();
  }

  /**
   * Navigate to a specific URL
   * @param url - Relative or absolute URL
   */
  async navigateTo(url: string): Promise<void> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    this.logger.info(`Navigating to: ${fullUrl}`);
    
    await this.page.goto(fullUrl, {
      waitUntil: 'domcontentloaded',
      timeout: config.getTimeout()
    });
    
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle', {
      timeout: config.getTimeout()
    });
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Take screenshot with automatic naming
   */
  async takeScreenshot(name?: string): Promise<Buffer> {
    const screenshotName = name || `${this.constructor.name}_${Date.now()}`;
    this.logger.info(`Taking screenshot: ${screenshotName}`);
    
    return await this.page.screenshot({
      path: `reports/screenshots/${screenshotName}.png`,
      fullPage: true
    });
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({
      state: 'visible',
      timeout: timeout || config.getExpectTimeout()
    });
  }

  /**
   * Safe click with retry logic
   */
  async safeClick(locator: Locator, retries: number = 3): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.waitForElement(locator);
        await locator.click();
        return;
      } catch (error) {
        this.logger.warn(`Click attempt ${attempt} failed: ${error.message}`);
        
        if (attempt === retries) {
          throw new Error(`Failed to click element after ${retries} attempts: ${error.message}`);
        }
        
        await this.page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Safe input with clear and validation
   */
  async safeInput(locator: Locator, text: string, shouldClear: boolean = true): Promise<void> {
    await this.waitForElement(locator);
    
    if (shouldClear) {
      await locator.clear();
    }
    
    await locator.fill(text);
    
    // Validate input
    const inputValue = await locator.inputValue();
    if (inputValue !== text) {
      throw new Error(`Input validation failed. Expected: "${text}", Actual: "${inputValue}"`);
    }
  }

  /**
   * Wait for URL to contain specific path
   */
  async waitForUrlContains(path: string, timeout?: number): Promise<void> {
    await this.page.waitForURL(url => url.includes(path), {
      timeout: timeout || config.getTimeout()
    });
  }

  /**
   * Scroll element into view
   */
  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Get element text with null safety
   */
  async getElementText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return await locator.textContent() || '';
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verify page loaded correctly (abstract method)
   */
  abstract verifyPageLoaded(): Promise<void>;
}
```

### Step 2: Base API Client Class

Create the foundation for API clients (`src/api/BaseApiClient.ts`):

```typescript
import { APIRequestContext, APIResponse } from '@playwright/test';
import { config } from '../utils/config';
import { Logger } from '../utils/logger';

/**
 * HTTP Methods supported by the API client
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

/**
 * API Request configuration
 */
export interface ApiRequestConfig {
  endpoint: string;
  method: HttpMethod;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  timeout?: number;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T = any> {
  status: number;
  statusText: string;
  data: T;
  headers: Record<string, string>;
  url: string;
}

/**
 * Base API Client Class
 * Provides common functionality for all API clients
 */
export abstract class BaseApiClient {
  protected request: APIRequestContext;
  protected logger: Logger;
  protected baseUrl: string;
  protected defaultHeaders: Record<string, string>;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.logger = Logger.getInstance();
    this.baseUrl = config.getApiBaseUrl();
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  /**
   * Make HTTP request with comprehensive error handling
   */
  async makeRequest<T = any>(requestConfig: ApiRequestConfig): Promise<ApiResponse<T>> {
    const { endpoint, method, data, headers, params, timeout } = requestConfig;
    
    // Build URL with parameters
    const url = this.buildUrl(endpoint, params);
    
    // Merge headers
    const requestHeaders = { ...this.defaultHeaders, ...headers };
    
    this.logger.info(`API Request: ${method} ${url}`);
    
    try {
      const response: APIResponse = await this.request.fetch(url, {
        method,
        data: data ? JSON.stringify(data) : undefined,
        headers: requestHeaders,
        timeout: timeout || config.getTimeout()
      });

      const responseData = await this.extractResponseData<T>(response);
      
      const apiResponse: ApiResponse<T> = {
        status: response.status(),
        statusText: response.statusText(),
        data: responseData,
        headers: await response.allHeaders(),
        url: response.url()
      };

      this.logger.info(`API Response: ${response.status()} ${response.statusText()}`);
      
      if (!response.ok()) {
        throw new Error(`API request failed: ${response.status()} ${response.statusText()}`);
      }

      return apiResponse;
      
    } catch (error) {
      this.logger.error(`API request failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * GET request helper
   */
  async get<T = any>(endpoint: string, params?: Record<string, string>, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      endpoint,
      method: HttpMethod.GET,
      params,
      headers
    });
  }

  /**
   * POST request helper
   */
  async post<T = any>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      endpoint,
      method: HttpMethod.POST,
      data,
      headers
    });
  }

  /**
   * PUT request helper
   */
  async put<T = any>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      endpoint,
      method: HttpMethod.PUT,
      data,
      headers
    });
  }

  /**
   * PATCH request helper
   */
  async patch<T = any>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      endpoint,
      method: HttpMethod.PATCH,
      data,
      headers
    });
  }

  /**
   * DELETE request helper
   */
  async delete<T = any>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      endpoint,
      method: HttpMethod.DELETE,
      headers
    });
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remove authentication token
   */
  removeAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const baseUrl = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    
    if (!params || Object.keys(params).length === 0) {
      return baseUrl;
    }

    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    return url.toString();
  }

  /**
   * Extract response data with type safety
   */
  private async extractResponseData<T>(response: APIResponse): Promise<T> {
    const contentType = response.headers()['content-type'] || '';
    
    if (contentType.includes('application/json')) {
      return await response.json();
    } else if (contentType.includes('text/')) {
      return await response.text() as unknown as T;
    } else {
      return await response.body() as unknown as T;
    }
  }
}
```

## Utility Functions and Helpers

### Step 1: Logger Implementation

Create a comprehensive logging utility (`src/utils/logger.ts`):

```typescript
import { writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { config } from './config';

/**
 * Log levels for categorizing log messages
 */
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

/**
 * Log entry structure
 */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: any;
}

/**
 * Logger Configuration
 */
export interface LoggerConfig {
  logLevel: LogLevel;
  logToFile: boolean;
  logToConsole: boolean;
  logFilePath: string;
  maxLogFileSize: number;
}

/**
 * Comprehensive Logger Implementation
 * Provides structured logging with multiple output options
 */
export class Logger {
  private static instance: Logger;
  private config: LoggerConfig;
  private logFilePath: string;

  private constructor() {
    this.config = {
      logLevel: config.isDebugMode() ? LogLevel.DEBUG : LogLevel.INFO,
      logToFile: true,
      logToConsole: true,
      logFilePath: join(process.cwd(), 'reports', 'logs'),
      maxLogFileSize: 10 * 1024 * 1024 // 10MB
    };

    this.initializeLogFile();
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Log error message
   */
  error(message: string, metadata?: any): void {
    this.log(LogLevel.ERROR, message, metadata);
  }

  /**
   * Log warning message
   */
  warn(message: string, metadata?: any): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  /**
   * Log info message
   */
  info(message: string, metadata?: any): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  /**
   * Log debug message
   */
  debug(message: string, metadata?: any): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, metadata?: any): void {
    if (level > this.config.logLevel) {
      return;
    }

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata
    };

    if (this.config.logToConsole) {
      this.logToConsole(logEntry);
    }

    if (this.config.logToFile) {
      this.logToFile(logEntry);
    }
  }

  /**
   * Output log to console with colors
   */
  private logToConsole(entry: LogEntry): void {
    const colors = {
      [LogLevel.ERROR]: '\x1b[31m', // Red
      [LogLevel.WARN]: '\x1b[33m',  // Yellow
      [LogLevel.INFO]: '\x1b[36m',  // Cyan
      [LogLevel.DEBUG]: '\x1b[37m'  // White
    };

    const reset = '\x1b[0m';
    const levelName = LogLevel[entry.level];
    const color = colors[entry.level];

    const formattedMessage = `${color}[${entry.timestamp}] [${levelName}] ${entry.message}${reset}`;
    
    if (entry.metadata) {
      console.log(formattedMessage, entry.metadata);
    } else {
      console.log(formattedMessage);
    }
  }

  /**
   * Write log to file
   */
  private logToFile(entry: LogEntry): void {
    const logLine = JSON.stringify(entry) + '\n';
    
    try {
      appendFileSync(this.logFilePath, logLine, 'utf8');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  /**
   * Initialize log file and directory
   */
  private initializeLogFile(): void {
    const logDir = join(process.cwd(), 'reports', 'logs');
    
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.logFilePath = join(logDir, `test-execution-${timestamp}.log`);

    // Create initial log file
    writeFileSync(this.logFilePath, '');
  }

  /**
   * Create a child logger with additional context
   */
  createChildLogger(context: string): ChildLogger {
    return new ChildLogger(this, context);
  }
}

/**
 * Child Logger for contextual logging
 */
export class ChildLogger {
  private parent: Logger;
  private context: string;

  constructor(parent: Logger, context: string) {
    this.parent = parent;
    this.context = context;
  }

  error(message: string, metadata?: any): void {
    this.parent.error(`[${this.context}] ${message}`, metadata);
  }

  warn(message: string, metadata?: any): void {
    this.parent.warn(`[${this.context}] ${message}`, metadata);
  }

  info(message: string, metadata?: any): void {
    this.parent.info(`[${this.context}] ${message}`, metadata);
  }

  debug(message: string, metadata?: any): void {
    this.parent.debug(`[${this.context}] ${message}`, metadata);
  }
}
```

### Step 2: Data Generation Utilities

Create test data generation utilities (`src/utils/dataGenerator.ts`):

```typescript
import { faker } from '@faker-js/faker';

/**
 * User data interface
 */
export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: string;
  address: AddressData;
}

/**
 * Address data interface
 */
export interface AddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/**
 * Product data interface
 */
export interface ProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  inStock: boolean;
  stockQuantity: number;
}

/**
 * Order data interface
 */
export interface OrderData {
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: AddressData;
  billingAddress: AddressData;
  paymentMethod: string;
}

/**
 * Order item interface
 */
export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

/**
 * Data Generator Utility
 * Provides methods for generating realistic test data
 */
export class DataGenerator {
  /**
   * Generate random user data
   */
  static generateUserData(overrides?: Partial<UserData>): UserData {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    const userData: UserData = {
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      password: this.generateSecurePassword(),
      phone: faker.phone.number('+1##########'),
      dateOfBirth: faker.date.birthdate().toISOString().split('T')[0],
      address: this.generateAddressData()
    };

    return { ...userData, ...overrides };
  }

  /**
   * Generate random address data
   */
  static generateAddressData(overrides?: Partial<AddressData>): AddressData {
    const addressData: AddressData = {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: 'United States'
    };

    return { ...addressData, ...overrides };
  }

  /**
   * Generate random product data
   */
  static generateProductData(overrides?: Partial<ProductData>): ProductData {
    const productData: ProductData = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      category: faker.commerce.department(),
      sku: faker.string.alphanumeric(8).toUpperCase(),
      inStock: faker.datatype.boolean(),
      stockQuantity: faker.number.int({ min: 0, max: 100 })
    };

    return { ...productData, ...overrides };
  }

  /**
   * Generate random order data
   */
  static generateOrderData(itemCount: number = 3, overrides?: Partial<OrderData>): OrderData {
    const items = Array.from({ length: itemCount }, () => {
      const unitPrice = parseFloat(faker.commerce.price({ min: 10, max: 500 }));
      const quantity = faker.number.int({ min: 1, max: 5 });
      
      return {
        productId: faker.string.uuid(),
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity
      };
    });

    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

    const orderData: OrderData = {
      orderId: `ORD-${faker.string.alphanumeric(8).toUpperCase()}`,
      items,
      totalAmount,
      shippingAddress: this.generateAddressData(),
      billingAddress: this.generateAddressData(),
      paymentMethod: faker.helpers.arrayElement(['Credit Card', 'PayPal', 'Bank Transfer'])
    };

    return { ...orderData, ...overrides };
  }

  /**
   * Generate secure password
   */
  static generateSecurePassword(length: number = 12): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';
    
    const allChars = lowercase + uppercase + numbers + symbols;
    
    let password = '';
    
    // Ensure at least one character from each set
    password += faker.helpers.arrayElement(lowercase.split(''));
    password += faker.helpers.arrayElement(uppercase.split(''));
    password += faker.helpers.arrayElement(numbers.split(''));
    password += faker.helpers.arrayElement(symbols.split(''));
    
    // Fill remaining length with random characters
    for (let i = 4; i < length; i++) {
      password += faker.helpers.arrayElement(allChars.split(''));
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Generate unique email address
   */
  static generateUniqueEmail(domain: string = 'testdomain.com'): string {
    const timestamp = Date.now();
    const randomString = faker.string.alphanumeric(5);
    return `test-${timestamp}-${randomString}@${domain}`;
  }

  /**
   * Generate random string with specific pattern
   */
  static generateStringWithPattern(pattern: string): string {
    return pattern.replace(/[#]/g, () => faker.string.numeric(1))
                 .replace(/[A]/g, () => faker.string.alpha({ length: 1, casing: 'upper' }))
                 .replace(/[a]/g, () => faker.string.alpha({ length: 1, casing: 'lower' }));
  }

  /**
   * Generate test data set for bulk operations
   */
  static generateDataSet<T>(generator: () => T, count: number): T[] {
    return Array.from({ length: count }, generator);
  }
}
```

### Step 3: Wait Utilities

Create comprehensive wait utilities (`src/utils/waitUtils.ts`):

```typescript
import { Page, Locator, expect } from '@playwright/test';
import { Logger } from './logger';

/**
 * Wait condition function type
 */
export type WaitCondition = () => Promise<boolean>;

/**
 * Wait options configuration
 */
export interface WaitOptions {
  timeout?: number;
  interval?: number;
  throwOnTimeout?: boolean;
  timeoutMessage?: string;
}

/**
 * Wait Utilities
 * Provides advanced waiting strategies for test automation
 */
export class WaitUtils {
  private static logger = Logger.getInstance();

  /**
   * Wait for condition to be true with custom retry logic
   */
  static async waitForCondition(
    condition: WaitCondition,
    options: WaitOptions = {}
  ): Promise<boolean> {
    const {
      timeout = 30000,
      interval = 500,
      throwOnTimeout = true,
      timeoutMessage = 'Wait condition timed out'
    } = options;

    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        if (await condition()) {
          return true;
        }
      } catch (error) {
        this.logger.debug(`Wait condition check failed: ${error.message}`);
      }
      
      await this.sleep(interval);
    }

    if (throwOnTimeout) {
      throw new Error(`${timeoutMessage} after ${timeout}ms`);
    }
    
    return false;
  }

  /**
   * Wait for element to meet specific condition
   */
  static async waitForElementCondition(
    locator: Locator,
    condition: (element: Locator) => Promise<boolean>,
    options: WaitOptions = {}
  ): Promise<boolean> {
    return this.waitForCondition(
      async () => condition(locator),
      {
        timeoutMessage: `Element condition not met for locator: ${locator}`,
        ...options
      }
    );
  }

  /**
   * Wait for text to appear in element
   */
  static async waitForElementText(
    locator: Locator,
    expectedText: string,
    options: WaitOptions = {}
  ): Promise<boolean> {
    return this.waitForElementCondition(
      locator,
      async (element) => {
        try {
          const text = await element.textContent();
          return text?.includes(expectedText) || false;
        } catch {
          return false;
        }
      },
      {
        timeoutMessage: `Text "${expectedText}" not found in element`,
        ...options
      }
    );
  }

  /**
   * Wait for attribute to have specific value
   */
  static async waitForElementAttribute(
    locator: Locator,
    attribute: string,
    expectedValue: string,
    options: WaitOptions = {}
  ): Promise<boolean> {
    return this.waitForElementCondition(
      locator,
      async (element) => {
        try {
          const value = await element.getAttribute(attribute);
          return value === expectedValue;
        } catch {
          return false;
        }
      },
      {
        timeoutMessage: `Attribute "${attribute}" does not have value "${expectedValue}"`,
        ...options
      }
    );
  }

  /**
   * Wait for element count to match expected
   */
  static async waitForElementCount(
    locator: Locator,
    expectedCount: number,
    options: WaitOptions = {}
  ): Promise<boolean> {
    return this.waitForCondition(
      async () => {
        try {
          const count = await locator.count();
          return count === expectedCount;
        } catch {
          return false;
        }
      },
      {
        timeoutMessage: `Element count does not match expected: ${expectedCount}`,
        ...options
      }
    );
  }

  /**
   * Wait for page URL to contain specific text
   */
  static async waitForUrlContains(
    page: Page,
    urlPart: string,
    options: WaitOptions = {}
  ): Promise<boolean> {
    return this.waitForCondition(
      async () => {
        const currentUrl = page.url();
        return currentUrl.includes(urlPart);
      },
      {
        timeoutMessage: `URL does not contain "${urlPart}"`,
        ...options
      }
    );
  }

  /**
   * Wait for page title to match expected
   */
  static async waitForPageTitle(
    page: Page,
    expectedTitle: string,
    options: WaitOptions = {}
  ): Promise<boolean> {
    return this.waitForCondition(
      async () => {
        const title = await page.title();
        return title === expectedTitle;
      },
      {
        timeoutMessage: `Page title does not match "${expectedTitle}"`,
        ...options
      }
    );
  }

  /**
   * Wait for API response with specific status
   */
  static async waitForApiResponse(
    page: Page,
    urlPattern: string | RegExp,
    expectedStatus: number,
    options: WaitOptions = {}
  ): Promise<boolean> {
    const { timeout = 30000 } = options;

    try {
      const response = await page.waitForResponse(
        response => {
          const url = response.url();
          const matchesPattern = typeof urlPattern === 'string' 
            ? url.includes(urlPattern)
            : urlPattern.test(url);
          
          return matchesPattern && response.status() === expectedStatus;
        },
        { timeout }
      );
      
      return response.status() === expectedStatus;
    } catch {
      if (options.throwOnTimeout !== false) {
        throw new Error(`API response with status ${expectedStatus} not received for pattern: ${urlPattern}`);
      }
      return false;
    }
  }

  /**
   * Wait for element to be stable (not moving/changing)
   */
  static async waitForElementStable(
    locator: Locator,
    stabilityDuration: number = 1000,
    options: WaitOptions = {}
  ): Promise<boolean> {
    let lastBoundingBox: any = null;
    let stableStartTime: number | null = null;

    return this.waitForCondition(
      async () => {
        try {
          const currentBoundingBox = await locator.boundingBox();
          
          if (!currentBoundingBox) {
            return false;
          }

          if (lastBoundingBox && 
              currentBoundingBox.x === lastBoundingBox.x &&
              currentBoundingBox.y === lastBoundingBox.y &&
              currentBoundingBox.width === lastBoundingBox.width &&
              currentBoundingBox.height === lastBoundingBox.height) {
            
            if (!stableStartTime) {
              stableStartTime = Date.now();
            }
            
            return Date.now() - stableStartTime >= stabilityDuration;
          } else {
            stableStartTime = null;
            lastBoundingBox = currentBoundingBox;
            return false;
          }
        } catch {
          return false;
        }
      },
      {
        timeoutMessage: `Element did not stabilize within duration`,
        ...options
      }
    );
  }

  /**
   * Simple sleep utility
   */
  static async sleep(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  /**
   * Wait with exponential backoff
   */
  static async waitWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries - 1) {
          break;
        }

        const delay = baseDelay * Math.pow(2, attempt);
        this.logger.warn(`Operation failed on attempt ${attempt + 1}, retrying in ${delay}ms: ${error.message}`);
        await this.sleep(delay);
      }
    }

    throw lastError || new Error('Operation failed after all retries');
  }
}
```

## Factory Pattern Implementation

### Step 1: Page Object Factory

Create a factory for page object creation (`src/utils/PageFactory.ts`):

```typescript
import { Page } from '@playwright/test';
import { Logger } from './logger';

// Import page objects (to be created in next lessons)
// import { HomePage } from '../pages/HomePage';
// import { LoginPage } from '../pages/LoginPage';
// import { ProductPage } from '../pages/ProductPage';
// import { CartPage } from '../pages/CartPage';
// import { CheckoutPage } from '../pages/CheckoutPage';

/**
 * Available page types
 */
export enum PageType {
  HOME = 'home',
  LOGIN = 'login',
  REGISTER = 'register',
  PRODUCT = 'product',
  CART = 'cart',
  CHECKOUT = 'checkout',
  PROFILE = 'profile',
  ADMIN = 'admin'
}

/**
 * Page Factory
 * Centralized creation and management of page objects
 */
export class PageFactory {
  private static pageCache = new Map<string, any>();
  private static logger = Logger.getInstance();

  /**
   * Create or retrieve cached page object
   */
  static getPage<T>(page: Page, pageType: PageType, forceNew: boolean = false): T {
    const cacheKey = `${pageType}_${page.toString()}`;

    if (!forceNew && this.pageCache.has(cacheKey)) {
      this.logger.debug(`Returning cached page object: ${pageType}`);
      return this.pageCache.get(cacheKey);
    }

    this.logger.debug(`Creating new page object: ${pageType}`);
    const pageObject = this.createPageObject<T>(page, pageType);
    
    this.pageCache.set(cacheKey, pageObject);
    return pageObject;
  }

  /**
   * Create specific page object instance
   */
  private static createPageObject<T>(page: Page, pageType: PageType): T {
    switch (pageType) {
      case PageType.HOME:
        // return new HomePage(page) as T;
        throw new Error('HomePage not yet implemented');
      
      case PageType.LOGIN:
        // return new LoginPage(page) as T;
        throw new Error('LoginPage not yet implemented');
      
      case PageType.REGISTER:
        // return new RegisterPage(page) as T;
        throw new Error('RegisterPage not yet implemented');
      
      case PageType.PRODUCT:
        // return new ProductPage(page) as T;
        throw new Error('ProductPage not yet implemented');
      
      case PageType.CART:
        // return new CartPage(page) as T;
        throw new Error('CartPage not yet implemented');
      
      case PageType.CHECKOUT:
        // return new CheckoutPage(page) as T;
        throw new Error('CheckoutPage not yet implemented');
      
      case PageType.PROFILE:
        // return new ProfilePage(page) as T;
        throw new Error('ProfilePage not yet implemented');
      
      case PageType.ADMIN:
        // return new AdminPage(page) as T;
        throw new Error('AdminPage not yet implemented');
      
      default:
        throw new Error(`Unknown page type: ${pageType}`);
    }
  }

  /**
   * Clear page cache
   */
  static clearCache(): void {
    this.logger.debug('Clearing page object cache');
    this.pageCache.clear();
  }

  /**
   * Clear specific page from cache
   */
  static clearPageFromCache(pageType: PageType): void {
    const keysToDelete = Array.from(this.pageCache.keys())
      .filter(key => key.startsWith(pageType));
    
    keysToDelete.forEach(key => {
      this.pageCache.delete(key);
    });
    
    this.logger.debug(`Cleared ${pageType} pages from cache`);
  }
}
```

## Practical Exercise: Framework Foundation Implementation

### Exercise Overview
Implement the complete framework foundation by creating all base classes, utilities, and configuration management.

### Exercise Instructions

#### Step 1: Core Implementation
Create each component following the provided patterns:

1. **Base Classes**:
   - [ ] Implement `BasePage.ts` with all required methods
   - [ ] Implement `BaseApiClient.ts` with HTTP method helpers
   - [ ] Test base class functionality with simple examples

2. **Utility Functions**:
   - [ ] Implement `Logger.ts` with file and console output
   - [ ] Implement `DataGenerator.ts` with test data creation
   - [ ] Implement `WaitUtils.ts` with custom wait strategies
   - [ ] Test utility functions with unit tests

3. **Factory Pattern**:
   - [ ] Implement `PageFactory.ts` with caching mechanism
   - [ ] Create API client factory following similar patterns
   - [ ] Test factory pattern with mock page objects

#### Step 2: Integration Testing
Verify framework components work together:

```typescript
// Create integration test file: tests/framework/framework-integration.spec.ts
import { test, expect } from '@playwright/test';
import { Logger } from '../../src/utils/logger';
import { DataGenerator } from '../../src/utils/dataGenerator';
import { WaitUtils } from '../../src/utils/waitUtils';
import { config } from '../../src/utils/config';

test.describe('Framework Foundation Integration', () => {
  test('Logger functionality', async () => {
    const logger = Logger.getInstance();
    
    logger.info('Testing logger functionality');
    logger.warn('This is a warning message');
    logger.error('This is an error message');
    logger.debug('This is a debug message');
    
    // Verify logger is working (check console output)
    expect(logger).toBeDefined();
  });

  test('Data generator functionality', async () => {
    const userData = DataGenerator.generateUserData();
    const addressData = DataGenerator.generateAddressData();
    const productData = DataGenerator.generateProductData();
    
    expect(userData.email).toContain('@');
    expect(userData.password).toHaveLength(12);
    expect(addressData.zipCode).toBeTruthy();
    expect(productData.price).toBeGreaterThan(0);
  });

  test('Configuration management', async () => {
    expect(config.getBaseUrl()).toBeTruthy();
    expect(config.getTimeout()).toBeGreaterThan(0);
    expect(config.getBrowser()).toBeTruthy();
  });
});
```

#### Step 3: Documentation Creation
Document your framework foundation:

1. **Architecture Documentation** (`docs/framework-architecture.md`):
   - Component overview and relationships
   - Design patterns used and rationale
   - Extension points for future development

2. **API Documentation** (`docs/api-reference.md`):
   - Base class methods and usage examples
   - Utility function documentation
   - Configuration options and environment variables

3. **Developer Guide** (`docs/developer-guide.md`):
   - Framework setup and initialization
   - Adding new page objects and API clients
   - Best practices for test development

### Deliverable Checklist

- [ ] **Base Classes**: `BasePage.ts` and `BaseApiClient.ts` implemented and tested
- [ ] **Utilities**: Logger, DataGenerator, and WaitUtils fully functional
- [ ] **Factory Pattern**: PageFactory implemented with caching
- [ ] **Integration Tests**: Framework components tested together
- [ ] **Configuration**: Environment management working across all components
- [ ] **Documentation**: Comprehensive framework documentation created
- [ ] **Code Quality**: All code passes linting and type checking
- [ ] **Git Commit**: Framework foundation committed with descriptive message

## Summary

This lesson established the core framework foundation by:

1. **Base Classes**: Created reusable base classes for page objects and API clients
2. **Utility Functions**: Implemented logging, data generation, and wait utilities
3. **Design Patterns**: Applied factory pattern for object creation and management
4. **Error Handling**: Established consistent error handling and logging strategies
5. **Type Safety**: Leveraged TypeScript for robust type checking and IDE support

### Key Takeaways

- **Solid Foundation**: Well-designed base classes enable consistent and maintainable test development
- **Utility Functions**: Common utilities reduce code duplication and improve efficiency
- **Design Patterns**: Proper patterns like Factory and Singleton create scalable architecture
- **Error Handling**: Comprehensive error handling and logging enable effective debugging
- **TypeScript Benefits**: Strong typing catches errors early and improves code quality

### Next Steps

In [Lesson 04: Writing and Organizing E2E Tests](../lesson-04-writing-and-organizing-e2e-tests/README.md), you'll:
- Create specific page object implementations using the base classes
- Develop comprehensive test suites using the framework foundation
- Implement test organization strategies and data management
- Apply the Page Object Model pattern to real-world scenarios

### Additional Resources

- **Design Patterns**: [Gang of Four Design Patterns](https://example.com/design-patterns)
- **TypeScript Best Practices**: [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- **Playwright Advanced Features**: [Playwright Documentation](https://playwright.dev/docs/intro)
- **Test Architecture**: [Test Automation Pyramid](https://example.com/test-pyramid)

---

*Your framework foundation is now complete and ready to support scalable test development. Proceed to implement specific page objects and tests in the next lesson!*
