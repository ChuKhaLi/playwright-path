# Exercise 03: Page Object Model Integration Lab

## Overview

This hands-on lab exercise focuses on professionally integrating Page Object Model (POM) patterns with Cucumber step definitions. You'll build a comprehensive, maintainable automation framework that separates business logic from technical implementation while maintaining type safety throughout.

## Learning Objectives

By completing this lab, you will be able to:

### **Primary Objectives**
- Integrate Page Object Models seamlessly with Cucumber step definitions
- Implement service layer patterns for complex business operations
- Create maintainable and reusable step definition patterns
- Use dependency injection for flexible POM management
- Handle complex user interactions through business-focused step definitions

### **Secondary Objectives**
- Optimize POM performance and memory usage
- Implement advanced error handling with POM integration
- Create composite page patterns for multi-page workflows
- Debug POM-related issues in BDD contexts
- Build scalable architecture for enterprise applications

## Lab Scenario

**Context**: You're building a comprehensive E2E testing framework for a multi-module enterprise application including:
- Authentication system with SSO integration
- Customer relationship management (CRM)
- Inventory management system
- Reporting and analytics dashboard
- Admin configuration panels

**Business Value**: Creating a robust, maintainable testing framework that scales with application complexity while remaining readable for business stakeholders.

**Your Role**: Lead QA Automation Architect designing the testing framework architecture.

## Prerequisites

- Completed Exercise 01 (Basic Step Definition Workshop) and Exercise 02 (Parameter Handling Mastery)
- Understanding of Page Object Model concepts
- Knowledge of TypeScript interfaces and dependency injection
- Familiarity with enterprise application patterns

## Lab Setup: Framework Architecture (15 minutes)

### **Task**: Create the foundational POM framework structure

### **Implementation**: Create the core framework files

#### **1. Page Object Base Class** - `support/page-objects/base-page.ts`

```typescript
import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../utils/logger';
import { WaitConditions } from '../utils/wait-conditions';

export abstract class BasePage {
  protected readonly page: Page;
  protected readonly logger: Logger;
  protected readonly waitConditions: WaitConditions;
  
  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger(this.constructor.name);
    this.waitConditions = new WaitConditions(page);
  }
  
  // Abstract properties that each page must define
  abstract readonly url: string;
  abstract readonly pageTitle: string;
  abstract readonly mainSelector: string;
  
  // Common navigation methods
  async navigate(): Promise<void> {
    this.logger.info(`Navigating to ${this.url}`);
    await this.page.goto(this.url);
    await this.waitForPageLoad();
  }
  
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForSelector(this.mainSelector, { state: 'visible' });
    await this.waitConditions.networkIdle();
    this.logger.info(`Page loaded: ${this.constructor.name}`);
  }
  
  async verifyPageLoaded(): Promise<void> {
    await expect(this.page.locator(this.mainSelector)).toBeVisible();
    await expect(this.page).toHaveTitle(new RegExp(this.pageTitle, 'i'));
    this.logger.info(`Verified page loaded: ${this.pageTitle}`);
  }
  
  // Common interaction patterns
  protected async clickElement(selector: string, description?: string): Promise<void> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible' });
    await element.click();
    this.logger.info(`Clicked: ${description || selector}`);
  }
  
  protected async fillField(selector: string, value: string, description?: string): Promise<void> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible' });
    await element.clear();
    await element.fill(value);
    this.logger.info(`Filled ${description || selector}: ${value}`);
  }
  
  protected async selectOption(selector: string, value: string, description?: string): Promise<void> {
    await this.page.selectOption(selector, value);
    this.logger.info(`Selected ${description || selector}: ${value}`);
  }
  
  // Common validation patterns
  protected async verifyElementVisible(selector: string, description?: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeVisible();
    this.logger.info(`Verified visible: ${description || selector}`);
  }
  
  protected async verifyElementText(selector: string, expectedText: string, description?: string): Promise<void> {
    await expect(this.page.locator(selector)).toHaveText(expectedText);
    this.logger.info(`Verified text ${description || selector}: ${expectedText}`);
  }
  
  protected async verifyElementCount(selector: string, expectedCount: number, description?: string): Promise<void> {
    await expect(this.page.locator(selector)).toHaveCount(expectedCount);
    this.logger.info(`Verified count ${description || selector}: ${expectedCount}`);
  }
  
  // Error handling and screenshots
  async takeScreenshot(name?: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name || this.constructor.name}-${timestamp}.png`;
    const path = `screenshots/${filename}`;
    
    await this.page.screenshot({ path, fullPage: true });
    this.logger.info(`Screenshot saved: ${path}`);
    return path;
  }
  
  async handleError(error: Error, context: string): Promise<void> {
    this.logger.error(`Error in ${context}: ${error.message}`);
    await this.takeScreenshot(`error-${context}`);
    
    // Add additional debugging information
    const url = this.page.url();
    const title = await this.page.title();
    this.logger.error(`Current URL: ${url}`);
    this.logger.error(`Current Title: ${title}`);
    
    throw error;
  }
}
```

#### **2. Authentication Page Object** - `support/page-objects/auth/login-page.ts`

```typescript
import { BasePage } from '../base-page';
import { User } from '../../types/user.types';

export class LoginPage extends BasePage {
  readonly url = '/auth/login';
  readonly pageTitle = 'Login - Enterprise Portal';
  readonly mainSelector = '[data-testid="login-form"]';
  
