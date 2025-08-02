# Example 03: Conditional Execution Patterns

## Overview

This example demonstrates advanced conditional execution patterns using tag expressions, command-line filtering, environment variables, and sophisticated test selection strategies for different execution contexts.

## Learning Focus

- **Tag Expression Logic**: Complex boolean expressions with AND, OR, NOT operators
- **Command-Line Mastery**: Advanced filtering techniques and execution control
- **Environment Integration**: Dynamic test selection based on runtime conditions
- **CI/CD Patterns**: Automated test execution strategies for different pipelines

## Tag Expression Fundamentals

### Boolean Logic Operators

```typescript
// Tag expression examples and their meanings
export const TAG_EXPRESSIONS = {
    // Basic operators
    AND: '@smoke and @critical',           // Both tags must be present
    OR: '@api or @ui',                     // Either tag can be present
    NOT: 'not @wip',                       // Tag must not be present
    
    // Complex combinations
    COMPLEX_AND: '@smoke and @api and not @slow',
    COMPLEX_OR: '@critical or @smoke or @regression',
    MIXED: '(@smoke or @critical) and not (@wip or @blocked)',
    
    // Team-based expressions
    TEAM_FRONTEND: '@team-frontend and (@ready or @regression)',
    TEAM_BACKEND: '@team-backend and @api and not @experimental',
    
    // Environment-specific
    QA_READY: '@qa and (@smoke or @regression) and not @dev-only',
    PROD_SAFE: '@prod-safe and @smoke and not @destructive',
    
    // Performance-based
    FAST_TESTS: '@fast and not @slow and not @integration',
    COMPREHENSIVE: '@regression and (@integration or @e2e)',
    
    // Priority-based
    HIGH_PRIORITY: '(@critical or @high) and not @low',
    MAINTENANCE: '@maintenance and (@cleanup or @migration)'
} as const;
```

## Advanced Command-Line Patterns

### PowerShell Script for Windows

```powershell
# scripts/run-tests.ps1
param(
    [string]$Environment = "dev",
    [string]$Team = "",
    [string]$Priority = "all",
    [switch]$Smoke,
    [switch]$Regression,
    [switch]$Fast,
    [switch]$Parallel,
    [int]$MaxParallel = 4
)

# Base cucumber command
$CucumberCmd = ".\node_modules\.bin\cucumber-js"

# Build tag expression based on parameters
$TagParts = @()

# Environment-based tags
switch ($Environment.ToLower()) {
    "dev" { $TagParts += "@dev and not @prod-only" }
    "qa" { $TagParts += "@qa and (@smoke or @regression)" }
    "staging" { $TagParts += "@staging and not @dev-only" }
    "prod" { $TagParts += "@prod-safe and @smoke and not @destructive" }
}

# Team-based filtering
if ($Team) {
    $TagParts += "@team-$Team and @ready"
}

# Priority-based filtering
switch ($Priority.ToLower()) {
    "critical" { $TagParts += "@critical" }
    "high" { $TagParts += "(@critical or @high)" }
    "low" { $TagParts += "@low" }
}

# Test type switches
if ($Smoke) { $TagParts += "@smoke" }
if ($Regression) { $TagParts += "@regression" }
if ($Fast) { $TagParts += "@fast and not @slow" }

# Always exclude work-in-progress and blocked tests
$TagParts += "not @wip and not @blocked"

# Combine all tag parts
$TagExpression = $TagParts -join " and "

Write-Host "🏃 Running tests with tag expression: $TagExpression" -ForegroundColor Green

# Build full command
$FullCommand = "$CucumberCmd --tags `"$TagExpression`""

# Add parallel execution if requested
if ($Parallel) {
    $FullCommand += " --parallel $MaxParallel"
}

# Add format options
$FullCommand += " --format progress --format json:reports/cucumber-results.json"

# Execute the command
Write-Host "📋 Executing: $FullCommand" -ForegroundColor Yellow
Invoke-Expression $FullCommand

# Check exit code
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Tests completed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Tests failed with exit code: $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}
```

### Usage Examples

```powershell
# Run smoke tests in QA environment
.\scripts\run-tests.ps1 -Environment qa -Smoke

# Run frontend team's regression tests
.\scripts\run-tests.ps1 -Team frontend -Regression

# Run critical tests only, fast execution
.\scripts\run-tests.ps1 -Priority critical -Fast -Parallel

