# Lesson 02: Setting up the Project Environment

## Learning Objectives

By the end of this lesson, you will be able to:

1. **Configure a complete development environment** for TypeScript, Playwright, and Cucumber
2. **Create a professional project structure** following industry best practices
3. **Set up version control and collaboration workflows** using Git and GitHub
4. **Establish tooling and automation** for consistent development experience
5. **Implement environment configuration management** for multiple testing environments

## Introduction

A well-configured development environment is the foundation of any successful automation project. This lesson guides you through setting up a professional-grade development workspace that supports efficient development, collaboration, and deployment of your test automation framework.

### Why Environment Setup Matters

Professional environment setup provides:
- **Consistency**: Standardized development experience across team members
- **Efficiency**: Automated tooling reduces manual setup and configuration tasks
- **Quality**: Built-in linting, formatting, and validation ensures code quality
- **Collaboration**: Shared configurations enable seamless team collaboration

## Prerequisites Verification

### System Requirements

Before starting, verify your system meets these requirements:

```powershell
# Check Node.js version (required: v18+)
node --version

# Check npm version
npm --version

# Check Git installation
git --version

# Verify PowerShell version (Windows)
$PSVersionTable.PSVersion
```

### Required Software Installation

If any components are missing, install them using these Windows-compatible commands:

#### Node.js Installation
```powershell
# Download and install Node.js from official website
# Visit: https://nodejs.org/en/download/
# Choose Windows Installer (.msi) for x64

# After installation, verify:
node --version  # Should show v18+ or higher
npm --version   # Should show corresponding npm version
```

#### Git Installation
```powershell
# Download and install Git for Windows
# Visit: https://git-scm.com/download/win
# Choose 64-bit Git for Windows Setup

# After installation, verify:
git --version
```

## Project Repository Setup

### Step 1: Create GitHub Repository

#### Repository Creation
1. **Navigate to GitHub**: Open [github.com](https://github.com) and sign in
2. **Create New Repository**: Click "New" or use the "+" menu
3. **Repository Configuration**:
   - **Name**: `techshop-automation`
   - **Description**: `Professional test automation framework for e-commerce application`
   - **Visibility**: Public (for portfolio purposes)
   - **Initialize**: Check "Add a README file"
   - **Gitignore**: Choose "Node"
   - **License**: MIT License (recommended for portfolio projects)

#### Repository Cloning
```powershell
# Navigate to your projects directory
cd "C:\Projects"

# Clone the repository
git clone https://github.com/YOUR_USERNAME/techshop-automation.git

# Navigate into project directory
cd techshop-automation

# Verify repository setup
git status
```

### Step 2: Initial Project Structure Creation

Create the professional project structure:

```powershell
# Create main directory structure
mkdir src, features, tests, config, docs, reports

# Create subdirectories for organized code structure
mkdir src\pages, src\api, src\fixtures, src\utils, src\step-definitions
mkdir tests\e2e, tests\api
mkdir .github\workflows
mkdir config\environments

# Verify structure creation
tree /F
```

## Development Environment Configuration

### Step 1: Node.js Project Initialization

Initialize the Node.js project with comprehensive configuration:

```powershell
# Initialize package.json with interactive setup
npm init -y

# Install core dependencies
npm install --save-dev @playwright/test @cucumber/cucumber typescript ts-node

# Install additional testing dependencies
npm install --save-dev @types/node dotenv cross-env

# Install development utilities
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier

# Install Playwright browsers
npx playwright install
```

### Step 2: TypeScript Configuration

Create comprehensive TypeScript configuration (`tsconfig.json`):

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": false,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "types": ["node", "playwright"]
  },
  "include": [
    "src/**/*",
    "tests/**/*",
    "features/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "reports"
  ]
}
```

### Step 3: Playwright Configuration

Create Playwright configuration (`playwright.config.ts`):

```typescript
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Playwright Test Configuration
 * Comprehensive setup for cross-browser testing with multiple environments
 */