  // Page elements
  private readonly usernameField = '[data-testid="username-input"]';
  private readonly passwordField = '[data-testid="password-input"]';
  private readonly loginButton = '[data-testid="login-button"]';
  private readonly forgotPasswordLink = '[data-testid="forgot-password-link"]';
  private readonly ssoButton = '[data-testid="sso-login-button"]';
  private readonly errorMessage = '[data-testid="error-message"]';
  private readonly successMessage = '[data-testid="success-message"]';
  
  // Business methods
  async loginWithCredentials(username: string, password: string): Promise<void> {
    try {
      this.logger.info(`Logging in user: ${username}`);
      
      await this.fillField(this.usernameField, username, 'Username');
      await this.fillField(this.passwordField, password, 'Password');
      await this.clickElement(this.loginButton, 'Login Button');
      
      // Wait for either success or error
      await Promise.race([
        this.page.waitForSelector(this.successMessage, { state: 'visible' }),
        this.page.waitForSelector(this.errorMessage, { state: 'visible' }),
        this.page.waitForURL('**/dashboard', { timeout: 5000 })
      ]);
      
      this.logger.info(`Login attempt completed for: ${username}`);
      
    } catch (error) {
      await this.handleError(error as Error, 'loginWithCredentials');
    }
  }
  
  async loginWithUser(user: User): Promise<void> {
    await this.loginWithCredentials(user.username, user.password);
  }
  
  async loginWithSSO(): Promise<void> {
    try {
      this.logger.info('Initiating SSO login');
      await this.clickElement(this.ssoButton, 'SSO Login Button');
      
      // Handle SSO redirect (simplified)
      await this.page.waitForURL('**/sso/**', { timeout: 10000 });
      this.logger.info('SSO redirect completed');
      
    } catch (error) {
      await this.handleError(error as Error, 'loginWithSSO');
    }
  }
  
  async attemptInvalidLogin(username: string, password: string): Promise<string> {
    await this.fillField(this.usernameField, username, 'Username');
    await this.fillField(this.passwordField, password, 'Password');
    await this.clickElement(this.loginButton, 'Login Button');
    
    // Wait for error message
    await this.page.waitForSelector(this.errorMessage, { state: 'visible' });
    const errorText = await this.page.locator(this.errorMessage).textContent();
    
    this.logger.info(`Invalid login error: ${errorText}`);
    return errorText || 'Unknown error';
  }
  
  // Validation methods
  async verifyLoginFormVisible(): Promise<void> {
    await this.verifyElementVisible(this.usernameField, 'Username Field');
    await this.verifyElementVisible(this.passwordField, 'Password Field');
    await this.verifyElementVisible(this.loginButton, 'Login Button');
  }
  
  async verifyLoginSuccess(): Promise<void> {
    // Check if redirected to dashboard or success message is shown
    const isRedirected = await this.page.url().includes('/dashboard');
    const hasSuccessMessage = await this.page.locator(this.successMessage).isVisible();
    
    if (!isRedirected && !hasSuccessMessage) {
      throw new Error('Login success verification failed');
    }
    
    this.logger.info('Login success verified');
  }
  
  async verifyLoginError(expectedError?: string): Promise<void> {
    await this.verifyElementVisible(this.errorMessage, 'Error Message');
    
    if (expectedError) {
      await this.verifyElementText(this.errorMessage, expectedError, 'Error Message Text');
    }
  }
  
  async getErrorMessage(): Promise<string> {
    await this.page.waitForSelector(this.errorMessage, { state: 'visible' });
    return await this.page.locator(this.errorMessage).textContent() || '';
  }
}
```

#### **3. Dashboard Page Object** - `support/page-objects/dashboard/dashboard-page.ts`

```typescript
import { BasePage } from '../base-page';
import { NavigationComponent } from '../components/navigation-component';
import { DashboardWidget } from '../../types/dashboard.types';

export class DashboardPage extends BasePage {
  readonly url = '/dashboard';
  readonly pageTitle = 'Dashboard - Enterprise Portal';
  readonly mainSelector = '[data-testid="dashboard-container"]';
  
  // Components
  private readonly navigation: NavigationComponent;
  
  // Page elements
  private readonly welcomeMessage = '[data-testid="welcome-message"]';
  private readonly userProfile = '[data-testid="user-profile"]';
  private readonly widgetContainer = '[data-testid="widget-container"]';
  private readonly widget = '[data-testid="dashboard-widget"]';
  private readonly addWidgetButton = '[data-testid="add-widget-button"]';
  private readonly refreshButton = '[data-testid="refresh-dashboard"]';
  
  constructor(page: any) {
    super(page);
    this.navigation = new NavigationComponent(page);
  }
  
  // Business methods
  async verifyWelcomeMessage(expectedUser: string): Promise<void> {
    await this.verifyElementVisible(this.welcomeMessage, 'Welcome Message');
    const welcomeText = await this.page.locator(this.welcomeMessage).textContent();
    
    if (!welcomeText?.includes(expectedUser)) {
      throw new Error(`Welcome message doesn't contain expected user: ${expectedUser}`);
    }
    
    this.logger.info(`Welcome message verified for user: ${expectedUser}`);
  }
  
  async getAvailableWidgets(): Promise<DashboardWidget[]> {
    await this.page.waitForSelector(this.widget, { state: 'attached' });
    const widgets = await this.page.locator(this.widget).all();
    
    const dashboardWidgets: DashboardWidget[] = [];
    
    for (const widget of widgets) {
      const title = await widget.locator('[data-testid="widget-title"]').textContent();
      const type = await widget.getAttribute('data-widget-type');
      const isVisible = await widget.isVisible();
      
      dashboardWidgets.push({
        title: title || 'Unknown',
        type: type || 'unknown',
        visible: isVisible
      });
    }
    
    this.logger.info(`Found ${dashboardWidgets.length} dashboard widgets`);
    return dashboardWidgets;
  }
  
