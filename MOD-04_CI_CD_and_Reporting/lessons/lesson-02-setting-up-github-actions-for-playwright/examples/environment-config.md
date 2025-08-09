# Environment Configuration for GitHub Actions

This document demonstrates how to configure different environments in your GitHub Actions workflows for Playwright testing.

## 1. Repository Secrets Configuration

### Setting up Environment Secrets

In your GitHub repository, navigate to **Settings > Secrets and variables > Actions** and add these secrets:

```
# Database connections
STAGING_DB_URL=postgresql://user:pass@staging-db.example.com:5432/testdb
PROD_DB_URL=postgresql://user:pass@prod-db.example.com:5432/proddb

# API keys
STAGING_API_KEY=sk_test_abc123def456
PROD_API_KEY=sk_live_xyz789abc123

# Authentication tokens
STAGING_AUTH_TOKEN=staging_token_12345
PROD_AUTH_TOKEN=prod_token_67890

# Third-party service URLs
STAGING_SERVICE_URL=https://api-staging.service.com
PROD_SERVICE_URL=https://api.service.com
```

### Environment Variables in Workflow

```yaml
# workflow-with-environments.yml
name: Environment-Specific Tests

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment Environment'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

jobs:
  test:
    name: Test on ${{ github.event.inputs.environment }}
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment }}
    
    env:
      # Environment-specific base URLs
      BASE_URL: ${{ 
        github.event.inputs.environment == 'production' && 'https://app.example.com' ||
        github.event.inputs.environment == 'staging' && 'https://staging.example.com' ||
        'https://dev.example.com'
      }}
      
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run tests
        run: npx playwright test
        env:
          # Environment-specific secrets
          DATABASE_URL: ${{ 
            github.event.inputs.environment == 'production' && secrets.PROD_DB_URL ||
            secrets.STAGING_DB_URL
          }}
          API_KEY: ${{ 
            github.event.inputs.environment == 'production' && secrets.PROD_API_KEY ||
            secrets.STAGING_API_KEY
          }}
          AUTH_TOKEN: ${{ 
            github.event.inputs.environment == 'production' && secrets.PROD_AUTH_TOKEN ||
            secrets.STAGING_AUTH_TOKEN
          }}
          SERVICE_URL: ${{ 
            github.event.inputs.environment == 'production' && secrets.PROD_SERVICE_URL ||
            secrets.STAGING_SERVICE_URL
          }}
```

## 2. Playwright Configuration for Environments

### Base Configuration (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from '@playwright/test';

// Get environment from process.env or default to 'staging'
const testEnv = process.env.TEST_ENV || 'staging';

// Environment-specific configurations
const environments = {
  staging: {
    baseURL: 'https://staging.example.com',
    timeout: 30000,
    retries: 2,
    workers: 2,
  },
  production: {
    baseURL: 'https://app.example.com',
    timeout: 45000,
    retries: 3,
    workers: 1, // More conservative for production
  },
  development: {
    baseURL: 'http://localhost:3000',
    timeout: 15000,
    retries: 0,
    workers: 4,
  },
};

const currentEnv = environments[testEnv] || environments.staging;

export default defineConfig({
  testDir: './tests',
  
  // Environment-specific settings
  timeout: currentEnv.timeout,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? currentEnv.retries : 0,
  workers: process.env.CI ? currentEnv.workers : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { 
      outputFolder: `playwright-report-${testEnv}`,
      open: 'never' 
    }],
    ['json', { 
      outputFile: `test-results-${testEnv}.json` 
    }],
    ['junit', { 
      outputFile: `junit-results-${testEnv}.xml` 
    }],
  ],
  
  use: {
    baseURL: currentEnv.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Environment-specific headers
    extraHTTPHeaders: {
      'X-Test-Environment': testEnv,
      'Authorization': process.env.AUTH_TOKEN ? `Bearer ${process.env.AUTH_TOKEN}` : '',
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile testing for production environment
    ...(testEnv === 'production' ? [
      {
        name: 'Mobile Chrome',
        use: { ...devices['Pixel 5'] },
      },
      {
        name: 'Mobile Safari',
        use: { ...devices['iPhone 12'] },
      },
    ] : []),
  ],

  // Environment-specific web server (for development)
  webServer: testEnv === 'development' ? {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  } : undefined,
});
```

## 3. Environment-Specific Test Files

### Base Page Object (`pages/BasePage.ts`)

```typescript
import { Page, expect } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}
  
  protected getEnvironment(): string {
    return process.env.TEST_ENV || 'staging';
  }
  
  protected getBaseURL(): string {
    const env = this.getEnvironment();
    const urls = {
      staging: 'https://staging.example.com',
      production: 'https://app.example.com',
      development: 'http://localhost:3000',
    };
    return urls[env] || urls.staging;
  }
  
  async navigateToHome(): Promise<void> {
    await this.page.goto('/');
    
    // Environment-specific validations
    if (this.getEnvironment() === 'production') {
      // More strict validation for production
      await expect(this.page.locator('[data-testid="app-header"]')).toBeVisible();
      await expect(this.page).toHaveTitle(/Production App/);
    } else {
      // Basic validation for staging/dev
      await expect(this.page.locator('header')).toBeVisible();
    }
  }
}
```

### Environment-Specific Test Helper (`utils/environment.ts`)

```typescript
export interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  databaseUrl: string;
  apiKey: string;
  features: {
    enableBetaFeatures: boolean;
    enableAnalytics: boolean;
    enableDebugMode: boolean;
  };
}

