# Exercise 02: TypeScript Configuration Mastery 🟡

## 🎯 Objective

Master advanced TypeScript configuration for optimal BDD development experience. Focus on type safety, development productivity, and IDE integration for professional-grade BDD projects.

## 📋 Prerequisites

- **Completed Exercise 01** successfully
- **Working BDD project** with basic TypeScript setup
- **Understanding of TypeScript basics** (interfaces, types, generics)
- **VS Code or similar IDE** with TypeScript support

## 📝 Tasks

### Task 1: Advanced TypeScript Configuration (20 minutes)

#### 1.1 Enhanced tsconfig.json
Replace your existing `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./",
    "baseUrl": "./",
    "paths": {
      "@features/*": ["features/*"],
      "@support/*": ["features/support/*"],
      "@steps/*": ["features/step_definitions/*"],
      "@src/*": ["src/*"],
      "@types/*": ["types/*"]
    },
    "typeRoots": ["./node_modules/@types", "./types"],
    "types": ["node", "playwright"]
  },
  "include": ["features/**/*", "src/**/*", "types/**/*"],
  "exclude": ["node_modules", "dist", "reports"],
  "ts-node": {
    "transpileOnly": true,
    "compilerOptions": {
      "module": "CommonJS"
    },
    "require": ["tsconfig-paths/register"]
  }
}
```

#### 1.2 Install Additional Dependencies
```powershell
npm install --save-dev tsconfig-paths @types/dotenv ts-node-dev
```

### Task 2: Custom Type Definitions (25 minutes)

#### 2.1 Global Type Definitions
Create `types/global.d.ts`:

```typescript
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'testing' | 'staging' | 'production';
      BASE_URL: string;
      API_BASE_URL: string;
      BROWSER: 'chromium' | 'firefox' | 'webkit';
      HEADLESS: 'true' | 'false';
      VIEWPORT_WIDTH: string;
      VIEWPORT_HEIGHT: string;
      TIMEOUT: string;
      EXPECT_TIMEOUT: string;
      SCREENSHOT_ON_FAILURE: 'true' | 'false';
      DEBUG_MODE: 'true' | 'false';
    }
  }
}

export {};
```

#### 2.2 BDD-Specific Types
Create `types/bdd.d.ts`:

```typescript
import { Page, BrowserContext, Browser } from 'playwright';
import { World } from '@cucumber/cucumber';

export interface IBDDWorld extends World {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  testData: Record<string, any>;
  
  init(): Promise<void>;
  cleanup(): Promise<void>;
  takeScreenshot(name?: string): Promise<string>;
  setTestData(key: string, value: any): void;
  getTestData<T = any>(key: string): T | undefined;
}

export interface TestConfig {
  browser: 'chromium' | 'firefox' | 'webkit';
  headless: boolean;
  viewport: { width: number; height: number };
  timeouts: { default: number; expect: number };
}

export interface UserData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'user' | 'guest';
}

export type ElementState = 'visible' | 'hidden' | 'enabled' | 'disabled';
```

### Task 3: Enhanced World Implementation (20 minutes)

#### 3.1 Type-Safe World Class
Update `features/support/world.ts`:

```typescript
import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from 'playwright';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { IBDDWorld, TestConfig } from '@types/bdd';

dotenv.config();

export class EnhancedWorld extends World implements IBDDWorld {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;
  public testData: Record<string, any> = {};
  public config: TestConfig;
  
  constructor(options: IWorldOptions) {
    super(options);
    this.config = this.loadConfig();
  }
  
  private loadConfig(): TestConfig {
    return {
      browser: (process.env.BROWSER as any) || 'chromium',
      headless: process.env.HEADLESS === 'true',
      viewport: {
        width: parseInt(process.env.VIEWPORT_WIDTH || '1280'),
        height: parseInt(process.env.VIEWPORT_HEIGHT || '720')
      },
      timeouts: {
        default: parseInt(process.env.TIMEOUT || '30000'),
        expect: parseInt(process.env.EXPECT_TIMEOUT || '10000')
      }
    };
  }
  
  async init(): Promise<void> {
    this.browser = await chromium.launch({
      headless: this.config.headless
    });
    
    this.context = await this.browser.newContext({
      viewport: this.config.viewport
    });
    
    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(this.config.timeouts.default);
  }
  
  async cleanup(): Promise<void> {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }
  
  async takeScreenshot(name?: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotName = name ? `${name}-${timestamp}` : `screenshot-${timestamp}`;
    const screenshotPath = path.join('screenshots', `${screenshotName}.png`);
    
    if (!fs.existsSync('screenshots')) {
      fs.mkdirSync('screenshots', { recursive: true });
    }
    
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    return screenshotPath;
  }
  
  setTestData(key: string, value: any): void {
    this.testData[key] = value;
  }
  
  getTestData<T = any>(key: string): T | undefined {
    return this.testData[key] as T;
  }
}

setWorldConstructor(EnhancedWorld);
```

### Task 4: Type-Safe Step Definitions (15 minutes)

#### 4.1 Enhanced Step Definitions
Create `features/step_definitions/typed-steps.ts`:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { EnhancedWorld } from '@support/world';
import { UserData, ElementState } from '@types/bdd';