export default defineConfig({
  // Test directory configuration
  testDir: './tests',
  
  // Global test timeout
  timeout: 30000,
  
  // Expect timeout for assertions
  expect: {
    timeout: 5000
  },
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry configuration
  retries: process.env.CI ? 2 : 0,
  
  // Parallel execution
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'reports/playwright-html' }],
    ['json', { outputFile: 'reports/playwright-results.json' }],
    ['junit', { outputFile: 'reports/playwright-junit.xml' }]
  ],
  
  // Global test setup
  use: {
    // Base URL from environment
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Browser context options
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
    
    // Viewport size
    viewport: { width: 1280, height: 720 }
  },

  // Browser project configurations
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
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    }
  ],

  // Web server configuration for local development
  webServer: {
    command: 'npm run start:test-server',
    port: 3000,
    reuseExistingServer: !process.env.CI
  }
});
```

### Step 4: Cucumber Configuration

Create Cucumber configuration (`cucumber.config.ts`):

```typescript
import { defineConfig } from '@cucumber/cucumber';

export default defineConfig({
  // Feature files location
  features: ['features/**/*.feature'],
  
  // Step definitions location
  require: [
    'src/step-definitions/**/*.ts',
    'src/support/**/*.ts'
  ],
  
  // Require module for TypeScript support
  requireModule: ['ts-node/register'],
  
  // Format options
  format: [
    'pretty',
    'html:reports/cucumber-html/index.html',
    'json:reports/cucumber-json/results.json',
    'junit:reports/cucumber-junit/results.xml'
  ],
  
  // Parallel execution
  parallel: 2,
  
  // Retry configuration
  retry: 1,
  
  // Tag expressions for selective execution
  tags: process.env.CUCUMBER_TAGS || '@smoke or @regression',
  
  // World parameters
  worldParameters: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    browser: process.env.BROWSER || 'chromium',
    headless: process.env.HEADLESS !== 'false'
  }
});
```

## Code Quality and Development Tools Setup

### Step 1: ESLint Configuration

Create ESLint configuration (`.eslintrc.json`):

```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint",
    "prettier"
  ],
  "rules": {
    "prettier/prettier": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-var": "error"
  },
  "ignorePatterns": [
    "dist/**",
    "node_modules/**",
    "reports/**"
  ]
}
```

### Step 2: Prettier Configuration

Create Prettier configuration (`.prettierrc.json`):

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "crlf"
}
```

### Step 3: Package.json Scripts Configuration

Update `package.json` with comprehensive scripts:

```json
{
  "name": "techshop-automation",
  "version": "1.0.0",
  "description": "Professional test automation framework for e-commerce application",
  "main": "index.js",
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:ui": "playwright test --ui",
    "test:chromium": "playwright test --project=chromium",
    "test:firefox": "playwright test --project=firefox",
    "test:webkit": "playwright test --project=webkit",
    "test:mobile": "playwright test --project=mobile-chrome --project=mobile-safari",
    "cucumber": "cucumber-js",
    "cucumber:smoke": "cucumber-js --tags @smoke",
    "cucumber:regression": "cucumber-js --tags @regression",
    "lint": "eslint src tests --ext .ts",
    "lint:fix": "eslint src tests --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\" \"tests/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.ts\" \"tests/**/*.ts\"",
    "type-check": "tsc --noEmit",
    "clean": "rimraf dist reports",
    "report:open": "npx playwright show-report",
    "report:cucumber": "open reports/cucumber-html/index.html",
    "setup": "npm install && npx playwright install",
    "start:test-server": "echo 'Test server would start here'",
    "precommit": "npm run lint && npm run type-check && npm run format:check"
  },
  "keywords": [
    "playwright",
    "cucumber",
    "typescript",
    "test-automation",
    "e2e-testing",
    "bdd"
  ],
  "author": "Your Name",
  "license": "MIT"
}
```

## Environment Configuration Management

### Step 1: Environment Variables Setup

Create environment configuration files:

#### Development Environment (`.env.development`)
```env
# Application Configuration
BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:3001/api

# Browser Configuration
BROWSER=chromium
HEADLESS=false
VIEWPORT_WIDTH=1280
VIEWPORT_HEIGHT=720

# Test Configuration
TEST_TIMEOUT=30000
EXPECT_TIMEOUT=5000
RETRY_COUNT=1

# Reporting Configuration
GENERATE_REPORTS=true
REPORT_PATH=./reports

# Debug Configuration
DEBUG=true
TRACE_ON=true
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=true
```

#### Testing Environment (`.env.testing`)
```env
# Application Configuration
BASE_URL=https://staging.techshop.com
API_BASE_URL=https://staging-api.techshop.com/api

# Browser Configuration
BROWSER=chromium
HEADLESS=true
VIEWPORT_WIDTH=1280
VIEWPORT_HEIGHT=720

# Test Configuration
TEST_TIMEOUT=45000
EXPECT_TIMEOUT=10000
RETRY_COUNT=2

# Reporting Configuration
GENERATE_REPORTS=true
REPORT_PATH=./reports

# Debug Configuration
DEBUG=false
TRACE_ON=true
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=true
```

#### Production Environment (`.env.production`)
```env
# Application Configuration
BASE_URL=https://www.techshop.com
API_BASE_URL=https://api.techshop.com/api

# Browser Configuration
BROWSER=chromium
HEADLESS=true
VIEWPORT_WIDTH=1280
VIEWPORT_HEIGHT=720

# Test Configuration
TEST_TIMEOUT=60000
EXPECT_TIMEOUT=15000
RETRY_COUNT=3

# Reporting Configuration
GENERATE_REPORTS=true
REPORT_PATH=./reports

# Debug Configuration
DEBUG=false
TRACE_ON=false
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=false
```

### Step 2: Environment Configuration Utility

Create environment configuration utility (`src/utils/config.ts`):

```typescript
import dotenv from 'dotenv';
import path from 'path';

/**
 * Environment Configuration Manager
 * Loads and manages environment-specific configurations
 */
export class EnvironmentConfig {
  private static instance: EnvironmentConfig;
  private config: Record<string, string>;

  private constructor() {
    this.loadEnvironmentConfig();
  }

  public static getInstance(): EnvironmentConfig {
    if (!EnvironmentConfig.instance) {
      EnvironmentConfig.instance = new EnvironmentConfig();
    }
    return EnvironmentConfig.instance;
  }

  private loadEnvironmentConfig(): void {
    const environment = process.env.NODE_ENV || 'development';
    const envFile = `.env.${environment}`;
    
    // Load base .env file first
    dotenv.config();
    
    // Load environment-specific configuration
    dotenv.config({
      path: path.resolve(process.cwd(), envFile)
    });

    this.config = process.env as Record<string, string>;
  }

  public get(key: string, defaultValue?: string): string {
    return this.config[key] || defaultValue || '';
  }

  public getNumber(key: string, defaultValue?: number): number {
    const value = this.get(key);
    return value ? parseInt(value, 10) : (defaultValue || 0);
  }

  public getBoolean(key: string, defaultValue?: boolean): boolean {
    const value = this.get(key).toLowerCase();
    return value === 'true' || value === '1' || (defaultValue || false);
  }

  public getBaseUrl(): string {
    return this.get('BASE_URL', 'http://localhost:3000');
  }

  public getApiBaseUrl(): string {
    return this.get('API_BASE_URL', 'http://localhost:3001/api');
  }

  public getBrowser(): string {
    return this.get('BROWSER', 'chromium');
  }

  public isHeadless(): boolean {
    return this.getBoolean('HEADLESS', true);
  }

  public getTimeout(): number {
    return this.getNumber('TEST_TIMEOUT', 30000);
  }

  public getExpectTimeout(): number {
    return this.getNumber('EXPECT_TIMEOUT', 5000);
  }

  public getRetryCount(): number {
    return this.getNumber('RETRY_COUNT', 1);
  }

  public isDebugMode(): boolean {
    return this.getBoolean('DEBUG', false);
  }

  public shouldGenerateReports(): boolean {
    return this.getBoolean('GENERATE_REPORTS', true);
  }

  public getReportPath(): string {
    return this.get('REPORT_PATH', './reports');
  }
}

// Export singleton instance
export const config = EnvironmentConfig.getInstance();
```