  async addWidget(widgetType: string): Promise<void> {
    try {
      await this.clickElement(this.addWidgetButton, 'Add Widget Button');
      
      // Wait for widget selection modal
      await this.page.waitForSelector('[data-testid="widget-selection-modal"]');
      
      // Select widget type
      await this.clickElement(`[data-widget-type="${widgetType}"]`, `Widget Type: ${widgetType}`);
      
      // Confirm addition
      await this.clickElement('[data-testid="confirm-add-widget"]', 'Confirm Add Widget');
      
      // Wait for widget to be added
      await this.page.waitForSelector(`[data-widget-type="${widgetType}"]`, { state: 'visible' });
      
      this.logger.info(`Successfully added widget: ${widgetType}`);
      
    } catch (error) {
      await this.handleError(error as Error, 'addWidget');
    }
  }
  
  async refreshDashboard(): Promise<void> {
    await this.clickElement(this.refreshButton, 'Refresh Dashboard');
    await this.waitConditions.networkIdle();
    this.logger.info('Dashboard refreshed');
  }
  
  async navigateToSection(section: string): Promise<void> {
    await this.navigation.navigateToSection(section);
  }
  
  // Validation methods
  async verifyDashboardLoaded(): Promise<void> {
    await this.verifyPageLoaded();
    await this.verifyElementVisible(this.welcomeMessage, 'Welcome Message');
    await this.verifyElementVisible(this.userProfile, 'User Profile');
    await this.verifyElementVisible(this.widgetContainer, 'Widget Container');
  }
  
  async verifyWidgetCount(expectedCount: number): Promise<void> {
    await this.verifyElementCount(this.widget, expectedCount, 'Dashboard Widgets');
  }
  
  async verifyWidgetPresent(widgetType: string): Promise<void> {
    await this.verifyElementVisible(`[data-widget-type="${widgetType}"]`, `Widget: ${widgetType}`);
  }
}
```

### **Validation Criteria**
- ✅ Base page class provides common functionality
- ✅ Page objects are well-structured with clear business methods
- ✅ Error handling is comprehensive
- ✅ Logging provides useful debugging information

## Lab Task 1: Service Layer Integration (25 minutes)

### **Objective**: Create service layer patterns for complex business operations

### **Implementation**: Create business service classes

#### **1. Authentication Service** - `support/services/auth-service.ts`

```typescript
import { Page } from '@playwright/test';
import { LoginPage } from '../page-objects/auth/login-page';
import { DashboardPage } from '../page-objects/dashboard/dashboard-page';
import { User, UserRole } from '../types/user.types';
import { Logger } from '../utils/logger';

export class AuthenticationService {
  private readonly logger: Logger;
  private readonly loginPage: LoginPage;
  private readonly dashboardPage: DashboardPage;
  
  constructor(private readonly page: Page) {
    this.logger = new Logger('AuthenticationService');
    this.loginPage = new LoginPage(page);
    this.dashboardPage = new DashboardPage(page);
  }
  
  async loginAsUser(userRole: UserRole, credentials?: Partial<User>): Promise<User> {
    try {
      this.logger.info(`Logging in as ${userRole}`);
      
      // Get user credentials based on role
      const user = this.getUserCredentials(userRole, credentials);
      
      // Navigate to login page if not already there
      if (!this.page.url().includes('/login')) {
        await this.loginPage.navigate();
      }
      
      // Perform login
      await this.loginPage.loginWithUser(user);
      
      // Verify login success
      await this.loginPage.verifyLoginSuccess();
      
      // Verify dashboard loads
      await this.dashboardPage.verifyDashboardLoaded();
      await this.dashboardPage.verifyWelcomeMessage(user.displayName);
      
      this.logger.info(`Successfully logged in as ${userRole}: ${user.username}`);
      return user;
      
    } catch (error) {
      this.logger.error(`Login failed for ${userRole}: ${error.message}`);
      throw error;
    }
  }
  
  async loginWithSSO(): Promise<void> {
    await this.loginPage.navigate();
    await this.loginPage.loginWithSSO();
    await this.dashboardPage.verifyDashboardLoaded();
  }
  
  async attemptInvalidLogin(username: string, password: string): Promise<string> {
    await this.loginPage.navigate();
    return await this.loginPage.attemptInvalidLogin(username, password);
  }
  
  async logout(): Promise<void> {
    try {
      // Navigate to dashboard if not already there
      if (!this.page.url().includes('/dashboard')) {
        await this.dashboardPage.navigate();
      }
      
      // Perform logout through navigation component
      await this.dashboardPage.navigateToSection('logout');
      
      // Verify logout success (redirected to login page)
      await this.page.waitForURL('**/login');
      await this.loginPage.verifyLoginFormVisible();
      
      this.logger.info('Successfully logged out');
      
    } catch (error) {
      this.logger.error(`Logout failed: ${error.message}`);
      throw error;
    }
  }
  
