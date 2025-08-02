# Example 04: Production Integration Patterns

## Learning Objectives

By the end of this example, you will be able to:

- 🏢 **Design Enterprise Architecture**: Implement scalable page object organization for large teams
- ⚙️ **Manage Configuration**: Handle environment-specific behaviors and deployment configurations
- 🚀 **Optimize Performance**: Apply production-grade performance optimization techniques
- 🔍 **Implement Monitoring**: Build comprehensive debugging and observability tools
- 🛡️ **Ensure Reliability**: Create robust error handling and recovery mechanisms
- 📊 **Integrate CI/CD**: Seamlessly integrate page objects with continuous deployment pipelines

---

## Introduction

Production-ready page object implementations require sophisticated patterns that go beyond basic functionality. This example explores enterprise-level patterns used in large-scale applications with multiple environments, complex deployment pipelines, and stringent reliability requirements.

### Production vs Development Patterns

**Development Pattern (Simple but Limited):**
```typescript
// ❌ Development-only approach
export class LoginPage {
  private emailInput = this.page.locator('#email');
  
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    // ... simple implementation
  }
}
```

**Production Pattern (Robust and Scalable):**
```typescript
// ✅ Production-ready approach
export class LoginPage extends BasePage implements IMonitorable, IConfigurable {
  private config: LoginPageConfig;
  private monitor: PageMonitor;
  private errorHandler: ErrorHandler;
  
  constructor(page: Page, config: LoginPageConfig) {
    super(page);
    this.config = config;
    this.monitor = new PageMonitor(page, 'LoginPage');
    this.errorHandler = new ErrorHandler(page, this.monitor);
  }
  
  async login(credentials: LoginCredentials): Promise<DashboardPage> {
    const operation = await this.monitor.startOperation('login');
    
    try {
      await this.validateEnvironment();
      await this.waitForStableState();
      
      const result = await this.performLogin(credentials);
      
      operation.succeed();
      return result;
      
    } catch (error) {
      await this.errorHandler.handleError(error, 'login', { credentials });
      operation.fail(error);
      throw error;
    }
  }
}
```

---

## Enterprise Architecture Organization

### 1. Multi-Layer Page Object Structure

```typescript
// architecture/layers/PresentationLayer.ts
export abstract class PresentationLayer {
  protected page: Page;
  protected config: ApplicationConfig;
  protected logger: Logger;
  
  constructor(page: Page, config: ApplicationConfig) {
    this.page = page;
    this.config = config;
    this.logger = LoggerFactory.create(this.constructor.name);
  }
  
  abstract getLayerIdentifier(): string;
}

// architecture/layers/BusinessLayer.ts
export class BusinessLayer extends PresentationLayer {
  private apiClient: ApiClient;
  private dataManager: DataManager;
  
  constructor(page: Page, config: ApplicationConfig) {
    super(page, config);
    this.apiClient = new ApiClient(config.apiBaseUrl);
    this.dataManager = new DataManager(config);
  }
  
  getLayerIdentifier(): string {
    return 'business-layer';
  }
  
  async performBusinessOperation(operationName: string, data: any): Promise<any> {
    this.logger.info(`Executing business operation: ${operationName}`, { data });
    
    // Coordinate between UI and API operations
    const uiResult = await this.performUIOperation(data);
    const apiResult = await this.apiClient.validateOperation(operationName, uiResult);
    
    return { ui: uiResult, api: apiResult };
  }
  
  protected abstract performUIOperation(data: any): Promise<any>;
}

// architecture/layers/InfrastructureLayer.ts
export class InfrastructureLayer {
  private metricsCollector: MetricsCollector;
  private errorReporter: ErrorReporter;
  private configManager: ConfigManager;
  
  constructor(config: ApplicationConfig) {
    this.metricsCollector = new MetricsCollector(config.metrics);
    this.errorReporter = new ErrorReporter(config.errorReporting);
    this.configManager = new ConfigManager(config);
  }
  
  async reportMetric(name: string, value: number, tags?: Record<string, string>): Promise<void> {
    await this.metricsCollector.increment(name, value, tags);
  }
  
  async reportError(error: Error, context: any): Promise<void> {
    await this.errorReporter.report(error, context);
  }
  
  getEnvironmentConfig(): EnvironmentConfig {
    return this.configManager.getCurrentEnvironment();
  }
}
```

### 2. Domain-Driven Page Organization