# Run comprehensive staging tests
.\scripts\run-tests.ps1 -Environment staging -Regression -MaxParallel 8
```

## Environment Variable Integration

### Dynamic Configuration

```typescript
// config/test-execution-config.ts
export interface TestExecutionConfig {
    environment: string;
    tagExpression: string;
    parallel: boolean;
    maxParallel: number;
    timeout: number;
    retries: number;
    screenshots: boolean;
    videos: boolean;
}

export class TestExecutionManager {
    private static getEnvironmentConfig(): Partial<TestExecutionConfig> {
        const env = process.env.NODE_ENV || 'development';
        
        const configs = {
            development: {
                tagExpression: '@dev and (@smoke or @fast) and not @slow',
                parallel: false,
                timeout: 30000,
                screenshots: true,
                videos: false
            },
            qa: {
                tagExpression: '@qa and (@smoke or @regression) and not @experimental',
                parallel: true,
                maxParallel: 4,
                timeout: 60000,
                screenshots: true,
                videos: true
            },
            staging: {
                tagExpression: '@staging and @regression and not @dev-only',
                parallel: true,
                maxParallel: 6,
                timeout: 90000,
                screenshots: true,
                videos: true
            },
            production: {
                tagExpression: '@prod-safe and @smoke and @monitoring and not @destructive',
                parallel: false,
                timeout: 120000,
                screenshots: false,
                videos: false
            }
        };
        
        return configs[env] || configs.development;
    }
    
    private static getTeamConfig(): string {
        const team = process.env.TEAM;
        if (!team) return '';
        
        return ` and @team-${team} and @ready`;
    }
    
    private static getPriorityConfig(): string {
        const priority = process.env.PRIORITY;
        if (!priority) return '';
        
        const priorityMap = {
            critical: ' and @critical',
            high: ' and (@critical or @high)',
            medium: ' and (@critical or @high or @medium)',
            all: ''
        };
        
        return priorityMap[priority] || '';
    }
    
    private static getFeatureConfig(): string {
        const features = process.env.FEATURES;
        if (!features) return '';
        
        const featureList = features.split(',').map(f => `@${f.trim()}`);
        return ` and (${featureList.join(' or ')})`;
    }
    
    public static buildConfiguration(): TestExecutionConfig {
        const baseConfig = this.getEnvironmentConfig();
        const teamConfig = this.getTeamConfig();
        const priorityConfig = this.getPriorityConfig();
        const featureConfig = this.getFeatureConfig();
        
        // Build complete tag expression
        let tagExpression = baseConfig.tagExpression || '@smoke';
        tagExpression += teamConfig;
        tagExpression += priorityConfig;
        tagExpression += featureConfig;
        
        // Override with environment variables
        const config: TestExecutionConfig = {
            environment: process.env.NODE_ENV || 'development',
            tagExpression: process.env.CUCUMBER_TAGS || tagExpression,
            parallel: process.env.PARALLEL === 'true' || baseConfig.parallel || false,
            maxParallel: parseInt(process.env.MAX_PARALLEL || '') || baseConfig.maxParallel || 2,
            timeout: parseInt(process.env.TIMEOUT || '') || baseConfig.timeout || 30000,
            retries: parseInt(process.env.RETRIES || '') || 1,
            screenshots: process.env.SCREENSHOTS !== 'false' && (baseConfig.screenshots ?? true),
            videos: process.env.VIDEOS === 'true' || baseConfig.videos || false
        };
        
        console.log('🔧 Test Execution Configuration:');
        console.log(`   Environment: ${config.environment}`);
        console.log(`   Tag Expression: ${config.tagExpression}`);
        console.log(`   Parallel: ${config.parallel} (max: ${config.maxParallel})`);
        console.log(`   Timeout: ${config.timeout}ms`);
        console.log(`   Screenshots: ${config.screenshots}`);
        console.log(`   Videos: ${config.videos}`);
        
        return config;
    }
}
```

### Environment Variable Examples

```bash
# Windows PowerShell
$env:NODE_ENV = "qa"
$env:TEAM = "frontend"
$env:PRIORITY = "critical"
$env:FEATURES = "authentication,checkout"
$env:PARALLEL = "true"
$env:MAX_PARALLEL = "6"
$env:SCREENSHOTS = "true"
$env:VIDEOS = "false"

# Run tests with environment configuration
npm run test:cucumber

# Or direct cucumber execution
$env:CUCUMBER_TAGS = "@critical and @team-frontend and not @slow"
.\node_modules\.bin\cucumber-js --tags "$env:CUCUMBER_TAGS"
```

## Conditional Hook Implementation

### Smart Hook Execution

```typescript
// hooks/conditional-execution-hooks.ts
import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { TestExecutionManager } from '../config/test-execution-config';