  private getUserCredentials(role: UserRole, overrides?: Partial<User>): User {
    const baseUsers: Record<UserRole, User> = {
      admin: {
        username: 'admin@example.com',
        password: 'Admin123!',
        displayName: 'System Administrator',
        role: 'admin',
        permissions: ['all']
      },
      manager: {
        username: 'manager@example.com',
        password: 'Manager123!',
        displayName: 'Project Manager',
        role: 'manager',
        permissions: ['read', 'write', 'manage_team']
      },
      developer: {
        username: 'developer@example.com',
        password: 'Dev123!',
        displayName: 'Senior Developer',
        role: 'developer',
        permissions: ['read', 'write', 'code']
      },
      tester: {
        username: 'tester@example.com',
        password: 'Test123!',
        displayName: 'QA Tester',
        role: 'tester',
        permissions: ['read', 'write', 'test']
      },
      viewer: {
        username: 'viewer@example.com',
        password: 'View123!',
        displayName: 'Guest Viewer',
        role: 'viewer',
        permissions: ['read']
      }
    };
    
    return { ...baseUsers[role], ...overrides };
  }
}
```

#### **2. Dashboard Service** - `support/services/dashboard-service.ts`

```typescript
import { Page } from '@playwright/test';
import { DashboardPage } from '../page-objects/dashboard/dashboard-page';
import { DashboardWidget, WidgetConfiguration } from '../types/dashboard.types';
import { Logger } from '../utils/logger';

export class DashboardService {
  private readonly logger: Logger;
  private readonly dashboardPage: DashboardPage;
  
  constructor(private readonly page: Page) {
    this.logger = new Logger('DashboardService');
    this.dashboardPage = new DashboardPage(page);
  }
  
  async setupDashboardForUser(userRole: string, widgetConfig?: WidgetConfiguration): Promise<void> {
    try {
      this.logger.info(`Setting up dashboard for ${userRole}`);
      
      // Navigate to dashboard
      await this.dashboardPage.navigate();
      await this.dashboardPage.verifyDashboardLoaded();
      
      // Configure widgets based on user role
      const requiredWidgets = this.getRequiredWidgetsForRole(userRole);
      
      for (const widgetType of requiredWidgets) {
        await this.ensureWidgetPresent(widgetType);
      }
      
      // Apply custom configuration if provided
      if (widgetConfig) {
        await this.applyWidgetConfiguration(widgetConfig);
      }
      
      // Refresh to ensure everything is loaded
      await this.dashboardPage.refreshDashboard();
      
      this.logger.info(`Dashboard setup completed for ${userRole}`);
      
    } catch (error) {
      this.logger.error(`Dashboard setup failed for ${userRole}: ${error.message}`);
      throw error;
    }
  }
  
  async verifyDashboardState(expectedWidgets: string[], userDisplayName: string): Promise<void> {
    await this.dashboardPage.verifyDashboardLoaded();
    await this.dashboardPage.verifyWelcomeMessage(userDisplayName);
    await this.dashboardPage.verifyWidgetCount(expectedWidgets.length);
    
    for (const widgetType of expectedWidgets) {
      await this.dashboardPage.verifyWidgetPresent(widgetType);
    }
  }
  
  async getDashboardState(): Promise<{
    widgets: DashboardWidget[];
    userInfo: string;
    url: string;
  }> {
    const widgets = await this.dashboardPage.getAvailableWidgets();
    const userInfo = await this.page.locator('[data-testid="user-profile"]').textContent();
    const url = this.page.url();
    
    return {
      widgets,
      userInfo: userInfo || 'Unknown',
      url
    };
  }
  
  private async ensureWidgetPresent(widgetType: string): Promise<void> {
    try {
      // Check if widget already exists
      await this.dashboardPage.verifyWidgetPresent(widgetType);
      this.logger.info(`Widget ${widgetType} already present`);
    } catch {
      // Widget doesn't exist, add it
      await this.dashboardPage.addWidget(widgetType);
      this.logger.info(`Added widget: ${widgetType}`);
    }
  }
  
  private async applyWidgetConfiguration(config: WidgetConfiguration): Promise<void> {
    for (const [widgetType, settings] of Object.entries(config.widgets)) {
      // This would typically involve clicking on widget settings and configuring
      this.logger.info(`Configuring widget ${widgetType} with settings:`, settings);
    }
  }
  