```typescript
// domains/authentication/pages/LoginPage.ts
export class LoginPage extends BusinessLayer implements IAuthenticationPage {
  private formComponent: LoginFormComponent;
  private securityMonitor: SecurityMonitor;
  
  constructor(page: Page, config: ApplicationConfig) {
    super(page, config);
    this.formComponent = new LoginFormComponent(page, config.forms.login);
    this.securityMonitor = new SecurityMonitor(page, config.security);
  }
  
  protected async performUIOperation(credentials: LoginCredentials): Promise<LoginResult> {
    await this.securityMonitor.validateSecurityHeaders();
    await this.formComponent.fillCredentials(credentials);
    
    const result = await this.formComponent.submit();
    await this.securityMonitor.validatePostLoginSecurity();
    
    return result;
  }
  
  async performSecureLogin(credentials: LoginCredentials): Promise<DashboardPage> {
    const businessResult = await this.performBusinessOperation('secure-login', credentials);
    
    if (businessResult.api.mfaRequired) {
      return PageFactory.createPage(MfaPage, this.page, this.config);
    }
    
    return PageFactory.createPage(DashboardPage, this.page, this.config);
  }
}

// domains/ecommerce/pages/CheckoutPage.ts
export class CheckoutPage extends BusinessLayer implements IEcommercePage {
  private paymentProcessor: PaymentProcessor;
  private inventoryValidator: InventoryValidator;
  private orderTracker: OrderTracker;
  
  constructor(page: Page, config: ApplicationConfig) {
    super(page, config);
    this.paymentProcessor = new PaymentProcessor(page, config.payment);
    this.inventoryValidator = new InventoryValidator(config.inventory);
    this.orderTracker = new OrderTracker(config.orders);
  }
  
  protected async performUIOperation(orderData: OrderData): Promise<OrderResult> {
    // Validate inventory before processing
    await this.inventoryValidator.validateItems(orderData.items);
    
    // Process payment
    const paymentResult = await this.paymentProcessor.processPayment(orderData.payment);
    
    if (!paymentResult.success) {
      throw new PaymentProcessingError(paymentResult.error);
    }
    
    // Complete order
    const orderResult = await this.completeOrderUI(orderData);
    
    // Start order tracking
    await this.orderTracker.startTracking(orderResult.orderId);
    
    return orderResult;
  }
  
  private async completeOrderUI(orderData: OrderData): Promise<OrderResult> {
    const checkoutForm = new CheckoutFormComponent(this.page, this.config.forms.checkout);
    
    await checkoutForm.fillOrderDetails(orderData);
    await checkoutForm.confirmOrder();
    
    return await this.waitForOrderConfirmation();
  }
}
```

---

## Configuration Management

### 1. Environment-Specific Configuration

```typescript
// config/EnvironmentConfig.ts
export interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  apiBaseUrl: string;
  timeouts: TimeoutConfig;
  features: FeatureFlags;
  monitoring: MonitoringConfig;
  errorHandling: ErrorHandlingConfig;
}

export interface TimeoutConfig {
  pageLoad: number;
  elementWait: number;
  networkWait: number;
  formSubmission: number;
}

export interface FeatureFlags {
  enableVideoRecording: boolean;
  enableScreenshots: boolean;
  enablePerformanceMonitoring: boolean;
  enableDetailedLogging: boolean;
  enableRetryOnFailure: boolean;
}

export class ConfigManager {
  private static instance: ConfigManager;
  private currentConfig: EnvironmentConfig;
  
  private constructor() {
    this.loadConfiguration();
  }
  
  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }
  
  private loadConfiguration(): void {
    const environment = process.env.TEST_ENVIRONMENT || 'development';
    
    const configs: Record<string, EnvironmentConfig> = {
      development: {
        name: 'development',
        baseUrl: 'http://localhost:3000',
        apiBaseUrl: 'http://localhost:3001/api',
        timeouts: {
          pageLoad: 10000,
          elementWait: 5000,
          networkWait: 5000,
          formSubmission: 10000
        },
        features: {
          enableVideoRecording: false,
          enableScreenshots: true,
          enablePerformanceMonitoring: false,
          enableDetailedLogging: true,
          enableRetryOnFailure: true
        },
        monitoring: {
          enabled: false,
          endpoint: '',
          apiKey: ''
        },
        errorHandling: {
          retryCount: 3,
          retryDelay: 1000,
          screenshotOnError: true,
          detailedErrorLogging: true
        }
      },
      staging: {
        name: 'staging',
        baseUrl: 'https://staging.example.com',
        apiBaseUrl: 'https://api.staging.example.com',
        timeouts: {
          pageLoad: 15000,
          elementWait: 7000,
          networkWait: 10000,
          formSubmission: 15000
        },
        features: {
          enableVideoRecording: true,
          enableScreenshots: true,
          enablePerformanceMonitoring: true,
          enableDetailedLogging: true,
          enableRetryOnFailure: true
        },
        monitoring: {
          enabled: true,
          endpoint: 'https://monitoring.staging.example.com',
          apiKey: process.env.MONITORING_API_KEY || ''
        },
        errorHandling: {
          retryCount: 2,
          retryDelay: 2000,
          screenshotOnError: true,
          detailedErrorLogging: true
        }
      },
      production: {
        name: 'production',
        baseUrl: 'https://example.com',
        apiBaseUrl: 'https://api.example.com',
        timeouts: {
          pageLoad: 20000,
          elementWait: 10000,
          networkWait: 15000,
          formSubmission: 20000
        },
        features: {
          enableVideoRecording: true,
          enableScreenshots: true,
          enablePerformanceMonitoring: true,
          enableDetailedLogging: false,
          enableRetryOnFailure: true
        },
        monitoring: {
          enabled: true,
          endpoint: 'https://monitoring.example.com',
          apiKey: process.env.MONITORING_API_KEY || ''
        },
        errorHandling: {
          retryCount: 1,
          retryDelay: 3000,
          screenshotOnError: true,
          detailedErrorLogging: false
        }
      }
    };
    
    this.currentConfig = configs[environment];
    if (!this.currentConfig) {
      throw new Error(`Invalid environment: ${environment}`);
    }
  }
  
  getCurrentConfig(): EnvironmentConfig {
    return this.currentConfig;
  }
  
  getTimeout(type: keyof TimeoutConfig): number {
    return this.currentConfig.timeouts[type];
  }
  
  isFeatureEnabled(feature: keyof FeatureFlags): boolean {
    return this.currentConfig.features[feature];
  }
  
  reloadConfiguration(): void {
    this.loadConfiguration();
  }
}
```

