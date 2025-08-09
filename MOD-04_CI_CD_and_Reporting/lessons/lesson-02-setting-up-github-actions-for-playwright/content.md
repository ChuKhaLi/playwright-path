# Setting up GitHub Actions for Playwright

**Learning Time**: 120 minutes  
**Complexity**: Core  
**Prerequisites**: Lesson 01 completion (75%+ score), GitHub account, basic YAML understanding  

## 🎯 Learning Objectives

By the end of this lesson, you will be able to:

- **LO-02-01**: **Create functional GitHub Actions workflows** for Playwright test execution including proper YAML syntax, action selection, and workflow triggering mechanisms
- **LO-02-02**: **Configure test environment dependencies** including Node.js setup, Playwright installation, and browser provisioning in CI/CD environments  
- **LO-02-03**: **Implement basic artifact management** for test results, screenshots, and execution logs with proper retention policies and access controls

---

## 📖 Table of Contents

1. [GitHub Actions Fundamentals Review](#1-github-actions-fundamentals-review)
2. [Setting Up Your Repository](#2-setting-up-your-repository)
3. [Creating Your First Playwright Workflow](#3-creating-your-first-playwright-workflow)
4. [Environment Configuration and Dependencies](#4-environment-configuration-and-dependencies)
5. [Advanced Workflow Features](#5-advanced-workflow-features)
6. [Artifact Management and Storage](#6-artifact-management-and-storage)
7. [Testing and Debugging Workflows](#7-testing-and-debugging-workflows)
8. [Security and Best Practices](#8-security-and-best-practices)
9. [Optimization and Performance](#9-optimization-and-performance)
10. [Summary and Next Steps](#10-summary-and-next-steps)

---

## 1. GitHub Actions Fundamentals Review

### Understanding GitHub Actions Architecture

GitHub Actions operates on a **workflow-based architecture** where automation is defined in YAML files:

```yaml
# Basic structure of a GitHub Actions workflow
name: Workflow Name
on: [trigger events]
jobs:
  job-name:
    runs-on: [runner environment]
    steps:
      - name: Step Name
        uses: action@version
        with:
          parameter: value
```

#### **Core Components**

**1. Workflows**
- YAML files stored in `.github/workflows/` directory
- Define entire automation process
- Can contain multiple jobs that run in parallel or sequence

**2. Events (Triggers)**
- Code pushes, pull requests, scheduled times
- External webhooks and manual dispatches
- Repository events like releases or issues

**3. Jobs**
- Collections of steps that execute on the same runner
- Can depend on other jobs or run independently
- Run in isolated virtual environments

**4. Steps**
- Individual tasks within a job
- Can run commands or use pre-built actions
- Execute sequentially within a job

**5. Actions**
- Reusable units of code
- Available from GitHub Marketplace or custom-built
- Simplify complex tasks with pre-configured functionality

### GitHub Actions vs. Traditional CI Systems

| Feature | GitHub Actions | Traditional CI (Jenkins) |
|---------|---------------|---------------------------|
| **Configuration** | YAML in repository | External server setup |
| **Scalability** | Auto-scaling cloud runners | Manual infrastructure management |
| **Integration** | Native GitHub integration | Plugin-based integration |
| **Marketplace** | Extensive action library | Plugin ecosystem |
| **Cost Model** | Pay-per-use (with free tier) | Infrastructure + maintenance costs |

---

## 2. Setting Up Your Repository

### Repository Preparation

#### **Step 2.1: Create or Prepare Repository**

**For New Repository:**
```powershell
# Create new repository using GitHub CLI
gh repo create playwright-ci-demo --public --clone
cd playwright-ci-demo

# Or create through GitHub web interface
# Navigate to github.com → New Repository
```

**For Existing Repository:**
```powershell
# Navigate to your existing Playwright project
cd your-playwright-project
git status  # Ensure working directory is clean
```

#### **Step 2.2: Verify Repository Structure**

Ensure your repository has the following structure:
```
your-project/
├── .github/
│   └── workflows/          # GitHub Actions workflows (we'll create this)
├── tests/                  # Playwright test files
├── playwright.config.ts    # Playwright configuration
├── package.json           # Node.js dependencies
└── README.md              # Project documentation
```

#### **Step 2.3: Sample Playwright Project Setup**

If you don't have a Playwright project, create one:

```powershell
# Initialize new Node.js project
npm init -y

# Install Playwright
npm install --save-dev @playwright/test
npx playwright install

# Create basic test structure
mkdir tests
```

**Basic Test File** (`tests/example.spec.ts`):
```typescript
import { test, expect } from '@playwright/test';

test('basic navigation test', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  
  await expect(page).toHaveTitle(/Playwright/);
  
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page).toHaveURL(/.*intro/);
});

test('search functionality', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  
  const searchButton = page.getByRole('button', { name: 'Search' });
  await searchButton.click();
  
  const searchInput = page.getByPlaceholder('Search docs');
  await searchInput.fill('testing');
  await searchInput.press('Enter');
  
  await expect(page.getByText('Test')).toBeVisible();
});
```

**Playwright Configuration** (`playwright.config.ts`):
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://playwright.dev',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
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
  ],
});
```

---

## 3. Creating Your First Playwright Workflow

### Basic Workflow Structure

#### **Step 3.1: Create Workflow Directory**

```powershell
# Create GitHub Actions directory structure
mkdir .github
mkdir .github\workflows
```

#### **Step 3.2: Basic Playwright Workflow**

Create `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests

# Trigger events - when should this workflow run?
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

# Job definitions
jobs:
  test:
    # Specify the runner environment
    runs-on: ubuntu-latest
    
    steps:
    # Step 1: Check out the repository code
    - name: Checkout code
      uses: actions/checkout@v4
    
    # Step 2: Set up Node.js environment
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    # Step 3: Install project dependencies
    - name: Install dependencies
      run: npm ci
    
    # Step 4: Install Playwright browsers
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    
    # Step 5: Run Playwright tests
    - name: Run Playwright tests
      run: npx playwright test
```

#### **Step 3.3: Understanding Each Component**

**Workflow Name and Triggers:**
```yaml
name: Playwright Tests    # Descriptive name shown in GitHub UI

on:
  push:
    branches: [ main, develop ]    # Run on pushes to these branches
  pull_request:
    branches: [ main ]             # Run on PRs targeting main branch
```

**Job Configuration:**
```yaml
jobs:
  test:                    # Job identifier
    runs-on: ubuntu-latest # GitHub-hosted runner (Ubuntu Linux)
```

**Common Runner Options:**
- `ubuntu-latest` - Ubuntu Linux (most common for web testing)
- `windows-latest` - Windows Server (for Windows-specific testing)
- `macos-latest` - macOS (for Safari testing, more expensive)

#### **Step 3.4: Commit and Test**

```powershell
# Add and commit the workflow file
git add .github\workflows\playwright.yml
git commit -m "Add basic Playwright CI workflow"
git push origin main
```

**Verify Workflow Execution:**
1. Navigate to your GitHub repository
2. Click **Actions** tab
3. You should see your workflow running or completed
4. Click on the workflow run to view details and logs

---

## 4. Environment Configuration and Dependencies

### Advanced Node.js Setup

#### **Step 4.1: Node.js Version Strategy**

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'      # Specific version
    # node-version: 'lts/*' # Latest LTS version
    # node-version-file: '.nvmrc' # Read from file
    cache: 'npm'            # Cache npm dependencies
```

**Version Selection Best Practices:**
- **Production Alignment**: Use same Node.js version as production
- **LTS Versions**: Prefer Long Term Support releases for stability
- **Matrix Testing**: Test against multiple Node.js versions if needed

#### **Step 4.2: Dependency Management and Caching**

```yaml
# Efficient dependency installation with caching
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

- name: Install dependencies
  run: npm ci  # Use 'npm ci' for faster, reliable installs in CI
```

**Why `npm ci` instead of `npm install`?**
- **Faster**: Skips dependency resolution
- **Reliable**: Uses exact versions from package-lock.json
- **Clean**: Removes node_modules before installing
- **CI Optimized**: Designed for automated environments

#### **Step 4.3: Playwright Browser Installation**

```yaml
# Basic browser installation
- name: Install Playwright Browsers
  run: npx playwright install --with-deps

# Alternative: Cache browsers for faster runs
- name: Get installed Playwright version
  id: playwright-version
  run: echo "version=$(npm list @playwright/test --depth=0 --json | jq -r '.dependencies."@playwright/test".version')" >> $GITHUB_OUTPUT

- name: Cache Playwright browsers
  uses: actions/cache@v3
  id: playwright-cache
  with:
    path: |
      ~/.cache/ms-playwright
    key: ${{ runner.os }}-playwright-${{ steps.playwright-version.outputs.version }}

- name: Install Playwright Browsers
  if: steps.playwright-cache.outputs.cache-hit != 'true'
  run: npx playwright install --with-deps
```

### Environment Variables and Secrets

#### **Step 4.4: Managing Environment Variables**

```yaml
# Environment variables for the entire job
jobs:
  test:
    runs-on: ubuntu-latest
    env:
      BASE_URL: https://staging.example.com
      CI: true
      
    steps:
    - name: Run tests with environment
      run: npx playwright test
      env:
        API_KEY: ${{ secrets.API_KEY }}        # From GitHub secrets
        TEST_USER: ${{ secrets.TEST_USER }}
        TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
```

**Setting up GitHub Secrets:**
1. Navigate to repository → Settings → Secrets and Variables → Actions
2. Click **New repository secret**
3. Add name and value
4. Reference using `${{ secrets.SECRET_NAME }}`

#### **Step 4.5: Conditional Environment Configuration**

```yaml
# Different configurations based on branch or event
- name: Set environment based on branch
  run: |
    if [[ "${{ github.ref }}" == "refs/heads/main" ]]; then
      echo "BASE_URL=https://production.example.com" >> $GITHUB_ENV
      echo "ENVIRONMENT=production" >> $GITHUB_ENV
    elif [[ "${{ github.ref }}" == "refs/heads/develop" ]]; then
      echo "BASE_URL=https://staging.example.com" >> $GITHUB_ENV
      echo "ENVIRONMENT=staging" >> $GITHUB_ENV
    else
      echo "BASE_URL=https://testing.example.com" >> $GITHUB_ENV
      echo "ENVIRONMENT=testing" >> $GITHUB_ENV
    fi

- name: Run tests against environment
  run: |
    echo "Testing against ${{ env.BASE_URL }}"
    npx playwright test
```

---

## 5. Advanced Workflow Features

### Matrix Testing Strategy

#### **Step 5.1: Cross-Browser Testing Matrix**

```yaml
name: Cross-Browser Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: ['chromium', 'firefox', 'webkit']
        node-version: ['16', '18', '20']
      fail-fast: false  # Continue other jobs if one fails
      
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright
      run: npx playwright install --with-deps ${{ matrix.browser }}
    
    - name: Run ${{ matrix.browser }} tests
      run: npx playwright test --project=${{ matrix.browser }}
```

#### **Step 5.2: Operating System Matrix**

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest, macos-latest]
    browser: [chromium, firefox, webkit]
    exclude:
      # WebKit on Ubuntu doesn't work well
      - os: ubuntu-latest
        browser: webkit
      # Firefox on Windows might have issues
      - os: windows-latest
        browser: firefox

runs-on: ${{ matrix.os }}
```

#### **Step 5.3: Conditional Matrix Execution**

```yaml
# Only run full matrix on main branch, limited testing on PRs
strategy:
  matrix:
    browser: [chromium, firefox, webkit]
    include:
      # Full testing on main branch
      - branch-condition: ${{ github.ref == 'refs/heads/main' }}
        browser: chromium
      - branch-condition: ${{ github.ref == 'refs/heads/main' }}
        browser: firefox
      - branch-condition: ${{ github.ref == 'refs/heads/main' }}
        browser: webkit
      # Limited testing on PRs
      - branch-condition: ${{ github.event_name == 'pull_request' }}
        browser: chromium

# Use conditional step execution
- name: Run full test suite
  if: github.ref == 'refs/heads/main'
  run: npx playwright test

- name: Run smoke tests
  if: github.event_name == 'pull_request'
  run: npx playwright test --grep "@smoke"
```

### Parallel Execution and Sharding

#### **Step 5.4: Playwright Test Sharding**

```yaml
name: Parallel Playwright Tests

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1/4, 2/4, 3/4, 4/4]  # Split tests into 4 parallel jobs
    
    steps:
    - uses: actions/checkout@v4
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright
      run: npx playwright install --with-deps
    
    - name: Run Playwright tests (Shard ${{ matrix.shard }})
      run: npx playwright test --shard=${{ matrix.shard }}
```

#### **Step 5.5: Dynamic Sharding Based on Test Count**

```yaml
# Calculate optimal shard count based on test files
- name: Count test files
  id: test-count
  run: |
    TEST_COUNT=$(find tests -name "*.spec.ts" | wc -l)
    SHARD_COUNT=$(( (TEST_COUNT + 9) / 10 ))  # 10 tests per shard
    echo "shard-count=$SHARD_COUNT" >> $GITHUB_OUTPUT

# Use calculated shard count in matrix
strategy:
  matrix:
    shard: ${{ fromJSON(steps.test-count.outputs.shard-count) }}
```

---

## 6. Artifact Management and Storage

### Test Results and Reports

#### **Step 6.1: Basic Artifact Upload**

```yaml
- name: Run Playwright tests
  run: npx playwright test
  continue-on-error: true  # Don't fail the job if tests fail

- name: Upload test results
  uses: actions/upload-artifact@v4
  if: always()  # Upload even if tests failed
  with:
    name: playwright-results
    path: |
      playwright-report/
      test-results/
    retention-days: 30
```

#### **Step 6.2: Comprehensive Artifact Strategy**

```yaml
# Configure Playwright to generate comprehensive reports
- name: Run Playwright tests
  run: npx playwright test --reporter=html,junit,json
  continue-on-error: true

# Upload different artifact types with appropriate retention
- name: Upload HTML Report
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-html-report-${{ github.run_id }}
    path: playwright-report/
    retention-days: 30

- name: Upload JUnit Results
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: junit-results-${{ github.run_id }}
    path: junit-results.xml
    retention-days: 90  # Longer retention for CI/CD integration

- name: Upload Screenshots
  uses: actions/upload-artifact@v4
  if: failure()  # Only upload on test failures
  with:
    name: screenshots-${{ github.run_id }}
    path: test-results/
    retention-days: 7   # Shorter retention for debugging artifacts
```

#### **Step 6.3: Advanced Artifact Management**

```yaml
# Matrix-aware artifact naming
- name: Upload artifacts with matrix info
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: test-results-${{ matrix.browser }}-${{ matrix.os }}-${{ github.run_id }}
    path: |
      playwright-report/
      test-results/

# Conditional artifact upload based on file existence
- name: Check for test artifacts
  id: check-artifacts
  run: |
    if [ -d "test-results" ] && [ "$(ls -A test-results)" ]; then
      echo "artifacts-exist=true" >> $GITHUB_OUTPUT
    else
      echo "artifacts-exist=false" >> $GITHUB_OUTPUT
    fi

- name: Upload test artifacts
  if: steps.check-artifacts.outputs.artifacts-exist == 'true'
  uses: actions/upload-artifact@v4
  with:
    name: test-artifacts-${{ github.run_id }}
    path: test-results/
```

### Report Publishing and Sharing

#### **Step 6.4: GitHub Pages Integration**

```yaml
# Job to collect and publish reports
publish-report:
  runs-on: ubuntu-latest
  needs: test  # Wait for test job to complete
  if: always()  # Run even if tests failed
  
  steps:
  - name: Download artifacts
    uses: actions/download-artifact@v4
    with:
      name: playwright-html-report-${{ github.run_id }}
      path: public/
  
  - name: Deploy to GitHub Pages
    uses: peaceiris/actions-gh-pages@v3
    if: github.ref == 'refs/heads/main'
    with:
      github_token: ${{ secrets.GITHUB_TOKEN }}
      publish_dir: ./public
      destination_dir: reports/${{ github.run_id }}
```

#### **Step 6.5: Slack/Teams Notification Integration**

```yaml
- name: Notify on test completion
  uses: 8398a7/action-slack@v3
  if: always()
  with:
    status: ${{ job.status }}
    channel: '#qa-automation'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
    fields: repo,message,commit,author,action,eventName,ref,workflow
    custom_payload: |
      {
        attachments: [{
          color: '${{ job.status }}' === 'success' ? 'good' : 'danger',
          blocks: [{
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `Playwright Tests ${job.status === 'success' ? '✅ Passed' : '❌ Failed'}\n*Repository:* ${process.env.AS_REPO}\n*Branch:* ${process.env.AS_REF}\n*Commit:* ${process.env.AS_COMMIT}`
            }
          }]
        }]
      }
```

---

## 7. Testing and Debugging Workflows

### Debugging Failed Workflows

#### **Step 7.1: Enhanced Logging and Debugging**

```yaml
# Enable debug logging
- name: Run tests with debug output
  run: npx playwright test --reporter=line,html
  env:
    DEBUG: pw:api  # Enable Playwright debug logs
    PWDEBUG: 1     # Enable Playwright debug mode in CI
    CI: true

# Add custom logging steps
- name: Log environment information
  run: |
    echo "Node.js version: $(node --version)"
    echo "npm version: $(npm --version)"
    echo "Playwright version: $(npx playwright --version)"
    echo "Available browsers:"
    npx playwright install --dry-run

- name: List test files
  run: |
    echo "Test files found:"
    find tests -name "*.spec.ts" -o -name "*.spec.js" | head -20
```

#### **Step 7.2: Conditional Debug Steps**

```yaml
# Only run debug steps on failure
- name: Capture system information on failure
  if: failure()
  run: |
    echo "=== System Information ==="
    uname -a
    echo "=== Disk Usage ==="
    df -h
    echo "=== Memory Usage ==="
    free -h
    echo "=== Process List ==="
    ps aux | head -20

- name: Upload debug logs
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: debug-logs-${{ github.run_id }}
    path: |
      npm-debug.log*
      yarn-error.log*
      playwright-debug.log*
```

#### **Step 7.3: SSH Debugging (Advanced)**

```yaml
# Enable SSH access for debugging (use with caution)
- name: Setup tmate session (Debug)
  if: ${{ failure() && github.event.inputs.debug == 'true' }}
  uses: mxschmitt/action-tmate@v3
  with:
    limit-access-to-actor: true
  timeout-minutes: 30
```

### Local Testing and Validation

#### **Step 7.4: Act - Local GitHub Actions Testing**

```powershell
# Install Act for local testing (requires Docker)
# On Windows with Chocolatey:
choco install act-cli

# On macOS with Homebrew:
# brew install act

# Test workflow locally
act push  # Simulate push event
act pull_request  # Simulate PR event

# Test specific job
act -j test  # Run only the 'test' job

# Use different runner images
act -P ubuntu-latest=catthehacker/ubuntu:act-latest
```

#### **Step 7.5: Workflow Validation Tools**

```yaml
# Add workflow validation step
name: Validate Workflow
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Validate GitHub Actions workflows
      uses: docker://rhymond/github-action-validate:latest
      with:
        path: .github/workflows/
```

---

## 8. Security and Best Practices

### Security Considerations

#### **Step 8.1: Secret Management Best Practices**

```yaml
# Secure secret handling
- name: Test with secrets
  run: npx playwright test
  env:
    # Use secrets for sensitive data
    API_KEY: ${{ secrets.API_KEY }}
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    
    # Don't expose secrets in logs
    # BAD: echo "API_KEY=${{ secrets.API_KEY }}"
    # GOOD: Use secrets only in env variables

- name: Mask sensitive outputs
  run: |
    # Mask sensitive values in logs
    TOKEN="${{ secrets.API_TOKEN }}"
    echo "::add-mask::$TOKEN"
    echo "Token configured for API access"
```

#### **Step 8.2: Permission Management**

```yaml
# Explicitly define permissions
permissions:
  contents: read     # Read repository contents
  actions: read      # Read actions
  checks: write      # Write check results
  pull-requests: write  # Comment on PRs

jobs:
  test:
    runs-on: ubuntu-latest
    # Job-level permissions (more restrictive)
    permissions:
      contents: read
      checks: write
```

#### **Step 8.3: Dependency Scanning and Security**

```yaml
# Add security scanning steps
- name: Run security audit
  run: npm audit --audit-level high

- name: Check for known vulnerabilities
  uses: ossf/scorecard-action@v2
  with:
    results_file: results.sarif
    results_format: sarif
    
- name: Upload SARIF results
  uses: github/codeql-action/upload-sarif@v2
  with:
    sarif_file: results.sarif
```

### Code Quality and Standards

#### **Step 8.4: Linting and Code Quality**

```yaml
# Integrate code quality checks
- name: Run ESLint
  run: npm run lint
  continue-on-error: true  # Don't fail build on linting errors

- name: Run TypeScript check
  run: npx tsc --noEmit

- name: Run Prettier check
  run: npx prettier --check .

# Generate code quality reports
- name: Upload ESLint results
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: eslint-results
    path: eslint-results.json
```

#### **Step 8.5: Test Coverage and Quality Gates**

```yaml
# Add coverage reporting
- name: Run tests with coverage
  run: npx playwright test --reporter=html,coverage

- name: Generate coverage report
  run: npx nyc report --reporter=lcov

- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
    flags: e2e-tests
    name: playwright-coverage

# Quality gates
- name: Check coverage threshold
  run: |
    COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
    if (( $(echo "$COVERAGE < 80" | bc -l) )); then
      echo "Coverage $COVERAGE% is below threshold (80%)"
      exit 1
    fi
```

---

## 9. Optimization and Performance

### Workflow Performance Optimization

#### **Step 9.1: Dependency Caching Strategies**

```yaml
# Advanced caching strategy
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

- name: Cache Playwright browsers
  uses: actions/cache@v3
  with:
    path: |
      ~/.cache/ms-playwright
    key: ${{ runner.os }}-playwright-${{ hashFiles('package-lock.json') }}

# Conditional installation based on cache
- name: Install dependencies
  if: steps.cache-node-modules.outputs.cache-hit != 'true'
  run: npm ci

- name: Install Playwright browsers
  if: steps.cache-playwright.outputs.cache-hit != 'true'
  run: npx playwright install --with-deps
```

#### **Step 9.2: Parallel Execution Optimization**

```yaml
# Optimized parallel strategy
strategy:
  matrix:
    # Optimize based on test distribution
    shard: [1/8, 2/8, 3/8, 4/8, 5/8, 6/8, 7/8, 8/8]
  fail-fast: false
  max-parallel: 4  # Limit concurrent jobs to avoid rate limiting

# Use faster runners for critical paths
runs-on: ubuntu-latest  # or 'windows-latest' for Windows-specific tests
# Consider: ubuntu-20.04 (faster startup) vs ubuntu-latest (latest features)
```

#### **Step 9.3: Smart Test Execution**

```yaml
# Run only changed tests on PRs
- name: Get changed files
  id: changed-files
  uses: dorny/paths-filter@v2
  with:
    filters: |
      tests:
        - 'tests/**'
        - 'src/**'
        - 'playwright.config.ts'
        - 'package.json'

- name: Run full test suite
  if: steps.changed-files.outputs.tests == 'true' || github.ref == 'refs/heads/main'
  run: npx playwright test

- name: Run smoke tests only
  if: steps.changed-files.outputs.tests == 'false' && github.event_name == 'pull_request'
  run: npx playwright test --grep "@smoke"
```

### Resource Management

#### **Step 9.4: Memory and CPU Optimization**

```yaml
# Configure Playwright for CI optimization
- name: Run Playwright tests
  run: npx playwright test
  env:
    # Optimize for CI environment
    PLAYWRIGHT_BROWSERS_PATH: ~/.cache/ms-playwright
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1
    # Reduce memory usage
    NODE_OPTIONS: '--max-old-space-size=4096'
    # Limit parallel workers
    PLAYWRIGHT_WORKERS: 2

# Monitor resource usage
- name: Monitor resource usage
  if: runner.debug == '1'
  run: |
    echo "=== Resource Usage ==="
    ps aux --sort=-%mem | head -10
    df -h
    free -h
```

#### **Step 9.5: Build Time Optimization**

```yaml
# Optimize workflow timing
jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30  # Prevent hanging jobs
    
    steps:
    # Use specific action versions for faster downloads
    - uses: actions/checkout@v4
      with:
        fetch-depth: 1  # Shallow clone for speed
    
    # Combine related steps to reduce overhead
    - name: Setup and install
      run: |
        node --version
        npm ci
        npx playwright install --with-deps chromium
      timeout-minutes: 10  # Step-level timeout
```

---

## 10. Summary and Next Steps

### Key Takeaways

#### **GitHub Actions Workflow Mastery**
- **YAML Configuration**: Understanding of workflow structure, jobs, and steps
- **Trigger Management**: Efficient event handling for different scenarios
- **Environment Setup**: Reliable Node.js and Playwright configuration
- **Matrix Testing**: Scalable cross-browser and cross-platform strategies

#### **Practical Implementation Skills**
- **Repository Setup**: Proper structure and organization
- **Dependency Management**: Caching and optimization strategies  
- **Security Practices**: Secret management and permission control
- **Debugging Techniques**: Troubleshooting and optimization methods

#### **Professional Development**
- **CI/CD Pipeline Creation**: End-to-end workflow implementation
- **Performance Optimization**: Resource management and execution efficiency
- **Quality Assurance**: Integration of testing best practices
- **Team Collaboration**: Artifact management and reporting strategies

### Immediate Action Items

```yaml
# Post-lesson checklist
immediate-actions:
  - [ ] Create a working Playwright workflow in your repository
  - [ ] Test the workflow with both passing and failing tests
  - [ ] Configure artifact upload for test results and screenshots
  - [ ] Set up basic environment variables and secrets
  - [ ] Verify workflow executes on push and pull request events

this-week:
  - [ ] Implement matrix testing for multiple browsers
  - [ ] Add caching for dependencies and browsers
  - [ ] Create a troubleshooting guide for your team
  - [ ] Set up notification integration (Slack/email)
  - [ ] Document your workflow decisions and rationale

advanced-challenges:
  - [ ] Implement test sharding for large test suites
  - [ ] Add security scanning and code quality checks
  - [ ] Create conditional execution based on changed files
  - [ ] Set up GitHub Pages for report publishing
  - [ ] Integrate with external reporting tools
```

### Preparation for Lesson 03

**Next Lesson Focus**: Configuring Playwright for Headless Execution

**What You'll Learn:**
- Optimize Playwright configuration for CI/CD environments
- Implement advanced headless testing strategies
- Configure test isolation and cleanup procedures
- Manage flaky tests and improve execution reliability

**Prerequisites to Complete:**
- [ ] Working GitHub Actions workflow from this lesson
- [ ] Understanding of Playwright configuration options
- [ ] Experience with basic CI/CD troubleshooting
- [ ] Completed Lesson 02 assessment with 75% or higher score

### Professional Development Path

#### **Short-term Goals (Next 2 Weeks)**
- Master GitHub Actions workflow creation for various scenarios
- Implement comprehensive CI/CD pipeline for current projects
- Develop troubleshooting expertise for common workflow issues
- Create team documentation and best practices guides

#### **Medium-term Goals (Next Month)**
- Lead CI/CD adoption within your team or organization  
- Optimize workflows for performance and cost efficiency
- Integrate advanced features like matrix testing and sharding
- Contribute to team training and knowledge sharing initiatives

#### **Long-term Goals (Next Quarter)**
- Become the go-to expert for GitHub Actions and Playwright integration
- Design and implement enterprise-scale CI/CD strategies
- Mentor others in modern QA automation practices
- Build reputation as a thought leader in DevOps and quality engineering

### Resources for Continued Learning

#### **Official Documentation**
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright CI Guide](https://playwright.dev/docs/ci)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)

#### **Community Resources**
- [GitHub Actions Community Forum](https://github.community/c/github-actions)
- [Playwright Discord Server](https://discord.gg/playwright-dev)
- [awesome-actions Repository](https://github.com/sdras/awesome-actions)

#### **Advanced Topics for Future Learning**
- **Self-hosted Runners**: Custom execution environments
- **Composite Actions**: Creating reusable workflow components
- **GitHub Apps Integration**: Advanced automation scenarios
- **Infrastructure as Code**: Terraform and GitHub Actions integration

---

**Congratulations!** You've mastered the fundamentals of GitHub Actions for Playwright testing. You now have the skills to create robust, scalable CI/CD pipelines that will significantly improve your team's development workflow and software quality.

**Module Progress**: 2/12 lessons completed  
**Next Lesson**: [Configuring Playwright for Headless Execution](../lesson-03-configuring-playwright-for-headless-execution/README.md)  
**Estimated Total Module Time Remaining**: 17.5 hours

### Quick Reference

#### **Essential Commands**
```powershell
# Create workflow directory
mkdir .github\workflows

# Test workflow locally (requires Docker and act)
act push

# View workflow runs
gh run list

# Download artifacts
gh run download [run-id]

# View workflow logs
gh run view [run-id] --log
```

#### **Common YAML Patterns**
```yaml
# Basic trigger
on: [push, pull_request]

# Matrix strategy
strategy:
  matrix:
    browser: [chromium, firefox, webkit]

# Conditional execution
if: github.ref == 'refs/heads/main'

# Artifact upload
uses: actions/upload-artifact@v4
with:
  name: test-results
  path: playwright-report/
```

This comprehensive foundation in GitHub Actions and Playwright integration positions you for success in the remaining lessons and in your professional CI/CD journey.