  private getRequiredWidgetsForRole(userRole: string): string[] {
    const roleWidgets: Record<string, string[]> = {
      admin: ['system-status', 'user-management', 'audit-log', 'performance-metrics'],
      manager: ['team-overview', 'project-status', 'reports', 'calendar'],
      developer: ['task-list', 'code-reviews', 'build-status', 'documentation'],
      tester: ['test-results', 'bug-reports', 'test-schedule', 'quality-metrics'],
      viewer: ['announcements', 'company-news', 'calendar']
    };
    
    return roleWidgets[userRole] || roleWidgets.viewer;
  }
}
```

### **Validation Criteria**
- ✅ Service layer abstracts complex business operations
- ✅ Services coordinate multiple page objects effectively
- ✅ Business logic is separated from UI interaction details
- ✅ Error handling maintains business context

## Lab Task 2: Step Definition Integration (30 minutes)

### **Objective**: Create maintainable step definitions using the POM framework

### **Implementation**: Comprehensive step definitions with POM integration

#### **1. Authentication Step Definitions** - `step-definitions/auth.steps.ts`

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { AuthenticationService } from '../support/services/auth-service';
import { UserRole } from '../support/types/user.types';

// Initialize services in World class
declare module '../support/world' {
  interface CustomWorld {
    authService: AuthenticationService;
  }
}

Given('I am not logged in', async function (this: CustomWorld) {
  // Ensure we start from a logged out state
  try {
    await this.authService.logout();
  } catch {
    // Ignore if already logged out
  }
  
  // Navigate to login page to verify logged out state
  await this.page!.goto('/login');
  console.log('✅ Confirmed logged out state');
});

Given('I am logged in as a {user_with_attributes}', async function (this: CustomWorld, userSpec) {
  const user = await this.authService.loginAsUser(userSpec.role, {
    displayName: `Test ${userSpec.role.charAt(0).toUpperCase() + userSpec.role.slice(1)}`,
    permissions: userSpec.permissions
  });
  
  // Store user context for later steps
  this.testData.currentUser = user;
  
  console.log(`✅ Logged in as ${userSpec.role}: ${user.displayName}`);
  console.log(`   Permissions: ${userSpec.permissions.join(', ')}`);
});

Given('I am on the login page', async function (this: CustomWorld) {
  const loginPage = this.pageObjects.getLoginPage();
  await loginPage.navigate();
  await loginPage.verifyLoginFormVisible();
  
  console.log('✅ Navigated to login page');
});

When('I login with username {string} and password {string}', async function (this: CustomWorld, username: string, password: string) {
  const loginPage = this.pageObjects.getLoginPage();
  await loginPage.loginWithCredentials(username, password);
  
  // Store login attempt for verification
  this.testData.lastLoginAttempt = { username, password, timestamp: new Date() };
  
  console.log(`✅ Attempted login: ${username}`);
});

When('I attempt to login with invalid credentials {string}/{string}', async function (this: CustomWorld, username: string, password: string) {
  const errorMessage = await this.authService.attemptInvalidLogin(username, password);
  
  // Store error for verification
  this.testData.lastLoginError = errorMessage;
  
  console.log(`✅ Invalid login attempted: ${username} - Error: ${errorMessage}`);
});

When('I login using SSO', async function (this: CustomWorld) {
  await this.authService.loginWithSSO();
  console.log('✅ SSO login completed');
});

When('I logout', async function (this: CustomWorld) {
  await this.authService.logout();
  this.testData.currentUser = undefined;
  console.log('✅ Logged out successfully');
});

Then('I should be logged in successfully', async function (this: CustomWorld) {
  const dashboardPage = this.pageObjects.getDashboardPage();
  await dashboardPage.verifyDashboardLoaded();
  
  if (this.testData.currentUser) {
    await dashboardPage.verifyWelcomeMessage(this.testData.currentUser.displayName);
  }
  
  console.log('✅ Login success verified');
});

Then('I should see a login error message containing {string}', async function (this: CustomWorld, expectedError: string) {
  const loginPage = this.pageObjects.getLoginPage();
  await loginPage.verifyLoginError(expectedError);
  
  const actualError = this.testData.lastLoginError || '';
  expect(actualError.toLowerCase()).toContain(expectedError.toLowerCase());
  
  console.log(`✅ Login error verified: ${expectedError}`);
});

Then('I should be redirected to the login page', async function (this: CustomWorld) {
  await this.page!.waitForURL('**/login', { timeout: 5000 });
  
  const loginPage = this.pageObjects.getLoginPage();
  await loginPage.verifyLoginFormVisible();
  
  console.log('✅ Redirected to login page');
});

// Complex authentication scenarios
Given('I have the following user roles available:', async function (this: CustomWorld, dataTable) {
  const roleData = dataTable.hashes();
  const availableRoles: any[] = [];
  
  for (const roleInfo of roleData) {
    const role = {
      name: roleInfo.role,
      permissions: roleInfo.permissions.split(',').map((p: string) => p.trim()),
      description: roleInfo.description
    };
    
    availableRoles.push(role);
  }
  
  this.testData.availableRoles = availableRoles;
  console.log(`✅ Configured ${availableRoles.length} user roles`);
});

When('I perform role-based login for {string}', async function (this: CustomWorld, roleName: string) {
  const roleInfo = this.testData.availableRoles?.find((r: any) => r.name === roleName);
  
  if (!roleInfo) {
    throw new Error(`Role not found: ${roleName}`);
  }
  
  const user = await this.authService.loginAsUser(roleName as UserRole);
  this.testData.currentUser = user;
  
  console.log(`✅ Role-based login completed: ${roleName}`);
});
```

#### **2. Dashboard Step Definitions** - `step-definitions/dashboard.steps.ts`

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { DashboardService } from '../support/services/dashboard-service';

// Extend World class
declare module '../support/world' {
  interface CustomWorld {
    dashboardService: DashboardService;
  }
}

Given('I am on the dashboard page', async function (this: CustomWorld) {
  const dashboardPage = this.pageObjects.getDashboardPage();
  await dashboardPage.navigate();
  await dashboardPage.verifyDashboardLoaded();
  
  console.log('✅ Navigated to dashboard page');
});

Given('my dashboard is configured for {string} role', async function (this: CustomWorld, userRole: string) {
  await this.dashboardService.setupDashboardForUser(userRole);
  
  // Verify the configuration
  const dashboardState = await this.dashboardService.getDashboardState();
  this.testData.dashboardState = dashboardState;
  
  console.log(`✅ Dashboard configured for ${userRole} role`);
  console.log(`   Widgets: ${dashboardState.widgets.map(w => w.type).join(', ')}`);
});

When('I add a {string} widget to my dashboard', async function (this: CustomWorld, widgetType: string) {
  const dashboardPage = this.pageObjects.getDashboardPage();
  await dashboardPage.addWidget(widgetType);
  
  // Verify widget was added
  await dashboardPage.verifyWidgetPresent(widgetType);
  
  console.log(`✅ Added ${widgetType} widget to dashboard`);
});