### 2. Dynamic Configuration Injection

```typescript
// config/ConfigurablePageObject.ts
export abstract class ConfigurablePageObject extends BasePage {
  protected config: EnvironmentConfig;
  protected timeouts: TimeoutConfig;
  protected features: FeatureFlags;
  
  constructor(page: Page) {
    super(page);
    const configManager = ConfigManager.getInstance();
    this.config = configManager.getCurrentConfig();
    this.timeouts = this.config.timeouts;
    this.features = this.config.features;
  }
  
  protected async waitForElement(locator: Locator, customTimeout?: number): Promise<void> {
    const timeout = customTimeout || this.timeouts.elementWait;
    await locator.waitFor({ state: 'visible', timeout });
  }
  
  protected async navigateWithEnvironmentUrl(path: string): Promise<void> {
    const fullUrl = `${this.config.baseUrl}${path}`;
    await this.page.goto(fullUrl, { timeout: this.timeouts.pageLoad });
  }
  
  protected async performActionWithRetry<T>(
    action: () => Promise<T>,
    actionName: string
  ): Promise<T> {
    if (!this.features.enableRetryOnFailure) {
      return await action();
    }
    
    const { retryCount, retryDelay } = this.config.errorHandling;
    
    for (let attempt = 1; attempt <= retryCount + 1; attempt++) {
      try {
        return await action();
      } catch (error) {
        if (attempt === retryCount + 1) {
          if (this.features.enableScreenshots) {
            await this.takeErrorScreenshot(`${actionName}-final-attempt`);
          }
          throw error;
        }
        
        if (this.features.enableDetailedLogging) {
          console.warn(`${actionName} failed on attempt ${attempt}, retrying...`, error.message);
        }
        
        await this.page.waitForTimeout(retryDelay);
      }
    }
    
    throw new Error(`All retry attempts failed for ${actionName}`);
  }
  
  private async takeErrorScreenshot(name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `error-${name}-${timestamp}.png`;
    await this.page.screenshot({ path: `screenshots/errors/${filename}` });
  }
}
```

---

## Performance Optimization

### 1. Performance Monitoring

```typescript
// monitoring/PerformanceMonitor.ts
export interface PerformanceMetrics {
  pageLoadTime: number;
  elementInteractionTime: number;
  networkRequests: NetworkMetric[];
  memoryUsage: MemoryMetric;
  renderingMetrics: RenderingMetric;
}

export class PerformanceMonitor {
  private page: Page;
  private metrics: PerformanceMetrics;
  private config: EnvironmentConfig;
  
  constructor(page: Page, config: EnvironmentConfig) {
    this.page = page;
    this.config = config;
    this.initializeMetrics();
  }
  
  async startMonitoring(): Promise<void> {
    if (!this.config.features.enablePerformanceMonitoring) {
      return;
    }
    
    // Start performance monitoring
    await this.page.addInitScript(() => {
      window.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        window.performanceEntries = window.performanceEntries || [];
        window.performanceEntries.push(...entries);
      });
      
      window.performanceObserver.observe({ entryTypes: ['navigation', 'resource', 'measure'] });
    });
  }
  
  async measurePageLoad(pageName: string): Promise<number> {
    const startTime = Date.now();
    
    await Promise.all([
      this.page.waitForLoadState('domcontentloaded'),
      this.page.waitForLoadState('networkidle')
    ]);
    
    const loadTime = Date.now() - startTime;
    
    if (this.config.features.enablePerformanceMonitoring) {
      await this.reportMetric('page_load_time', loadTime, { page: pageName });
    }
    
    return loadTime;
  }
  
  async measureElementInteraction(elementName: string, action: () => Promise<void>): Promise<number> {
    const startTime = Date.now();
    await action();
    const interactionTime = Date.now() - startTime;
    
    if (this.config.features.enablePerformanceMonitoring) {
      await this.reportMetric('element_interaction_time', interactionTime, { 
        element: elementName 
      });
    }
    
    return interactionTime;
  }
  
  async getNetworkMetrics(): Promise<NetworkMetric[]> {
    return await this.page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return entries.map(entry => ({
        name: entry.name,
        duration: entry.duration,
        size: entry.transferSize,
        type: entry.initiatorType
      }));
    });
  }
  
  async getMemoryMetrics(): Promise<MemoryMetric> {
    return await this.page.evaluate(() => {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory?.usedJSHeapSize || 0,
        totalJSHeapSize: memory?.totalJSHeapSize || 0,
        jsHeapSizeLimit: memory?.jsHeapSizeLimit || 0
      };
    });
  }
  
  async validatePerformanceThresholds(pageName: string): Promise<PerformanceValidationResult> {
    const thresholds = this.getPerformanceThresholds(pageName);
    const currentMetrics = await this.collectCurrentMetrics();
    
    const violations: PerformanceViolation[] = [];
    
    if (currentMetrics.pageLoadTime > thresholds.maxPageLoadTime) {
      violations.push({
        metric: 'pageLoadTime',
        actual: currentMetrics.pageLoadTime,
        threshold: thresholds.maxPageLoadTime,
        severity: 'warning'
      });
    }
    
    return {
      passed: violations.length === 0,
      violations,
      metrics: currentMetrics
    };
  }
  
  private async reportMetric(name: string, value: number, tags?: Record<string, string>): Promise<void> {
    // Send metrics to monitoring service
    if (this.config.monitoring.enabled) {
      // Implementation would send to actual monitoring service
      console.log(`Metric: ${name} = ${value}`, tags);
    }
  }
  
  private getPerformanceThresholds(pageName: string): PerformanceThresholds {
    const thresholds: Record<string, PerformanceThresholds> = {
      'login': { maxPageLoadTime: 3000, maxElementInteractionTime: 1000 },
      'dashboard': { maxPageLoadTime: 5000, maxElementInteractionTime: 1500 },
      'checkout': { maxPageLoadTime: 4000, maxElementInteractionTime: 2000 }
    };
    
    return thresholds[pageName] || { maxPageLoadTime: 5000, maxElementInteractionTime: 1500 };
  }
}
```