const config = TestExecutionManager.buildConfiguration();

// Conditional setup based on environment
BeforeAll(async function () {
    console.log(`🌍 Setting up ${config.environment} environment`);
    
    if (config.environment === 'production') {
        // Production-specific setup
        console.log('🔒 Production mode: Read-only operations only');
        process.env.READ_ONLY = 'true';
    } else if (config.environment === 'development') {
        // Development-specific setup
        console.log('🛠️ Development mode: Full access enabled');
        process.env.DEBUG = 'true';
    }
});

// Database setup only for scenarios requiring it
Before({ tags: '@database' }, async function () {
    if (config.environment === 'production') {
        console.log('⚠️ Skipping database setup in production');
        return;
    }
    
    console.log('🗄️ Setting up test database');
    // Database setup logic here
});

// API mocking for specific environments
Before({ tags: '@api and not @integration' }, async function () {
    if (config.environment === 'development' || config.environment === 'qa') {
        console.log('🎭 Setting up API mocks');
        // Setup API mocks for faster testing
    }
});

// Performance monitoring setup
Before({ tags: '@performance' }, async function () {
    console.log('📊 Initializing performance monitoring');
    this.performanceStartTime = Date.now();
    
    // Setup performance monitoring
    if (this.page) {
        await this.page.addInitScript(() => {
            window.performanceMetrics = {
                navigationStart: performance.now(),
                marks: [],
                measures: []
            };
        });
    }
});

// Extended cleanup for slow tests
After({ tags: '@slow' }, async function () {
    console.log('🧹 Performing extended cleanup for slow test');
    
    // Wait for any async operations to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Clear any cached data
    if (this.page) {
        await this.page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
    }
});

// Screenshot capture based on configuration
After(async function (scenario) {
    const shouldCaptureScreenshot = config.screenshots && 
        (scenario.result?.status === 'FAILED' || 
         scenario.pickle.tags.some(tag => tag.name === '@screenshot'));
    
    if (shouldCaptureScreenshot && this.page) {
        console.log('📸 Capturing screenshot');
        const screenshot = await this.page.screenshot({
            fullPage: true,
            type: 'png'
        });
        this.attach(screenshot, 'image/png', 'screenshot');
    }
});
```

## CI/CD Pipeline Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/conditional-testing.yml
name: Conditional Test Execution

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC

jobs:
  determine-tests:
    runs-on: ubuntu-latest
    outputs:
      test-matrix: ${{ steps.matrix.outputs.matrix }}
    steps:
      - uses: actions/checkout@v3
      - name: Determine Test Matrix
        id: matrix
        run: |
          if [[ "${{ github.event_name }}" == "push" && "${{ github.ref }}" == "refs/heads/main" ]]; then
            # Main branch: Full regression
            echo "matrix={\"include\":[{\"env\":\"staging\",\"tags\":\"@regression and not @experimental\",\"parallel\":6},{\"env\":\"production\",\"tags\":\"@prod-safe and @smoke\",\"parallel\":1}]}" >> $GITHUB_OUTPUT
          elif [[ "${{ github.event_name }}" == "pull_request" ]]; then
            # PR: Smoke and affected areas
            echo "matrix={\"include\":[{\"env\":\"qa\",\"tags\":\"@smoke and not @slow\",\"parallel\":4},{\"env\":\"qa\",\"tags\":\"@regression and @affected\",\"parallel\":4}]}" >> $GITHUB_OUTPUT
          elif [[ "${{ github.event_name }}" == "schedule" ]]; then
            # Scheduled: Comprehensive testing
            echo "matrix={\"include\":[{\"env\":\"qa\",\"tags\":\"@regression\",\"parallel\":8},{\"env\":\"staging\",\"tags\":\"@integration and @e2e\",\"parallel\":6}]}" >> $GITHUB_OUTPUT
          else
            # Default: Smoke tests
            echo "matrix={\"include\":[{\"env\":\"qa\",\"tags\":\"@smoke\",\"parallel\":2}]}" >> $GITHUB_OUTPUT
          fi

  test-execution:
    needs: determine-tests
    runs-on: ubuntu-latest
    strategy:
      matrix: ${{ fromJson(needs.determine-tests.outputs.test-matrix) }}
      fail-fast: false
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Setup test environment
        run: |
          echo "NODE_ENV=${{ matrix.env }}" >> $GITHUB_ENV
          echo "CUCUMBER_TAGS=${{ matrix.tags }}" >> $GITHUB_ENV
          echo "PARALLEL=true" >> $GITHUB_ENV
          echo "MAX_PARALLEL=${{ matrix.parallel }}" >> $GITHUB_ENV
          echo "SCREENSHOTS=true" >> $GITHUB_ENV
          echo "VIDEOS=${{ matrix.env == 'staging' }}" >> $GITHUB_ENV
      
      - name: Run Cucumber Tests
        run: npm run test:cucumber
        timeout-minutes: 30
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: cucumber-results-${{ matrix.env }}-${{ github.run_number }}
          path: |
            reports/
            test-results/
            screenshots/
          retention-days: 30

  team-specific-tests:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    strategy:
      matrix:
        team: [frontend, backend, api, mobile]
    
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run team-specific tests
        run: |
          export TEAM=${{ matrix.team }}
          export CUCUMBER_TAGS="@team-${{ matrix.team }} and (@smoke or @regression) and @ready and not @wip"
          export PARALLEL=true
          export MAX_PARALLEL=4
          npm run test:cucumber
        timeout-minutes: 20
```