## Git Configuration and Workflow Setup

### Step 1: Git Configuration

Configure Git for professional development:

```powershell
# Set global Git configuration
git config --global user.name "Your Full Name"
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# Configure line endings for Windows
git config --global core.autocrlf true

# Configure editor (VS Code)
git config --global core.editor "code --wait"

# Configure diff tool
git config --global diff.tool vscode
git config --global difftool.vscode.cmd "code --wait --diff $LOCAL $REMOTE"

# Configure merge tool
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd "code --wait $MERGED"
```

### Step 2: Gitignore Configuration

Create comprehensive `.gitignore` file:

```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
*.tsbuildinfo

# Test reports and artifacts
reports/
test-results/
playwright-report/
coverage/

# Environment files (keep templates)
.env
.env.local
.env.*.local
!.env.example
!.env.development
!.env.testing
!.env.production

# IDE and editor files
.vscode/settings.json
.vscode/launch.json
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Temporary files
tmp/
temp/

# Screenshots and videos from failed tests
test-results/
screenshots/
videos/
traces/

# Package manager lock files (include one, exclude others)
package-lock.json
# yarn.lock
# pnpm-lock.yaml

# Playwright browsers (will be downloaded via install command)
# ms-playwright/

# Coverage directory used by tools like istanbul
coverage/
.nyc_output/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/
```

### Step 3: Git Hooks Setup

Create pre-commit hook for code quality:

```powershell
# Create Git hooks directory
mkdir .git\hooks

# Create pre-commit hook file
@"
#!/bin/sh
# Pre-commit hook for code quality checks

echo "Running pre-commit checks..."

# Run linting
echo "Checking code style..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed. Please fix the issues and try again."
  exit 1
fi

# Run type checking
echo "Checking TypeScript types..."
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ Type checking failed. Please fix the issues and try again."
  exit 1
fi

# Run formatting check
echo "Checking code formatting..."
npm run format:check
if [ $? -ne 0 ]; then
  echo "❌ Code formatting issues found. Run 'npm run format' to fix."
  exit 1
fi

echo "✅ All pre-commit checks passed!"
exit 0
"@ | Out-File -FilePath .git\hooks\pre-commit -Encoding ASCII

# Make the hook executable
# Note: This may require additional configuration on Windows
```

## VS Code Workspace Configuration

### Step 1: VS Code Settings

Create VS Code workspace settings (`.vscode/settings.json`):

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/reports": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/reports": true
  },
  "files.associations": {
    "*.feature": "cucumber"
  },
  "emmet.includeLanguages": {
    "cucumber": "html"
  }
}
```

### Step 2: VS Code Extensions

Create recommended extensions list (`.vscode/extensions.json`):

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-playwright.playwright",
    "alexkrechik.cucumberautocomplete",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml",
    "ms-vscode.powershell",
    "eamodio.gitlens",
    "ms-vscode.test-adapter-converter"
  ]
}
```

### Step 3: VS Code Launch Configuration