### 2. Resource Optimization

```typescript
// optimization/ResourceOptimizer.ts
export class ResourceOptimizer {
  private page: Page;
  private blockedResources: Set<string> = new Set();
  
  constructor(page: Page) {
    this.page = page;
  }
  
  async optimizeForTesting(): Promise<void> {
    // Block unnecessary resources for faster test execution
    await this.page.route('**/*', (route) => {
      const url = route.request().url();
      const resourceType = route.request().resourceType();
      
      if (this.shouldBlockResource(url, resourceType)) {
        route.abort();
        return;
      }
      
      route.continue();
    });
  }
  
  private shouldBlockResource(url: string, resourceType: string): boolean {
    // Block analytics, ads, and tracking scripts
    const blockedDomains = [
      'google-analytics.com',
      'googletagmanager.com',
      'facebook.com/tr',
      'doubleclick.net',
      'adsystem.com'
    ];
    
    if (blockedDomains.some(domain => url.includes(domain))) {
      return true;
    }
    
    // Block non-essential resources in test environment
    if (resourceType === 'image' && url.includes('banner')) {
      return true;
    }
    
    if (resourceType === 'media' && !url.includes('essential')) {
      return true;
    }
    
    return false;
  }
  
  async preloadCriticalResources(resources: string[]): Promise<void> {
    await this.page.addInitScript((resourceUrls) => {
      resourceUrls.forEach((url: string) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = url.endsWith('.css') ? 'style' : 'script';
        document.head.appendChild(link);
      });
    }, resources);
  }
  
  async optimizeNetworkConditions(): Promise<void> {
    // Simulate various network conditions for testing
    const networkProfiles = {
      fast: { downloadThroughput: 10000000, uploadThroughput: 5000000, latency: 20 },
      slow: { downloadThroughput: 500000, uploadThroughput: 250000, latency: 150 },
      offline: { downloadThroughput: 0, uploadThroughput: 0, latency: 0 }
    };
    
    const profile = process.env.NETWORK_PROFILE || 'fast';
    if (networkProfiles[profile]) {
      const context = this.page.context();
      await context.setExtraHTTPHeaders({
        'Connection': 'keep-alive'
      });
    }
  }
}
```

---

## Comprehensive Error Handling

### 1. Advanced Error Handler

