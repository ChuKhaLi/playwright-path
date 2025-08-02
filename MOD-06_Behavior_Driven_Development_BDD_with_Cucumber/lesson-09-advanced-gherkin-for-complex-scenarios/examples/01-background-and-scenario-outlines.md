# Example 01: Background and Scenario Outlines

## Overview

This example demonstrates advanced usage of Background sections and Scenario Outlines to create maintainable, data-driven test scenarios. You'll learn how to effectively share setup steps across scenarios while implementing comprehensive parameterized testing patterns.

## Learning Objectives

By completing this example, you will:

- **Master Background Sections**: Implement effective shared setup across multiple scenarios
- **Advanced Scenario Outlines**: Create sophisticated data-driven test patterns
- **State Management**: Handle shared state and context across parameterized executions
- **Performance Optimization**: Optimize Background execution for better test performance
- **Multi-Browser Testing**: Implement cross-browser compatibility scenarios
- **Dynamic Data Generation**: Use advanced Examples table patterns with calculated values

## Key Concepts

### When to Use Background
- Shared preconditions across ALL scenarios in a feature
- System initialization and configuration
- User authentication and permissions setup
- Test data preparation that applies to multiple scenarios

### Advanced Scenario Outline Patterns
- Multiple Examples tables for different test categories
- Complex data types in Examples tables
- Conditional logic based on parameter values
- Cross-browser and multi-environment testing

## Implementation

### Project Structure

```
background-scenario-outlines/
├── features/
│   ├── user-authentication.feature
│   ├── api-validation.feature
│   ├── cross-browser-testing.feature
│   └── support/
│       ├── world.ts
│       ├── hooks.ts
│       └── data-generators.ts
├── step-definitions/
│   ├── authentication.steps.ts
│   ├── api.steps.ts
│   ├── browser.steps.ts
│   └── shared.steps.ts
├── test-data/
│   ├── users.json
│   ├── api-endpoints.json
│   └── browser-configs.json
├── config/
│   ├── cucumber.js
│   └── test-environments.js
└── package.json
```

### Feature Files

#### User Authentication Feature

```gherkin
# features/user-authentication.feature
Feature: User Authentication System
  As a system administrator
  I want to ensure user authentication works correctly
  So that system security is maintained across all user types

Background:
  Given the authentication service is running
  And the user database is initialized with test data
  And the following system configuration is applied:
    | setting               | value    |
    | session_timeout       | 1800     |
    | max_login_attempts    | 3        |
    | password_complexity   | high     |
    | two_factor_enabled    | true     |
  And audit logging is enabled

@smoke @authentication
Scenario Outline: User login validation across user types
  Given a <user_type> user with username "<username>"
  And the user has <status> account status
  When they attempt to login with password "<password>"
  Then the login should <result>
  And the session duration should be <session_duration> seconds
  And the audit log should contain "<audit_message>"

Examples: Valid Login Scenarios
  | user_type | username      | status | password    | result  | session_duration | audit_message     |
  | admin     | admin_user    | active | AdminPass1! | succeed | 1800            | successful_login  |
  | standard  | john_doe      | active | UserPass1!  | succeed | 1800            | successful_login  |
  | readonly  | jane_smith    | active | ReadPass1!  | succeed | 900             | successful_login  |

Examples: Invalid Login Scenarios
  | user_type | username      | status    | password     | result | session_duration | audit_message    |
  | admin     | admin_user    | suspended | AdminPass1!  | fail   | 0               | login_blocked    |
  | standard  | john_doe      | active    | WrongPass    | fail   | 0               | invalid_password |
  | readonly  | unknown_user  | active    | ReadPass1!   | fail   | 0               | user_not_found   |

@regression @authentication @security
Scenario Outline: Multi-factor authentication flow
  Given a <user_type> user with username "<username>"
  And the user has enabled <mfa_method> authentication
  When they login with valid credentials
  And they provide <mfa_code> as the second factor
  Then the authentication should <result>
  And the security level should be marked as <security_level>

Examples: MFA Success Cases
  | user_type | username   | mfa_method | mfa_code | result  | security_level |
  | admin     | admin_user | totp       | 123456   | succeed | high          |
  | standard  | john_doe   | sms        | 789012   | succeed | medium        |
  | readonly  | jane_smith | email      | 345678   | succeed | medium        |

Examples: MFA Failure Cases
  | user_type | username   | mfa_method | mfa_code | result | security_level |
  | admin     | admin_user | totp       | invalid  | fail   | none          |
  | standard  | john_doe   | sms        | expired  | fail   | none          |
```

