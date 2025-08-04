# Lesson 8: Continuous Testing Pipeline Design

## 1. What is Continuous Testing?

Continuous Testing is the process of executing automated tests as part of the software delivery pipeline to obtain immediate feedback on the business risks associated with a software release candidate. It's not about testing more; it's about testing smarter and faster.

The goal is to "shift left"—to find and fix bugs as early in the development process as possible, where they are cheapest to fix.

## 2. Architecting a Multi-Stage CI/CD Pipeline

A well-architected pipeline is a series of stages, each providing a greater level of confidence. If a stage fails, the pipeline stops, preventing a defective build from progressing.

Here is a typical pipeline design using GitHub Actions:

**`/.github/workflows/ci-pipeline.yml`**
```yaml
name: Continuous Integration Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  # Stage 1: Fast static checks
  lint-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Run linter
        run: npm run lint
      - name: Build application
        run: npm run build

  # Stage 2: Fast API & Component tests
  fast-tests:
    needs: lint-and-build # Depends on the previous stage
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Run API and Component tests
        run: npx playwright test --grep "@api|@component"

  # Stage 3: Slower E2E tests (only on PRs to main)
  e2e-smoke-tests:
    if: github.event_name == 'pull_request'
    needs: fast-tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Run E2E Smoke tests
        run: npx playwright test --grep @smoke

  # Stage 4: Full regression suite (only on merge to main or nightly)
  full-regression:
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    needs: fast-tests
    runs-on: ubuntu-latest
    steps:
      # ...
      - name: Run Full E2E Regression Suite
        run: npx playwright test --grep @e2e
```

## 3. Dynamic Test Environments

Hardcoding URLs for `dev`, `staging`, and `prod` is not scalable. A mature pipeline uses **ephemeral** or **dynamic environments**.

**How it works:**
1.  A developer opens a pull request (PR).
2.  The CI/CD pipeline automatically spins up a new, isolated environment that contains the code from that specific PR. This might be done using containers (Docker, Kubernetes) or cloud services (Vercel, Netlify).
3.  The pipeline runs the E2E tests against this unique environment. The URL for the environment is passed as an environment variable or a secret.
4.  When the PR is merged or closed, the ephemeral environment is automatically destroyed.

**Example using an environment variable in `playwright.config.ts`:**
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // Use the BASE_URL from the environment variable if it exists,
    // otherwise fall back to a local default.
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  },
});
```

**In the CI/CD pipeline (`.yml` file):**
```yaml
- name: Run E2E tests
  run: npx playwright test
  env:
    # The URL is provided by the deployment service that created the environment.
    BASE_URL: ${{ steps.deploy-preview.outputs.url }}
```

## 4. Optimizing for Speed

When a test suite grows, pipeline duration can become a bottleneck. Here are key optimization strategies:

### a) Parallelization and Sharding

Playwright is designed for this. By default, it runs test files in parallel. You can increase the number of parallel workers in `playwright.config.ts`:
`fullyParallel: true,`
`workers: process.env.CI ? '100%' : undefined, // Use all available cores in CI`

**Sharding** is another technique where you split the test suite across multiple machines. The CI/CD platform runs the same job on, for example, 4 different virtual machines, and each one runs a fraction of the tests.

**In GitHub Actions:**
```yaml
strategy:
  fail-fast: false
  matrix:
    shard: [1, 2, 3, 4] # Create 4 parallel jobs

steps:
  # ...
  - name: Run Playwright tests
    run: npx playwright test --shard=${{ matrix.shard }}/${{ strategy.job-total }}
```

### b) Caching

Don't reinstall dependencies or browser binaries on every run. CI/CD platforms provide caching mechanisms to store these between runs.

**In GitHub Actions:**
```yaml
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}

- name: Cache Playwright browsers
  uses: actions/cache@v3
  with:
    path: ~/.cache/ms-playwright
    key: ${{ runner.os }}-playwright-${{ hashFiles('**/package-lock.json') }}
```

## 5. Reporting and Notifications

A pipeline is useless if no one looks at the results.
- **Test Reports:** Configure your pipeline to upload the Playwright HTML report as an artifact. This allows anyone to download and view the detailed report, including traces and videos.
  ```yaml
  - name: Upload report
    uses: actions/upload-artifact@v3
    if: always() # Always upload, even if tests fail
    with:
      name: playwright-report
      path: playwright-report/
  ```
- **Notifications:** Integrate with Slack or Microsoft Teams to send notifications on pipeline failures. This ensures that the responsible team is immediately aware of any issues. Many marketplace actions are available for this.