```typescript
// error-handling/ErrorHandler.ts
export class ProductionErrorHandler {
  private page: Page;
  private config: EnvironmentConfig;
  private errorReporter: ErrorReporter;
  private retryManager: RetryManager;
  
  constructor(page: Page, config: EnvironmentConfig) {
    this.page = page;
    this.config = config;
    this.errorReporter = new ErrorReporter(config);
    this.retryManager = new RetryManager(config);
  }
  
  async handleError(error: Error, context: ErrorContext): Promise<void> {
    const errorDetails = await this.captureErrorDetails(error, context);
    
    // Report error to monitoring service
    await this.errorReporter.report(errorDetails);
    
    // Take recovery actions based on error type
    await this.attemptRecovery(error, context);
    
    // Log error details if detailed logging is enabled
    if (this.config.features.enableDetailedLogging) {
      this.logErrorDetails(errorDetails);
    }
  }
  
  private async captureErrorDetails(error: Error, context: ErrorContext): Promise<ErrorDetails> {
    const screenshot = await this.captureScreenshot();
    const pageState = await this.capturePageState();
    const networkLogs = await this.captureNetworkLogs();
    const consoleErrors = await this.captureConsoleErrors();
    
    return {
      error: {
        message: error.message,
        stack: error.stack,
        type: error.constructor.name
      },
      context,
      environment: {
        url: this.page.url(),
        userAgent: await this.page.evaluate(() => navigator.userAgent),
        viewport: await this.page.viewportSize(),
        timestamp: new Date().toISOString()
      },
      artifacts: {
        screenshot,
        pageState,
        networkLogs,
        consoleErrors
      }
    };
  }
  
  private async attemptRecovery(error: Error, context: ErrorContext): Promise<void> {
    if (error instanceof ElementNotFoundError) {
      await this.recoverFromElementNotFound(context);
    } else if (error instanceof TimeoutError) {
      await this.recoverFromTimeout(context);
    } else if (error instanceof NetworkError) {
      await this.recoverFromNetworkError(context);
    }
  }
  
  private async recoverFromElementNotFound(context: ErrorContext): Promise<void> {
    // Try refreshing the page
    try {
      await this.page.reload({ waitUntil: 'networkidle' });
      await this.page.waitForTimeout(2000);
    } catch (recoveryError) {
      console.warn('Failed to recover from element not found error', recoveryError);
    }
  }
  
  private async recoverFromTimeout(context: ErrorContext): Promise<void> {
    // Wait a bit longer and try to continue
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch (recoveryError) {
      console.warn('Failed to recover from timeout error', recoveryError);
    }
  }
  
  private async recoverFromNetworkError(context: ErrorContext): Promise<void> {
    // Retry the network request
    try {
      await this.page.reload({ waitUntil: 'domcontentloaded' });
    } catch (recoveryError) {
      console.warn('Failed to recover from network error', recoveryError);
    }
  }
  
  private async captureScreenshot(): Promise<string> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `error-${timestamp}.png`;
      const path = `screenshots/errors/${filename}`;
      
      await this.page.screenshot({ path, fullPage: true });
      return path;
    } catch {
      return 'screenshot-failed';
    }
  }
  
  private async capturePageState(): Promise<PageState> {
    try {
      return {
        url: this.page.url(),
        title: await this.page.title(),
        html: await this.page.content(),
        localStorage: await this.page.evaluate(() => JSON.stringify(localStorage)),
        sessionStorage: await this.page.evaluate(() => JSON.stringify(sessionStorage)),
        cookies: await this.page.context().cookies()
      };
    } catch {
      return { url: 'capture-failed', title: '', html: '', localStorage: '', sessionStorage: '', cookies: [] };
    }
  }
  
  private async captureNetworkLogs(): Promise<NetworkLog[]> {
    // Implementation would capture network requests/responses
    return [];
  }
  
  private async captureConsoleErrors(): Promise<ConsoleError[]> {
    // Implementation would capture console errors
    return [];
  }
}
```

### 2. Resilient Page Operations

```typescript
// operations/ResilientOperations.ts
export class ResilientPageOperations {
  private page: Page;
  private errorHandler: ProductionErrorHandler;
  private config: EnvironmentConfig;
  
  constructor(page: Page, config: EnvironmentConfig) {
    this.page = page;
    this.config = config;
    this.errorHandler = new ProductionErrorHandler(page, config);
  }
  
  async resilientClick(locator: Locator, options?: ResilientClickOptions): Promise<void> {
    const operation = async () => {
      // Wait for element to be stable
      await this.waitForStableElement(locator);
      
      // Scroll element into view if needed
      await locator.scrollIntoViewIfNeeded();
      
      // Ensure element is clickable
      await locator.waitFor({ state: 'visible' });
      await this.page.waitForTimeout(100); // Brief stability wait
      
      // Perform click with retry
      await locator.click({ timeout: this.config.timeouts.elementWait });
    };
    
    await this.executeWithResilience(operation, 'resilient-click', {
      element: await locator.toString(),
      options
    });
  }
  
  async resilientFill(locator: Locator, value: string, options?: ResilientFillOptions): Promise<void> {
    const operation = async () => {
      await this.waitForStableElement(locator);
      await locator.scrollIntoViewIfNeeded();
      
      // Clear field first
      await locator.clear();
      await this.page.waitForTimeout(100);
      
      // Fill with value
      await locator.fill(value);
      
      // Verify the value was set correctly
      const actualValue = await locator.inputValue();
      if (actualValue !== value) {
        throw new Error(`Failed to fill field. Expected: ${value}, Actual: ${actualValue}`);
      }
    };
    
    await this.executeWithResilience(operation, 'resilient-fill', {
      element: await locator.toString(),
      value,
      options
    });
  }
  
  async resilientWaitForSelector(selector: string, options?: ResilientWaitOptions): Promise<Locator> {
    const operation = async () => {
      const locator = this.page.locator(selector);
      await locator.waitFor({ 
        state: options?.state || 'visible',
        timeout: options?.timeout || this.config.timeouts.elementWait
      });
      return locator;
    };
    
    return await this.executeWithResilience(operation, 'resilient-wait-for-selector', {
      selector,
      options
    });
  }
  
  async resilientNavigation(url: string, options?: ResilientNavigationOptions): Promise<void> {
    const operation = async () => {
      const response = await this.page.goto(url, {
        waitUntil: options?.waitUntil || 'networkidle',
        timeout: this.config.timeouts.pageLoad
      });
      
      if (!response?.ok()) {
        throw new Error(`Navigation failed with status: ${response?.status()}`);
      }
      
      // Verify we're on the correct page
      if (options?.expectedUrlPattern) {
        const currentUrl = this.page.url();
        if (!currentUrl.match(options.expectedUrlPattern)) {
          throw new Error(`Unexpected URL after navigation. Expected pattern: ${options.expectedUrlPattern}, Actual: ${currentUrl}`);
        }
      }
    };
    
    await this.executeWithResilience(operation, 'resilient-navigation', {
      url,
      options
    });
  }
  
  private async waitForStableElement(locator: Locator): Promise<void> {
    // Wait for element to be stable (not moving/changing)
    let previousPosition: any = null;
    const maxAttempts = 10;
    
    for (let i = 0; i < maxAttempts; i++) {
      await locator.waitFor({ state: 'visible' });
      
      const boundingBox = await locator.boundingBox();
      
      if (previousPosition && 
          boundingBox?.x === previousPosition.x && 
          boundingBox?.y === previousPosition.y) {
        return; // Element is stable
      }
      
      previousPosition = boundingBox;
      await this.page.waitForTimeout(100);
    }
  }
  
  private async executeWithResilience<T>(
    operation: () => Promise<T>,
    operationName: string,
    context: any
  ): Promise<T> {
    const { retryCount, retryDelay } = this.config.errorHandling;
    
    for (let attempt = 1; attempt <= retryCount + 1; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === retryCount + 1) {
          await this.errorHandler.handleError(error, {
            operationName,
            attempt,
            context
          });
          throw error;
        }
        
        console.warn(`${operationName} failed on attempt ${attempt}/${retryCount + 1}, retrying...`);
        await this.page.waitForTimeout(retryDelay * attempt); // Exponential backoff
      }
    }
    
    throw new Error(`All attempts failed for ${operationName}`);
  }
}
```

