# Exercise 01: Complete BDD Project Setup 🟢

## 🎯 Objective

Create a fully functional BDD project from scratch with Cucumber, TypeScript, and Playwright integration. This exercise establishes a solid foundation for all future BDD development work.

## 📋 Prerequisites

- **Node.js 16+** installed and verified
- **npm or yarn** package manager available
- **Basic understanding** of TypeScript and npm projects
- **VS Code or similar IDE** with TypeScript support
- **Completed** Lesson 02 content review

## 📝 Tasks

### Task 1: Project Initialization (15 minutes)

Create project structure and initialize git repository:

```powershell
# Create project directory
New-Item -ItemType Directory -Force -Path "my-bdd-project"
Set-Location "my-bdd-project"

# Initialize npm project
npm init -y

# Create directory structure
New-Item -ItemType Directory -Force -Path "features"
New-Item -ItemType Directory -Force -Path "features/step_definitions"
New-Item -ItemType Directory -Force -Path "features/support"
New-Item -ItemType Directory -Force -Path "src"
New-Item -ItemType Directory -Force -Path "reports"

# Initialize git
git init
```

### Task 2: Install Dependencies (10 minutes)

```powershell
# Install core dependencies
npm install --save-dev @cucumber/cucumber @playwright/test
npm install --save-dev typescript ts-node @types/node
npm install --save-dev dotenv

# Install Playwright browsers
npx playwright install
```

### Task 3: Configuration Files (15 minutes)

Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "lib": ["ES2022", "DOM"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["features/**/*", "src/**/*"],
  "exclude": ["node_modules", "dist", "reports"]
}
```

Create `cucumber.json`:
```json
{
  "default": {
    "require": [
      "features/step_definitions/**/*.ts",
      "features/support/**/*.ts"
    ],
    "requireModule": ["ts-node/register"],
    "format": ["progress-bar", "html:reports/cucumber-report.html"],
    "formatOptions": {
      "snippetInterface": "async-await"
    }
  }
}
```

Create `.env`:
```bash
NODE_ENV=development
BASE_URL=http://localhost:3000
BROWSER=chromium
HEADLESS=false
TIMEOUT=30000
```

### Task 4: World Setup (20 minutes)

Create `features/support/world.ts`:
```typescript
import { World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from 'playwright';
import * as dotenv from 'dotenv';

dotenv.config();

export class CustomWorld extends World {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;
  
  constructor(options: IWorldOptions) {
    super(options);
  }
  
  async init(): Promise<void> {
    this.browser = await chromium.launch({ 
      headless: process.env.HEADLESS === 'true' 
    });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }
  
  async cleanup(): Promise<void> {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }
}
```

### Task 5: Hooks and Feature Files (20 minutes)

Create `features/support/hooks.ts`:
```typescript
import { Before, After } from '@cucumber/cucumber';
import { CustomWorld } from './world';

Before(async function (this: CustomWorld) {
  await this.init();
});

After(async function (this: CustomWorld) {
  await this.cleanup();
});
```

Create `features/sample.feature`:
```gherkin
Feature: Sample Homepage Testing
  As a user
  I want to visit the homepage
  So that I can verify basic functionality

  @smoke
  Scenario: Homepage loads successfully
    Given I am on the homepage
    When the page loads completely
    Then I should see the page title
```

Create `features/step_definitions/sample.steps.ts`:
```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('I am on the homepage', async function (this: CustomWorld) {
  await this.page.goto(process.env.BASE_URL || 'https://example.com');
});

When('the page loads completely', async function (this: CustomWorld) {
  await this.page.waitForLoadState('networkidle');
});

Then('I should see the page title', async function (this: CustomWorld) {
  const title = await this.page.title();
  expect(title).toBeTruthy();
});
```

### Task 6: Package Scripts (5 minutes)

Add to `package.json`:
```json
{
  "scripts": {
    "test": "cucumber-js",
    "test:dev": "NODE_ENV=development HEADLESS=false cucumber-js",
    "typecheck": "tsc --noEmit",
    "pretest": "npm run typecheck"
  }
}
```

## ✅ Validation

Run these commands to verify setup:

```powershell
# Check TypeScript compilation
npm run typecheck

# Test configuration
npx cucumber-js --dry-run

# Run first test
npm run test:dev
```

## 🔧 Troubleshooting

**Common Issues:**
- `Cannot find module`: Run `npm install`
- `Browser not found`: Run `npx playwright install`
- `No step definitions`: Check file paths in cucumber.json
- `TypeScript errors`: Verify tsconfig.json configuration

## 🎓 Learning Points

- **Project Structure**: Proper BDD project organization
- **TypeScript Integration**: TS configuration for Cucumber
- **World Pattern**: Browser state management
- **Configuration**: Environment-based setup
- **Step Definitions**: Basic test automation patterns

## 📊 Self-Assessment

Rate your understanding (1-5):
- [ ] Project setup from scratch
- [ ] TypeScript configuration
- [ ] Cucumber integration
- [ ] Step definition creation
- [ ] Test execution

**Minimum Score**: 12/25 (48%) to proceed to Exercise 02.

Congratulations on completing your first BDD project setup! 🎉