When('I refresh the dashboard', async function (this: CustomWorld) {
  const dashboardPage = this.pageObjects.getDashboardPage();
  await dashboardPage.refreshDashboard();
  
  console.log('✅ Dashboard refreshed');
});

When('I navigate to the {string} section', async function (this: CustomWorld, section: string) {
  const dashboardPage = this.pageObjects.getDashboardPage();
  await dashboardPage.navigateToSection(section);
  
  console.log(`✅ Navigated to ${section} section`);
});

Then('I should see {int} widgets on my dashboard', async function (this: CustomWorld, expectedCount: number) {
  const dashboardPage = this.pageObjects.getDashboardPage();
  await dashboardPage.verifyWidgetCount(expectedCount);
  
  console.log(`✅ Verified ${expectedCount} widgets on dashboard`);
});

Then('I should see the following widgets:', async function (this: CustomWorld, dataTable) {
  const expectedWidgets = dataTable.raw().flat();
  const dashboardPage = this.pageObjects.getDashboardPage();
  
  for (const widgetType of expectedWidgets) {
    await dashboardPage.verifyWidgetPresent(widgetType);
  }
  
  console.log(`✅ Verified widgets: ${expectedWidgets.join(', ')}`);
});

Then('my dashboard should be personalized for {string} role', async function (this: CustomWorld, userRole: string) {
  const currentState = await this.dashboardService.getDashboardState();
  
  // Verify role-appropriate widgets are present
  const expectedWidgets = this.getExpectedWidgetsForRole(userRole);
  
  for (const expectedWidget of expectedWidgets) {
    const hasWidget = currentState.widgets.some(w => w.type === expectedWidget);
    expect(hasWidget).toBeTruthy();
  }
  
  console.log(`✅ Dashboard personalized for ${userRole} role`);
});

// Complex dashboard scenarios
When('I configure my dashboard with the following widgets:', async function (this: CustomWorld, dataTable) {
  const widgetConfigs = dataTable.hashes();
  const dashboardPage = this.pageObjects.getDashboardPage();
  
  for (const widgetConfig of widgetConfigs) {
    await dashboardPage.addWidget(widgetConfig.type);
    
    // If position is specified, configure it (simplified implementation)
    if (widgetConfig.position) {
      console.log(`Widget ${widgetConfig.type} positioned at ${widgetConfig.position}`);
    }
  }
  
  console.log(`✅ Configured ${widgetConfigs.length} widgets`);
});

Then('the dashboard should show widgets appropriate for my permissions', async function (this: CustomWorld) {
  const currentUser = this.testData.currentUser;
  if (!currentUser) {
    throw new Error('No current user found');
  }
  
  const dashboardState = await this.dashboardService.getDashboardState();
  
  // Verify widgets match user permissions
  for (const widget of dashboardState.widgets) {
    const requiredPermission = this.getRequiredPermissionForWidget(widget.type);
    
    if (requiredPermission && !currentUser.permissions.includes(requiredPermission)) {
      throw new Error(`Widget ${widget.type} requires permission ${requiredPermission} which user doesn't have`);
    }
  }
  
  console.log('✅ Dashboard widgets match user permissions');
});

// Helper methods for the World class
declare module '../support/world' {
  interface CustomWorld {
    getExpectedWidgetsForRole(role: string): string[];
    getRequiredPermissionForWidget(widgetType: string): string | null;
  }
}

CustomWorld.prototype.getExpectedWidgetsForRole = function(role: string): string[] {
  const roleWidgets: Record<string, string[]> = {
    admin: ['system-status', 'user-management', 'audit-log'],
    manager: ['team-overview', 'project-status', 'reports'],
    developer: ['task-list', 'code-reviews', 'build-status'],
    tester: ['test-results', 'bug-reports', 'quality-metrics'],
    viewer: ['announcements', 'company-news']
  };
  
  return roleWidgets[role] || [];
};

CustomWorld.prototype.getRequiredPermissionForWidget = function(widgetType: string): string | null {
  const widgetPermissions: Record<string, string> = {
    'user-management': 'manage_users',
    'audit-log': 'view_audit',
    'system-status': 'system_admin',
    'team-overview': 'manage_team',
    'project-status': 'view_projects'
  };
  
  return widgetPermissions[widgetType] || null;
};
```

### **Validation Criteria**
- ✅ Step definitions use services for complex operations
- ✅ Business logic is abstracted from technical implementation
- ✅ Error handling maintains context throughout the chain
- ✅ Step definitions are readable and maintainable

## Lab Task 3: Page Object Manager Pattern (20 minutes)

### **Objective**: Implement a centralized page object management system

### **Implementation**: Create a Page Object Manager

#### **Page Object Manager** - `support/page-objects/page-object-manager.ts`

```typescript
import { Page } from '@playwright/test';
import { LoginPage } from './auth/login-page';
import { DashboardPage } from './dashboard/dashboard-page';
import { Logger } from '../utils/logger';

export class PageObjectManager {
  private readonly logger: Logger;
  private readonly pageObjects: Map<string, any> = new Map();
  
  constructor(private readonly page: Page) {
    this.logger = new Logger('PageObjectManager');
  }
  
  // Lazy initialization of page objects
  getLoginPage(): LoginPage {
    return this.getOrCreatePageObject('LoginPage', () => new LoginPage(this.page));
  }
  