export function getEnvironmentConfig(): EnvironmentConfig {
  const env = process.env.TEST_ENV || 'staging';
  
  const configs: Record<string, EnvironmentConfig> = {
    production: {
      name: 'production',
      baseUrl: 'https://app.example.com',
      databaseUrl: process.env.PROD_DB_URL || '',
      apiKey: process.env.PROD_API_KEY || '',
      features: {
        enableBetaFeatures: false,
        enableAnalytics: true,
        enableDebugMode: false,
      },
    },
    staging: {
      name: 'staging',
      baseUrl: 'https://staging.example.com',
      databaseUrl: process.env.STAGING_DB_URL || '',
      apiKey: process.env.STAGING_API_KEY || '',
      features: {
        enableBetaFeatures: true,
        enableAnalytics: false,
        enableDebugMode: true,
      },
    },
    development: {
      name: 'development',
      baseUrl: 'http://localhost:3000',
      databaseUrl: 'postgresql://localhost:5432/testdb',
      apiKey: 'test-key-123',
      features: {
        enableBetaFeatures: true,
        enableAnalytics: false,
        enableDebugMode: true,
      },
    },
  };

  return configs[env] || configs.staging;
}

// Environment-aware test data
export function getTestData() {
  const config = getEnvironmentConfig();
  
  return {
    users: {
      validUser: {
        email: config.name === 'production' 
          ? 'test.user@example.com' 
          : 'staging.user@example.com',
        password: config.name === 'production' 
          ? process.env.PROD_TEST_PASSWORD 
          : 'test123',
      },
    },
    api: {
      baseUrl: `${config.baseUrl}/api/v1`,
      timeout: config.name === 'production' ? 10000 : 5000,
    },
  };
}
```

## 4. Conditional Test Execution

### Environment-Specific Tests

```typescript
import { test, expect } from '@playwright/test';
import { getEnvironmentConfig } from '../utils/environment';

const config = getEnvironmentConfig();

test.describe('Environment-specific tests', () => {
  // Only run on production
  test.skip(() => config.name !== 'production', 'Production only tests');
  
  test('should handle production-level load', async ({ page }) => {
    // This test only runs in production environment
    await page.goto('/');
    
    // Production-specific assertions
    await expect(page.locator('[data-testid="performance-indicator"]')).toBeVisible();
  });
});

test.describe('Feature flag tests', () => {
  test('should show beta features when enabled', async ({ page }) => {
    // Skip if beta features are disabled
    test.skip(!config.features.enableBetaFeatures, 'Beta features disabled');
    
    await page.goto('/');
    await expect(page.locator('[data-testid="beta-feature"]')).toBeVisible();
  });
  
  test('should not show debug info in production', async ({ page }) => {
    await page.goto('/');
    
    if (config.name === 'production') {
      await expect(page.locator('[data-testid="debug-panel"]')).not.toBeVisible();
    } else {
      // Debug panel should be visible in non-production environments
      await expect(page.locator('[data-testid="debug-panel"]')).toBeVisible();
    }
  });
});
```

## 5. Best Practices Summary

1. **Use GitHub Environments**: Set up environment-specific secrets and protection rules
2. **Centralized Configuration**: Keep environment configs in one place
3. **Conditional Logic**: Use environment variables to control test behavior
4. **Feature Flags**: Test different feature states based on environment
5. **Data Isolation**: Use different test data for different environments
6. **Monitoring**: Add environment-specific monitoring and alerts
7. **Security**: Never expose production secrets in logs or artifacts