## Dynamic Test Selection

### Intelligent Test Selection Based on Changes

```typescript
// tools/intelligent-test-selector.ts
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface FileChange {
    file: string;
    type: 'added' | 'modified' | 'deleted';
}

interface TestSelection {
    tags: string[];
    reasoning: string[];
}

export class IntelligentTestSelector {
    private getChangedFiles(): FileChange[] {
        try {
            // Get changed files from git
            const output = execSync('git diff --name-status HEAD~1', { encoding: 'utf-8' });
            return output.trim().split('\n').map(line => {
                const [status, file] = line.split('\t');
                return {
                    file,
                    type: status === 'A' ? 'added' : status === 'M' ? 'modified' : 'deleted'
                };
            });
        } catch (error) {
            console.log('⚠️ Could not determine changed files, running smoke tests');
            return [];
        }
    }
    
    private analyzeChanges(changes: FileChange[]): TestSelection {
        const tags: Set<string> = new Set(['@smoke']); // Always include smoke tests
        const reasoning: string[] = ['Including smoke tests for basic functionality'];
        
        for (const change of changes) {
            const { file } = change;
            
            // Frontend changes
            if (file.includes('/components/') || file.includes('/pages/') || file.endsWith('.css') || file.endsWith('.scss')) {
                tags.add('@ui');
                tags.add('@team-frontend');
                reasoning.push(`Frontend changes detected: ${file}`);
            }
            
            // Backend API changes
            if (file.includes('/api/') || file.includes('/controllers/') || file.includes('/models/')) {
                tags.add('@api');
                tags.add('@team-backend');
                reasoning.push(`Backend API changes detected: ${file}`);
            }
            
            // Database changes
            if (file.includes('/migrations/') || file.includes('/schema/') || file.includes('/seeds/')) {
                tags.add('@database');
                tags.add('@integration');
                reasoning.push(`Database changes detected: ${file}`);
            }
            
            // Authentication/security changes
            if (file.includes('/auth/') || file.includes('/security/') || file.includes('/permissions/')) {
                tags.add('@authentication');
                tags.add('@authorization');
                tags.add('@security');
                reasoning.push(`Security changes detected: ${file}`);
            }
            
            // Payment processing changes
            if (file.includes('/payment/') || file.includes('/checkout/') || file.includes('/billing/')) {
                tags.add('@payment');
                tags.add('@checkout');
                tags.add('@critical');
                reasoning.push(`Payment system changes detected: ${file}`);
            }
            
            // Configuration changes
            if (file.includes('/config/') || file.endsWith('.env') || file.includes('/docker/')) {
                tags.add('@integration');
                tags.add('@configuration');
                reasoning.push(`Configuration changes detected: ${file}`);
            }
            
            // Mobile-specific changes
            if (file.includes('/mobile/') || file.includes('/responsive/')) {
                tags.add('@mobile');
                tags.add('@responsive');
                reasoning.push(`Mobile changes detected: ${file}`);
            }
            
            // Performance-critical changes
            if (file.includes('/cache/') || file.includes('/optimization/') || file.includes('/performance/')) {
                tags.add('@performance');
                reasoning.push(`Performance changes detected: ${file}`);
            }
        }
        
        return {
            tags: Array.from(tags),
            reasoning
        };
    }
    
    public generateTestExpression(): string {
        const changes = this.getChangedFiles();
        const selection = this.analyzeChanges(changes);
        
        console.log('🔍 Intelligent Test Selection Analysis:');
        console.log('📁 Changed files:', changes.length);
        selection.reasoning.forEach(reason => console.log(`   • ${reason}`));
        
        // Build tag expression
        let expression = selection.tags.join(' or ');
        
        // Always exclude WIP and blocked tests
        expression = `(${expression}) and not @wip and not @blocked`;
        
        // Add environment-specific exclusions
        if (process.env.NODE_ENV === 'production') {
            expression += ' and not @destructive and @prod-safe';
        }
        
        console.log('🏷️ Generated tag expression:', expression);
        return expression;
    }
    
    public static getRecommendedExecution(): { tags: string; parallel: boolean; maxParallel: number } {
        const selector = new IntelligentTestSelector();
        const tags = selector.generateTestExpression();
        
        // Determine parallelization based on tag complexity
        const tagCount = tags.split(' or ').length;
        const parallel = tagCount > 2;
        const maxParallel = Math.min(tagCount * 2, 8);
        
        return { tags, parallel, maxParallel };
    }
}

// Usage in test execution
const recommendation = IntelligentTestSelector.getRecommendedExecution();
console.log('🚀 Recommended execution:', recommendation);
```