  getDashboardPage(): DashboardPage {
    return this.getOrCreatePageObject('DashboardPage', () => new DashboardPage(this.page));
  }
  
  // Generic method for page object management
  private getOrCreatePageObject<T>(name: string, factory: () => T): T {
    if (!this.pageObjects.has(name)) {
      this.logger.info(`Creating page object: ${name}`);
      this.pageObjects.set(name, factory());
    }
    
    return this.pageObjects.get(name) as T;
  }
  
  // Cleanup method
  cleanup(): void {
    this.logger.info('Cleaning up page objects');
    this.pageObjects.clear();
  }
  
  // Utility methods
  async takeScreenshotOfCurrentPage(name: string): Promise<string> {
    const currentUrl = this.page.url();
    const pageName = this.getPageNameFromUrl(currentUrl);
    
    return await this.page.screenshot({
      path: `screenshots/${pageName}-${name}-${Date.now()}.png`,
      fullPage: true
    });
  }
  
  private getPageNameFromUrl(url: string): string {
    const path = new URL(url).pathname;
    return path.split('/').filter(Boolean).join('-') || 'root';
  }
}

// Integration with World class
declare module '../support/world' {
  interface CustomWorld {
    pageObjects: PageObjectManager;
  }
}
```

#### **Enhanced World Class** - `support/world.ts`

```typescript
import { World, IWorldOptions } from '@cucumber/cucumber';
import { Page } from '@playwright/test';
import { PageObjectManager } from './page-objects/page-object-manager';
import { AuthenticationService } from './services/auth-service';
import { DashboardService } from './services/dashboard-service';

export interface CustomWorld extends World {
  page?: Page;
  pageObjects: PageObjectManager;
  authService: AuthenticationService;
  dashboardService: DashboardService;
  testData: {
    currentUser?: any;
    lastLoginAttempt?: any;
    lastLoginError?: string;
    dashboardState?: any;
    availableRoles?: any[];
    [key: string]: any;
  };
}

export class CustomWorldClass extends World implements CustomWorld {
  page?: Page;
  pageObjects!: PageObjectManager;
  authService!: AuthenticationService;
  dashboardService!: DashboardService;
  testData: CustomWorld['testData'] = {};
  
  constructor(options: IWorldOptions) {
    super(options);
  }
  
  // Initialize services when page is set
  setPage(page: Page): void {
    this.page = page;
    this.pageObjects = new PageObjectManager(page);
    this.authService = new AuthenticationService(page);
    this.dashboardService = new DashboardService(page);
  }
  
  // Cleanup method
  cleanup(): void {
    this.pageObjects?.cleanup();
    this.testData = {};
  }
}
```

### **Validation Criteria**
- ✅ Page objects are managed centrally
- ✅ Services are properly initialized
- ✅ Memory management prevents leaks
- ✅ World class integrates all components seamlessly

## Lab Task 4: Complex Workflow Integration (25 minutes)

### **Objective**: Create comprehensive feature tests using the integrated framework

### **Implementation**: End-to-end feature scenarios

#### **Feature File** - `features/user-workflow.feature`

```gherkin
Feature: Complete User Workflow
  As a business user
  I want to perform complete workflows in the application
  So that I can accomplish my business objectives efficiently

  Background:
    Given the application is running
    And I am not logged in

  @smoke @authentication
  Scenario: Admin user complete workflow
    Given I am logged in as a admin with system_management
    And my dashboard is configured for "admin" role
    When I navigate to the "user-management" section
    And I add a "audit-log" widget to my dashboard
    Then I should see 4 widgets on my dashboard
    And my dashboard should be personalized for "admin" role
    And the dashboard should show widgets appropriate for my permissions

  @integration @multi-role
  Scenario Outline: Role-based dashboard personalization
    Given I am logged in as a <role> with <permissions>
    When my dashboard is configured for "<role>" role
    Then I should see the following widgets:
      | <expected_widgets> |
    And my dashboard should be personalized for "<role>" role

    Examples:
      | role      | permissions                    | expected_widgets                      |
      | manager   | read,write,manage_team        | team-overview,project-status,reports  |
      | developer | read,write,code               | task-list,code-reviews,build-status   |
      | tester    | read,write,test               | test-results,bug-reports              |

  @error-handling @negative
  Scenario: Invalid login with proper error handling
    Given I am on the login page
    When I attempt to login with invalid credentials "invalid@test.com"/"wrongpassword"
    Then I should see a login error message containing "Invalid credentials"
    And I should be redirected to the login page

  @complex @data-driven
  Scenario: Multi-step user configuration workflow
    Given I have the following user roles available:
      | role      | permissions                   | description           |
      | admin     | all                          | System administrator   |
      | manager   | read,write,manage_team       | Project manager       |
      | developer | read,write,code              | Software developer    |
    When I perform role-based login for "manager"
    And I configure my dashboard with the following widgets:
      | type           | position | visible |
      | team-overview  | top-left | true    |
      | project-status | top-right| true    |
      | reports        | bottom   | true    |
    Then I should see 3 widgets on my dashboard
    And the dashboard should show widgets appropriate for my permissions