Create debugging configuration (`.vscode/launch.json`):

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Playwright Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/playwright",
      "args": ["test", "--debug"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "env": {
        "NODE_ENV": "development"
      }
    },
    {
      "name": "Debug Cucumber Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/cucumber-js",
      "args": ["--tags", "@debug"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

## Verification and Testing

### Step 1: Environment Verification Script

Create verification script (`scripts/verify-setup.ts`):

```typescript
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { config } from '../src/utils/config';

/**
 * Environment Setup Verification Script
 * Validates that all required components are properly configured
 */
class SetupVerification {
  private errors: string[] = [];
  private warnings: string[] = [];

  public async verify(): Promise<void> {
    console.log('🔍 Verifying development environment setup...\n');

    this.checkNodeVersion();
    this.checkGitConfiguration();
    this.checkProjectStructure();
    this.checkDependencies();
    this.checkConfiguration();
    this.checkEnvironmentFiles();

    this.reportResults();
  }

  private checkNodeVersion(): void {
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
      const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0]);
      
      if (majorVersion >= 18) {
        console.log('✅ Node.js version:', nodeVersion);
      } else {
        this.errors.push(`Node.js version ${nodeVersion} is too old. Required: v18+`);
      }
    } catch (error) {
      this.errors.push('Node.js is not installed or not accessible');
    }
  }

  private checkGitConfiguration(): void {
    try {
      const gitUser = execSync('git config user.name', { encoding: 'utf8' }).trim();
      const gitEmail = execSync('git config user.email', { encoding: 'utf8' }).trim();
      
      if (gitUser && gitEmail) {
        console.log('✅ Git configuration:', `${gitUser} <${gitEmail}>`);
      } else {
        this.warnings.push('Git user configuration is incomplete');
      }
    } catch (error) {
      this.errors.push('Git is not installed or not configured');
    }
  }

  private checkProjectStructure(): void {
    const requiredDirs = [
      'src', 'features', 'tests', 'config', 'docs',
      'src/pages', 'src/api', 'src/utils', 'src/step-definitions',
      'tests/e2e', 'tests/api'
    ];

    const missingDirs = requiredDirs.filter(dir => !existsSync(dir));
    
    if (missingDirs.length === 0) {
      console.log('✅ Project structure is complete');
    } else {
      this.errors.push(`Missing directories: ${missingDirs.join(', ')}`);
    }
  }

  private checkDependencies(): void {
    try {
      const packageJson = require('../package.json');
      const requiredDeps = [
        '@playwright/test',
        '@cucumber/cucumber',
        'typescript',
        'ts-node'
      ];

      const missingDeps = requiredDeps.filter(dep => 
        !packageJson.devDependencies?.[dep] && !packageJson.dependencies?.[dep]
      );

      if (missingDeps.length === 0) {
        console.log('✅ All required dependencies are installed');
      } else {
        this.errors.push(`Missing dependencies: ${missingDeps.join(', ')}`);
      }
    } catch (error) {
      this.errors.push('Unable to verify package dependencies');
    }
  }

  private checkConfiguration(): void {
    const configFiles = [
      'tsconfig.json',
      'playwright.config.ts',
      '.eslintrc.json',
      '.prettierrc.json'
    ];

    const missingConfigs = configFiles.filter(file => !existsSync(file));
    
    if (missingConfigs.length === 0) {
      console.log('✅ All configuration files are present');
    } else {
      this.errors.push(`Missing configuration files: ${missingConfigs.join(', ')}`);
    }
  }

  private checkEnvironmentFiles(): void {
    const envFiles = [
      '.env.development',
      '.env.testing',
      '.env.production'
    ];

    const missingEnvFiles = envFiles.filter(file => !existsSync(file));
    
    if (missingEnvFiles.length === 0) {
      console.log('✅ Environment configuration files are present');
      console.log(`🔧 Current base URL: ${config.getBaseUrl()}`);
    } else {
      this.warnings.push(`Missing environment files: ${missingEnvFiles.join(', ')}`);
    }
  }

  private reportResults(): void {
    console.log('\n📊 Setup Verification Results:');
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('🎉 Environment setup is complete and ready for development!');
    } else {
      if (this.errors.length > 0) {
        console.log('\n❌ Errors that must be fixed:');
        this.errors.forEach(error => console.log(`   - ${error}`));
      }
      
      if (this.warnings.length > 0) {
        console.log('\n⚠️  Warnings (recommended to fix):');
        this.warnings.forEach(warning => console.log(`   - ${warning}`));
      }
    }
  }
}

// Run verification if script is executed directly
if (require.main === module) {
  const verification = new SetupVerification();
  verification.verify().catch(console.error);
}
```

### Step 2: Setup Verification Execution

```powershell
# Create scripts directory
mkdir scripts

# Run the verification script
npx ts-node scripts/verify-setup.ts

# Run basic test to verify Playwright installation
npx playwright test --list

# Verify TypeScript compilation
npm run type-check

# Verify linting configuration
npm run lint

# Verify formatting configuration
npm run format:check
```

## Practical Exercise: Complete Environment Setup

### Exercise Overview
Set up your complete development environment and verify all configurations are working correctly.

### Exercise Instructions

#### Step 1: Environment Setup Checklist
Complete each step and verify the result:

- [ ] **Repository Setup**: Create and clone GitHub repository
- [ ] **Project Structure**: Create all required directories
- [ ] **Dependencies**: Install all Node.js packages
- [ ] **TypeScript**: Configure TypeScript compilation
- [ ] **Playwright**: Configure cross-browser testing
- [ ] **Cucumber**: Configure BDD testing framework
- [ ] **Code Quality**: Set up ESLint and Prettier
- [ ] **Environment Config**: Create environment-specific settings
- [ ] **Git Workflow**: Configure Git hooks and workflows
- [ ] **VS Code**: Set up workspace and extensions

#### Step 2: Verification Tests
Run these commands to verify your setup:

```powershell
# Verify project builds successfully
npm run build

# Verify TypeScript compilation
npm run type-check

# Verify code quality tools
npm run lint
npm run format:check

# Verify Playwright installation
npx playwright --version
npx playwright test --list

# Verify environment configuration
npx ts-node scripts/verify-setup.ts

# Create initial commit
git add .
git commit -m "feat: initial project setup with complete development environment"
git push origin main
```

#### Step 3: Documentation Creation
Create project documentation:

1. **Update README.md** with project overview and setup instructions
2. **Create CONTRIBUTING.md** with development guidelines
3. **Create CHANGELOG.md** for tracking project changes
4. **Document environment variables** in `.env.example`

### Deliverable Checklist

- [ ] GitHub repository created and configured
- [ ] Complete project structure implemented
- [ ] All dependencies installed and configured
- [ ] TypeScript, Playwright, and Cucumber configurations working
- [ ] Code quality tools (ESLint, Prettier) operational
- [ ] Environment configuration management implemented
- [ ] Git workflows and hooks configured
- [ ] VS Code workspace optimized for development
- [ ] Setup verification script passing all checks
- [ ] Initial documentation created and committed

## Summary

This lesson established a professional development environment by:

1. **Repository Setup**: Created GitHub repository with proper configuration
2. **Project Structure**: Implemented industry-standard directory organization
3. **Tool Configuration**: Set up TypeScript, Playwright, Cucumber, and code quality tools
4. **Environment Management**: Created flexible configuration for multiple environments
5. **Development Workflow**: Established Git workflows and VS Code optimization

### Key Takeaways

- **Professional Setup**: Industry-standard environment configuration enables efficient development
- **Tool Integration**: Proper configuration of TypeScript, Playwright, and Cucumber creates a powerful testing foundation
- **Quality Assurance**: ESLint, Prettier, and Git hooks ensure consistent code quality
- **Environment Flexibility**: Multiple environment configurations support development through production
- **Documentation**: Comprehensive setup documentation enables team collaboration and project maintenance

### Next Steps

In [Lesson 03: Building the Test Framework Foundation](../lesson-03-building-the-test-framework-foundation/README.md), you'll:
- Implement core framework architecture and utilities
- Create base classes for Page Object Model implementation
- Set up configuration management and helper functions
- Establish patterns for scalable test development

### Troubleshooting Resources

- **Node.js Issues**: [Node.js Installation Guide](https://nodejs.org/en/download/)
- **Playwright Problems**: [Playwright Troubleshooting](https://playwright.dev/docs/troubleshooting)
- **TypeScript Configuration**: [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- **Git Configuration**: [Git Setup Guide](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup)

---

*Your development environment is now ready for professional test automation development. Proceed to build the framework foundation in the next lesson!*
