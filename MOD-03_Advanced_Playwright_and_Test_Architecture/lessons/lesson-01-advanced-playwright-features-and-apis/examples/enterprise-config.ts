/**
 * Enterprise Configuration Management
 * 
 * This example demonstrates sophisticated configuration management patterns
 * for enterprise Playwright deployments including environment-specific
 * configurations, secret management, multi-tenant setups, and scalable
 * configuration architectures.
 * 
 * @author Playwright Learning Module
 * @version 1.0.0
 */

import { PlaywrightTestConfig, devices } from '@playwright/test';

// =============================================================================
// CONFIGURATION INTERFACES
// =============================================================================

interface EnvironmentConfig {
  name: string;
  baseURL: string;
  apiURL: string;
  timeout: number;
  retries: number;
  workers: number;
  headless: boolean;
  slowMo: number;
  video: 'off' | 'on' | 'retain-on-failure' | 'on-first-retry';
  screenshot: 'off' | 'on' | 'only-on-failure';
  trace: 'off' | 'on' | 'retain-on-failure' | 'on-first-retry';
}

interface BrowserConfig {
  name: string;
  use: {
    browserName: 'chromium' | 'firefox' | 'webkit';
    viewport: { width: number; height: number };
    ignoreHTTPSErrors: boolean;
    bypassCSP: boolean;
    userAgent?: string;
    extraHTTPHeaders?: Record<string, string>;
    locale?: string;
    timezoneId?: string;
    geolocation?: { latitude: number; longitude: number };
    permissions?: string[];
    colorScheme?: 'light' | 'dark' | 'no-preference';
  };
}

interface TestSuiteConfig {
  name: string;
  testDir: string;
  testMatch?: string | string[];
  testIgnore?: string | string[];
  timeout: number;
  expect: {
    timeout: number;
    toHaveScreenshot?: { threshold: number; mode: 'pixel' | 'percent' };
    toMatchSnapshot?: { threshold: number; mode: 'pixel' | 'percent' };
  };
  fullyParallel: boolean;
  forbidOnly: boolean;
  retries: number;
  workers: number;
  reporter: Array<[string, any?]>;
  use: {
    actionTimeout: number;
    navigationTimeout: number;
    trace: string;
    screenshot: string;
    video: string;
  };
}

// =============================================================================
// CONFIGURATION MANAGER
// =============================================================================

/**
 * Centralized configuration management for enterprise deployments
 */
export class EnterpriseConfigManager {
  private static instance: EnterpriseConfigManager;
  private configurations: Map<string, any> = new Map();
  private secrets: Map<string, string> = new Map();
  private environment: string;