---

## CI/CD Integration

### 1. Pipeline Configuration

```typescript
// ci-cd/PipelineIntegration.ts
export class PipelineIntegration {
  private config: EnvironmentConfig;
  private buildInfo: BuildInfo;
  
  constructor(config: EnvironmentConfig) {
    this.config = config;
    this.buildInfo = this.extractBuildInfo();
  }
  
  private extractBuildInfo(): BuildInfo {
    return {
      buildNumber: process.env.BUILD_NUMBER || 'local',
      gitCommit: process.env.GIT_COMMIT || 'unknown',
      gitBranch: process.env.GIT_BRANCH || 'unknown',
      buildUrl: process.env.BUILD_URL || '',
      timestamp: new Date().toISOString()
    };
  }
  
  async setupTestEnvironment(): Promise<void> {
    // Set up test environment based on CI/CD context
    if (this.isRunningInCI()) {
      await this.configureCIEnvironment();
    } else {
      await this.configureLocalEnvironment();
    }
  }
  
  private isRunningInCI(): boolean {
    return !!(process.env.CI || process.env.GITHUB_ACTIONS || process.env.JENKINS_URL);
  }
  
  private async configureCIEnvironment(): Promise<void> {
    // Configure for CI environment
    process.env.HEADLESS = 'true';
    process.env.VIDEO_RECORDING = 'true';
    process.env.SCREENSHOT_ON_FAILURE = 'true';
    
    // Set up artifact directories
    await this.ensureDirectoryExists('screenshots');
    await this.ensureDirectoryExists('videos');
    await this.ensureDirectoryExists('reports');
  }
  
  private async configureLocalEnvironment(): Promise<void> {
    // Configure for local development
    process.env.HEADLESS = process.env.HEADLESS || 'false';
    process.env.SLOW_MO = process.env.SLOW_MO || '100';
  }
  
  async reportTestResults(results: TestResults): Promise<void> {
    const report = {
      buildInfo: this.buildInfo,
      environment: this.config.name,
      results,
      timestamp: new Date().toISOString()
    };
    
    // Send results to various reporting systems
    await Promise.all([
      this.sendToTestReporting(report),
      this.sendToSlack(report),
      this.updateDashboard(report)
    ]);
  }
  
  private async sendToTestReporting(report: TestReport): Promise<void> {
    // Send to test management system
    if (process.env.TEST_REPORTING_URL) {
      // Implementation would send to actual reporting system
      console.log('Sending test results to reporting system', report);
    }
  }
  
  private async sendToSlack(report: TestReport): Promise<void> {
    // Send notification to Slack
    if (process.env.SLACK_WEBHOOK_URL && report.results.failed > 0) {
      // Implementation would send Slack notification
      console.log('Sending failure notification to Slack', report);
    }
  }
  
  private async updateDashboard(report: TestReport): Promise<void> {
    // Update test dashboard
    if (process.env.DASHBOARD_API_URL) {
      // Implementation would update dashboard
      console.log('Updating test dashboard', report);
    }
  }
}
```