#### API Validation Feature

```gherkin
# features/api-validation.feature
Feature: API Endpoint Validation
  As an API consumer
  I want to validate API responses across different endpoints
  So that I can ensure consistent API behavior

Background:
  Given the API server is running on port 3000
  And the following API configuration is loaded:
    | setting           | value              |
    | rate_limit        | 100                |
    | timeout           | 30                 |
    | auth_required     | true               |
    | cors_enabled      | true               |
  And the test database contains sample data
  And API authentication tokens are generated

@api @smoke
Scenario Outline: REST API endpoint validation
  Given the API endpoint "<endpoint>"
  And the request method is "<method>"
  When I send a request with the following data:
    """
    <request_data>
    """
  Then the response status should be <status_code>
  And the response time should be less than <max_response_time> milliseconds
  And the response should contain "<expected_field>"
  And the response should match the schema "<schema_name>"

Examples: Successful API Calls
  | endpoint      | method | request_data              | status_code | max_response_time | expected_field | schema_name    |
  | /api/users    | GET    | {}                        | 200         | 500              | users          | users_list     |
  | /api/users    | POST   | {"name":"John","age":30}  | 201         | 1000             | id             | user_created   |
  | /api/users/1  | GET    | {}                        | 200         | 300              | name           | user_detail    |
  | /api/users/1  | PUT    | {"name":"Jane","age":25}  | 200         | 800              | updated_at     | user_updated   |

Examples: Error Scenarios
  | endpoint       | method | request_data            | status_code | max_response_time | expected_field | schema_name |
  | /api/users/999 | GET    | {}                      | 404         | 300              | error          | error       |
  | /api/users     | POST   | {"invalid":"data"}      | 400         | 500              | message        | validation  |
  | /api/users/1   | DELETE | {}                      | 403         | 200              | error          | forbidden   |
```

#### Cross-Browser Testing Feature

```gherkin
# features/cross-browser-testing.feature
Feature: Cross-Browser Compatibility
  As a web developer
  I want to ensure my application works across different browsers
  So that all users have a consistent experience

Background:
  Given the web application is deployed
  And the following browser configurations are available:
    | browser | version | platform | resolution  |
    | chrome  | latest  | desktop  | 1920x1080  |
    | firefox | latest  | desktop  | 1920x1080  |
    | safari  | latest  | desktop  | 1920x1080  |
    | edge    | latest  | desktop  | 1920x1080  |
  And the test data is prepared for cross-browser testing

@cross-browser @smoke
Scenario Outline: Login functionality across browsers
  Given I am using "<browser>" browser
  And the browser window is set to "<resolution>"
  When I navigate to the login page
  And I enter username "<username>" and password "<password>"
  And I click the login button
  Then I should be redirected to the dashboard
  And the page should load within <load_time> seconds
  And all UI elements should be visible and functional

Examples: Browser Compatibility Matrix
  | browser | resolution | username | password   | load_time |
  | chrome  | 1920x1080  | testuser | TestPass1! | 3         |
  | firefox | 1920x1080  | testuser | TestPass1! | 4         |
  | safari  | 1920x1080  | testuser | TestPass1! | 5         |
  | edge    | 1920x1080  | testuser | TestPass1! | 3         |

@cross-browser @regression
Scenario Outline: Form submission with different input types
  Given I am using "<browser>" browser
  When I navigate to the form page
  And I fill in the form with the following data:
    | field_type | field_name | value           |
    | text       | full_name  | <name>          |
    | email      | email      | <email>         |
    | date       | birth_date | <birth_date>    |
    | number     | age        | <age>           |
    | select     | country    | <country>       |
  And I submit the form
  Then the form should be submitted successfully
  And the confirmation message should appear
  And the data should be saved correctly

Examples: Form Data Validation
  | browser | name        | email              | birth_date | age | country |
  | chrome  | John Doe    | john@example.com   | 1990-01-15 | 33  | USA     |
  | firefox | Jane Smith  | jane@example.com   | 1985-05-22 | 38  | Canada  |
  | safari  | Bob Johnson | bob@example.com    | 1992-11-08 | 31  | UK      |
  | edge    | Alice Brown | alice@example.com  | 1988-03-14 | 35  | Australia|
```