  private constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.loadSecrets();
    this.loadConfigurations();
  }

  public static getInstance(): EnterpriseConfigManager {
    if (!EnterpriseConfigManager.instance) {
      EnterpriseConfigManager.instance = new EnterpriseConfigManager();
    }
    return EnterpriseConfigManager.instance;
  }

  /**
   * Load secrets from environment or secure vault
   */
  private loadSecrets(): void {
    // In production, these would come from Azure Key Vault, AWS Secrets Manager, etc.
    this.secrets.set('API_KEY', process.env.API_KEY || 'dev-api-key');
    this.secrets.set('DATABASE_URL', process.env.DATABASE_URL || 'sqlite://test.db');
    this.secrets.set('JWT_SECRET', process.env.JWT_SECRET || 'dev-jwt-secret');
    this.secrets.set('OAUTH_CLIENT_ID', process.env.OAUTH_CLIENT_ID || 'dev-oauth-client');
    this.secrets.set('OAUTH_CLIENT_SECRET', process.env.OAUTH_CLIENT_SECRET || 'dev-oauth-secret');
  }

  /**
   * Load environment-specific configurations
   */
  private loadConfigurations(): void {
    // Development Configuration
    this.configurations.set('development', this.createDevelopmentConfig());
    
    // Staging Configuration
    this.configurations.set('staging', this.createStagingConfig());
    
    // Production Configuration
    this.configurations.set('production', this.createProductionConfig());
    
    // Testing Configuration
    this.configurations.set('testing', this.createTestingConfig());
    
    // CI Configuration
    this.configurations.set('ci', this.createCIConfig());
  }

  /**
   * Get configuration for current environment
   */
  public getConfig(): PlaywrightTestConfig {
    const config = this.configurations.get(this.environment);
    if (!config) {
      throw new Error(`Configuration not found for environment: ${this.environment}`);
    }
    return config;
  }

  /**
   * Get secret value
   */
  public getSecret(key: string): string {
    const secret = this.secrets.get(key);
    if (!secret) {
      throw new Error(`Secret not found: ${key}`);
    }
    return secret;
  }

  /**
   * Create development configuration
   */
  private createDevelopmentConfig(): PlaywrightTestConfig {
    return {
      testDir: './tests',
      timeout: 30000,
      expect: {
        timeout: 5000,
        toHaveScreenshot: { threshold: 0.2, mode: 'pixel' },
      },
      fullyParallel: false,
      forbidOnly: false,
      retries: 1,
      workers: 1,
      reporter: [
        ['list'],
        ['html', { outputFolder: 'playwright-report', open: 'always' }]
      ],
      use: {
        baseURL: 'http://localhost:3000',
        actionTimeout: 10000,
        navigationTimeout: 15000,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        ignoreHTTPSErrors: true,
        extraHTTPHeaders: {
          'X-Environment': 'development',
          'X-API-Key': this.getSecret('API_KEY'),
        },
      },
      projects: [
        {
          name: 'chromium-dev',
          use: { 
            ...devices['Desktop Chrome'],
            headless: false,
            slowMo: 500,
          },
        },
      ],
    };\n  }\n\n  /**\n   * Create staging configuration\n   */\n  private createStagingConfig(): PlaywrightTestConfig {\n    return {\n      testDir: './tests',\n      timeout: 45000,\n      expect: {\n        timeout: 10000,\n        toHaveScreenshot: { threshold: 0.1, mode: 'pixel' },\n      },\n      fullyParallel: true,\n      forbidOnly: true,\n      retries: 2,\n      workers: 3,\n      reporter: [\n        ['dot'],\n        ['json', { outputFile: 'test-results/staging-results.json' }],\n        ['html', { outputFolder: 'playwright-report-staging' }],\n        ['junit', { outputFile: 'test-results/staging-junit.xml' }]\n      ],\n      use: {\n        baseURL: 'https://staging.example.com',\n        actionTimeout: 15000,\n        navigationTimeout: 20000,\n        trace: 'retain-on-failure',\n        screenshot: 'only-on-failure',\n        video: 'retain-on-failure',\n        ignoreHTTPSErrors: false,\n        extraHTTPHeaders: {\n          'X-Environment': 'staging',\n          'X-API-Key': this.getSecret('API_KEY'),\n          'Authorization': `Bearer ${this.getSecret('JWT_SECRET')}`,\n        },\n      },\n      projects: [\n        {\n          name: 'chromium-staging',\n          use: { ...devices['Desktop Chrome'] },\n        },\n        {\n          name: 'firefox-staging',\n          use: { ...devices['Desktop Firefox'] },\n        },\n        {\n          name: 'webkit-staging',\n          use: { ...devices['Desktop Safari'] },\n        },\n      ],\n      webServer: {\n        command: 'npm run start:staging',\n        port: 3001,\n        timeout: 120000,\n        reuseExistingServer: true,\n      },\n    };\n  }\n\n  /**\n   * Create production configuration\n   */\n  private createProductionConfig(): PlaywrightTestConfig {\n    return {\n      testDir: './tests/production',\n      timeout: 60000,\n      expect: {\n        timeout: 15000,\n        toHaveScreenshot: { threshold: 0.05, mode: 'pixel' },\n      },\n      fullyParallel: true,\n      forbidOnly: true,\n      retries: 3,\n      workers: 5,\n      reporter: [\n        ['dot'],\n        ['json', { outputFile: 'test-results/production-results.json' }],\n        ['junit', { outputFile: 'test-results/production-junit.xml' }],\n        ['custom-enterprise-reporter', { \n          apiEndpoint: 'https://api.testresults.company.com',\n          token: this.getSecret('REPORTING_API_TOKEN'),\n          teamId: 'qa-team'\n        }]\n      ],\n      use: {\n        baseURL: 'https://app.example.com',\n        actionTimeout: 20000,\n        navigationTimeout: 30000,\n        trace: 'on-first-retry',\n        screenshot: 'only-on-failure',\n        video: 'retain-on-failure',\n        ignoreHTTPSErrors: false,\n        extraHTTPHeaders: {\n          'X-Environment': 'production',\n          'X-API-Key': this.getSecret('API_KEY'),\n          'Authorization': `Bearer ${this.getSecret('JWT_SECRET')}`,\n          'X-Request-ID': () => `prod-test-${Date.now()}`,\n        },\n      },\n      projects: [\n        {\n          name: 'chromium-prod',\n          use: { \n            ...devices['Desktop Chrome'],\n            channel: 'chrome',\n          },\n        },\n        {\n          name: 'firefox-prod',\n          use: { ...devices['Desktop Firefox'] },\n        },\n        {\n          name: 'webkit-prod',\n          use: { ...devices['Desktop Safari'] },\n        },\n        {\n          name: 'mobile-chrome-prod',\n          use: { ...devices['Pixel 5'] },\n        },\n        {\n          name: 'mobile-safari-prod',\n          use: { ...devices['iPhone 12'] },\n        },\n      ],\n    };\n  }\n\n  /**\n   * Create testing environment configuration\n   */\n  private createTestingConfig(): PlaywrightTestConfig {\n    return {\n      testDir: './tests',\n      timeout: 30000,\n      expect: {\n        timeout: 5000,\n      },\n      fullyParallel: true,\n      forbidOnly: false,\n      retries: 0,\n      workers: process.env.CI ? 2 : undefined,\n      reporter: [['list']],\n      use: {\n        baseURL: 'http://localhost:3000',\n        actionTimeout: 5000,\n        navigationTimeout: 10000,\n        trace: 'off',\n        screenshot: 'off',\n        video: 'off',\n        extraHTTPHeaders: {\n          'X-Environment': 'testing',\n          'X-Test-Mode': 'unit',\n        },\n      },\n      projects: [\n        {\n          name: 'chromium-test',\n          use: { ...devices['Desktop Chrome'] },\n        },\n      ],\n    };\n  }\n\n  /**\n   * Create CI environment configuration\n   */\n  private createCIConfig(): PlaywrightTestConfig {\n    return {\n      testDir: './tests',\n      timeout: 60000,\n      expect: {\n        timeout: 10000,\n      },\n      fullyParallel: true,\n      forbidOnly: true,\n      retries: 2,\n      workers: 4,\n      reporter: [\n        ['github'],\n        ['json', { outputFile: 'test-results/ci-results.json' }],\n        ['junit', { outputFile: 'test-results/ci-junit.xml' }],\n        ['html', { outputFolder: 'playwright-report-ci', open: 'never' }]\n      ],\n      use: {\n        baseURL: process.env.BASE_URL || 'http://localhost:3000',\n        actionTimeout: 15000,\n        navigationTimeout: 20000,\n        trace: 'retain-on-failure',\n        screenshot: 'only-on-failure',\n        video: 'retain-on-failure',\n        extraHTTPHeaders: {\n          'X-Environment': 'ci',\n          'X-CI-Build': process.env.GITHUB_RUN_ID || process.env.BUILD_NUMBER || 'unknown',\n          'X-Branch': process.env.GITHUB_REF_NAME || process.env.BRANCH_NAME || 'unknown',\n        },\n      },\n      projects: [\n        {\n          name: 'chromium-ci',\n          use: { ...devices['Desktop Chrome'] },\n        },\n        {\n          name: 'firefox-ci',\n          use: { ...devices['Desktop Firefox'] },\n        },\n        {\n          name: 'webkit-ci',\n          use: { ...devices['Desktop Safari'] },\n        },\n      ],\n    };\n  }\n}\n\n// =============================================================================\n// MULTI-TENANT CONFIGURATION\n// =============================================================================\n\n/**\n * Multi-tenant configuration manager for SaaS applications\n */\nexport class MultiTenantConfigManager {\n  private tenantConfigs: Map<string, any> = new Map();\n\n  constructor() {\n    this.initializeTenantConfigs();\n  }\n\n  /**\n   * Initialize configurations for different tenants\n   */\n  private initializeTenantConfigs(): void {\n    // Enterprise tenant configuration\n    this.tenantConfigs.set('enterprise', {\n      baseURL: 'https://enterprise.example.com',\n      features: ['advanced-analytics', 'sso', 'custom-branding', 'api-access'],\n      limits: {\n        users: 10000,\n        projects: 1000,\n        apiCalls: 100000\n      },\n      authentication: {\n        type: 'saml',\n        provider: 'okta',\n        endpoints: {\n          login: '/saml/login',\n          logout: '/saml/logout'\n        }\n      },\n      customHeaders: {\n        'X-Tenant': 'enterprise',\n        'X-Features': 'advanced-analytics,sso,custom-branding,api-access'\n      }\n    });\n\n    // Professional tenant configuration\n    this.tenantConfigs.set('professional', {\n      baseURL: 'https://pro.example.com',\n      features: ['analytics', 'integrations', 'priority-support'],\n      limits: {\n        users: 100,\n        projects: 50,\n        apiCalls: 10000\n      },\n      authentication: {\n        type: 'oauth',\n        provider: 'google',\n        endpoints: {\n          login: '/oauth/google',\n          logout: '/oauth/logout'\n        }\n      },\n      customHeaders: {\n        'X-Tenant': 'professional',\n        'X-Features': 'analytics,integrations,priority-support'\n      }\n    });\n\n    // Basic tenant configuration\n    this.tenantConfigs.set('basic', {\n      baseURL: 'https://basic.example.com',\n      features: ['basic-features'],\n      limits: {\n        users: 10,\n        projects: 5,\n        apiCalls: 1000\n      },\n      authentication: {\n        type: 'basic',\n        endpoints: {\n          login: '/login',\n          logout: '/logout'\n        }\n      },\n      customHeaders: {\n        'X-Tenant': 'basic',\n        'X-Features': 'basic-features'\n      }\n    });\n  }\n\n  /**\n   * Get configuration for specific tenant\n   */\n  public getTenantConfig(tenantId: string): PlaywrightTestConfig {\n    const tenantConfig = this.tenantConfigs.get(tenantId);\n    if (!tenantConfig) {\n      throw new Error(`Tenant configuration not found: ${tenantId}`);\n    }\n\n    const baseConfig = EnterpriseConfigManager.getInstance().getConfig();\n    \n    return {\n      ...baseConfig,\n      use: {\n        ...baseConfig.use,\n        baseURL: tenantConfig.baseURL,\n        extraHTTPHeaders: {\n          ...baseConfig.use?.extraHTTPHeaders,\n          ...tenantConfig.customHeaders\n        },\n        storageState: {\n          cookies: [],\n          origins: [{\n            origin: tenantConfig.baseURL,\n            localStorage: [\n              { name: 'tenantId', value: tenantId },\n              { name: 'features', value: JSON.stringify(tenantConfig.features) },\n              { name: 'limits', value: JSON.stringify(tenantConfig.limits) }\n            ]\n          }]\n        }\n      },\n      projects: baseConfig.projects?.map(project => ({\n        ...project,\n        name: `${project.name}-${tenantId}`,\n        use: {\n          ...project.use,\n          baseURL: tenantConfig.baseURL,\n          extraHTTPHeaders: {\n            ...project.use?.extraHTTPHeaders,\n            ...tenantConfig.customHeaders\n          }\n        }\n      }))\n    };\n  }\n\n  /**\n   * Get all tenant IDs\n   */\n  public getTenantIds(): string[] {\n    return Array.from(this.tenantConfigs.keys());\n  }\n}\n\n// =============================================================================\n// CONFIGURATION VALIDATION\n// =============================================================================\n\n/**\n * Validates configuration integrity and security\n */\nexport class ConfigurationValidator {\n  \n  /**\n   * Validate configuration for security and best practices\n   */\n  public static validateConfig(config: PlaywrightTestConfig): {\n    isValid: boolean;\n    warnings: string[];\n    errors: string[];\n  } {\n    const warnings: string[] = [];\n    const errors: string[] = [];\n\n    // Security validations\n    if (config.use?.ignoreHTTPSErrors === true && process.env.NODE_ENV === 'production') {\n      errors.push('ignoreHTTPSErrors should not be true in production');\n    }\n\n    if (!config.use?.extraHTTPHeaders?.['X-Environment']) {\n      warnings.push('Missing X-Environment header for environment identification');\n    }\n\n    // Performance validations\n    if (config.timeout && config.timeout > 120000) {\n      warnings.push('Test timeout is very high (>2 minutes), consider reducing');\n    }\n\n    if (config.workers && config.workers > 10) {\n      warnings.push('High number of workers may cause resource contention');\n    }\n\n    // Configuration completeness\n    if (!config.reporter) {\n      warnings.push('No reporters configured');\n    }\n\n    if (!config.projects || config.projects.length === 0) {\n      warnings.push('No browser projects configured');\n    }\n\n    // Retry strategy validation\n    if (config.retries && config.retries > 3) {\n      warnings.push('High retry count may mask test instability');\n    }\n\n    return {\n      isValid: errors.length === 0,\n      warnings,\n      errors\n    };\n  }\n\n  /**\n   * Validate secrets are properly configured\n   */\n  public static validateSecrets(requiredSecrets: string[]): {\n    isValid: boolean;\n    missingSecrets: string[];\n  } {\n    const configManager = EnterpriseConfigManager.getInstance();\n    const missingSecrets: string[] = [];\n\n    for (const secret of requiredSecrets) {\n      try {\n        configManager.getSecret(secret);\n      } catch (error) {\n        missingSecrets.push(secret);\n      }\n    }\n\n    return {\n      isValid: missingSecrets.length === 0,\n      missingSecrets\n    };\n  }\n}\n\n// =============================================================================\n// DYNAMIC CONFIGURATION LOADER\n// =============================================================================\n\n/**\n * Loads configuration dynamically based on runtime conditions\n */\nexport class DynamicConfigurationLoader {\n  \n  /**\n   * Load configuration based on runtime environment and conditions\n   */\n  public static loadConfiguration(): PlaywrightTestConfig {\n    const configManager = EnterpriseConfigManager.getInstance();\n    const baseConfig = configManager.getConfig();\n    \n    // Apply runtime modifications\n    const runtimeConfig = this.applyRuntimeModifications(baseConfig);\n    \n    // Validate configuration\n    const validation = ConfigurationValidator.validateConfig(runtimeConfig);\n    \n    if (!validation.isValid) {\n      console.error('Configuration validation failed:', validation.errors);\n      throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);\n    }\n    \n    if (validation.warnings.length > 0) {\n      console.warn('Configuration warnings:', validation.warnings);\n    }\n    \n    return runtimeConfig;\n  }\n\n  /**\n   * Apply runtime-specific modifications to configuration\n   */\n  private static applyRuntimeModifications(config: PlaywrightTestConfig): PlaywrightTestConfig {\n    const runtimeConfig = { ...config };\n    \n    // Adjust workers based on available CPU cores\n    if (process.env.CI) {\n      runtimeConfig.workers = Math.min(runtimeConfig.workers || 1, 4);\n    } else {\n      const cpuCount = require('os').cpus().length;\n      runtimeConfig.workers = Math.min(runtimeConfig.workers || cpuCount, cpuCount);\n    }\n    \n    // Adjust timeouts based on environment\n    if (process.env.SLOW_ENVIRONMENT === 'true') {\n      runtimeConfig.timeout = (runtimeConfig.timeout || 30000) * 2;\n      if (runtimeConfig.use) {\n        runtimeConfig.use.actionTimeout = (runtimeConfig.use.actionTimeout || 0) * 2;\n        runtimeConfig.use.navigationTimeout = (runtimeConfig.use.navigationTimeout || 0) * 2;\n      }\n    }\n    \n    // Enable debug features in development\n    if (process.env.NODE_ENV === 'development' && process.env.DEBUG === 'true') {\n      if (runtimeConfig.use) {\n        runtimeConfig.use.trace = 'on';\n        runtimeConfig.use.video = 'on';\n        runtimeConfig.use.screenshot = 'on';\n      }\n    }\n    \n    return runtimeConfig;\n  }\n}\n\n// =============================================================================\n// EXAMPLE USAGE AND EXPORTS\n// =============================================================================\n\n// Example: Load configuration for current environment\nconst config = DynamicConfigurationLoader.loadConfiguration();\n\n// Example: Multi-tenant configuration\nconst multiTenantManager = new MultiTenantConfigManager();\nconst enterpriseConfig = multiTenantManager.getTenantConfig('enterprise');\n\n// Example: Configuration validation\nconst validation = ConfigurationValidator.validateConfig(config);\nif (!validation.isValid) {\n  console.error('Configuration issues found:', validation.errors);\n}\n\n// Export the main configuration\nexport default config;\n\n// Export utility classes\nexport {\n  EnterpriseConfigManager,\n  MultiTenantConfigManager,\n  ConfigurationValidator,\n  DynamicConfigurationLoader\n};\n\n// Export types for external use\nexport type {\n  EnvironmentConfig,\n  BrowserConfig,\n  TestSuiteConfig\n};\n