### 2. Parallel Test Execution

```typescript
// ci-cd/ParallelTestManager.ts
export class ParallelTestManager {
  private config: EnvironmentConfig;
  private workerCount: number;
  
  constructor(config: EnvironmentConfig) {
    this.config = config;
    this.workerCount = this.calculateOptimalWorkerCount();
  }
  
  private calculateOptimalWorkerCount(): number {
    const cpuCount = require('os').cpus().length;
    const memoryGB = require('os').totalmem() / (1024 ** 3);
    
    // Conservative approach: 1 worker per 2 CPU cores and 4GB RAM
    const cpuBasedWorkers = Math.floor(cpuCount / 2);
    const memoryBasedWorkers = Math.floor(memoryGB / 4);
    
    const maxWorkers = Math.min(cpuBasedWorkers, memoryBasedWorkers, 8); // Cap at 8
    return Math.max(maxWorkers, 1); // At least 1 worker
  }
  
  async executeTestsInParallel(testSuites: TestSuite[]): Promise<ParallelTestResults> {
    const workerPool = new WorkerPool(this.workerCount);
    const results: TestResult[] = [];
    
    try {
      // Distribute test suites across workers
      const chunks = this.distributeTestSuites(testSuites, this.workerCount);
      
      const workerPromises = chunks.map(async (chunk, index) => {
        const worker = await workerPool.getWorker(index);
        return await worker.executeTests(chunk);
      });
      
      const workerResults = await Promise.all(workerPromises);
      results.push(...workerResults.flat());
      
      return this.aggregateResults(results);
      
    } finally {
      await workerPool.terminate();
    }
  }
  
  private distributeTestSuites(testSuites: TestSuite[], workerCount: number): TestSuite[][] {
    const chunks: TestSuite[][] = Array.from({ length: workerCount }, () => []);\n    \n    // Distribute based on estimated execution time\n    testSuites\n      .sort((a, b) => b.estimatedDuration - a.estimatedDuration)\n      .forEach((suite, index) => {\n        const workerIndex = index % workerCount;\n        chunks[workerIndex].push(suite);\n      });\n    \n    return chunks.filter(chunk => chunk.length > 0);\n  }
  
  private aggregateResults(results: TestResult[]): ParallelTestResults {
    const totalTests = results.length;
    const passedTests = results.filter(r => r.status === 'passed').length;
    const failedTests = results.filter(r => r.status === 'failed').length;
    const skippedTests = results.filter(r => r.status === 'skipped').length;
    
    return {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      skipped: skippedTests,
      duration: Math.max(...results.map(r => r.duration)),
      results
    };
  }
}
```

---

## Complete Production Example