### Step Definitions

#### Authentication Step Definitions

```typescript
// step-definitions/authentication.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../features/support/world';

Given('the authentication service is running', async function (this: ICustomWorld) {
  // Initialize authentication service
  this.authService = {
    isRunning: true,
    config: {},
    users: []
  };
  
  // Verify service health
  const healthCheck = await this.makeApiRequest('/auth/health');
  expect(healthCheck.status).toBe(200);
});

Given('the user database is initialized with test data', async function (this: ICustomWorld) {
  // Load test users from data file
  const testUsers = require('../test-data/users.json');
  
  // Initialize database with test data
  for (const user of testUsers) {
    await this.databaseHelper.createUser(user);
  }
  
  this.testUsers = testUsers;
});

Given('the following system configuration is applied:', async function (this: ICustomWorld, dataTable) {
  const configData = dataTable.hashes()[0];
  
  // Apply configuration settings
  this.systemConfig = {
    sessionTimeout: parseInt(configData.session_timeout),
    maxLoginAttempts: parseInt(configData.max_login_attempts),
    passwordComplexity: configData.password_complexity,
    twoFactorEnabled: configData.two_factor_enabled === 'true'
  };
  
  // Apply configuration to system
  await this.makeApiRequest('/config', {
    method: 'POST',
    data: this.systemConfig
  });
});

Given('audit logging is enabled', async function (this: ICustomWorld) {
  await this.makeApiRequest('/audit/enable', { method: 'POST' });
  this.auditEnabled = true;
});

Given('a {word} user with username {string}', function (this: ICustomWorld, userType: string, username: string) {
  this.currentUser = {
    type: userType,
    username: username,
    ...this.testUsers.find(u => u.username === username && u.type === userType)
  };
});

Given('the user has {word} account status', function (this: ICustomWorld, status: string) {
  this.currentUser.status = status;
});

When('they attempt to login with password {string}', async function (this: ICustomWorld, password: string) {
  this.loginAttempt = {
    username: this.currentUser.username,
    password: password,
    timestamp: new Date()
  };
  
  this.loginResponse = await this.makeApiRequest('/auth/login', {
    method: 'POST',
    data: this.loginAttempt
  });
});

Then('the login should {word}', function (this: ICustomWorld, expectedResult: string) {
  if (expectedResult === 'succeed') {
    expect(this.loginResponse.status).toBe(200);
    expect(this.loginResponse.data.success).toBe(true);
  } else {
    expect(this.loginResponse.status).toBeGreaterThanOrEqual(400);
    expect(this.loginResponse.data.success).toBe(false);
  }
});

Then('the session duration should be {int} seconds', function (this: ICustomWorld, expectedDuration: number) {
  if (this.loginResponse.data.success) {
    expect(this.loginResponse.data.sessionDuration).toBe(expectedDuration);
  }
});

Then('the audit log should contain {string}', async function (this: ICustomWorld, expectedMessage: string) {
  const auditLogs = await this.makeApiRequest('/audit/logs');
  const latestLog = auditLogs.data[0];
  
  expect(latestLog.message).toContain(expectedMessage);
  expect(latestLog.username).toBe(this.currentUser.username);
});

// Multi-factor authentication steps
Given('the user has enabled {word} authentication', function (this: ICustomWorld, mfaMethod: string) {
  this.currentUser.mfaMethod = mfaMethod;
  this.currentUser.mfaEnabled = true;
});

When('they login with valid credentials', async function (this: ICustomWorld) {
  this.loginResponse = await this.makeApiRequest('/auth/login', {
    method: 'POST',
    data: {
      username: this.currentUser.username,
      password: this.currentUser.password
    }
  });
  
  // Should receive MFA challenge
  expect(this.loginResponse.status).toBe(202);
  expect(this.loginResponse.data.mfaRequired).toBe(true);
});

When('they provide {word} as the second factor', async function (this: ICustomWorld, mfaCode: string) {
  this.mfaResponse = await this.makeApiRequest('/auth/mfa', {
    method: 'POST',
    data: {
      sessionId: this.loginResponse.data.sessionId,
      code: mfaCode,
      method: this.currentUser.mfaMethod
    }
  });
});

Then('the authentication should {word}', function (this: ICustomWorld, expectedResult: string) {
  if (expectedResult === 'succeed') {
    expect(this.mfaResponse.status).toBe(200);
    expect(this.mfaResponse.data.authenticated).toBe(true);
  } else {
    expect(this.mfaResponse.status).toBeGreaterThanOrEqual(400);
    expect(this.mfaResponse.data.authenticated).toBe(false);
  }
});

Then('the security level should be marked as {word}', function (this: ICustomWorld, expectedLevel: string) {
  if (this.mfaResponse.data.authenticated) {
    expect(this.mfaResponse.data.securityLevel).toBe(expectedLevel);
  }
});
```