## Feature Flag Integration

### Dynamic Test Execution Based on Feature Flags

```typescript
// hooks/feature-flag-hooks.ts
import { Before, After } from '@cucumber/cucumber';

interface FeatureFlags {
    newCheckoutFlow: boolean;
    aiRecommendations: boolean;
    socialLogin: boolean;
    darkMode: boolean;
}

class FeatureFlagManager {
    private static flags: FeatureFlags;
    
    public static async loadFlags(): Promise<FeatureFlags> {
        if (this.flags) return this.flags;
        
        try {
            // In real implementation, this would call your feature flag service
            const response = await fetch(`${process.env.FEATURE_FLAG_API}/flags`);
            this.flags = await response.json();
        } catch (error) {
            console.log('⚠️ Failed to load feature flags, using defaults');
            this.flags = {
                newCheckoutFlow: false,
                aiRecommendations: true,
                socialLogin: true,
                darkMode: false
            };
        }
        
        console.log('🎛️ Feature flags loaded:', this.flags);
        return this.flags;
    }
    
    public static isEnabled(flag: keyof FeatureFlags): boolean {
        return this.flags?.[flag] || false;
    }
}

// Skip scenarios for disabled features
Before({ tags: '@feature-new-checkout' }, async function (scenario) {
    const flags = await FeatureFlagManager.loadFlags();
    
    if (!flags.newCheckoutFlow) {
        console.log('⏭️ Skipping scenario: New checkout flow is disabled');
        return 'skipped';
    }
    
    console.log('✅ New checkout flow is enabled, proceeding with scenario');
});

Before({ tags: '@feature-ai-recommendations' }, async function (scenario) {
    const flags = await FeatureFlagManager.loadFlags();
    
    if (!flags.aiRecommendations) {
        console.log('⏭️ Skipping scenario: AI recommendations are disabled');
        return 'skipped';
    }
});

// Dynamic tag injection based on feature flags
Before(async function (scenario) {
    const flags = await FeatureFlagManager.loadFlags();
    
    // Add dynamic tags based on enabled features
    const dynamicTags: string[] = [];
    
    if (flags.newCheckoutFlow) dynamicTags.push('@new-checkout-enabled');
    if (flags.aiRecommendations) dynamicTags.push('@ai-enabled');
    if (flags.socialLogin) dynamicTags.push('@social-login-enabled');
    if (flags.darkMode) dynamicTags.push('@dark-mode-enabled');
    
    // Store dynamic tags for use in steps
    this.dynamicTags = dynamicTags;
    this.featureFlags = flags;
    
    if (dynamicTags.length > 0) {
        console.log('🏷️ Dynamic tags added:', dynamicTags);
    }
});
```

## Best Practices Summary

### 1. **Tag Expression Design**
- Use clear, readable boolean logic
- Group related conditions with parentheses
- Always exclude `@wip` and `@blocked` in CI/CD

### 2. **Environment Configuration**
- Separate configurations for each environment
- Use environment variables for flexibility
- Provide sensible defaults

### 3. **Intelligent Selection**
- Analyze code changes to determine relevant tests
- Use feature flags to control test execution
- Balance thoroughness with execution time

### 4. **CI/CD Integration**
- Different strategies for different triggers
- Matrix builds for comprehensive coverage
- Fail-fast strategies for quick feedback

### 5. **Performance Optimization**
- Parallel execution for appropriate scenarios
- Skip expensive operations when not needed
- Monitor execution times and optimize accordingly

This comprehensive approach to conditional execution ensures efficient, targeted testing while maintaining thorough coverage of critical functionality.