```typescript
// pages/ProductionEcommercePage.ts
export class ProductionEcommercePage extends ConfigurablePageObject implements IMonitorable {
  private performanceMonitor: PerformanceMonitor;
  private errorHandler: ProductionErrorHandler;
  private resilientOps: ResilientPageOperations;
  private infrastructureLayer: InfrastructureLayer;
  
  // Components
  private headerComponent: HeaderComponent;
  private productGridComponent: ProductGridComponent;
  private filterComponent: FilterComponent;
  
  constructor(page: Page) {
    super(page);
    
    // Initialize monitoring and error handling
    this.performanceMonitor = new PerformanceMonitor(page, this.config);
    this.errorHandler = new ProductionErrorHandler(page, this.config);
    this.resilientOps = new ResilientPageOperations(page, this.config);
    this.infrastructureLayer = new InfrastructureLayer(this.config);
    
    // Initialize components
    this.headerComponent = ComponentFactory.createComponent(HeaderComponent, page);
    this.productGridComponent = ComponentFactory.createComponent(ProductGridComponent, page, '.product-grid');
    this.filterComponent = ComponentFactory.createComponent(FilterComponent, page, '.filters-sidebar');
  }
  
  getPageMetadata(): PageMetadata {
    return {
      title: 'E-commerce Product Catalog',
      url: '/products',
      identifier: 'ecommerce-catalog'
    };
  }
  
  async waitForPageLoad(): Promise<void> {
    const loadTime = await this.performanceMonitor.measurePageLoad('ecommerce-catalog');
    
    await Promise.all([
      this.headerComponent.waitForComponent(),
      this.productGridComponent.waitForComponent(),
      this.filterComponent.waitForComponent()
    ]);
    
    // Validate performance thresholds
    const performanceValidation = await this.performanceMonitor.validatePerformanceThresholds('ecommerce-catalog');
    if (!performanceValidation.passed) {
      await this.infrastructureLayer.reportMetric('performance_threshold_violation', 1, {
        page: 'ecommerce-catalog',
        violations: performanceValidation.violations.length.toString()
      });
    }
  }
  
  async isPageLoaded(): Promise<boolean> {
    try {
      return await this.headerComponent.isVisible() && 
             await this.productGridComponent.isVisible();
    } catch (error) {
      await this.errorHandler.handleError(error, {
        operationName: 'isPageLoaded',
        context: { page: 'ecommerce-catalog' }
      });
      return false;
    }
  }
  
  async searchForProducts(query: string): Promise<ProductionEcommercePage> {
    return await this.performActionWithRetry(async () => {
      const searchTime = await this.performanceMonitor.measureElementInteraction('search', async () => {
        await this.headerComponent.search(query);
      });
      
      await this.waitForSearchResults();
      
      // Report search metrics
      await this.infrastructureLayer.reportMetric('search_duration', searchTime, {
        query: query.length.toString()
      });
      
      return this;
    }, 'searchForProducts');
  }
  
  async filterByCategory(category: string): Promise<ProductionEcommercePage> {
    return await this.performActionWithRetry(async () => {
      await this.filterComponent.selectCategory(category);
      await this.waitForFilterResults();
      return this;
    }, 'filterByCategory');
  }
  
  async addProductToCart(productId: string): Promise<void> {
    await this.performActionWithRetry(async () => {
      const productCard = await this.resilientOps.resilientWaitForSelector(
        `[data-product-id="${productId}"]`
      );
      
      const addToCartButton = productCard.locator('.add-to-cart-btn');
      await this.resilientOps.resilientClick(addToCartButton);
      
      // Wait for cart update confirmation
      await this.resilientOps.resilientWaitForSelector('.cart-success-message');
      
      // Report successful add to cart
      await this.infrastructureLayer.reportMetric('add_to_cart_success', 1, {
        productId
      });
      
    }, 'addProductToCart');
  }
  
  async validateProductDisplays(): Promise<ValidationResult> {
    try {\n      const products = await this.productGridComponent.getAllProducts();\n      const validationResults = await Promise.all(\n        products.map(product => this.validateSingleProduct(product))\n      );\n      \n      const failedValidations = validationResults.filter(result => !result.isValid);\n      \n      if (failedValidations.length > 0) {\n        await this.infrastructureLayer.reportMetric('product_validation_failures', failedValidations.length);\n      }\n      \n      return {\n        isValid: failedValidations.length === 0,\n        totalProducts: products.length,\n        failedValidations\n      };\n      \n    } catch (error) {\n      await this.errorHandler.handleError(error, {\n        operationName: 'validateProductDisplays'\n      });\n      throw error;\n    }\n  }
  
  private async validateSingleProduct(product: Product): Promise<ProductValidationResult> {
    const validations = [\n      { name: 'hasName', isValid: !!product.name },\n      { name: 'hasPrice', isValid: product.price > 0 },\n      { name: 'hasImage', isValid: !!product.imageUrl },\n      { name: 'hasValidId', isValid: !!product.id }\n    ];\n    \n    const failedValidations = validations.filter(v => !v.isValid);\n    \n    return {\n      productId: product.id,\n      isValid: failedValidations.length === 0,\n      failedValidations: failedValidations.map(v => v.name)\n    };\n  }
  
  private async waitForSearchResults(): Promise<void> {
    await this.resilientOps.resilientWaitForSelector('.search-results-container');
    await this.page.waitForFunction(\n      () => !document.querySelector('.search-loading'),\n      { timeout: this.timeouts.networkWait }\n    );\n  }
  
  private async waitForFilterResults(): Promise<void> {
    await this.resilientOps.resilientWaitForSelector('.filter-results-updated');
  }
}
```

---

## Summary

This example demonstrated production-ready integration patterns for enterprise-scale page object implementations:

### Enterprise Architecture

1. **Multi-Layer Design**: Separation of presentation, business, and infrastructure concerns
2. **Domain-Driven Organization**: Page objects organized by business domains
3. **Configuration Management**: Environment-specific behavior and feature flags
4. **Performance Monitoring**: Comprehensive metrics collection and threshold validation
5. **Error Handling**: Advanced error recovery and reporting mechanisms
6. **CI/CD Integration**: Seamless integration with deployment pipelines

### Production Benefits

- ✅ **Scalability**: Architecture that supports large teams and complex applications
- ✅ **Reliability**: Robust error handling and recovery mechanisms
- ✅ **Observability**: Comprehensive monitoring and reporting
- ✅ **Performance**: Optimized operations and resource management
- ✅ **Maintainability**: Clear separation of concerns and configuration management
- ✅ **CI/CD Ready**: Built-in support for continuous integration workflows

### Key Production Features

- **Environment Configuration**: Dynamic behavior based on deployment environment
- **Performance Thresholds**: Automated validation of performance metrics
- **Error Recovery**: Intelligent recovery from common failure scenarios
- **Resource Optimization**: Network and resource optimization for faster execution
- **Parallel Execution**: Efficient distribution of tests across multiple workers
- **Comprehensive Reporting**: Integration with monitoring and reporting systems

---

## Next Steps

You've mastered production integration patterns! Now you can:

1. **Implement**: Apply these patterns to your enterprise testing projects
2. **Customize**: Adapt the architecture to your specific organizational needs
3. **Scale**: Use these patterns to support large-scale testing initiatives
4. **Monitor**: Implement comprehensive observability for your test automation
5. **Continue Learning**: Proceed to the [exercises](../exercises/) to practice these concepts

Ready to put these production patterns into practice? Let's move to the hands-on exercises! 🚀