#### API Step Definitions

```typescript
// step-definitions/api.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../features/support/world';
import Ajv from 'ajv';

Given('the API server is running on port {int}', async function (this: ICustomWorld, port: number) {
  this.apiBaseUrl = `http://localhost:${port}`;
  
  // Verify server is running
  try {
    const response = await this.makeApiRequest('/health');
    expect(response.status).toBe(200);
  } catch (error) {
    throw new Error(`API server not running on port ${port}`);
  }
});

Given('the following API configuration is loaded:', async function (this: ICustomWorld, dataTable) {
  const configData = dataTable.hashes()[0];
  
  this.apiConfig = {
    rateLimit: parseInt(configData.rate_limit),
    timeout: parseInt(configData.timeout),
    authRequired: configData.auth_required === 'true',
    corsEnabled: configData.cors_enabled === 'true'
  };
  
  // Apply API configuration
  await this.makeApiRequest('/config/api', {
    method: 'POST',
    data: this.apiConfig
  });
});

Given('the test database contains sample data', async function (this: ICustomWorld) {
  // Initialize database with sample data
  await this.databaseHelper.seedTestData();
});

Given('API authentication tokens are generated', async function (this: ICustomWorld) {
  const tokenResponse = await this.makeApiRequest('/auth/token', {
    method: 'POST',
    data: { 
      client_id: 'test-client',
      client_secret: 'test-secret'
    }
  });
  
  this.apiToken = tokenResponse.data.access_token;
});

Given('the API endpoint {string}', function (this: ICustomWorld, endpoint: string) {
  this.currentEndpoint = endpoint;
});

Given('the request method is {string}', function (this: ICustomWorld, method: string) {
  this.requestMethod = method.toUpperCase();
});