Given('I am on the {string} page', async function (this: EnhancedWorld, pageName: string) {
  const urls: Record<string, string> = {
    'homepage': process.env.BASE_URL || 'https://example.com',
    'login': `${process.env.BASE_URL}/login`,
    'dashboard': `${process.env.BASE_URL}/dashboard`
  };
  
  const url = urls[pageName.toLowerCase()];
  if (!url) {
    throw new Error(`Unknown page: ${pageName}`);
  }
  
  await this.page.goto(url);
  this.setTestData('currentPage', pageName);
});

When('I click the {string} button', async function (this: EnhancedWorld, buttonName: string) {
  const selectors: Record<string, string> = {
    'login': '[data-testid="login-button"], button:has-text("Login")',
    'submit': '[data-testid="submit-button"], button[type="submit"]',
    'cancel': '[data-testid="cancel-button"], button:has-text("Cancel")'
  };
  
  const selector = selectors[buttonName.toLowerCase()];
  if (!selector) {
    throw new Error(`Unknown button: ${buttonName}`);
  }
  
  await this.page.locator(selector).click();
});

Then('the {string} element should be {string}', async function (this: EnhancedWorld, elementName: string, state: ElementState) {
  const selectors: Record<string, string> = {
    'login form': '[data-testid="login-form"]',
    'error message': '[data-testid="error"], .error',
    'success message': '[data-testid="success"], .success'
  };
  
  const selector = selectors[elementName.toLowerCase()];
  if (!selector) {
    throw new Error(`Unknown element: ${elementName}`);
  }
  
  const element = this.page.locator(selector);
  
  switch (state) {
    case 'visible':
      await expect(element).toBeVisible();
      break;
    case 'hidden':
      await expect(element).toBeHidden();
      break;
    case 'enabled':
      await expect(element).toBeEnabled();
      break;
    case 'disabled':
      await expect(element).toBeDisabled();
      break;
    default:
      throw new Error(`Unknown state: ${state}`);
  }
});
```

### Task 5: IDE Integration (10 minutes)

#### 5.1 VS Code Settings
Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "typescript.suggest.autoImports": true,
  "typescript.suggest.paths": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "files.associations": {
    "*.feature": "gherkin"
  }
}
```

#### 5.2 Enhanced Package Scripts
Update `package.json` scripts:

```json
{
  "scripts": {
    "test": "cucumber-js",
    "test:dev": "NODE_ENV=development HEADLESS=false cucumber-js",
    "test:debug": "NODE_ENV=development HEADLESS=false DEBUG_MODE=true cucumber-js",
    "typecheck": "tsc --noEmit",
    "typecheck:watch": "tsc --noEmit --watch",
    "lint:types": "tsc --noEmit --strict",
    "clean": "rimraf dist reports screenshots",
    "pretest": "npm run typecheck"
  }
}
```

## ✅ Validation

### Type Safety Checklist

- [ ] **Strict TypeScript**: All strict options enabled
- [ ] **Path Mapping**: Custom paths work with IntelliSense
- [ ] **Custom Types**: BDD-specific types defined and used
- [ ] **World Class**: Fully typed with interface implementation
- [ ] **Step Definitions**: Type-safe parameter handling
- [ ] **Environment**: Process.env properly typed
- [ ] **IDE Integration**: Full IntelliSense support

### Test Commands

```powershell
# Test strict type checking
npm run lint:types

# Test path mapping
npm run typecheck

# Test enhanced debugging
npm run test:debug

# Test watch mode
npm run typecheck:watch
```

## 🔧 Troubleshooting

### Common Issues

**Issue: "Cannot resolve path mapping"**
```powershell
# Install tsconfig-paths
npm install --save-dev tsconfig-paths
# Ensure "require": ["tsconfig-paths/register"] is in ts-node section
```

**Issue: "Type errors in step definitions"**
- Check that `this: EnhancedWorld` is properly typed
- Verify custom types are properly exported/imported
- Restart TypeScript service in VS Code

**Issue: "IDE not recognizing custom types"**
- Restart TypeScript service (Cmd/Ctrl+Shift+P → "TypeScript: Restart TS Server")
- Check that types directory is included in tsconfig.json

## 🎓 Learning Points

### Advanced TypeScript Concepts

1. **Strict Type Checking**: Maximum type safety configuration
2. **Path Mapping**: Organized imports with custom paths
3. **Declaration Files**: Custom type definitions for BDD
4. **Interface Implementation**: Type-safe World class
5. **Generic Types**: Flexible, reusable type definitions
6. **Environment Types**: Typed process.env variables
7. **IDE Integration**: Enhanced development experience

### Professional Practices

- **Type-First Development**: Define types before implementation
- **Incremental Adoption**: Gradually increase type strictness
- **Documentation**: Types as living documentation
- **Team Standards**: Consistent typing across codebase
- **Tooling Integration**: Leverage IDE capabilities fully

## 📊 Self-Assessment

Rate your understanding (1-5 scale):

- [ ] Advanced TypeScript configuration
- [ ] Path mapping and module resolution
- [ ] Custom type definitions for BDD
- [ ] Type-safe World classes
- [ ] Type-safe step definitions
- [ ] IDE integration setup
- [ ] TypeScript troubleshooting
- [ ] Benefits of strict typing in BDD

**Minimum Score for Progression**: 28/40 (70%)

Your enhanced setup now provides:
- **Type Safety**: Catch errors at compile time
- **Better DX**: Enhanced IDE support and IntelliSense
- **Maintainability**: Self-documenting code through types
- **Team Collaboration**: Shared understanding via type contracts
- **Professional Standards**: Industry-grade TypeScript configuration

Congratulations on mastering TypeScript configuration for BDD! 🎉