```

### **Advanced Step Definitions** - `step-definitions/workflow.steps.ts`

```typescript
import { Given, When, Then, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

BeforeAll(async function () {
  console.log('🚀 Starting workflow test suite');
});

AfterAll(async function () {
  console.log('✅ Workflow test suite completed');
});

Given('the application is running', async function (this: CustomWorld) {
  // Verify application is accessible
  await this.page!.goto('/');
  
  // Basic health check
  const response = await this.page!.request.get('/health');
  if (!response.ok()) {
    throw new Error('Application health check failed');
  }
  
  console.log('✅ Application health check passed');
});

// Complex workflow coordination
When('I complete the full user onboarding workflow', async function (this: CustomWorld) {
  try {
    // Step 1: Login
    const user = await this.authService.loginAsUser('manager');
    
    // Step 2: Dashboard setup
    await this.dashboardService.setupDashboardForUser('manager');
    
    // Step 3: Profile configuration
    const dashboardPage = this.pageObjects.getDashboardPage();
    await dashboardPage.navigateToSection('profile');
    
    // Store workflow state
    this.testData.workflowState = {
      user,
      step: 'completed',
      timestamp: new Date()
    };
    
    console.log('✅ Full user onboarding workflow completed');
    
  } catch (error) {
    // Enhanced error handling with context
    await this.pageObjects.takeScreenshotOfCurrentPage('workflow-error');
    throw new Error(`Workflow failed at step: ${error.message}`);
  }
});

Then('the workflow should be completed successfully', async function (this: CustomWorld) {
  const workflowState = this.testData.workflowState;
  
  if (!workflowState || workflowState.step !== 'completed') {
    throw new Error('Workflow was not completed successfully');
  }
  
  // Verify final state
  const dashboardState = await this.dashboardService.getDashboardState();
  
  if (dashboardState.widgets.length === 0) {
    throw new Error('Dashboard not properly configured');
  }
  
  console.log('✅ Workflow completion verified');
  console.log(`   Completion time: ${workflowState.timestamp}`);
  console.log(`   Final widget count: ${dashboardState.widgets.length}`);
});
```

### **Validation Criteria**
- ✅ Complex workflows coordinate multiple services
- ✅ Error handling maintains context across workflow steps
- ✅ State management tracks progress effectively
- ✅ Verification ensures workflow integrity

## Extension Challenges

### **Challenge 1: Component-Based Architecture** (Optional - 20 minutes)
Create reusable component objects for common UI patterns:

```typescript
// support/page-objects/components/data-table-component.ts
export class DataTableComponent {
  constructor(private page: Page, private selector: string) {}
  
  async getRowCount(): Promise<number> {
    return await this.page.locator(`${this.selector} tbody tr`).count();
  }
  
  async getRowData(rowIndex: number): Promise<Record<string, string>> {
    // Implementation for extracting row data
  }
  
  async sortByColumn(columnName: string): Promise<void> {
    // Implementation for column sorting
  }
}
```

### **Challenge 2: Performance Monitoring** (Optional - 15 minutes)
Add performance tracking to page objects:

```typescript
// support/utils/performance-monitor.ts
export class PerformanceMonitor {
  static async measurePageLoad(page: Page, operation: () => Promise<void>): Promise<{
    duration: number;
    navigationTiming: any;
  }> {
    const startTime = performance.now();
    await operation();
    const endTime = performance.now();
    
    return {
      duration: endTime - startTime,
      navigationTiming: await page.evaluate(() => performance.getEntriesByType('navigation')[0])
    };
  }
}
```

### **Challenge 3: Multi-Browser Support** (Optional - 25 minutes)
Extend the framework to support multiple browser contexts:

```typescript
// support/browser-manager.ts
export class BrowserManager {
  private contexts: Map<string, BrowserContext> = new Map();
  
  async createContext(name: string, options?: BrowserContextOptions): Promise<BrowserContext> {
    // Implementation for managing multiple browser contexts
  }
  
  async switchContext(name: string): Promise<void> {
    // Implementation for context switching
  }
}
```

## Success Validation

### **Completion Checklist**
- [ ] Base page architecture is implemented
- [ ] Service layer abstracts business operations
- [ ] Step definitions integrate cleanly with POM
- [ ] Page Object Manager handles lifecycle
- [ ] Complex workflows execute successfully
- [ ] Error handling maintains context
- [ ] Extension challenges attempted (optional)

### **Quality Metrics**
- [ ] Code coverage exceeds 85% for POM integration
- [ ] Step definitions are readable by business stakeholders
- [ ] Framework supports easy addition of new pages
- [ ] Performance remains acceptable (< 500ms per step)
- [ ] Memory usage is stable during test execution

## Running Your Implementation

```bash
# Run integration tests
npx cucumber-js features/user-workflow.feature

# Run with specific tags
npx cucumber-js --tags "@integration"

# Run with debug output
DEBUG=true npx cucumber-js

# Performance testing
PERFORMANCE_MODE=true npx cucumber-js

# Multi-browser testing
BROWSER=chrome,firefox npx cucumber-js
```

---

## Summary

This lab has established:

- ✅ **Professional POM Architecture**: Scalable, maintainable page object patterns
- ✅ **Service Layer Integration**: Business logic separation from technical implementation
- ✅ **Clean Step Definitions**: Readable, business-focused automation code
- ✅ **Centralized Management**: Efficient page object and service lifecycle management
- ✅ **Complex Workflow Support**: End-to-end business process automation
- ✅ **Enterprise-Ready Patterns**: Patterns suitable for large-scale applications

You now have a production-ready BDD automation framework that integrates Page Object Model patterns with Cucumber step definitions, providing maintainable, scalable, and business-readable test automation.

*Time to complete: 80-120 minutes*  
*Difficulty: Advanced*  
*Skills gained: POM integration, service patterns, enterprise architecture*