When('I send a request with the following data:', async function (this: ICustomWorld, docString: string) {
  const requestData = JSON.parse(docString);
  
  this.apiResponse = await this.makeApiRequest(this.currentEndpoint, {
    method: this.requestMethod,
    data: requestData,
    headers: {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  this.responseTime = Date.now() - this.requestStartTime;
});

Then('the response status should be {int}', function (this: ICustomWorld, expectedStatus: number) {
  expect(this.apiResponse.status).toBe(expectedStatus);
});

Then('the response time should be less than {int} milliseconds', function (this: ICustomWorld, maxTime: number) {
  expect(this.responseTime).toBeLessThan(maxTime);
});

Then('the response should contain {string}', function (this: ICustomWorld, expectedField: string) {
  expect(this.apiResponse.data).toHaveProperty(expectedField);
});

Then('the response should match the schema {string}', async function (this: ICustomWorld, schemaName: string) {
  const schema = require(`../test-data/schemas/${schemaName}.json`);
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  
  const isValid = validate(this.apiResponse.data);
  if (!isValid) {
    throw new Error(`Schema validation failed: ${JSON.stringify(validate.errors)}`);
  }
});
```

#### Browser Step Definitions

```typescript
// step-definitions/browser.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../features/support/world';

Given('the web application is deployed', async function (this: ICustomWorld) {
  this.appUrl = process.env.APP_URL || 'http://localhost:3000';
  
  // Verify application is accessible
  await this.page.goto(this.appUrl);
  await expect(this.page).toHaveTitle(/.*/, { timeout: 10000 });
});

Given('the following browser configurations are available:', async function (this: ICustomWorld, dataTable) {
  this.browserConfigs = dataTable.hashes();
});

Given('the test data is prepared for cross-browser testing', async function (this: ICustomWorld) {
  // Prepare test data that works across all browsers
  this.crossBrowserTestData = {
    testUser: {
      username: 'crossbrowser_user',
      password: 'CrossBrowser123!',
      email: 'test@crossbrowser.com'
    }
  };
});

Given('I am using {string} browser', async function (this: ICustomWorld, browserName: string) {
  // Browser is already initialized in hooks based on test execution
  this.currentBrowser = browserName;
});

Given('the browser window is set to {string}', async function (this: ICustomWorld, resolution: string) {
  const [width, height] = resolution.split('x').map(Number);
  await this.page.setViewportSize({ width, height });
});

When('I navigate to the login page', async function (this: ICustomWorld) {
  await this.page.goto(`${this.appUrl}/login`);
  await expect(this.page.locator('[data-testid="login-form"]')).toBeVisible();
});

When('I enter username {string} and password {string}', async function (this: ICustomWorld, username: string, password: string) {
  await this.page.fill('[data-testid="username-input"]', username);
  await this.page.fill('[data-testid="password-input"]', password);
});

When('I click the login button', async function (this: ICustomWorld) {
  this.navigationStartTime = Date.now();
  await this.page.click('[data-testid="login-button"]');
});

Then('I should be redirected to the dashboard', async function (this: ICustomWorld) {
  await expect(this.page).toHaveURL(/.*\/dashboard/);
  await expect(this.page.locator('[data-testid="dashboard-content"]')).toBeVisible();
});

Then('the page should load within {int} seconds', function (this: ICustomWorld, maxLoadTime: number) {
  const loadTime = Date.now() - this.navigationStartTime;
  expect(loadTime).toBeLessThan(maxLoadTime * 1000);
});

Then('all UI elements should be visible and functional', async function (this: ICustomWorld) {
  // Check navigation menu
  await expect(this.page.locator('[data-testid="nav-menu"]')).toBeVisible();
  
  // Check main content area
  await expect(this.page.locator('[data-testid="main-content"]')).toBeVisible();
  
  // Check footer
  await expect(this.page.locator('[data-testid="footer"]')).toBeVisible();
  
  // Test interactive elements
  const menuButton = this.page.locator('[data-testid="menu-toggle"]');
  if (await menuButton.isVisible()) {
    await menuButton.click();
    await expect(this.page.locator('[data-testid="dropdown-menu"]')).toBeVisible();
  }
});

When('I navigate to the form page', async function (this: ICustomWorld) {
  await this.page.goto(`${this.appUrl}/form`);
  await expect(this.page.locator('[data-testid="test-form"]')).toBeVisible();
});

When('I fill in the form with the following data:', async function (this: ICustomWorld, dataTable) {
  const formData = dataTable.hashes();
  
  for (const field of formData) {
    const selector = `[data-testid="${field.field_name}-input"]`;
    
    switch (field.field_type) {
      case 'text':
      case 'email':
        await this.page.fill(selector, field.value);
        break;
      case 'date':
        await this.page.fill(selector, field.value);
        break;
      case 'number':
        await this.page.fill(selector, field.value);
        break;
      case 'select':
        await this.page.selectOption(selector, field.value);
        break;
    }
  }
});

When('I submit the form', async function (this: ICustomWorld) {
  await this.page.click('[data-testid="submit-button"]');
});

Then('the form should be submitted successfully', async function (this: ICustomWorld) {
  await expect(this.page.locator('[data-testid="success-message"]')).toBeVisible();
});

Then('the confirmation message should appear', async function (this: ICustomWorld) {
  const confirmationMessage = this.page.locator('[data-testid="confirmation-message"]');
  await expect(confirmationMessage).toBeVisible();
  await expect(confirmationMessage).toContainText('Form submitted successfully');
});

Then('the data should be saved correctly', async function (this: ICustomWorld) {
  // Verify data was saved by checking API or database
  const savedData = await this.makeApiRequest('/api/form-submissions/latest');
  expect(savedData.status).toBe(200);
  expect(savedData.data).toBeDefined();
});
```

### Support Files

#### World Context

```typescript
// features/support/world.ts
import { World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';

export interface ICustomWorld extends World {
  // Browser context
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  currentBrowser?: string;
  
  // API context
  apiBaseUrl?: string;
  apiToken?: string;
  apiConfig?: any;
  apiResponse?: any;
  responseTime?: number;
  requestStartTime?: number;
  
  // Authentication context
  authService?: any;
  currentUser?: any;
  loginAttempt?: any;
  loginResponse?: any;
  mfaResponse?: any;
  auditEnabled?: boolean;
  
  // System context
  systemConfig?: any;
  testUsers?: any[];
  crossBrowserTestData?: any;
  
  // Test data and utilities
  databaseHelper?: any;
  navigationStartTime?: number;
  
  // Helper methods
  makeApiRequest(endpoint: string, options?: any): Promise<any>;
}

export class CustomWorld extends World implements ICustomWorld {
  constructor(options: IWorldOptions) {
    super(options);
  }
  
  async makeApiRequest(endpoint: string, options: any = {}): Promise<any> {
    const { method = 'GET', data, headers = {} } = options;
    this.requestStartTime = Date.now();
    
    const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: data ? JSON.stringify(data) : undefined
    });
    
    const responseData = await response.json();
    
    return {
      status: response.status,
      data: responseData,
      headers: response.headers
    };
  }
}
```

#### Hooks

```typescript
// features/support/hooks.ts
import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { Browser, chromium, firefox, webkit } from '@playwright/test';
import { ICustomWorld } from './world';

let browser: Browser;

BeforeAll(async function () {
  // Initialize database helper
  const { DatabaseHelper } = require('./database-helper');
  this.databaseHelper = new DatabaseHelper();
  await this.databaseHelper.connect();
});

Before(async function (this: ICustomWorld, scenario) {
  // Determine browser based on tags or environment
  const browserName = this.getBrowserFromTags(scenario.pickle.tags) || 'chromium';
  
  // Launch browser
  switch (browserName) {
    case 'chrome':
    case 'chromium':
      browser = await chromium.launch();
      break;
    case 'firefox':
      browser = await firefox.launch();
      break;
    case 'safari':
    case 'webkit':
      browser = await webkit.launch();
      break;
    default:
      browser = await chromium.launch();
  }
  
  this.browser = browser;
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
  
  // Set up API base URL
  this.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
});

After(async function (this: ICustomWorld) {
  // Clean up browser context
  if (this.context) {
    await this.context.close();
  }
  
  if (this.browser) {
    await this.browser.close();
  }
  
  // Clean up test data if needed
  if (this.databaseHelper) {
    await this.databaseHelper.cleanup();
  }
});

AfterAll(async function () {
  // Disconnect from database
  if (this.databaseHelper) {
    await this.databaseHelper.disconnect();
  }
});

// Helper method to determine browser from tags
function getBrowserFromTags(tags: any[]): string | undefined {
  const browserTags = tags.filter(tag => 
    ['@chrome', '@firefox', '@safari', '@edge'].includes(tag.name)
  );
  
  if (browserTags.length > 0) {
    return browserTags[0].name.replace('@', '');
  }
  
  return undefined;
}
```

### Configuration

#### Cucumber Configuration

```javascript
// config/cucumber.js
const config = {
  require: ['features/step-definitions/**/*.ts'],
  requireModule: ['ts-node/register'],
  format: [
    'pretty',
    'json:reports/cucumber-report.json',
    'html:reports/cucumber-report.html'
  ],
  formatOptions: {
    snippetInterface: 'async-await'
  },
  worldParameters: {
    appUrl: process.env.APP_URL || 'http://localhost:3000',
    apiUrl: process.env.API_URL || 'http://localhost:3000',
    browser: process.env.BROWSER || 'chromium',
    headless: process.env.HEADLESS !== 'false'
  },
  retry: 1,
  parallel: 2
};

module.exports = config;
```

### Package Configuration

```json
{
  "name": "background-scenario-outlines-example",
  "version": "1.0.0",
  "scripts": {
    "test": "cucumber-js",
    "test:smoke": "cucumber-js --tags @smoke",
    "test:regression": "cucumber-js --tags @regression",
    "test:api": "cucumber-js --tags @api",
    "test:auth": "cucumber-js --tags @authentication",
    "test:cross-browser": "cucumber-js --tags @cross-browser",
    "test:chrome": "BROWSER=chrome cucumber-js",
    "test:firefox": "BROWSER=firefox cucumber-js",
    "test:safari": "BROWSER=safari cucumber-js",
    "test:parallel": "cucumber-js --parallel 4",
    "test:report": "cucumber-js --format html:reports/report.html"
  },
  "dependencies": {
    "@cucumber/cucumber": "^10.0.0",
    "@playwright/test": "^1.40.0",
    "playwright": "^1.40.0",
    "ajv": "^8.12.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "ts-node": "^10.9.0",
    "typescript": "^5.0.0"
  }
}
```

## Key Learning Points

### Background Best Practices

1. **Shared Setup Only**: Use Background for steps that apply to ALL scenarios in the feature
2. **Keep It Lightweight**: Avoid heavy setup that slows down test execution
3. **State Independence**: Ensure Background doesn't create dependencies between scenarios
4. **Clear Documentation**: Make Background steps self-explanatory

### Scenario Outline Optimization

1. **Meaningful Examples**: Use descriptive table names (Valid/Invalid scenarios)
2. **Focused Testing**: Keep each outline focused on a single concept
3. **Data Variety**: Include edge cases and boundary conditions
4. **Performance Consideration**: Balance comprehensive testing with execution time

### Advanced Patterns

1. **Dynamic Data**: Generate test data based on parameters
2. **Conditional Logic**: Handle different scenarios based on parameter values
3. **Cross-Browser Testing**: Parameterize browser and environment configurations
4. **Multi-Environment**: Support different deployment environments

## Common Pitfalls and Solutions

### Background Overuse
❌ **Problem**: Using Background for steps that only apply to some scenarios
✅ **Solution**: Move specific setup to individual scenarios or use Given steps

### Complex Examples Tables
❌ **Problem**: Creating overly complex Examples tables that are hard to read
✅ **Solution**: Break complex scenarios into multiple focused Scenario Outlines

### State Pollution
❌ **Problem**: Background creating state that affects subsequent scenarios
✅ **Solution**: Ensure proper cleanup and state isolation

## Summary

This example demonstrates how to effectively use Background sections and Scenario Outlines to create maintainable, comprehensive test suites. The patterns shown here scale well for complex applications while maintaining readability and performance.

Key takeaways:
- Use Background judiciously for truly shared setup
- Structure Scenario Outlines with clear, focused Examples tables
- Implement proper state management and cleanup
- Consider performance implications of Background execution
- Leverage parameterization for comprehensive coverage

## Next Steps

- Explore [Example 02: Complex Data Tables and Transformations](./02-complex-data-tables-and-transformations.md)
- Practice implementing similar patterns in your own test scenarios
- Experiment with different Background optimization techniques
- Consider how these patterns apply to your specific testing requirements